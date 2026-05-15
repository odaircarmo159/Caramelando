import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Header from "../../assets/components/common/Header"
import "../../Styles/Home.css"
import heroImage from "../../assets/hero-dog.jpg"
import { useAnimals } from "../../hooks/useAnimals"
import { useAuth } from "../../hooks/useAuth"
import { getPlatformStats } from "../../services/api"

export default function Home() {
  const { animals } = useAnimals({})
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalAnimals: 0,
    totalAdoptions: 0,
    totalInstitutions: 0,
  })
  const featuredAnimals = animals.slice(0, 3)
  const isInstitution = user?.tipo === "instituicao"
  const isLogged = Boolean(user)

  useEffect(() => {
    getPlatformStats().then(setStats)
  }, [animals.length])

  return (
    <>
      <Header />

      <main className="home">
        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-image">
            <img src={heroImage} alt="Cachorro feliz" />
          </div>

          <div className="container hero-content">
            <h1>Encontre seu novo melhor amigo</h1>
            <p>
              Conectamos animais em situação de vulnerabilidade com pessoas que
              querem fazer a diferença através da adoção responsável.
            </p>
            <div className="hero-actions">
              <Link to="/animais" className="btn primary">
                Ver Animais
              </Link>

              {!isLogged ? (
                <Link to="/cadastro" className="btn outline light">
                  Cadastrar Conta
                </Link>
              ) : (
                <Link
                  to={isInstitution ? "/instituicao/dashboard" : "/perfil"}
                  className="btn outline light"
                >
                  {isInstitution ? "Ir para Painel" : "Meu Perfil"}
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="stats">
          <div className="container grid-3">
            <div className="card stat-card">
              <div className="icon-circle">🐾</div>
              <h3>{stats.totalAnimals}</h3>
              <p>Animais cadastrados</p>
            </div>
            <div className="card stat-card">
              <div className="icon-circle">❤️</div>
              <h3>{stats.totalAdoptions}</h3>
              <p>Adoções realizadas</p>
            </div>
            <div className="card stat-card">
              <div className="icon-circle">🏠</div>
              <h3>{stats.totalInstitutions}</h3>
              <p>ONGs parceiras</p>
            </div>
          </div>
        </section>

        <section className="featured">
          <div className="container">
            <div className="section-title">
              <h2>Animais Disponíveis para Adoção</h2>
              <p>
                Conheça alguns dos nossos amigos que estão esperando por um lar
                cheio de amor e carinho.
              </p>
            </div>

            <div className="grid-3">
              {featuredAnimals.map((animal) => (
                <article className="card animal-card" key={animal.id}>
                  <div className="card-image">
                    <img src={animal.fotosUrl?.[0]} alt={animal.nome} />
                  </div>
                  <div className="card-body">
                    <div className="card-title">
                      <h3>{animal.nome}</h3>
                      <span>{animal.idadeEstimada} anos</span>
                    </div>
                    <p className="muted">{animal.especie}</p>
                    <p className="desc">{animal.descricao}</p>
                    <Link className="btn full" to={`/animais/${animal.id}`}>
                      Quero Conhecer
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="center">
              <Link to="/animais" className="btn outline">
                Ver Todos os Animais
              </Link>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container cta-content">
            <h2>Faça Parte dessa Causa</h2>
            <p>
              Seja doador, adotante ou parceiro. Juntos podemos transformar a
              vida de muitos animais.
            </p>
            <div className="hero-actions">
              {isInstitution ? (
                <Link to="/instituicao/animais/novo" className="btn light">
                  Cadastrar Animal
                </Link>
              ) : null}

              {!isLogged ? (
                <Link to="/cadastro" className="btn outline light">
                  Ser Parceiro
                </Link>
              ) : !isInstitution ? (
                <Link to="/perfil" className="btn outline light">
                  Acompanhar Perfil
                </Link>
              ) : (
                <Link to="/instituicao/animais" className="btn outline light">
                  Gerenciar Animais
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
