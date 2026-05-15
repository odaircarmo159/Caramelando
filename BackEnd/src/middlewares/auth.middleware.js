const { createClient } = require("@supabase/supabase-js");

const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não informado." });
  }

  const token = authHeader.replace("Bearer ", "");

  const { data, error } = await supabaseAuth.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ message: "Token inválido." });
  }

  req.user = data.user;

  next();
}

module.exports = authMiddleware;