import { Link } from "react-router-dom";
import "../../Styles/Home.css";
import heroImage from "../../assets/hero-dog.jpg";

const featuredAnimals = [
  {
    id: 1,
    name: "Thor",
    species: "Cachorro",
    age: "2 anos",
    description: "Um cachorro carinhoso e brincalhão procurando um lar amoroso.",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400",
    ongWhatsapp: "5567999999999",
  },
  {
    id: 2,
    name: "Luna",
    species: "Gato",
    age: "1 ano",
    description: "Gatinha meiga e tranquila, ótima para apartamento.",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
    ongWhatsapp: "5567977777777",
  },
  {
    id: 3,
    name: "Mel",
    species: "Cachorro",
    age: "3 anos",
    description: "Cachorrinha caramelo alegre e cheia de energia.",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
    ongWhatsapp: "5567999999999",
  },
];

export default function Home() {
  return (
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
            <Link to="/sobre" className="btn outline light">
              Saiba Mais
            </Link>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container grid-3">
          <div className="card stat-card">
            <div className="icon-circle">🐾</div>
            <h3>200+</h3>
            <p>Animais cadastrados</p>
          </div>
          <div className="card stat-card">
            <div className="icon-circle">❤️</div>
            <h3>150+</h3>
            <p>Adoções realizadas</p>
          </div>
          <div className="card stat-card">
            <div className="icon-circle">🏠</div>
            <h3>5+</h3>
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
                  <img src={animal.image} alt={animal.name} />
                </div>
                <div className="card-body">
                  <div className="card-title">
                    <h3>{animal.name}</h3>
                    <span>{animal.age}</span>
                  </div>
                  <p className="muted">{animal.species}</p>
                  <p className="desc">{animal.description}</p>
                  <button
                    className="btn full"
                    onClick={() => {
                      const message = encodeURIComponent(
                        `Olá! Tenho interesse em adotar o(a) ${animal.name}.`
                      );
                      window.open(
                        `https://wa.me/${animal.ongWhatsapp}?text=${message}`,
                        "_blank"
                      );
                    }}
                  >
                    Quero Adotar
                  </button>
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
            Seja doador, adotante ou parceiro. Juntos podemos transformar a vida
            de muitos animais.
          </p>
          <div className="hero-actions">
            <button className="btn light">Cadastrar Animal</button>
            <button className="btn outline light">Ser Parceiro</button>
          </div>
        </div>
      </section>
    </main>
  );
}
