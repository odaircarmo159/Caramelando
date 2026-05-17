import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import "../../Styles/Login.css"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPass, setShowPass] = useState(false)
  const [isPassFocused, setIsPassFocused] = useState(false)
  const [form, setForm] = useState({ email: "", senha: "" })
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)
  const eyesRef = useRef(null)

  useEffect(() => {
    const handleMove = (e) => {
      if (!eyesRef.current) return
      const rect = eyesRef.current.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)
      const moveX = Math.max(-6, Math.min(6, x / 30))
      const moveY = Math.max(-6, Math.min(6, y / 30))
      eyesRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`
    }

    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setFeedback("")
    setLoading(true)

    try {
      const session = await login(form)

      navigate(
        session.user.tipo === "instituicao"
          ? "/instituicao/dashboard"
          : "/perfil"
      )
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-cute">
      <div className="login-bg">
        <span className="paw p1">🐾</span>
        <span className="paw p2">🐾</span>
        <span className="paw p3">🐾</span>
        <span className="paw p4">🐾</span>
      </div>

      <section className="login-card">
        <div className={`dog ${isPassFocused ? "cover-eyes" : ""}`}>
          <div className="ear ear-left" />
          <div className="ear ear-right" />

          <div className="face">
            <div className="eyes" ref={eyesRef}>
              <div className="eye eye-left" />
              <div className="eye eye-right" />
            </div>

            <div className="snout">
              <div className="nose" />
              <div className="tongue" />
            </div>
          </div>

          <div className="paws">
            <span />
            <span />
          </div>
        </div>

        <h1>Bem‑vindo de volta</h1>
        <p>Entre e continue ajudando nossos amigos.</p>

        <form className="login-form-cute" onSubmit={handleSubmit}>
          {feedback ? <div className="message-box error">{feedback}</div> : null}

          <label>
            E-mail
            <input
              type="email"
              placeholder="exemplo@email.com"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
            />
          </label>

          <label className="password-field">
            Senha
            <input
              type={showPass ? "text" : "password"}
              placeholder="********"
              value={form.senha}
              onChange={(event) =>
                setForm((current) => ({ ...current, senha: event.target.value }))
              }
              onFocus={() => setIsPassFocused(true)}
              onBlur={() => setIsPassFocused(false)}
            />
            <button
              type="button"
              className="toggle-pass"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "🙈" : "👀"}
            </button>
          </label>

          <button type="submit" className="btn-login-cute">
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="login-links-cute">
            <Link to="/cadastro">Criar conta</Link>
            <Link to="/animais">Ver animais</Link>
          </div>
        </form>
      </section>
    </main>
  )
}
