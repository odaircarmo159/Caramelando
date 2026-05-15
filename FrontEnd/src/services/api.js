import {
  STORAGE_KEYS,
  defaultAnimals,
  defaultInstitutions,
  defaultUsers,
  generateId,
  readList,
  writeList,
} from "../mocks/data"

const API_URL = import.meta.env.VITE_API_URL

function buildUrl(endpoint) {
  if (!API_URL) {
    throw new Error("VITE_API_URL nao foi configurada.")
  }

  return `${API_URL}${endpoint}`
}

function normalizeAnimal(animal) {
  return {
    ...animal,
    fotosUrl: Array.isArray(animal.fotosUrl)
      ? animal.fotosUrl.filter(Boolean)
      : animal.fotosUrl
        ? [animal.fotosUrl]
        : [],
  }
}

function readAnimals() {
  return readList(STORAGE_KEYS.animals, defaultAnimals)
}

function writeAnimals(animals) {
  writeList(STORAGE_KEYS.animals, animals)
}

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(buildUrl(endpoint), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || "Erro na requisicao.")
  }

  return data
}

export async function getAnimals(filters = {}) {
  const animals = readAnimals()

  return animals.filter((animal) => {
    const matchesSearch =
      !filters.search ||
      animal.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
      animal.cidade.toLowerCase().includes(filters.search.toLowerCase())

    const matchesSpecies =
      !filters.especie || animal.especie === filters.especie

    const matchesStatus = !filters.status || animal.status === filters.status

    return matchesSearch && matchesSpecies && matchesStatus
  })
}

export async function getAnimalById(animalId) {
  const animal = readAnimals().find((item) => item.id === animalId)

  if (!animal) {
    throw new Error("Animal nao encontrado.")
  }

  return animal
}

export async function getInstitutionAnimals(instituicaoId) {
  return readAnimals().filter((animal) => animal.instituicaoId === instituicaoId)
}

export async function createAnimal(payload) {
  const animals = readAnimals()
  const animal = normalizeAnimal({
    ...payload,
    id: generateId("animal"),
  })

  writeAnimals([animal, ...animals])
  return animal
}

export async function updateAnimal(animalId, payload) {
  const animals = readAnimals()
  const index = animals.findIndex((animal) => animal.id === animalId)

  if (index === -1) {
    throw new Error("Animal nao encontrado.")
  }

  const updatedAnimal = normalizeAnimal({
    ...animals[index],
    ...payload,
    id: animalId,
  })

  animals[index] = updatedAnimal
  writeAnimals(animals)

  return updatedAnimal
}

export async function getPlatformStats() {
  const animals = readAnimals()
  const institutions = readInstitutions()

  return {
    totalAnimals: animals.length,
    totalAdoptions: animals.filter((animal) => animal.status === "ADOTADO").length,
    totalInstitutions: institutions.length,
  }
}

export function readUsers() {
  return readList(STORAGE_KEYS.users, defaultUsers)
}

export function writeUsers(users) {
  writeList(STORAGE_KEYS.users, users)
}

export function readInstitutions() {
  return readList(STORAGE_KEYS.institutions, defaultInstitutions)
}

export function writeInstitutions(institutions) {
  writeList(STORAGE_KEYS.institutions, institutions)
}
