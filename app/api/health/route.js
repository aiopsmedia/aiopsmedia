// Legitimate keep-alive / health check — NOT for fake analytics.
// On Hostinger Node.js: the process is persistent, no cold starts.
// To prevent sleeping on shared plans, ping this endpoint externally
// (e.g. cron-job.org every 10 min: GET https://aiopsmedia.com/api/health).
// It does NOT increment analytics page_view events.
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
