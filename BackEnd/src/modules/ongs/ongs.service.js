const supabase = require("../../config/supabase");
const repo = require("./ongs.repo");

async function createOng(payload) {
  const existingOng = await repo.findByCnpj(payload.cnpj);

  if (existingOng) {
    const error = new Error("CNPJ ja cadastrado.");
    error.statusCode = 409;
    throw error;
  }

  const existingProfile = await repo.findProfileByEmail(payload.email);

  if (existingProfile) {
    const error = new Error("Ja existe um perfil com este e-mail.");
    error.statusCode = 409;
    throw error;
  }

  const { data: authUserData, error: authUserError } =
    await supabase.auth.admin.createUser({
      email: payload.email,
      password: payload.senha,
      email_confirm: true,
    });

  if (authUserError || !authUserData.user) {
    throw authUserError || new Error("Nao foi possivel criar o usuario no Auth.");
  }

  try {
    const profile = await repo.createProfile({
      id: authUserData.user.id,
      tipo_usuario: "ong",
      nome: payload.nome,
      email: payload.email,
      estado: payload.estado,
    });

    const ong = await repo.create({
      perfil_id: authUserData.user.id,
      cnpj: payload.cnpj,
      descricao: null,
      endereco: null,
      whatsapp: null,
      instagram: null,
      site: null,
      logo_url: null,
      status_validacao: "em_validacao",
    });

    return {
      profile,
      ong,
    };
  } catch (error) {
    await supabase.auth.admin.deleteUser(authUserData.user.id);
    throw error;
  }
}

module.exports = {
  createOng,
};
