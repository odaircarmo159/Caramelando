const { z } = require("zod");

const criarOngSchema = z.object({
  nome: z.string().min(3).max(255),
  email: z.string().email(),
  senha: z.string().min(6).max(255),
  cnpj: z.string().min(14).max(18),
  estado: z.string().min(2).max(2),
});

module.exports = {
  criarOngSchema
};
