import { useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import Header from "../../assets/components/common/Header"
import { useAuth } from "../../hooks/useAuth"

export default function Perfil() {
  const { user, loading, logout, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState({ type: "", text: "" })
  const [form, setForm] = useState({
    nomeCompleto: "",
    email: "",
    telefone: "",
    cidade: "",
    estado: "",
  })

  useEffect(() => {
    if (user) {
      setForm({
        nomeCompleto: user.nome ?? "",
        email: user.email ?? "",
        telefone: user.telefone ?? "",
        cidade: user.cidade ?? "",
        estado: user.estado ?? "",
      })
    }
  }, [user])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSaving(true)
    setFeedback({ type: "", text: "" })

    try {
      await updateProfile(form)
      setFeedback({
        type: "success",
        text: "Perfil atualizado com sucesso.",
      })
      setIsEditing(false)
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.message,
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Header />

      <main className="section-shell">
        <div className="container">
          <div className="section-header">
            <h1>Perfil do adotante</h1>
            <p>
              Mantenha seus dados atualizados e acompanhe suas informacoes de perfil.
            </p>
          </div>

          <section className="profile-shell">
            <article className="profile-hero-card">
              <div className="profile-hero-main">
                <div className="profile-avatar">{user.nome?.charAt(0) ?? "A"}</div>
                <div>
                  <span className="profile-eyebrow">Perfil</span>
                  <h2>{user.nome}</h2>
                  <p>{user.email}</p>
                  <div className="details-meta" style={{ marginTop: 12 }}>
                    <span>Adotante</span>
                    {user.cidade ? (
                      <span>
                        {user.cidade}
                        {user.estado ? `/${user.estado}` : ""}
                      </span>
                    ) : null}
                    {user.telefone ? <span>{user.telefone}</span> : null}
                  </div>
                </div>
              </div>

              <div className="dashboard-actions">
                <Link to="/animais" className="btn">
                  Buscar animais
                </Link>
                <button
                  type="button"
                  className="btn outline"
                  onClick={() => setIsEditing((current) => !current)}
                >
                  {isEditing ? "Cancelar edicao" : "Editar perfil"}
                </button>
                <button type="button" className="btn outline" onClick={logout}>
                  Sair
                </button>
              </div>
            </article>

            <div className="profile-grid">
              <section className="dashboard-card">
                <div className="profile-section-head">
                  <div>
                    <h2>Informacoes pessoais</h2>
                    <p>Dados usados para contato e identificacao do adotante.</p>
                  </div>
                  <span className="status-chip">
                    {isEditing ? "Editando" : "Dados cadastrais"}
                  </span>
                </div>

                {feedback.text ? (
                  <div className={`message-box ${feedback.type}`}>{feedback.text}</div>
                ) : null}

                <form className="form-grid" onSubmit={handleSubmit}>
                  <label>
                    Nome completo
                    <input
                      value={form.nomeCompleto}
                      disabled={!isEditing}
                      onChange={(event) =>
                        updateField("nomeCompleto", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    E-mail
                    <input
                      type="email"
                      value={form.email}
                      disabled={!isEditing}
                      onChange={(event) => updateField("email", event.target.value)}
                    />
                  </label>

                  <label>
                    Telefone
                    <input
                      value={form.telefone}
                      disabled={!isEditing}
                      onChange={(event) =>
                        updateField("telefone", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Cidade
                    <input
                      value={form.cidade}
                      disabled={!isEditing}
                      onChange={(event) => updateField("cidade", event.target.value)}
                    />
                  </label>

                  <label>
                    Estado
                    <input
                      value={form.estado}
                      disabled={!isEditing}
                      onChange={(event) => updateField("estado", event.target.value)}
                    />
                  </label>

                  {isEditing ? (
                    <div className="dashboard-actions full-width">
                      <button className="btn" type="submit" disabled={isSaving}>
                        {isSaving ? "Salvando..." : "Salvar alteracoes"}
                      </button>
                      <button
                        type="button"
                        className="btn outline"
                        onClick={() => {
                          setIsEditing(false)
                          setFeedback({ type: "", text: "" })
                          setForm({
                            nomeCompleto: user.nome ?? "",
                            email: user.email ?? "",
                            telefone: user.telefone ?? "",
                            cidade: user.cidade ?? "",
                            estado: user.estado ?? "",
                          })
                        }}
                      >
                        Descartar
                      </button>
                    </div>
                  ) : null}
                </form>
              </section>

              <aside className="profile-side">
                <section className="dashboard-card">
                  <h3>Resumo do perfil</h3>
                  <div className="profile-summary-list">
                    <div>
                      <span>Nome</span>
                      <strong>{user.nome}</strong>
                    </div>
                    <div>
                      <span>E-mail</span>
                      <strong>{user.email}</strong>
                    </div>
                    <div>
                      <span>Telefone</span>
                      <strong>{user.telefone || "Nao informado"}</strong>
                    </div>
                    <div>
                      <span>Localidade</span>
                      <strong>
                        {user.cidade
                          ? `${user.cidade}${user.estado ? `/${user.estado}` : ""}`
                          : "Nao informada"}
                      </strong>
                    </div>
                  </div>
                </section>

                <section className="dashboard-card">
                  <h3>Qualidade do cadastro</h3>
                  <div className="profile-completion">
                    <div className="profile-completion-bar">
                      <span
                        style={{
                          width: `${
                            [
                              user.nome,
                              user.email,
                              user.telefone,
                              user.cidade,
                              user.estado,
                            ].filter(Boolean).length * 20
                          }%`,
                        }}
                      />
                    </div>
                    <p>Preencha seus dados principais para manter o perfil completo.</p>
                  </div>
                </section>

                <section className="dashboard-card">
                  <h3>Acoes rapidas</h3>
                  <div className="dashboard-actions">
                    <Link to="/animais" className="btn">
                      Explorar animais
                    </Link>
                    <button
                      type="button"
                      className="btn outline"
                      onClick={() => setIsEditing(true)}
                    >
                      Atualizar dados
                    </button>
                  </div>
                </section>
              </aside>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
