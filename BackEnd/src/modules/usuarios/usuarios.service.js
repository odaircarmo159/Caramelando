const supabase = require("../../config/supabase");
const AppError = require("../../utils/AppError");
const repo = require("./usuarios.repo");

async function createUsuario(payload) {
  const existingProfile = await repo.findByEmail(payload.email);

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
    throw authUserError || new AppError("Nao foi possivel criar o usuario.", 500);
  }

  try {
    return await repo.createProfile({
      id: authUserData.user.id,
      tipo_usuario: "usuario",
      nome: payload.nome,
      email: payload.email,
      telefone: payload.telefone || null,
      cidade: payload.cidade || null,
      estado: payload.estado || null,
      foto_perfil: payload.foto_perfil || null,
    });
  } catch (error) {
    await supabase.auth.admin.deleteUser(authUserData.user.id);
    throw error;
  }
}

async function getCurrentUsuario(userId) {
  const profile = await repo.findById(userId);

  if (!profile) {
    throw new AppError("Perfil nao encontrado.", 404);
  }

  return profile;
}

async function updateCurrentUsuario(userId, payload) {
  const currentProfile = await repo.findById(userId);

  if (!currentProfile) {
    throw new AppError("Perfil nao encontrado.", 404);
  }

  if (payload.email && payload.email !== currentProfile.email) {
    const existingProfile = await repo.findByEmail(payload.email);

    if (existingProfile && existingProfile.id !== userId) {
      throw new AppError("Ja existe um perfil com este e-mail.", 409);
    }

    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
      userId,
      { email: payload.email }
    );

    if (authUpdateError) {
      throw authUpdateError;
    }
  }

  return repo.updateById(userId, {
    nome: payload.nome ?? currentProfile.nome,
    email: payload.email ?? currentProfile.email,
    telefone:
      payload.telefone === undefined ? currentProfile.telefone : payload.telefone,
    cidade: payload.cidade === undefined ? currentProfile.cidade : payload.cidade,
    estado: payload.estado === undefined ? currentProfile.estado : payload.estado,
    foto_perfil:
      payload.foto_perfil === undefined
        ? currentProfile.foto_perfil
        : payload.foto_perfil,
  });
}

module.exports = {
  createUsuario,
  getCurrentUsuario,
  updateCurrentUsuario,
};
