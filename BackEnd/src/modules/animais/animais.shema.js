const { z } = require("zod");

const especieSchema = z.enum(["Cachorro", "Gato", "cao", "gato"]);
const porteSchema = z.enum([
  "Pequeno",
  "Medio",
  "Grande",
  "pequeno",
  "medio",
  "grande",
]);
const sexoSchema = z.enum(["Macho", "Femea", "macho", "femea"]);
const statusSchema = z.enum([
  "DISPONIVEL",
  "ADOTADO",
  "INDISPONIVEL",
  "EM_TRATAMENTO",
  "disponivel",
  "adotado",
  "inativo",
]);

const criarAnimalSchema = z.object({
  nome: z.string().trim().min(2).max(255),
  especie: especieSchema,
  porte: porteSchema.optional().nullable(),
  idadeEstimada: z.coerce.number().min(0).max(50).optional().nullable(),
  sexo: sexoSchema.optional().nullable(),
  descricao: z.string().trim().max(2000).optional().nullable(),
  seloPersonalidade: z.string().trim().min(2).max(120).optional().nullable(),
  vacinado: z.boolean().optional(),
  castrado: z.boolean().optional(),
  vermifugado: z.boolean().optional(),
  status: statusSchema.optional(),
  fotosUrl: z.array(z.string().trim().url()).min(4, "Envie pelo menos 4 fotos."),
  contatoWhatsapp: z.string().trim().min(8).max(30).optional().nullable(),
  cidade: z.string().trim().min(2).max(120).optional().nullable(),
  estado: z.string().trim().min(2).max(2).optional().nullable(),
});

const atualizarAnimalSchema = criarAnimalSchema.partial().superRefine((data, ctx) => {
  if (data.fotosUrl && data.fotosUrl.length < 4) {
    ctx.addIssue({
      code: "custom",
      path: ["fotosUrl"],
      message: "Envie pelo menos 4 fotos ao atualizar a galeria.",
    });
  }
});

module.exports = {
  atualizarAnimalSchema,
  criarAnimalSchema,
};
