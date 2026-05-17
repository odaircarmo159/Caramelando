const supabase = require("../../config/supabase");

const ONG_SELECT = `
  id,
  perfil_id,
  cnpj,
  descricao,
  endereco,
  whatsapp,
  instagram,
  site,
  logo_url,
  status_validacao,
  created_at,
  nome_ong,
  cidade,
  estado,
  facebook,
  updated_at,
  perfis!ongs_perfil_id_fkey (
    id,
    tipo_usuario,
    nome,
    email,
    telefone,
    cidade,
    estado,
    foto_perfil,
    created_at
  ),
  documentos_ong (
    id,
    url,
    nome_arquivo,
    created_at
  )
`;

async function create(data) {
  const { data: ong, error } = await supabase
    .from("ongs")
    .insert(data)
    .select(ONG_SELECT)
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

async function createDocuments(documents) {
  if (!documents.length) {
    return [];
  }

  const { data, error } = await supabase
    .from("documentos_ong")
    .insert(documents)
    .select();

  if (error) {
    throw error;
  }

  return data;
}

async function findByCnpj(cnpj) {
  const { data, error } = await supabase
    .from("ongs")
    .select(ONG_SELECT)
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

async function findById(id) {
  const { data, error } = await supabase
    .from("ongs")
    .select(ONG_SELECT)
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

async function findByPerfilId(perfilId) {
  const { data, error } = await supabase
    .from("ongs")
    .select(ONG_SELECT)
    .eq("perfil_id", perfilId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

async function updateProfile(perfilId, payload) {
  const { data, error } = await supabase
    .from("perfis")
    .update(payload)
    .eq("id", perfilId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function updateOng(id, payload) {
  const { data, error } = await supabase
    .from("ongs")
    .update(payload)
    .eq("id", id)
    .select(ONG_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  create,
  createDocuments,
  createProfile,
  findByCnpj,
  findById,
  findByPerfilId,
  findProfileByEmail,
  updateOng,
  updateProfile,
};
