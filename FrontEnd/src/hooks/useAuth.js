import { useEffect, useState } from "react"
import { STORAGE_KEYS, generateId } from "../mocks/data"
import {
  apiRequest,
  readInstitutions,
  readUsers,
  writeInstitutions,
  writeUsers,
} from "../services/api"

function readSession() {
  if (typeof window === "undefined") {
    return null
  }

  const rawSession = localStorage.getItem(STORAGE_KEYS.session)
  return rawSession ? JSON.parse(rawSession) : null
}

function writeSession(session) {
  if (typeof window === "undefined") {
    return
  }

  if (!session) {
    localStorage.removeItem(STORAGE_KEYS.session)
    return
  }

  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session))
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = readSession()
    setUser(session?.user ?? null)
    setLoading(false)
  }, [])

  async function register(payload) {
    if (payload.tipo === "instituicao") {
      const response = await apiRequest("/ongs", {
        method: "POST",
        body: JSON.stringify({
          nome: payload.razaoSocial,
          email: payload.email,
          senha: payload.senha,
          cnpj: payload.cnpj,
          estado: payload.estado,
        }),
      })

      const institutions = readInstitutions()
      const institution = {
        id: response.profile.id,
        razaoSocial: payload.razaoSocial,
        cnpj: payload.cnpj,
        estado: payload.estado,
        email: payload.email,
        senha: payload.senha,
        documentoVerificacao: payload.documentoVerificacao || "",
        statusCadastro:
          response.ong.status_validacao?.toUpperCase() || "EM_ANALISE",
      }

      writeInstitutions([institution, ...institutions])
      return institution
    }

    const users = readUsers()
    const userExists = users.some((userItem) => userItem.email === payload.email)

    if (userExists) {
      throw new Error("Ja existe uma conta com este e-mail.")
    }

    const newUser = {
      id: generateId("user"),
      nomeCompleto: payload.nomeCompleto,
      email: payload.email,
      senha: payload.senha,
      telefone: "",
      cidade: "",
      estado: payload.estado || "",
      bio: "",
      preferenciaAdocao: "",
    }

    writeUsers([newUser, ...users])
    return newUser
  }

  async function login({ email, senha }) {
    const institutions = readInstitutions()
    const institution = institutions.find(
      (item) => item.email === email && item.senha === senha
    )

    if (institution) {
      const session = {
        user: {
          id: institution.id,
          nome: institution.razaoSocial,
          email: institution.email,
          tipo: "instituicao",
          estado: institution.estado,
          statusCadastro: institution.statusCadastro,
        },
      }

      writeSession(session)
      setUser(session.user)
      return session
    }

    const users = readUsers()
    const account = users.find((item) => item.email === email && item.senha === senha)

    if (!account) {
      throw new Error("E-mail ou senha invalidos.")
    }

    const session = {
      user: {
        id: account.id,
        nome: account.nomeCompleto,
        email: account.email,
        tipo: "usuario",
        telefone: account.telefone,
        cidade: account.cidade,
        estado: account.estado,
        bio: account.bio,
        preferenciaAdocao: account.preferenciaAdocao,
      },
    }

    writeSession(session)
    setUser(session.user)
    return session
  }

  function logout() {
    writeSession(null)
    setUser(null)
  }

  async function updateProfile(payload) {
    if (!user || user.tipo !== "usuario") {
      throw new Error("Somente adotantes podem editar o perfil nesta versao.")
    }

    const users = readUsers()
    const index = users.findIndex((item) => item.id === user.id)

    if (index === -1) {
      throw new Error("Perfil nao encontrado.")
    }

    const updatedUser = {
      ...users[index],
      nomeCompleto: payload.nomeCompleto,
      email: payload.email,
      telefone: payload.telefone,
      cidade: payload.cidade,
      estado: payload.estado,
      bio: payload.bio,
      preferenciaAdocao: payload.preferenciaAdocao,
    }

    users[index] = updatedUser
    writeUsers(users)

    const nextSession = {
      user: {
        id: updatedUser.id,
        nome: updatedUser.nomeCompleto,
        email: updatedUser.email,
        tipo: "usuario",
        telefone: updatedUser.telefone,
        cidade: updatedUser.cidade,
        estado: updatedUser.estado,
        bio: updatedUser.bio,
        preferenciaAdocao: updatedUser.preferenciaAdocao,
      },
    }

    writeSession(nextSession)
    setUser(nextSession.user)

    return nextSession.user
  }

  return {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
  }
}
