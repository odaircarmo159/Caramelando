import { Link, Navigate } from "react-router-dom"
import Header from "../../assets/components/common/Header"
import { useAuth } from "../../hooks/useAuth"
import { useInstitutionAnimals } from "../../hooks/useAnimals"

export default function Dashboard() {
  const { user, loading, logout } = useAuth()
  const { animals, loading: animalsLoading } = useInstitutionAnimals(user?.id)

  if (loading) {
    return (
      <main className="section-shell">
        <div className="container empty-state">
          <h3>Carregando painel...</h3>
        </div>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.tipo !== "instituicao") {
    return <Navigate to="/perfil" replace />
  }

  const disponiveis = animals.filter((animal) => animal.status === "DISPONIVEL")
  const emTratamento = animals.filter(
    (animal) => animal.status === "EM_TRATAMENTO"
  )
  const adotados = animals.filter((animal) => animal.status === "ADOTADO")
  const indisponiveis = animals.filter(
    (animal) => animal.status === "INDISPONIVEL"
  )
  const latestAnimals = animals.slice(0, 3)
  const completionFields = [
    user.nome,
    user.email,
    user.statusCadastro,
    animals.length ? "animais" : "",
  ].filter(Boolean).length
  const completionPercent = Math.min(100, completionFields * 25)

  return (
    <>
      <Header />

      <main className="section-shell">
        <div className="container">
          <section className="institution-hero-card">
            <div className="institution-hero-main">
              <div className="institution-badge">ONG</div>
              <div>
                <span className="profile-eyebrow">Painel institucional</span>
                <h1>{user.nome}</h1>
                <p>
                  Acompanhe o cadastro da instituicao, o desempenho dos animais
                  publicados e as proximas acoes da operacao.
                </p>
                <div className="details-meta" style={{ marginTop: 14 }}>
                  <span>{user.statusCadastro?.replaceAll("_", " ")}</span>
                  <span>{animals.length} animais no painel</span>
                  <span>Painel institucional</span>
                </div>
              </div>
            </div>

            <div className="dashboard-actions">
              <Link to="/instituicao/animais/novo" className="btn">
                Cadastrar animal
              </Link>
              <Link to="/instituicao/animais" className="btn outline">
                Gerenciar animais
              </Link>
              <button type="button" className="btn outline" onClick={logout}>
                Sair
              </button>
            </div>
          </section>

          <div className="dashboard-stats institution-stats-grid">
            <article className="dashboard-card stat-emphasis">
              <span className="profile-eyebrow">Total monitorado</span>
              <h3>{animalsLoading ? "..." : animals.length}</h3>
              <p>Animais cadastrados no fluxo atual da instituicao.</p>
            </article>
            <article className="dashboard-card">
              <span className="profile-eyebrow">Disponiveis</span>
              <h3>{animalsLoading ? "..." : disponiveis.length}</h3>
              <p>Prontos para receber contato de adotantes.</p>
            </article>
            <article className="dashboard-card">
              <span className="profile-eyebrow">Em tratamento</span>
              <h3>{animalsLoading ? "..." : emTratamento.length}</h3>
              <p>Demandam acompanhamento clinico ou recuperacao.</p>
            </article>
            <article className="dashboard-card">
              <span className="profile-eyebrow">Concluidos</span>
              <h3>{animalsLoading ? "..." : adotados.length}</h3>
              <p>Registros marcados como adotados pela instituicao.</p>
            </article>
          </div>

          <div className="institution-dashboard-grid">
            <section className="dashboard-card">
              <div className="profile-section-head">
                <div>
                  <h2>Resumo operacional</h2>
                  <p>Leitura rapida da operacao da ONG dentro da plataforma.</p>
                </div>
                <span className="status-chip">
                  {user.statusCadastro?.replaceAll("_", " ")}
                </span>
              </div>

              <div className="ops-overview-grid">
                <article className="ops-tile">
                  <strong>{disponiveis.length}</strong>
                  <span>Animais aptos para divulgacao</span>
                </article>
                <article className="ops-tile">
                  <strong>{emTratamento.length}</strong>
                  <span>Casos que exigem atencao clinica</span>
                </article>
                <article className="ops-tile">
                  <strong>{indisponiveis.length}</strong>
                  <span>Registros pausados ou temporariamente inativos</span>
                </article>
                <article className="ops-tile">
                  <strong>{adotados.length}</strong>
                  <span>Historico de animais com jornada encerrada</span>
                </article>
              </div>
            </section>

            <section className="dashboard-card">
              <div className="profile-section-head">
                <div>
                  <h2>Visao geral</h2>
                  <p>Resumo do painel institucional e do cadastro da ONG.</p>
                </div>
              </div>

              <div className="profile-completion">
                <div className="profile-completion-bar">
                  <span style={{ width: `${completionPercent}%` }} />
                </div>
                <p>{completionPercent}% das informacoes principais preenchidas.</p>
              </div>

              <div className="institution-note-list">
                <div>
                  <strong>Status cadastral</strong>
                  <p>
                    {user.statusCadastro === "EM_ANALISE"
                      ? "A instituicao esta em analise."
                      : "Conta institucional pronta para operacao."}
                  </p>
                </div>
              </div>
            </section>

            <section className="dashboard-card institution-wide-card">
              <div className="profile-section-head">
                <div>
                  <h2>Animais publicados recentemente</h2>
                  <p>Visao executiva dos registros mais novos da instituicao.</p>
                </div>
                <Link to="/instituicao/animais" className="link-button">
                  Ver todos
                </Link>
              </div>

              {animalsLoading ? (
                <p>Carregando animais...</p>
              ) : latestAnimals.length ? (
                <div className="institution-animal-list">
                  {latestAnimals.map((animal) => (
                    <article className="institution-animal-card" key={animal.id}>
                      <img src={animal.fotosUrl?.[0]} alt={animal.nome} />
                      <div>
                        <h3>{animal.nome}</h3>
                        <p>
                          {animal.especie} • {animal.porte} • {animal.cidade}/
                          {animal.estado}
                        </p>
                        <div className="details-meta" style={{ marginTop: 10 }}>
                          <span>{animal.status.replaceAll("_", " ")}</span>
                          <span>{animal.idadeEstimada} anos</span>
                        </div>
                      </div>
                      <div className="inline-actions">
                        <Link
                          to={`/instituicao/animais/${animal.id}/editar`}
                          className="link-button"
                        >
                          Editar
                        </Link>
                        <Link to={`/animais/${animal.id}`} className="link-button">
                          Visualizar
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>Nenhum animal cadastrado ainda</h3>
                  <p>Cadastre um animal para comecar a organizar a sua vitrine.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  )
}
