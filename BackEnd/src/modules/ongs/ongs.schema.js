const { z } = require("zod");

const urlOrNull = z.string().trim().url().optional().nullable();

const criarOngSchema = z.object({
  nome: z.string().trim().min(3).max(255),
  email: z.string().trim().email(),
  senha: z.string().min(6).max(255),
  cnpj: z.string().trim().min(14).max(18),
  estado: z.string().trim().min(2).max(2),
  cidade: z.string().trim().min(2).max(120).optional().nullable(),
  telefone: z.string().trim().min(8).max(30).optional().nullable(),
  descricao: z.string().trim().max(2000).optional().nullable(),
  endereco: z.string().trim().max(255).optional().nullable(),
  whatsapp: z.string().trim().min(8).max(30).optional().nullable(),
  instagram: z.string().trim().max(100).optional().nullable(),
  site: urlOrNull,
  logo_url: urlOrNull,
  facebook: urlOrNull,
  documento_verificacao: z.string().trim().url().optional().nullable(),
});

const atualizarOngSchema = z.object({
  nome: z.string().trim().min(3).max(255).optional(),
  email: z.string().trim().email().optional(),
  telefone: z.string().trim().min(8).max(30).optional().nullable(),
  cidade: z.string().trim().min(2).max(120).optional().nullable(),
  estado: z.string().trim().min(2).max(2).optional().nullable(),
  descricao: z.string().trim().max(2000).optional().nullable(),
  endereco: z.string().trim().max(255).optional().nullable(),
  whatsapp: z.string().trim().min(8).max(30).optional().nullable(),
  instagram: z.string().trim().max(100).optional().nullable(),
  site: urlOrNull,
  logo_url: urlOrNull,
  facebook: urlOrNull,
});

module.exports = {
  atualizarOngSchema,
  criarOngSchema,
};
