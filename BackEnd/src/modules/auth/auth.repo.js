const supabase = require("../../config/supabase");

async function findProfileById(id) {
  const { data, error } = await supabase
    .from("perfis")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

async function findOngByPerfilId(perfilId) {
  const { data, error } = await supabase
    .from("ongs")
    .select("*")
    .eq("perfil_id", perfilId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

module.exports = {
  findOngByPerfilId,
  findProfileById,
};
