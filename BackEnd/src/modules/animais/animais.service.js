const AppError = require("../../utils/AppError");
const repo = require("./animais.repo");

function toDbEspecie(value) {
  if (!value) return null;
  return value.toLowerCase() === "gato" ? "gato" : "cao";
}

function toApiEspecie(value) {
  return value === "gato" ? "Gato" : "Cachorro";
}

function toDbPorte(value) {
  if (!value) return null;
  const normalized = value.toLowerCase();

  if (normalized.startsWith("peq")) return "pequeno";
  if (normalized.startsWith("gra")) return "grande";
  return "medio";
}

function toApiPorte(value) {
  if (!value) return null;
  if (value === "pequeno") return "Pequeno";
  if (value === "grande") return "Grande";
  return "Medio";
}

function toDbSexo(value) {
  if (!value) return null;
  return value.toLowerCase() === "femea" ? "femea" : "macho";
}

function toApiSexo(value) {
  if (!value) return null;
  return value === "femea" ? "Femea" : "Macho";
}

function toDbStatus(value) {
  if (!value) return "disponivel";

  const normalized = value.toLowerCase();

  if (normalized === "adotado") return "adotado";
  if (normalized === "inativo") return "inativo";
  if (normalized === "indisponivel" || normalized === "em_tratamento") {
    return "inativo";
  }

  return "disponivel";
}

function toApiStatus(value) {
  if (value === "adotado") return "ADOTADO";
  if (value === "inativo") return "INDISPONIVEL";
  return "DISPONIVEL";
}

function toPhotoRows(animalId, photos) {
  return (photos || [])
    .filter(Boolean)
    .map((url, index) => ({
      animal_id: animalId,
      url,
      principal: index === 0,
      ordem: index,
    }));
}

function formatAnimal(animal) {
  const photos = [...(animal.animal_fotos || [])].sort((a, b) => a.ordem - b.ordem);
  const ong = animal.ongs || {};

  return {
    id: String(animal.id),
    ongId: animal.ong_id,
    nome: animal.nome,
    especie: toApiEspecie(animal.especie),
    porte: toApiPorte(animal.porte),
    idadeEstimada: animal.idade_anos === null ? null : Number(animal.idade_anos),
    sexo: toApiSexo(animal.sexo),
    descricao: animal.descricao,
    seloPersonalidade: animal.selo_personalidade,
    vacinado: animal.vacinado,
    castrado: animal.castrado,
    vermifugado: animal.vermifugado,
    status: toApiStatus(animal.status),
    fotosUrl: photos.map((photo) => photo.url),
    instituicaoId: ong.perfil_id || null,
    instituicaoNome: ong.nome_ong || null,
    cidade: ong.cidade || null,
    estado: ong.estado || null,
    contatoWhatsapp: ong.whatsapp || null,
    createdAt: animal.created_at,
    updatedAt: animal.updated_at,
  };
}

function buildAnimalPayload(payload) {
  return {
    nome: payload.nome,
    especie: toDbEspecie(payload.especie),
    porte: payload.porte ? toDbPorte(payload.porte) : null,
    idade_anos:
      payload.idadeEstimada === undefined || payload.idadeEstimada === null
        ? null
        : Number(payload.idadeEstimada),
    sexo: payload.sexo ? toDbSexo(payload.sexo) : null,
    descricao: payload.descricao ?? null,
    selo_personalidade: payload.seloPersonalidade ?? null,
    vacinado: payload.vacinado ?? false,
    castrado: payload.castrado ?? false,
    vermifugado: payload.vermifugado ?? false,
    status: toDbStatus(payload.status),
  };
}

function buildOngContactPayload(payload) {
  const hasAnyField =
    payload.cidade !== undefined ||
    payload.estado !== undefined ||
    payload.contatoWhatsapp !== undefined;

  if (!hasAnyField) {
    return null;
  }

  return {
    cidade: payload.cidade ?? null,
    estado: payload.estado ?? null,
    whatsapp: payload.contatoWhatsapp ?? null,
  };
}

async function listAnimais(filters = {}) {
  const data = await repo.list({
    search: filters.search || null,
    especie: filters.especie ? toDbEspecie(filters.especie) : null,
    status: filters.status ? toDbStatus(filters.status) : null,
    ongId: filters.ongId || null,
  });

  return data.map(formatAnimal);
}

async function getAnimalById(id) {
  const animal = await repo.findById(id);

  if (!animal) {
    throw new AppError("Animal nao encontrado.", 404);
  }

  return formatAnimal(animal);
}

async function getCurrentOngAnimals(perfilId) {
  const ong = await repo.findOngByPerfilId(perfilId);

  if (!ong) {
    throw new AppError("Perfil institucional nao encontrado.", 404);
  }

  const animais = await repo.list({ ongId: ong.id });
  return animais.map(formatAnimal);
}

