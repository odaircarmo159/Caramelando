import { useMemo, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import Header from "../../assets/components/common/Header"
import { useAuth } from "../../hooks/useAuth"
import { useInstitutionAnimals } from "../../hooks/useAnimals"

export default function GerenciarAnimais() {
  const { user, loading } = useAuth()
  const { animals, loading: animalsLoading, editAnimal } = useInstitutionAnimals(
    user?.id
  )
  const [filters, setFilters] = useState({
    search: "",
    especie: "",
    status: "",
  })
  const [feedback, setFeedback] = useState({ type: "", text: "" })

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const matchesSearch =
        !filters.search ||
        animal.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
        (animal.cidade || "").toLowerCase().includes(filters.search.toLowerCase())

      const matchesSpecies =
        !filters.especie || animal.especie === filters.especie

      const matchesStatus = !filters.status || animal.status === filters.status

      return matchesSearch && matchesSpecies && matchesStatus
    })
  }, [animals, filters])

  const stats = {
    total: animals.length,
    disponiveis: animals.filter((animal) => animal.status === "DISPONIVEL").length,
    indisponiveis: animals.filter((animal) => animal.status === "INDISPONIVEL").length,
    adotados: animals.filter((animal) => animal.status === "ADOTADO").length,
  }

  async function handleStatusChange(id, status) {
    try {
      await editAnimal(id, { status })
      setFeedback({
        type: "success",
        text: "Status atualizado com sucesso.",
      })
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.message,
      })
    }
  }

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  if (loading) {
    return null
  }

  if (!user || user.tipo !== "instituicao") {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Header />

      <main className="section-shell">
        <div className="container">
          <section className="institution-hero-card">
            <div className="institution-hero-main">
              <div className="institution-badge">PET</div>
              <div>
                <span className="profile-eyebrow">Gestao operacional</span>
                <h1>Gerenciar animais</h1>
                <p>
                  Controle os registros publicados, refine os dados e acompanhe o
                  status de cada animal em um unico painel.
                </p>
                <div className="details-meta" style={{ marginTop: 14 }}>
                  <span>{stats.total} registros</span>
                  <span>{stats.disponiveis} disponiveis</span>
                  <span>{stats.indisponiveis} indisponiveis</span>
                </div>
              </div>
            </div>

            <div className="dashboard-actions">
              <Link to="/instituicao/animais/novo" className="btn">
                Novo animal
              </Link>
              <Link to="/instituicao/dashboard" className="btn outline">
                Voltar ao painel
              </Link>
            </div>
          </section>

          <div className="institution-stats-grid" style={{ marginBottom: 24 }}>
            <article className="dashboard-card stat-emphasis">
              <span className="profile-eyebrow">Total</span>
              <h3>{stats.total}</h3>
              <p>Animais sob responsabilidade da instituicao.</p>
            </article>
            <article className="dashboard-card">
              <span className="profile-eyebrow">Disponiveis</span>
              <h3>{stats.disponiveis}</h3>
              <p>Perfis prontos para receber interesse.</p>
            </article>
            <article className="dashboard-card">
              <span className="profile-eyebrow">Indisponiveis</span>
              <h3>{stats.indisponiveis}</h3>
              <p>Casos pausados ou temporariamente inativos.</p>
            </article>
            <article className="dashboard-card">
              <span className="profile-eyebrow">Adotados</span>
              <h3>{stats.adotados}</h3>
              <p>Historico positivo de saídas do painel.</p>
            </article>
          </div>

          <section className="dashboard-card">
            <div className="profile-section-head">
              <div>
                <h2>Base de animais</h2>
                <p>
                  Busque por nome ou cidade, filtre por especie e atualize o
                  status diretamente nesta tela.
                </p>
              </div>
              <span className="status-chip">
                {filteredAnimals.length} resultado
                {filteredAnimals.length === 1 ? "" : "s"}
              </span>
            </div>

            {feedback.text ? (
              <div className={`message-box ${feedback.type}`}>{feedback.text}</div>
            ) : null}

            <div className="manager-toolbar">
              <input
                type="search"
                placeholder="Buscar por nome ou cidade"
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
              />

              <select
                value={filters.especie}
                onChange={(event) => updateFilter("especie", event.target.value)}
              >
                <option value="">Todas as especies</option>
                <option value="Cachorro">Cachorro</option>
                <option value="Gato">Gato</option>
              </select>

              <select
                value={filters.status}
                onChange={(event) => updateFilter("status", event.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="DISPONIVEL">Disponivel</option>
                <option value="INDISPONIVEL">Indisponivel</option>
                <option value="ADOTADO">Adotado</option>
              </select>
            </div>

            {animalsLoading ? (
              <p>Carregando animais...</p>
            ) : filteredAnimals.length ? (
              <div className="manager-table-wrap">
                <table className="list-table">
                <thead>
                  <tr>
                    <th>Animal</th>
                    <th>Nome</th>
                    <th>Especie</th>
                    <th>Status</th>
                    <th>Cidade</th>
                    <th>Atualizacao rapida</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnimals.map((animal) => (
                    <tr key={animal.id}>
                      <td>
                        <img
                          className="manager-thumb"
                          src={animal.fotosUrl?.[0]}
                          alt={animal.nome}
                        />
                      </td>
                      <td>{animal.nome}</td>
                      <td>{animal.especie}</td>
                      <td>
                        <span className="status-chip">
                          {animal.status.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td>
                        {animal.cidade}
                        {animal.estado ? `/${animal.estado}` : ""}
                      </td>
                      <td>
                        <select
                          className="quick-status-select"
                          value={animal.status}
                          onChange={(event) =>
                            handleStatusChange(animal.id, event.target.value)
                          }
                        >
                          <option value="DISPONIVEL">Disponivel</option>
                          <option value="INDISPONIVEL">Indisponivel</option>
                          <option value="ADOTADO">Adotado</option>
                        </select>
                      </td>
                      <td>
                        <div className="inline-actions">
                          <Link to={`/animais/${animal.id}`} className="link-button">
                            Ver
                          </Link>
                          <Link
                            to={`/instituicao/animais/${animal.id}/editar`}
                            className="link-button"
                          >
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <h3>Nenhum animal encontrado</h3>
                <p>
                  Ajuste os filtros ou comece criando o primeiro registro da
                  instituicao.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  )
}
