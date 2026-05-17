const API_URL = import.meta.env.VITE_API_URL
const SESSION_STORAGE_KEY = "caramelando.session"

function buildUrl(endpoint) {
  if (!API_URL) {
    throw new Error("VITE_API_URL nao foi configurada.")
  }

  return `${API_URL}${endpoint}`
}

function toQueryString(params) {
  const searchParams = new URLSearchParams()

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value)
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ""
}

export function readStoredSession() {
  if (typeof window === "undefined") {
    return null
  }

  const rawSession = localStorage.getItem(SESSION_STORAGE_KEY)
  return rawSession ? JSON.parse(rawSession) : null
}

export function writeStoredSession(session) {
  if (typeof window === "undefined") {
    return
  }

  if (!session) {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    return
  }

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

function getAccessToken() {
  return readStoredSession()?.accessToken || null
}

export async function apiRequest(endpoint, options = {}) {
  const token = options.auth === false ? null : getAccessToken()

  const response = await fetch(buildUrl(endpoint), {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export async function loginRequest(payload) {
  return apiRequest("/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  })
}

export async function getCurrentSession() {
  return apiRequest("/auth/me")
}

export async function registerUser(payload) {
  return apiRequest("/usuarios/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  })
}

export async function registerInstitution(payload) {
  return apiRequest("/ongs", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  })
}

export async function updateCurrentUser(payload) {
  return apiRequest("/usuarios/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function getAnimals(filters = {}) {
  return apiRequest(`/animais${toQueryString(filters)}`, { auth: false })
}

export async function getAnimalById(animalId) {
  return apiRequest(`/animais/${animalId}`, { auth: false })
}

export async function getInstitutionAnimals() {
  return apiRequest("/animais/me/ong")
}

export async function createAnimal(payload) {
  return apiRequest("/animais", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function updateAnimal(animalId, payload) {
  return apiRequest(`/animais/${animalId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function deleteAnimal(animalId) {
  return apiRequest(`/animais/${animalId}`, {
    method: "DELETE",
  })
}

export async function getPlatformStats() {
  return apiRequest("/animais/stats/platform", { auth: false })
}

export async function uploadAnimalImage(file) {
  if (!file) {
    throw new Error("Selecione uma imagem para upload.")
  }

  const token = getAccessToken()

  if (!token) {
    throw new Error("Voce precisa estar autenticado para enviar imagens.")
  }

  const response = await fetch(buildUrl("/uploads/animal-image"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-file-name": file.name,
    },
    body: file,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || "Nao foi possivel enviar a imagem.")
  }

  return data.publicUrl
}
