// Vercel API route — stores push subscriptions and relays pushes
// POST /api/send-push  { subscription, title, body }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { subscription, title, body, tag } = req.body;

    // In a full implementation you'd use web-push library here
    // For the PWA we use the subscription endpoint directly
    const pushPayload = JSON.stringify({ title, body, tag });

    const response = await fetch(subscription.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "TTL": "86400",
      },
      body: pushPayload,
    });

    if (!response.ok) throw new Error(`Push failed: ${response.status}`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
