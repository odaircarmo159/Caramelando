const { z } = require("zod");

const criarUsuarioSchema = z.object({
  nome: z.string().trim().min(3).max(255),
  email: z.string().trim().email(),
  senha: z.string().min(6).max(255),
  telefone: z.string().trim().min(8).max(30).optional().nullable(),
  cidade: z.string().trim().min(2).max(120).optional().nullable(),
  estado: z.string().trim().min(2).max(2).optional().nullable(),
  foto_perfil: z.string().trim().url().optional().nullable(),
});

const atualizarUsuarioSchema = z.object({
  nome: z.string().trim().min(3).max(255).optional(),
  email: z.string().trim().email().optional(),
  telefone: z.string().trim().min(8).max(30).optional().nullable(),
  cidade: z.string().trim().min(2).max(120).optional().nullable(),
  estado: z.string().trim().min(2).max(2).optional().nullable(),
  foto_perfil: z.string().trim().url().optional().nullable(),
});

module.exports = {
  criarUsuarioSchema,
  atualizarUsuarioSchema,
};
