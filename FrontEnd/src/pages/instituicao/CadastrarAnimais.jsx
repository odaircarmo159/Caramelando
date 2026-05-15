import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import Header from "../../assets/components/common/Header"
import { useAuth } from "../../hooks/useAuth"
import { useInstitutionAnimals } from "../../hooks/useAnimals"

const initialForm = {
  nome: "",
  especie: "Cachorro",
  idadeEstimada: 1,
  porte: "Pequeno",
  sexo: "Macho",
  status: "DISPONIVEL",
  castrado: true,
  vacinado: true,
  descricao: "",
  fotosUrl: "",
  cidade: "",
  estado: "MS",
  contatoWhatsapp: "",
}

export default function CadastrarAnimais() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const { addAnimal } = useInstitutionAnimals(user?.id)
  const [form, setForm] = useState(initialForm)
  const [feedback, setFeedback] = useState("")
  const [saving, setSaving] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setFeedback("")

    try {
      await addAnimal({
        ...form,
        idadeEstimada: Number(form.idadeEstimada),
        fotosUrl: [form.fotosUrl],
        instituicaoId: user.id,
        instituicaoNome: user.nome,
      })

      navigate("/instituicao/animais")
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setSaving(false)
    }
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
          <div className="section-header">
            <h1>Cadastrar animal</h1>
            <p>Preencha as informacoes do animal para disponibiliza-lo no sistema.</p>
          </div>

          <section className="dashboard-card">
            {feedback ? <div className="message-box error">{feedback}</div> : null}

            <form className="form-grid" onSubmit={handleSubmit}>
              <label>
                Nome
                <input
                  value={form.nome}
                  onChange={(event) => updateField("nome", event.target.value)}
                />
              </label>

              <label>
                Especie
                <select
                  value={form.especie}
                  onChange={(event) => updateField("especie", event.target.value)}
                >
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                </select>
              </label>

              <label>
                Idade estimada
                <input
                  type="number"
                  min="0"
                  value={form.idadeEstimada}
                  onChange={(event) =>
                    updateField("idadeEstimada", event.target.value)
                  }
                />
              </label>

              <label>
                Porte
                <select
                  value={form.porte}
                  onChange={(event) => updateField("porte", event.target.value)}
                >
                  <option value="Pequeno">Pequeno</option>
                  <option value="Medio">Medio</option>
                  <option value="Grande">Grande</option>
                </select>
              </label>

              <label>
                Sexo
                <select
                  value={form.sexo}
                  onChange={(event) => updateField("sexo", event.target.value)}
                >
                  <option value="Macho">Macho</option>
                  <option value="Femea">Femea</option>
                </select>
              </label>

              <label>
                Status
                <select
                  value={form.status}
                  onChange={(event) => updateField("status", event.target.value)}
                >
                  <option value="DISPONIVEL">Disponivel</option>
                  <option value="EM_TRATAMENTO">Em tratamento</option>
                  <option value="INDISPONIVEL">Indisponivel</option>
                  <option value="ADOTADO">Adotado</option>
                </select>
              </label>

              <label>
                Cidade
                <input
                  value={form.cidade}
                  onChange={(event) => updateField("cidade", event.target.value)}
                />
              </label>

              <label>
                Estado
                <input
                  value={form.estado}
                  onChange={(event) => updateField("estado", event.target.value)}
                />
              </label>

              <label>
                WhatsApp da ONG
                <input
                  value={form.contatoWhatsapp}
                  onChange={(event) =>
                    updateField("contatoWhatsapp", event.target.value)
                  }
                />
              </label>

              <label>
                URL da foto
                <input
                  value={form.fotosUrl}
                  onChange={(event) => updateField("fotosUrl", event.target.value)}
                />
              </label>

              <label>
                Castrado
                <select
                  value={String(form.castrado)}
                  onChange={(event) =>
                    updateField("castrado", event.target.value === "true")
                  }
                >
                  <option value="true">Sim</option>
                  <option value="false">Nao</option>
                </select>
              </label>

              <label>
                Vacinado
                <select
                  value={String(form.vacinado)}
                  onChange={(event) =>
                    updateField("vacinado", event.target.value === "true")
                  }
                >
                  <option value="true">Sim</option>
                  <option value="false">Nao</option>
                </select>
              </label>

              <label className="full-width">
                Descricao
                <textarea
                  value={form.descricao}
                  onChange={(event) => updateField("descricao", event.target.value)}
                />
              </label>

              <div className="dashboard-actions full-width">
                <button className="btn" type="submit" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar animal"}
                </button>
                <button
                  className="btn outline"
                  type="button"
                  onClick={() => navigate("/instituicao/dashboard")}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </>
  )
}
