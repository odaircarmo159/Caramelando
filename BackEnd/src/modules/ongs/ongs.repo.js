const supabase = require("../../config/supabase");

async function create(data) {
  const { data: ong, error } = await supabase
    .from("ongs")
    .insert(data)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return ong;
}

async function createProfile(data) {
  const { data: profile, error } = await supabase
    .from("perfis")
    .insert(data)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return profile;
}

async function findByCnpj(cnpj) {
  const { data, error } = await supabase
    .from("ongs")
    .select("*")
    .eq("cnpj", cnpj)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

async function findProfileByEmail(email) {
  const { data, error } = await supabase
    .from("perfis")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

module.exports = {
  create,
  createProfile,
  findByCnpj,
  findProfileByEmail,
};
