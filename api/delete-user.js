// api/delete-user.js
// Vercel serverless function — handles account deletion using the Supabase service role key
// The service role key lives only here on the server, never exposed to the client.

export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { user_id, token } = await req.json();

    // Verify the token belongs to the user being deleted
    const userRes = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        "apikey": process.env.SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${token}`,
      },
    });
    const userData = await userRes.json();

    if (!userData.id || userData.id !== user_id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Delete the user using service role key
    const deleteRes = await fetch(`${process.env.SUPABASE_URL}/auth/v1/admin/users/${user_id}`, {
      method: "DELETE",
      headers: {
        "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });

    if (!deleteRes.ok) {
      throw new Error("Delete failed");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
