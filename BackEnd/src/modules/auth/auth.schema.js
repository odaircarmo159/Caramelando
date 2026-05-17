const { z } = require("zod");

const loginSchema = z.object({
  email: z.string().trim().email(),
  senha: z.string().min(6).max(255),
});

module.exports = {
  loginSchema,
};
