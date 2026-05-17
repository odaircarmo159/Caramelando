import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  CalendarDays,
  ChevronRight,
  Circle,
  Heart,
  MapPin,
  MessageCircle,
  PawPrint,
  Ruler,
  Share2,
  ShieldCheck,
  Smile,
  Sparkles,
  SunMedium,
  Users,
} from "lucide-react"
import Header from "../../assets/components/common/Header"
import { useAnimal } from "../../hooks/useAnimals"

const speciesCopy = {
  Cachorro: {
    traits: [
      {
        title: "Brincalhao",
        text: "Transforma qualquer cantinho em convite para brincar.",
        icon: Smile,
      },
      {
        title: "Docil",
        text: "Se sente carinho, responde com confianca e presenca.",
        icon: Heart,
      },
      {
        title: "Sociavel",
        text: "Gosta de gente por perto e observa tudo com curiosidade.",
        icon: Users,
      },
      {
        title: "Animado",
        text: "Tem energia boa, daquelas que iluminam a casa.",
        icon: Sparkles,
      },
    ],
    galleryTags: ["Modo aventura", "Soneca estrategica", "Olhar que convence"],
    routine: [
      {
        period: "Manha",
        text: "Entre alarmes, cafe e pressa, sempre tem um focinho esperando atencao antes do dia comecar.",
        icon: SunMedium,
      },
      {
        period: "Tarde",
        text: "Mesmo nos dias corridos, a casa fica diferente quando existe alguem te esperando voltar.",
        icon: PawPrint,
      },
      {
        period: "Noite",
        text: "No fim do dia, a rotina desacelera e a companhia deixa qualquer momento mais leve.",
        icon: Heart,
      },
    ],
  },
  Gato: {
    traits: [
      {
        title: "Curioso",
        text: "Observa o mundo com atencao antes de decidir chegar mais perto.",
        icon: Sparkles,
      },
      {
        title: "Carinhoso",
        text: "Quando confia, demonstra afeto do jeitinho mais gostoso possivel.",
        icon: Heart,
      },
      {
        title: "Elegante",
        text: "Tem presenca leve, charmosa e cheia de personalidade.",
        icon: Smile,
      },
      {
        title: "Esperto",
        text: "Aprende a rotina da casa rapidinho e sabe exatamente como te ganhar.",
        icon: Users,
      },
    ],
    galleryTags: ["Janela favorita", "Soneca premium", "Olhar hipnotico"],
    routine: [
      {
        period: "Manha",
        text: "Entre alarmes, cafe e pressa, sempre tem um focinho esperando atencao antes do dia comecar.",
        icon: SunMedium,
      },
      {
        period: "Tarde",
        text: "Mesmo nos dias corridos, a casa fica diferente quando existe alguem te esperando voltar.",
        icon: PawPrint,
      },
      {
        period: "Noite",
        text: "No fim do dia, a rotina desacelera e a companhia deixa qualquer momento mais leve.",
        icon: Heart,
      },
    ],
  },
}

function getSpeciesProfile(animal) {
  return speciesCopy[animal.especie] || speciesCopy.Cachorro
}

function getDisplayAge(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "Idade estimada"
  }

  const numericAge = Number(value)
  const rounded = Number.isInteger(numericAge) ? numericAge : numericAge.toFixed(1)
  return `${rounded} aninho${numericAge === 1 ? "" : "s"}`
}

