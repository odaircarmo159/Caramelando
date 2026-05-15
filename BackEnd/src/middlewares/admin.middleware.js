const supabase = require("../config/supabase");

async function adminMiddleware(req, res, next) {
  const { data, error } = await supabase
    .from("perfis")
    .select("tipo_usuario")
    .eq("id", req.user.id)
    .single();

  if (error || !data) {
    return res.status(403).json({ message: "Perfil não encontrado." });
  }

  if (data.tipo_usuario !== "administrador") {
    return res.status(403).json({ message: "Acesso negado." });
  }

  next();
}

module.exports = adminMiddleware;