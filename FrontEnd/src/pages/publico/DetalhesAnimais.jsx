import { Link, useParams } from "react-router-dom"
import Header from "../../assets/components/common/Header"
import { useAnimal } from "../../hooks/useAnimals"

export default function DetalhesAnimais() {
  const { id } = useParams()
  const { animal, loading, error } = useAnimal(id)

  if (loading) {
    return (
      <>
        <Header />
        <main className="section-shell">
          <div className="container empty-state">
            <h3>Carregando detalhes...</h3>
          </div>
        </main>
      </>
    )
  }

  if (error || !animal) {
    return (
      <>
        <Header />
        <main className="section-shell">
          <div className="container empty-state">
            <h3>{error || "Animal nao encontrado"}</h3>
            <Link to="/animais" className="btn">
              Voltar para listagem
            </Link>
          </div>
        </main>
      </>
    )
  }

  const imageUrl = animal.fotosUrl?.[0] ?? ""
  const whatsappMessage = encodeURIComponent(`Ola! Tenho interesse em adotar o(a) ${animal.nome}.

Nome: ${animal.nome}
Especie: ${animal.especie}
Idade estimada: ${animal.idadeEstimada} anos
Porte: ${animal.porte}
Sexo: ${animal.sexo}
Status: ${animal.status.replaceAll("_", " ")}
Cidade: ${animal.cidade}/${animal.estado}
Instituicao: ${animal.instituicaoNome}
Descricao: ${animal.descricao}
Foto: ${imageUrl}`)

  return (
    <>
      <Header />

      <main className="section-shell">
        <div className="container">
          <div className="details-layout">
            <div className="details-image">
              <img src={animal.fotosUrl?.[0]} alt={animal.nome} />
            </div>

            <div className="details-card">
              <div className="details-meta">
                <span>{animal.status.replaceAll("_", " ")}</span>
                <span>{animal.sexo}</span>
                <span>{animal.porte}</span>
              </div>

              <h1>{animal.nome}</h1>
              <p>
                {animal.especie} • {animal.idadeEstimada} anos • {animal.cidade}/
                {animal.estado}
              </p>

              <p className="full-width" style={{ marginTop: 16 }}>
                {animal.descricao}
              </p>

              <div className="info-list" style={{ marginTop: 18 }}>
                <span className="status-chip">
                  {animal.vacinado ? "Vacinado" : "Vacina pendente"}
                </span>
                <span className="status-chip">
                  {animal.castrado ? "Castrado" : "Nao castrado"}
                </span>
                <span className="status-chip">{animal.instituicaoNome}</span>
              </div>

              <div className="dashboard-actions">
                <a
                  className="btn"
                  href={`https://wa.me/${animal.contatoWhatsapp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Falar no WhatsApp
                </a>

                <Link to="/animais" className="btn outline">
                  Ver outros animais
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
