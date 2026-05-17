const supabase = require("../../config/supabase");

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

async function findById(id) {
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

async function findByEmail(email) {
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

async function updateById(id, payload) {
  const { data, error } = await supabase
    .from("perfis")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  createProfile,
  findById,
  findByEmail,
  updateById,
};
