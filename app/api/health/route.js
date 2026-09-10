// Legitimate keep-alive / health check — NOT for fake analytics.
// This endpoint is used by Vercel Cron / UptimeRobot to prevent cold starts
// for serverless + Neon. It does NOT increment analytics page_view events.
// Filter in analytics: path !== '/api/health'
export async function GET() {
  return Response.json(
    { status: 'ok', timestamp: new Date().toISOString(), service: 'AiOpsMedia health' },
    { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}
export async function HEAD() {
  return new Response(null, { status: 200, headers: { 'Cache-Control': 'no-store' } });
}
