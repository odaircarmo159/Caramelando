import { useEffect, useState } from "react"
import {
  createAnimal,
  getAnimalById,
  getAnimals,
  getInstitutionAnimals,
  updateAnimal,
} from "../services/api"

export function useAnimals(filters) {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)

    getAnimals(filters)
      .then((data) => {
        if (active) {
          setAnimals(data)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [filters?.especie, filters?.search, filters?.status])

  return { animals, loading }
}

export function useAnimal(animalId) {
  const [animal, setAnimal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    if (!animalId) {
      setLoading(false)
      return undefined
    }

    setLoading(true)
    setError("")

    getAnimalById(animalId)
      .then((data) => {
        if (active) {
          setAnimal(data)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [animalId])

  return { animal, loading, error }
}

export function useInstitutionAnimals(instituicaoId) {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    if (!instituicaoId) {
      setAnimals([])
      setLoading(false)
      return
    }

    setLoading(true)
    const data = await getInstitutionAnimals(instituicaoId)
    setAnimals(data)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [instituicaoId])

  async function addAnimal(payload) {
    const created = await createAnimal(payload)
    await refresh()
    return created
  }

  async function editAnimal(id, payload) {
    const updated = await updateAnimal(id, payload)
    await refresh()
    return updated
  }

  return {
    animals,
    loading,
    refresh,
    addAnimal,
    editAnimal,
  }
}