function getNarrative(animal, profile) {
  const firstName = animal.nome || "esse amorzinho"
  const cityLabel = animal.cidade && animal.estado
    ? `${animal.cidade}/${animal.estado}`
    : animal.cidade || animal.estado || "sua cidade"

  const sizeHeadline =
    animal.porte === "Pequeno"
      ? "Pequeno em tamanho, gigante em personalidade"
      : animal.porte === "Grande"
        ? "Grande no porte, maior ainda no carinho"
        : "Na medida certa para baguncar o coracao"

  return {
    cityLabel,
    sizeHeadline,
    intro: animal.descricao
      ? `${animal.descricao} So falta alguem olhar para tudo isso e pensar: "e voce que eu estava procurando".`
      : `${firstName} tem aquele jeitinho que vai entrando no coracao aos poucos ate virar certeza.`,
    heroTitle: `Oi, eu sou o`,
    heroName: firstName,
    routineBadge: "Como seria viver com ele?",
    routineTitle: "A rotina muda quando alguem passa a fazer parte dela",
  }
}

function getShareText(animal, cityLabel) {
  return `Olha esse animal para adocao no Caramelando: ${animal.nome}, ${animal.especie}, em ${cityLabel}.`
}

export default function DetalhesAnimais() {
  const { id } = useParams()
  const { animal, loading, error } = useAnimal(id)
  const [shareFeedback, setShareFeedback] = useState("")

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

  const profile = getSpeciesProfile(animal)
  const narrative = getNarrative(animal, profile)
  const photos = animal.fotosUrl?.length ? animal.fotosUrl : []
  const heroImage = photos[0]
  const galleryImages = photos.slice(1, 4)
  const ageLabel = getDisplayAge(animal.idadeEstimada)
  const whatsappMessage = encodeURIComponent(`Ola! Tenho interesse em adotar o(a) ${animal.nome}.

Nome: ${animal.nome}
Especie: ${animal.especie}
Idade estimada: ${ageLabel}
Porte: ${animal.porte}
Sexo: ${animal.sexo}
Cidade: ${narrative.cityLabel}
Instituicao: ${animal.instituicaoNome}
Descricao: ${animal.descricao}`)

  async function handleShare() {
    const shareData = {
      title: `Conheca ${animal.nome}`,
      text: getShareText(animal, narrative.cityLabel),
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        setShareFeedback("Link compartilhado.")
        return
      }

      await navigator.clipboard.writeText(window.location.href)
      setShareFeedback("Link copiado.")
    } catch {
      setShareFeedback("Nao foi possivel compartilhar agora.")
    } finally {
      window.setTimeout(() => setShareFeedback(""), 2400)
    }
  }

  const specItems = [
    { icon: PawPrint, label: animal.especie },
    { icon: CalendarDays, label: ageLabel },
    { icon: MapPin, label: narrative.cityLabel },
    { icon: Ruler, label: `Porte ${animal.porte?.toLowerCase() || "especial"}` },
  ]

  return (
    <>
      <Header />

      <main className="pet-story-shell">
        <div className="container pet-story-stack">
          <section className="pet-hero">
            <div className="pet-hero-media pet-fade-up">
              <div className="pet-hero-frame">
                <img src={heroImage} alt={animal.nome} />

                <button className="pet-heart-orbit" type="button" aria-label="Gostei desse animal">
                  <Heart size={24} strokeWidth={2.2} />
                </button>

                <div className="pet-availability-pill">
                  <Circle size={10} fill="currentColor" />
                  Disponivel pra Adoção
                </div>
              </div>
            </div>

            <div className="pet-hero-copy pet-fade-up delay-1">
              <span className="pet-eyebrow">
                <Heart size={16} strokeWidth={2.4} />
                Procurando um lar para encher de amor
              </span>

              <h1 className="pet-hero-title">
                <span className="pet-title-line">{narrative.heroTitle}</span>
                <span className="pet-title-name">
                  {narrative.heroName}
                  <span className="pet-wave-mark">
                    <PawPrint size={26} strokeWidth={2.2} />
                  </span>
                </span>
              </h1>

              <p className="pet-lead">
                {narrative.intro}
              </p>

              <div className="pet-spec-grid">
                {specItems.map(({ icon: Icon, label }) => (
                  <span key={label}>
                    <Icon size={18} strokeWidth={2.2} />
                    {label}
                  </span>
                ))}
              </div>

              <div className="pet-cta-row">
                <a
                  className="btn pet-primary-cta"
                  href={`https://wa.me/${animal.contatoWhatsapp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={22} strokeWidth={2.4} />
                  Quero adotar o {animal.nome}
                  <ChevronRight size={20} strokeWidth={2.6} />
                </a>

                <button className="btn outline pet-secondary-cta" type="button" onClick={handleShare}>
                  <Share2 size={20} strokeWidth={2.2} />
                  Compartilhar
                </button>
              </div>

              <div className="pet-interest-line">
                <span className="pet-avatar-stack" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <strong>Perfis como esse costumam arrancar mensagem ja no primeiro scroll.</strong>
              </div>

              {shareFeedback ? <p className="pet-share-feedback">{shareFeedback}</p> : null}
            </div>
          </section>

          <section className="pet-gallery-story pet-fade-up delay-2">
            <div className="pet-gallery-grid">
              {galleryImages.map((image, index) => (
                <figure
                  className={`pet-gallery-photo tone-${index + 1}`}
                  key={`${image}-${index}`}
                >
                  <img src={image} alt={`${animal.nome} em outro momento`} />
                  <figcaption>
                    <Sparkles size={16} strokeWidth={2.2} />
                    {profile.galleryTags[index] || "Mais um motivo para se apaixonar"}
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="pet-routine-panel">
              <span className="pet-section-eyebrow">{narrative.routineBadge}</span>
              <h2>{narrative.routineTitle}</h2>

              <div className="pet-routine-list">
                {profile.routine.map(({ period, text, icon: Icon }, index) => (
                  <article key={period}>
                    <div className="pet-routine-step">
                      <Icon size={30} strokeWidth={2.1} />
                    </div>
                    <div>
                      <strong>{period}</strong>
                      <p>{text}</p>
                    </div>
                    {index < profile.routine.length - 1 ? <span className="pet-routine-line" aria-hidden="true" /> : null}
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="pet-process-section pet-fade-up delay-3">
            <span className="pet-section-eyebrow">Como funciona</span>
            <h2>Da primeira mensagem ao para sempre</h2>

            <div className="pet-process-grid">
              {[
                {
                  step: "01",
                  title: "Voce manda oi",
                  text: "A conversa comeca leve, no WhatsApp, sem formulario assustador.",
                  icon: MessageCircle,
                },
                {
                  step: "02",
                  title: "A gente se encontra",
                  text: "Voce conhece o animal, sente a energia e tira duvidas com a ONG.",
                  icon: Users,
                },
                {
                  step: "03",
                  title: "Adaptacao com apoio",
                  text: "A instituicao acompanha os primeiros dias para tudo fluir bem.",
                  icon: ShieldCheck,
                },
                {
                  step: "04",
                  title: "Para sempre",
                  text: "Se rolar match, voce leva para casa um novo melhor amigo.",
                  icon: Heart,
                },
              ].map(({ step, title, text, icon: Icon }, index) => (
                <article
                  className="pet-process-card"
                  key={step}
                  style={{ animationDelay: `${0.12 * (index + 1)}s` }}
                >
                  <span>{step}</span>
                  <div className="pet-process-icon">
                    <Icon size={28} strokeWidth={2.2} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="pet-final-cta pet-fade-up delay-4">
            <span className="pet-cta-mark">
              <Heart size={28} strokeWidth={2.3} />
            </span>
            <h2>O {animal.nome} ta esperando uma mensagem sua</h2>
            <p>
              Sem burocracia, sem pressão e sem texto gelado. O que acha de adotar seu novo melhor amigo?.
            </p>
            <a
              className="btn pet-final-button"
              href={`https://wa.me/${animal.contatoWhatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={22} strokeWidth={2.4} />
              Falar no WhatsApp
            </a>
          </section>
        </div>
      </main>
    </>
  )
}
