import { useState } from "react"
import Header from "../../assets/components/common/Header"
import AnimaisFiltros from "../../assets/components/animais/AnimaisFiltros"
import AnimaisGaleria from "../../assets/components/animais/AnimaisGaleria"
import { useAnimals } from "../../hooks/useAnimals"

export default function ListaAnimais() {
  const [filters, setFilters] = useState({
    search: "",
    especie: "",
    status: "",
  })
  const { animals, loading } = useAnimals(filters)

  function handleChange(field, value) {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  return (
    <>
      <Header />

      <main className="section-shell hero-shell">
        <div className="container">
          <div className="section-header">
            <h1>Animais para adocao</h1>
            <p>
              Explore os perfis disponiveis e encontre o companheiro ideal para
              adocao responsavel.
            </p>
          </div>

          <AnimaisFiltros filters={filters} onChange={handleChange} />

          {loading ? (
            <div className="empty-state">
              <h3>Carregando animais...</h3>
            </div>
          ) : (
            <AnimaisGaleria animals={animals} />
          )}
        </div>
      </main>
    </>
  )
}
