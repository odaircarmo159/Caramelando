import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import Header from "../../assets/components/common/Header"
import { useAuth } from "../../hooks/useAuth"
import { useAnimal, useInstitutionAnimals } from "../../hooks/useAnimals"

export default function EditarAnimais() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user, loading } = useAuth()
  const { animal, loading: animalLoading } = useAnimal(id)
  const { editAnimal } = useInstitutionAnimals(user?.id)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (animal) {
      setForm({
        ...animal,
        fotosUrl: animal.fotosUrl?.[0] ?? "",
      })
    }
  }, [animal])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)

    await editAnimal(id, {
      ...form,
      idadeEstimada: Number(form.idadeEstimada),
      fotosUrl: [form.fotosUrl],
    })

    navigate("/instituicao/animais")
  }

  if (loading || animalLoading || !form) {
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
            <h1>Editar animal</h1>
            <p>Atualize as informacoes do animal e mantenha o cadastro organizado.</p>
          </div>

          <section className="dashboard-card">
            <form className="form-grid" onSubmit={handleSubmit}>
              <label>
                Nome
                <input
                  value={form.nome}
                  onChange={(event) => updateField("nome", event.target.value)}
                />
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
                WhatsApp
                <input
                  value={form.contatoWhatsapp}
                  onChange={(event) =>
                    updateField("contatoWhatsapp", event.target.value)
                  }
                />
              </label>

              <label className="full-width">
                URL da foto
                <input
                  value={form.fotosUrl}
                  onChange={(event) => updateField("fotosUrl", event.target.value)}
                />
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
                  {saving ? "Salvando..." : "Salvar alteracoes"}
                </button>
                <button
                  className="btn outline"
                  type="button"
                  onClick={() => navigate("/instituicao/animais")}
                >
                  Voltar
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </>
  )
}
