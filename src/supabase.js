// ── SUPABASE CLIENT ──────────────────────────────────────────────────────────
// Replace these two values with your Supabase project URL and anon key.
// Get them from: supabase.com → your project → Settings → API
//
// IMPORTANT: The anon key is safe to expose in frontend code.
// Row Level Security (RLS) on the database protects your data.

export const SUPABASE_URL  = "YOUR_SUPABASE_URL_HERE";
export const SUPABASE_ANON = "YOUR_SUPABASE_ANON_KEY_HERE";

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

// ── FRIENDS & LEADERBOARD ─────────────────────────────────────────────────────

// Search users by name or email (uses profiles table)
export const sbSearchUsers = async (token, query) => {
  const q = encodeURIComponent(`%${query}%`);
  const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?or=(name.ilike.${q},email.ilike.${q})&select=id,name,email&limit=10`, {
    headers: headers(token),
  });
  return r.ok ? r.json() : [];
};

// Send friend request
export const sbSendFriendRequest = async (token, fromId, toId) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/friends`, {
    method: "POST",
    headers: { ...headers(token), "Prefer": "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify({ user_id: fromId, friend_id: toId, status: "pending" }),
  });
  return r.ok;
};

// Accept friend request
export const sbAcceptFriend = async (token, fromId, myId) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/friends?user_id=eq.${fromId}&friend_id=eq.${myId}`, {
    method: "PATCH",
    headers: { ...headers(token), "Prefer": "return=minimal" },
    body: JSON.stringify({ status: "accepted" }),
  });
  return r.ok;
};

// Decline / remove friend
export const sbRemoveFriend = async (token, userId, friendId) => {
  await fetch(`${SUPABASE_URL}/rest/v1/friends?user_id=eq.${userId}&friend_id=eq.${friendId}`, {
    method: "DELETE", headers: headers(token),
  });
  await fetch(`${SUPABASE_URL}/rest/v1/friends?user_id=eq.${friendId}&friend_id=eq.${userId}`, {
    method: "DELETE", headers: headers(token),
  });
};

// Get all my friend records (pending + accepted)
export const sbGetFriends = async (token, userId) => {
  const [sent, received] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/friends?user_id=eq.${userId}&select=*,profiles!friend_id(id,name,email)`, { headers: headers(token) }).then(r=>r.ok?r.json():[]),
    fetch(`${SUPABASE_URL}/rest/v1/friends?friend_id=eq.${userId}&select=*,profiles!user_id(id,name,email)`, { headers: headers(token) }).then(r=>r.ok?r.json():[]),
  ]);
  return { sent, received };
};

// Get leaderboard data for a user + their friends
export const sbGetLeaderboard = async (token, userId) => {
  // Get accepted friend IDs
  const { sent, received } = await sbGetFriends(token, userId);
  const friendIds = [
    ...sent.filter(f=>f.status==="accepted").map(f=>f.friend_id),
    ...received.filter(f=>f.status==="accepted").map(f=>f.user_id),
    userId,
  ];
  if (!friendIds.length) return [];
  const ids = friendIds.map(id=>`"${id}"`).join(",");
  const r = await fetch(`${SUPABASE_URL}/rest/v1/user_data?user_id=in.(${ids})&select=user_id,profiles,sessions,food_log,sleep_log`, {
    headers: headers(token),
  });
  return r.ok ? r.json() : [];
};

// Upsert user into public profiles table (enables friend search)
export const sbUpsertProfile = async (token, userId, name, email) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
    method: "POST",
    headers: { ...headers(token), "Prefer": "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ id: userId, name, email, updated_at: new Date().toISOString() }),
  });
  return r.ok;
};
