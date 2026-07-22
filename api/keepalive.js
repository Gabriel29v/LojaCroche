export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://qbtgdhbpvpacnxaivugk.supabase.co";
  const key = process.env.SUPABASE_ANON_KEY || "sb_publishable_S8nUhhYo0BkQQUZjhekL8Q_Uz0H23NA";

  try {
    // 1. Check Database
    const dbRes = await fetch(`${url}/rest/v1/products?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    
    // 2. Check Storage
    const storageRes = await fetch(`${url}/storage/v1/bucket`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });

    if (!dbRes.ok || !storageRes.ok) {
      throw new Error(`DB: ${dbRes.status}, Storage: ${storageRes.status}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      timestamp: new Date().toISOString(),
      dbStatus: dbRes.status, 
      storageStatus: storageRes.status 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
