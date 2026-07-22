const { createClient } = require("@supabase/supabase-js");

// We fall back to standard URL/KEY if ENV vars are not set yet to avoid breaking immediately
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://qbtgdhbpvpacnxaivugk.supabase.co";
const key = process.env.SUPABASE_ANON_KEY || "sb_publishable_S8nUhhYo0BkQQUZjhekL8Q_Uz0H23NA";

const supabase = createClient(url, key);

export default async function handler(req, res) {
  try {
    // 1. Query the database
    const { data: dbData, error: dbError } = await supabase
      .from("products")
      .select("id")
      .limit(1);

    if (dbError) {
      console.error("Erro no Supabase (DB):", dbError);
      return res.status(500).json({ success: false, error: dbError.message });
    }

    // 2. Query the storage
    const { data: storageData, error: storageError } = await supabase.storage.listBuckets();

    if (storageError) {
      console.error("Erro no Supabase (Storage):", storageError);
      return res.status(500).json({ success: false, error: storageError.message });
    }

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      rows: dbData.length,
      buckets: storageData.length
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
