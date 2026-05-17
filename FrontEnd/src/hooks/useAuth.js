import { useEffect, useState } from "react"
import {
  getCurrentSession,
  loginRequest,
  registerInstitution,
  registerUser,
  updateCurrentUser,
  writeStoredSession,
  readStoredSession,
} from "../services/api"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const session = readStoredSession()

    if (!session?.accessToken) {
      setLoading(false)
      return undefined
    }

    getCurrentSession()
      .then((data) => {
        if (!active) return

        const nextSession = {
          ...session,
          user: data.user,
        }

        writeStoredSession(nextSession)
        setUser(data.user)
      })
      .catch(() => {
        if (!active) return
        writeStoredSession(null)
        setUser(null)
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  async function register(payload) {
    if (payload.tipo === "instituicao") {
      return registerInstitution({
        nome: payload.razaoSocial,
        email: payload.email,
        senha: payload.senha,
        cnpj: payload.cnpj,
        estado: payload.estado,
        documento_verificacao: payload.documentoVerificacao || null,
      })
    }

    return registerUser({
      nome: payload.nomeCompleto,
      email: payload.email,
      senha: payload.senha,
      estado: payload.estado || null,
    })
  }

  async function login({ email, senha }) {
    const session = await loginRequest({ email, senha })
    writeStoredSession(session)
    setUser(session.user)
    return session
  }

  function logout() {
    writeStoredSession(null)
    setUser(null)
  }

  async function updateProfile(payload) {
    const updatedProfile = await updateCurrentUser({
      nome: payload.nomeCompleto,
      email: payload.email,
      telefone: payload.telefone,
      cidade: payload.cidade,
      estado: payload.estado,
    })

    const currentSession = readStoredSession()
    const nextUser = {
      id: updatedProfile.id,
      nome: updatedProfile.nome,
      email: updatedProfile.email,
      tipo: "usuario",
      telefone: updatedProfile.telefone,
      cidade: updatedProfile.cidade,
      estado: updatedProfile.estado,
      fotoPerfil: updatedProfile.foto_perfil,
    }

    writeStoredSession({
      ...currentSession,
      user: nextUser,
    })

    setUser(nextUser)
    return nextUser
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
