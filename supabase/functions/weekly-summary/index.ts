// Supabase Edge Function — Weekly Summary Push Notification
// Deploy with: supabase functions deploy weekly-summary
// Schedule via: supabase.com → Edge Functions → Schedule (cron: 0 9 * * 1)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch all users with data from the past week
    const { data: users, error } = await supabase
      .from("user_data")
      .select("user_id, user_profile, sessions, food_log, sleep_log");

    if (error) throw error;

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const summaries = users?.map(row => {
      const profile  = row.user_profile || {};
      const sessions = Array.isArray(row.sessions)  ? row.sessions  : JSON.parse(row.sessions  || "[]");
      const foodLog  = Array.isArray(row.food_log)  ? row.food_log  : JSON.parse(row.food_log  || "[]");
      const sleepLog = Array.isArray(row.sleep_log) ? row.sleep_log : JSON.parse(row.sleep_log || "[]");

      const weekSessions = sessions.filter((s: any) => new Date(s.date||0).getTime() > weekAgo);
      const weekFood     = foodLog.filter((f: any)  => (f.id||0) > weekAgo);
      const weekSleep    = sleepLog.slice(-7);

      const avgCalories = weekFood.length
        ? Math.round(weekFood.reduce((a: number, f: any) => a + (f.calories||0), 0) / 7)
        : 0;
      const avgSleep = weekSleep.length
        ? Math.round(weekSleep.reduce((a: number, s: any) => a + (s.hours||0), 0) / weekSleep.length * 10) / 10
        : 0;

      return {
        userId: row.user_id,
        name: profile.name || "Warrior",
        workouts: weekSessions.length,
        avgCalories,
        avgSleep,
      };
    }) || [];

    // In production: send push notifications via web push
    // For now: return the summary data (can be polled by app or used in scheduled email)
    console.log(`Generated ${summaries.length} weekly summaries`);
    return new Response(JSON.stringify({ ok: true, summaries }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
