import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import Header from "../../assets/components/common/Header"
import ConfirmationDialog from "../../assets/components/common/ConfirmationDialog"
import { useAuth } from "../../hooks/useAuth"
import { useAnimal, useInstitutionAnimals } from "../../hooks/useAnimals"
import { uploadAnimalImage } from "../../services/api"

export default function EditarAnimais() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user, loading } = useAuth()
  const { animal, loading: animalLoading, error: animalError } = useAnimal(id)
  const { editAnimal, removeAnimal } = useInstitutionAnimals(user?.id)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [photoFiles, setPhotoFiles] = useState([])
  const [photoPreviews, setPhotoPreviews] = useState([])
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    if (animal) {
      setForm({
        ...animal,
        fotosUrl: animal.fotosUrl ?? [],
      })
      setPhotoPreviews(animal.fotosUrl ?? [])
    }
  }, [animal])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handlePhotoSelection(event) {
    const files = Array.from(event.target.files || [])

    if (!files.length) {
      return
    }

    const previews = files.map((file) => URL.createObjectURL(file))

    setPhotoFiles((current) => [...current, ...files])
    setPhotoPreviews((current) => [...current, ...previews])
    updateField("fotosUrl", [
      ...(form?.fotosUrl || []),
      ...previews,
    ])
    event.target.value = ""
  }

  function removePhoto(indexToRemove) {
    const currentGallery = form?.fotosUrl || []
    const targetPhoto = currentGallery[indexToRemove]

    setPhotoPreviews((current) =>
      current.filter((_, index) => index !== indexToRemove)
    )

    updateField(
      "fotosUrl",
      currentGallery.filter((_, index) => index !== indexToRemove)
    )

    if (!targetPhoto?.startsWith("blob:")) {
      return
    }

    const blobPhotosBeforeTarget = currentGallery
      .slice(0, indexToRemove + 1)
      .filter((photo) => photo.startsWith("blob:")).length

    setPhotoFiles((current) =>
      current.filter((_, index) => index !== blobPhotosBeforeTarget - 1)
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setFeedback("")

    try {
      const uploadedPhotoUrls = photoFiles.length
        ? await Promise.all(photoFiles.map((file) => uploadAnimalImage(file)))
        : []

      const updatedGallery = [
        ...form.fotosUrl.filter((url) => !url.startsWith("blob:")),
        ...uploadedPhotoUrls,
      ]

      await editAnimal(id, {
        ...form,
        idadeEstimada: Number(form.idadeEstimada),
        fotosUrl: updatedGallery,
      })

      navigate("/instituicao/animais")
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    setFeedback("")

    try {
      await removeAnimal(id)
      navigate("/instituicao/animais")
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  if (loading || animalLoading) {
    return (
      <>
        <Header />
        <main className="section-shell">
          <div className="container empty-state">
            <h3>Carregando cadastro do animal...</h3>
          </div>
        </main>
      </>
    )
  }

  if (!user || user.tipo !== "instituicao") {
    return <Navigate to="/login" replace />
  }

  if (animalError || !animal || !form) {
    return (
      <>
        <Header />
        <main className="section-shell">
          <div className="container empty-state">
            <h3>{animalError || "Nao foi possivel carregar esse animal."}</h3>
            <button
              type="button"
              className="btn outline"
              onClick={() => navigate("/instituicao/animais")}
            >
              Voltar
            </button>
          </div>
        </main>
      </>
    )
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
                Status
                <select
                  value={form.status}
                  onChange={(event) => updateField("status", event.target.value)}
                >
                  <option value="DISPONIVEL">Disponivel</option>
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
                Fotos do animal
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoSelection}
                />
              </label>

              {photoPreviews.length ? (
                <div className="full-width">
                  <p style={{ margin: "4px 0 12px", color: "#8a6a43", fontWeight: 600 }}>
                    A galeria precisa manter pelo menos 4 fotos. Voce pode adicionar mais imagens em varias selecoes sem perder as anteriores.
                  </p>
                  <div className="pet-upload-grid">
                    {photoPreviews.map((preview, index) => (
                      <div key={`${preview}-${index}`} className="pet-upload-card">
                        <img
                          src={preview}
                          alt={`${form.nome} ${index + 1}`}
                          className="pet-upload-preview"
                        />
                        <button
                          type="button"
                          className="pet-upload-remove"
                          onClick={() => removePhoto(index)}
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

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
                  onClick={() => setConfirmOpen(true)}
                  disabled={deleting}
                >
                  {deleting ? "Excluindo..." : "Excluir animal"}
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

      <ConfirmationDialog
        open={confirmOpen}
        title="Excluir animal"
        description={`Tem certeza que deseja excluir ${form.nome}? Essa acao nao pode ser desfeita.`}
        confirmLabel="Excluir animal"
        cancelLabel="Cancelar"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
