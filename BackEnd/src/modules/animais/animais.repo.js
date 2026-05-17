const supabase = require("../../config/supabase");

const ANIMAL_SELECT = `
  id,
  ong_id,
  nome,
  especie,
  porte,
  idade_anos,
  sexo,
  descricao,
  selo_personalidade,
  vacinado,
  castrado,
  vermifugado,
  status,
  created_at,
  updated_at,
  animal_fotos (
    id,
    url,
    principal,
    ordem,
    created_at
  ),
  ongs!animais_ong_id_fkey (
    id,
    perfil_id,
    nome_ong,
    cidade,
    estado,
    whatsapp
  )
`;

async function list(filters = {}) {
  let query = supabase.from("animais").select(ANIMAL_SELECT);

  if (filters.ongId) {
    query = query.eq("ong_id", filters.ongId);
  }

  if (filters.especie) {
    query = query.eq("especie", filters.especie);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.search) {
    query = query.ilike("nome", `%${filters.search}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

async function findById(id) {
  const { data, error } = await supabase
    .from("animais")
    .select(ANIMAL_SELECT)
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

async function createAnimal(payload) {
  const { data, error } = await supabase
    .from("animais")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function updateAnimal(id, payload) {
  const { data, error } = await supabase
    .from("animais")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function deleteAnimal(id) {
  const { error } = await supabase
    .from("animais")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

async function insertPhotos(photos) {
  if (!photos.length) {
    return [];
  }

  const { data, error } = await supabase
    .from("animal_fotos")
    .insert(photos)
    .select();

  if (error) {
    throw error;
  }

  return data;
}

async function deletePhotosByAnimalId(animalId) {
  const { error } = await supabase
    .from("animal_fotos")
    .delete()
    .eq("animal_id", animalId);

  if (error) {
    throw error;
  }
}

async function findOngByPerfilId(perfilId) {
  const { data, error } = await supabase
    .from("ongs")
    .select("id, perfil_id, nome_ong, cidade, estado, whatsapp")
    .eq("perfil_id", perfilId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

async function updateOng(id, payload) {
  const { data, error } = await supabase
    .from("ongs")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function countPlatformStats() {
  const [{ count: totalAnimals, error: animalsError }, { count: totalAdoptions, error: adoptionsError }, { count: totalInstitutions, error: institutionsError }] =
    await Promise.all([
      supabase.from("animais").select("*", { count: "exact", head: true }),
      supabase
        .from("animais")
        .select("*", { count: "exact", head: true })
        .eq("status", "adotado"),
      supabase.from("ongs").select("*", { count: "exact", head: true }),
    ]);

  if (animalsError) throw animalsError;
  if (adoptionsError) throw adoptionsError;
  if (institutionsError) throw institutionsError;

  return {
    totalAnimals: totalAnimals || 0,
    totalAdoptions: totalAdoptions || 0,
    totalInstitutions: totalInstitutions || 0,
  };
}

module.exports = {
  countPlatformStats,
  createAnimal,
  deleteAnimal,
  deletePhotosByAnimalId,
  findById,
  findOngByPerfilId,
  insertPhotos,
  list,
  updateAnimal,
  updateOng,
};
