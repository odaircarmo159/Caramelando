const STORAGE_KEYS = {
  animals: "caramelando.animals",
  users: "caramelando.users",
  institutions: "caramelando.institutions",
  session: "caramelando.session",
}

const defaultInstitutions = [
  {
    id: "inst-1",
    razaoSocial: "ONG Patinhas Solidarias",
    cnpj: "12.345.678/0001-90",
    estado: "MS",
    email: "contato@patinhas.org",
    senha: "123456",
    documentoVerificacao: "estatuto-social.pdf",
    statusCadastro: "EM_ANALISE",
  },
]

const defaultUsers = [
  {
    id: "user-1",
    nomeCompleto: "Ana Souza",
    email: "ana@email.com",
    senha: "123456",
    telefone: "(67) 99999-8888",
    cidade: "Campo Grande",
    estado: "MS",
    bio: "Apaixonada por animais, com interesse em adocao responsavel e apoio a ONGs locais.",
    preferenciaAdocao: "Cachorros de porte pequeno e medio",
  },
]

const defaultAnimals = [
  {
    id: "animal-1",
    nome: "Thor",
    especie: "Cachorro",
    idadeEstimada: 2,
    porte: "Medio",
    sexo: "Macho",
    status: "DISPONIVEL",
    castrado: true,
    vacinado: true,
    descricao: "Muito brincalhao, sociavel e adora criancas.",
    fotosUrl: [
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=900",
    ],
    instituicaoId: "inst-1",
    instituicaoNome: "ONG Patinhas Solidarias",
    contatoWhatsapp: "5567999999999",
    cidade: "Campo Grande",
    estado: "MS",
  },
  {
    id: "animal-4",
    nome: "Ste",
    especie: "Gato",
    idadeEstimada: 2,
    porte: "Pequeni",
    sexo: "Macho",
    status: "DISPONIVEL",
    castrado: true,
    vacinado: true,
    descricao: "Gatinho Tadinho.",
    fotosUrl: [
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.B7U-Pgoq0rUryYoKg3J6DwHaGD%3Fpid%3DApi&f=1&ipt=477cd2d51e73fd1a92302103491a3f04c0fa2c493c3289d5a9e2db816f0d71bb&ipo=images",
    ],
    instituicaoId: "inst-1",
    instituicaoNome: "ONG Patinhas Solidarias",
    contatoWhatsapp: "5567996336295",
    cidade: "Dourados",
    estado: "MS",
  },
  {
    id: "animal-2",
    nome: "Luna",
    especie: "Gato",
    idadeEstimada: 1,
    porte: "Pequeno",
    sexo: "Femea",
    status: "DISPONIVEL",
    castrado: true,
    vacinado: true,
    descricao: "Calma, se adapta bem a apartamento e gosta de colo.",
    fotosUrl: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900",
    ],
    instituicaoId: "inst-1",
    instituicaoNome: "ONG Patinhas Solidarias",
    contatoWhatsapp: "5567977777777",
    cidade: "Campo Grande",
    estado: "MS",
  },
  {
    id: "animal-3",
    nome: "Mel",
    especie: "Cachorro",
    idadeEstimada: 3,
    porte: "Grande",
    sexo: "Femea",
    status: "EM_TRATAMENTO",
    castrado: false,
    vacinado: true,
    descricao: "Muito carinhosa, resgatada recentemente e em tratamento.",
    fotosUrl: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900",
    ],
    instituicaoId: "inst-1",
    instituicaoNome: "ONG Patinhas Solidarias",
    contatoWhatsapp: "5567999999999",
    cidade: "Dourados",
    estado: "MS",
  },
]

const isBrowser = typeof window !== "undefined"

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

function seedStorage() {
  if (!isBrowser) return

  if (!localStorage.getItem(STORAGE_KEYS.animals)) {
    localStorage.setItem(STORAGE_KEYS.animals, JSON.stringify(defaultAnimals))
  }

  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(defaultUsers))
  }

  if (!localStorage.getItem(STORAGE_KEYS.institutions)) {
    localStorage.setItem(
      STORAGE_KEYS.institutions,
      JSON.stringify(defaultInstitutions)
    )
  }
}

function readList(key, fallback) {
  if (!isBrowser) return clone(fallback)
  seedStorage()
  return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback))
}

function writeList(key, data) {
  if (!isBrowser) return
  localStorage.setItem(key, JSON.stringify(data))
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}`
}

export {
  STORAGE_KEYS,
  defaultAnimals,
  defaultInstitutions,
  defaultUsers,
  generateId,
  readList,
  seedStorage,
  writeList,
}
