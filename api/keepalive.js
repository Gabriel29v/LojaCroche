export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = "https://qbtgdhbpvpacnxaivugk.supabase.co/rest/v1/products?select=id&limit=1";
  const key = "sb_publishable_S8nUhhYo0BkQQUZjhekL8Q_Uz0H23NA";

  try {
    const response = await fetch(url, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`
      }
    });
    
    if (response.ok) {
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ status: "error", error: response.statusText }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ status: "error", error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
