export const config = { runtime: "edge" };

// In-memory rate limit store — resets on cold start
// For a PWA with family/friends this is sufficient
const rateLimitStore = new Map();

const RATE_LIMIT = {
  windowMs: 60 * 1000,   // 1 minute window
  maxRequests: 20,        // max 20 requests per IP per minute
  dailyMax: 200,          // max 200 requests per IP per day
};

function getClientIP(req) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";
}

function checkRateLimit(ip) {
  const now = Date.now();
  const dayStart = new Date().setHours(0, 0, 0, 0);

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { requests: [], dailyCount: 0, dayStart });
  }

  const record = rateLimitStore.get(ip);

  // Reset daily count if new day
  if (record.dayStart < dayStart) {
    record.dailyCount = 0;
    record.dayStart = dayStart;
  }

  // Clean up requests outside the window
  record.requests = record.requests.filter(t => now - t < RATE_LIMIT.windowMs);

  // Check limits
  if (record.requests.length >= RATE_LIMIT.maxRequests) {
    return { allowed: false, reason: "Rate limit exceeded. Please wait a moment before trying again." };
  }
  if (record.dailyCount >= RATE_LIMIT.dailyMax) {
    return { allowed: false, reason: "Daily limit reached. Please try again tomorrow." };
  }

  // Record this request
  record.requests.push(now);
  record.dailyCount++;
  rateLimitStore.set(ip, record);

  return { allowed: true };
}

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Rate limit check
  const ip = getClientIP(req);
  const { allowed, reason } = checkRateLimit(ip);

  if (!allowed) {
    return new Response(JSON.stringify({ error: reason }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Proxy error", detail: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
