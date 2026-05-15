const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testConnection() {
  const { error } = await supabase
    .from("perfis")
    .select("id")
    .limit(1);

  if (error) {
    console.error("❌ Erro ao conectar no Supabase:");
    console.error(error.message);
  } else {
    console.log("✅ Supabase conectado com sucesso!");
  }
}

testConnection();

module.exports = supabase;