const { createClient } = require("@supabase/supabase-js");

const AppError = require("../../utils/AppError");
const repo = require("./auth.repo");

const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

function normalizeAuthUser(profile, ong) {
  if (!profile) {
    return null;
  }

  if (profile.tipo_usuario === "ong") {
    return {
      id: profile.id,
      ongId: ong?.id || null,
      nome: ong?.nome_ong || profile.nome,
      email: profile.email,
      tipo: "instituicao",
      telefone: profile.telefone,
      cidade: ong?.cidade ?? profile.cidade,
      estado: ong?.estado ?? profile.estado,
      statusCadastro: (ong?.status_validacao || "em_validacao").toUpperCase(),
      whatsapp: ong?.whatsapp || null,
      logoUrl: ong?.logo_url || profile.foto_perfil || null,
    };
  }

  return {
    id: profile.id,
    nome: profile.nome,
    email: profile.email,
    tipo: "usuario",
    telefone: profile.telefone,
    cidade: profile.cidade,
    estado: profile.estado,
    fotoPerfil: profile.foto_perfil,
  };
}

async function buildCurrentUser(userId) {
  const profile = await repo.findProfileById(userId);

  if (!profile) {
    throw new AppError("Perfil nao encontrado.", 404);
  }

  const ong = profile.tipo_usuario === "ong"
    ? await repo.findOngByPerfilId(userId)
    : null;

  return normalizeAuthUser(profile, ong);
}

async function login(payload) {
  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email: payload.email,
    password: payload.senha,
  });

  if (error || !data.session || !data.user) {
    throw new AppError("E-mail ou senha invalidos.", 401);
  }

  const user = await buildCurrentUser(data.user.id);

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at,
    user,
  };
}

async function getCurrentSession(userId) {
  const user = await buildCurrentUser(userId);
  return { user };
}

module.exports = {
  getCurrentSession,
  login,
};