async function createAnimal(perfilId, payload) {
  const ong = await repo.findOngByPerfilId(perfilId);

  if (!ong) {
    throw new AppError("Perfil institucional nao encontrado.", 404);
  }

  if (!payload.fotosUrl || payload.fotosUrl.length < 4) {
    throw new AppError("Cada animal precisa de pelo menos 4 fotos.", 400);
  }

  const createdAnimal = await repo.createAnimal({
    ong_id: ong.id,
    ...buildAnimalPayload(payload),
  });

  const photos = toPhotoRows(createdAnimal.id, payload.fotosUrl);

  if (photos.length) {
    await repo.insertPhotos(photos);
  }

  const ongContactPayload = buildOngContactPayload(payload);

  if (ongContactPayload) {
    await repo.updateOng(ong.id, ongContactPayload);
  }

  const animal = await repo.findById(createdAnimal.id);
  return formatAnimal(animal);
}

async function updateAnimal(perfilId, animalId, payload) {
  const ong = await repo.findOngByPerfilId(perfilId);

  if (!ong) {
    throw new AppError("Perfil institucional nao encontrado.", 404);
  }

  const currentAnimal = await repo.findById(animalId);

  if (!currentAnimal) {
    throw new AppError("Animal nao encontrado.", 404);
  }

  if (currentAnimal.ong_id !== ong.id) {
    throw new AppError("Voce nao pode editar este animal.", 403);
  }

  if (payload.fotosUrl && payload.fotosUrl.length < 4) {
    throw new AppError("Ao atualizar a galeria, envie pelo menos 4 fotos.", 400);
  }

  const currentPayload = buildAnimalPayload({
    nome: currentAnimal.nome,
    especie: currentAnimal.especie,
    porte: currentAnimal.porte,
    idadeEstimada: currentAnimal.idade_anos,
    sexo: currentAnimal.sexo,
    descricao: currentAnimal.descricao,
    seloPersonalidade: currentAnimal.selo_personalidade,
    vacinado: currentAnimal.vacinado,
    castrado: currentAnimal.castrado,
    vermifugado: currentAnimal.vermifugado,
    status: currentAnimal.status,
  });

  await repo.updateAnimal(animalId, {
    ...currentPayload,
    ...buildAnimalPayload({
      ...payload,
      nome: payload.nome ?? currentAnimal.nome,
      especie: payload.especie ?? currentAnimal.especie,
      porte: payload.porte ?? currentAnimal.porte,
      idadeEstimada:
        payload.idadeEstimada === undefined
          ? currentAnimal.idade_anos
          : payload.idadeEstimada,
      sexo: payload.sexo ?? currentAnimal.sexo,
      descricao:
        payload.descricao === undefined
          ? currentAnimal.descricao
          : payload.descricao,
      seloPersonalidade:
        payload.seloPersonalidade === undefined
          ? currentAnimal.selo_personalidade
          : payload.seloPersonalidade,
      vacinado:
        payload.vacinado === undefined
          ? currentAnimal.vacinado
          : payload.vacinado,
      castrado:
        payload.castrado === undefined
          ? currentAnimal.castrado
          : payload.castrado,
      vermifugado:
        payload.vermifugado === undefined
          ? currentAnimal.vermifugado
          : payload.vermifugado,
      status: payload.status ?? currentAnimal.status,
    }),
  });

  if (payload.fotosUrl) {
    await repo.deletePhotosByAnimalId(animalId);
    await repo.insertPhotos(toPhotoRows(animalId, payload.fotosUrl));
  }

  const ongContactPayload = buildOngContactPayload(payload);

  if (ongContactPayload) {
    await repo.updateOng(ong.id, {
      cidade:
        payload.cidade === undefined ? currentAnimal.ongs?.cidade : payload.cidade,
      estado:
        payload.estado === undefined ? currentAnimal.ongs?.estado : payload.estado,
      whatsapp:
        payload.contatoWhatsapp === undefined
          ? currentAnimal.ongs?.whatsapp
          : payload.contatoWhatsapp,
    });
  }

  const updatedAnimal = await repo.findById(animalId);
  return formatAnimal(updatedAnimal);
}

async function deleteAnimal(perfilId, animalId) {
  const ong = await repo.findOngByPerfilId(perfilId);

  if (!ong) {
    throw new AppError("Perfil institucional nao encontrado.", 404);
  }

  const currentAnimal = await repo.findById(animalId);

  if (!currentAnimal) {
    throw new AppError("Animal nao encontrado.", 404);
  }

  if (currentAnimal.ong_id !== ong.id) {
    throw new AppError("Voce nao pode excluir este animal.", 403);
  }

  await repo.deletePhotosByAnimalId(animalId);
  await repo.deleteAnimal(animalId);
}

async function getPlatformStats() {
  return repo.countPlatformStats();
}

module.exports = {
  createAnimal,
  deleteAnimal,
  getAnimalById,
  getCurrentOngAnimals,
  getPlatformStats,
  listAnimais,
  updateAnimal,
};
