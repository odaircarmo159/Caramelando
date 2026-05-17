const supabase = require("../../config/supabase");
const AppError = require("../../utils/AppError");
const repo = require("./ongs.repo");

function formatOng(ong) {
  if (!ong) {
    return null;
  }

  const profile = ong.perfis || {};
  const documents = ong.documentos_ong || [];

  return {
    id: ong.id,
    perfilId: ong.perfil_id,
    cnpj: ong.cnpj,
    nomeOng: ong.nome_ong,
    nomeResponsavel: profile.nome,
    email: profile.email,
    telefone: profile.telefone,
    cidade: ong.cidade ?? profile.cidade,
    estado: ong.estado ?? profile.estado,
    descricao: ong.descricao,
    endereco: ong.endereco,
    whatsapp: ong.whatsapp,
    instagram: ong.instagram,
    site: ong.site,
    logoUrl: ong.logo_url,
    facebook: ong.facebook,
    statusValidacao: ong.status_validacao,
    fotoPerfil: profile.foto_perfil,
    documentos: documents.map((document) => ({
      id: document.id,
      url: document.url,
      nomeArquivo: document.nome_arquivo,
      createdAt: document.created_at,
    })),
    createdAt: ong.created_at,
    updatedAt: ong.updated_at,
  };
}

async function createOng(payload) {
  const existingOng = await repo.findByCnpj(payload.cnpj);

  if (existingOng) {
    throw new AppError("CNPJ ja cadastrado.", 409);
  }

  const existingProfile = await repo.findProfileByEmail(payload.email);

  if (existingProfile) {
    throw new AppError("Ja existe um perfil com este e-mail.", 409);
  }

  const { data: authUserData, error: authUserError } =
    await supabase.auth.admin.createUser({
      email: payload.email,
      password: payload.senha,
      email_confirm: true,
    });

  if (authUserError || !authUserData.user) {
    throw authUserError || new AppError("Nao foi possivel criar a conta da ONG.", 500);
  }

  try {
    await repo.createProfile({
      id: authUserData.user.id,
      tipo_usuario: "ong",
      nome: payload.nome,
      email: payload.email,
      telefone: payload.telefone || null,
      cidade: payload.cidade || null,
      estado: payload.estado || null,
      foto_perfil: payload.logo_url || null,
    });

    const ong = await repo.create({
      perfil_id: authUserData.user.id,
      cnpj: payload.cnpj,
      descricao: payload.descricao || null,
      endereco: payload.endereco || null,
      whatsapp: payload.whatsapp || null,
      instagram: payload.instagram || null,
      site: payload.site || null,
      logo_url: payload.logo_url || null,
      status_validacao: "em_validacao",
      nome_ong: payload.nome,
      cidade: payload.cidade || null,
      estado: payload.estado || null,
      facebook: payload.facebook || null,
    });

    if (payload.documento_verificacao) {
      await repo.createDocuments([
        {
          ong_id: ong.id,
          url: payload.documento_verificacao,
          nome_arquivo: null,
        },
      ]);
    }

    const createdOng = await repo.findById(ong.id);

    return {
      profile: createdOng.perfis,
      ong: createdOng,
      institution: formatOng(createdOng),
    };
  } catch (error) {
    await supabase.auth.admin.deleteUser(authUserData.user.id);
    throw error;
  }
}

async function getCurrentOng(perfilId) {
  const ong = await repo.findByPerfilId(perfilId);

  if (!ong) {
    throw new AppError("ONG nao encontrada para este perfil.", 404);
  }

  return formatOng(ong);
}

async function getOngById(id) {
  const ong = await repo.findById(id);

  if (!ong) {
    throw new AppError("ONG nao encontrada.", 404);
  }

  return formatOng(ong);
}

async function updateCurrentOng(perfilId, payload) {
  const currentOng = await repo.findByPerfilId(perfilId);

  if (!currentOng) {
    throw new AppError("ONG nao encontrada para este perfil.", 404);
  }

  const currentProfile = currentOng.perfis;

  if (payload.email && payload.email !== currentProfile.email) {
    const existingProfile = await repo.findProfileByEmail(payload.email);

    if (existingProfile && existingProfile.id !== perfilId) {
      throw new AppError("Ja existe um perfil com este e-mail.", 409);
    }

    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
      perfilId,
      { email: payload.email }
    );

    if (authUpdateError) {
      throw authUpdateError;
    }
  }

  await repo.updateProfile(perfilId, {
    nome: payload.nome ?? currentProfile.nome,
    email: payload.email ?? currentProfile.email,
    telefone:
      payload.telefone === undefined ? currentProfile.telefone : payload.telefone,
    cidade: payload.cidade === undefined ? currentProfile.cidade : payload.cidade,
    estado: payload.estado === undefined ? currentProfile.estado : payload.estado,
    foto_perfil:
      payload.logo_url === undefined ? currentProfile.foto_perfil : payload.logo_url,
  });

  const updatedOng = await repo.updateOng(currentOng.id, {
    nome_ong: payload.nome ?? currentOng.nome_ong,
    descricao:
      payload.descricao === undefined ? currentOng.descricao : payload.descricao,
    endereco: payload.endereco === undefined ? currentOng.endereco : payload.endereco,
    whatsapp: payload.whatsapp === undefined ? currentOng.whatsapp : payload.whatsapp,
    instagram:
      payload.instagram === undefined ? currentOng.instagram : payload.instagram,
    site: payload.site === undefined ? currentOng.site : payload.site,
    logo_url: payload.logo_url === undefined ? currentOng.logo_url : payload.logo_url,
    cidade: payload.cidade === undefined ? currentOng.cidade : payload.cidade,
    estado: payload.estado === undefined ? currentOng.estado : payload.estado,
    facebook:
      payload.facebook === undefined ? currentOng.facebook : payload.facebook,
  });

  return formatOng(updatedOng);
}

module.exports = {
  createOng,
  getCurrentOng,
  getOngById,
  updateCurrentOng,
};
