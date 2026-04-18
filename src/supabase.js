// ── SUPABASE CLIENT ──────────────────────────────────────────────────────────
// Replace these two values with your Supabase project URL and anon key.
// Get them from: supabase.com → your project → Settings → API
//
// IMPORTANT: The anon key is safe to expose in frontend code.
// Row Level Security (RLS) on the database protects your data.

export const SUPABASE_URL  = "https://bnsxjgluydwfwqrjcktc.supabase.co";
export const SUPABASE_ANON = "sb_publishable_zt2GPYa7vyZ97EcZx6vftA_i53WaivP";

// ── SUPABASE HELPERS ──────────────────────────────────────────────────────────
// Lightweight fetch wrappers — no SDK needed, keeps bundle small.

const headers = (token) => ({
  "Content-Type":  "application/json",
  "apikey":        SUPABASE_ANON,
  "Authorization": `Bearer ${token || SUPABASE_ANON}`,
  "Prefer":        "return=representation",
});

// Auth: sign up with email + password
export const sbSignUp = async (email, password, name) => {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: { "Content-Type":"application/json", "apikey": SUPABASE_ANON },
    body: JSON.stringify({ email, password, data: { name } }),
  });
  return r.json();
};

// Auth: sign in with email + password
export const sbSignIn = async (email, password) => {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type":"application/json", "apikey": SUPABASE_ANON },
    body: JSON.stringify({ email, password }),
  });
  return r.json();
};

// Auth: sign in with Google (OAuth redirect)
export const sbSignInGoogle = () => {
  const redirectTo = encodeURIComponent(window.location.origin);
  window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`;
};

// Auth: sign out
export const sbSignOut = async (token) => {
  await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
    method: "POST",
    headers: headers(token),
  });
};

// Auth: get session from URL hash (after OAuth redirect)
export const sbGetSessionFromHash = () => {
  const hash = window.location.hash;
  if (!hash) return null;
  const params = new URLSearchParams(hash.replace("#", "?"));
  const access_token  = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  if (access_token) {
    window.history.replaceState(null, "", window.location.pathname);
    return { access_token, refresh_token };
  }
  return null;
};

// Auth: refresh token
export const sbRefreshToken = async (refresh_token) => {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { "Content-Type":"application/json", "apikey": SUPABASE_ANON },
    body: JSON.stringify({ refresh_token }),
  });
  return r.json();
};

// Data: upsert user data (all app state in one row per user)
export const sbUpsertData = async (token, userId, payload) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/user_data?user_id=eq.${userId}`, {
    method: "POST",
    headers: { ...headers(token), "Prefer": "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ user_id: userId, ...payload, updated_at: new Date().toISOString() }),
  });
  return r.ok;
};

// Data: load user data
export const sbLoadData = async (token, userId) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/user_data?user_id=eq.${userId}&select=*`, {
    headers: headers(token),
  });
  const rows = await r.json();
  return rows[0] || null;
};

// Data: delete user data + account
export const sbDeleteAccount = async (token, userId) => {
  // Delete data row
  await fetch(`${SUPABASE_URL}/rest/v1/user_data?user_id=eq.${userId}`, {
    method: "DELETE",
    headers: headers(token),
  });
  // Delete auth user (requires service role in production — handled via API proxy)
  await fetch("/api/delete-user", {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ user_id: userId, token }),
  });
};
