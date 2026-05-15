import { Link } from "react-router-dom"

export default function AnimaisCard({ animal }) {
  const image = animal.fotosUrl?.[0]

  return (
    <article className="card animal-card">
      <div className="card-image">
        <img src={image} alt={animal.nome} />
      </div>

      <div className="card-body">
        <div className="card-title">
          <h3>{animal.nome}</h3>
          <span>{animal.idadeEstimada} anos</span>
        </div>

        <p className="muted">
          {animal.especie} • {animal.porte} • {animal.cidade}/{animal.estado}
        </p>
        <p className="desc">{animal.descricao}</p>

        <div className="card-tags">
          <span>{animal.status.replaceAll("_", " ")}</span>
          <span>{animal.sexo}</span>
        </div>

        <Link to={`/animais/${animal.id}`} className="btn full">
          Ver detalhes
        </Link>
      </div>
    </article>
  )
}
