import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "../../assets/components/common/Header"
import { useAuth } from "../../hooks/useAuth"
import "../../Styles/Cadastro.css"

export default function Cadastro() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [tipo, setTipo] = useState("usuario")
  const [feedback, setFeedback] = useState({ type: "", text: "" })
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nomeCompleto: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    razaoSocial: "",
    cnpj: "",
    estado: "",
    documentoVerificacao: "",
  })

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFeedback({ type: "", text: "" })

    if (!form.email || !form.senha) {
      setFeedback({ type: "error", text: "Preencha e-mail e senha." })
      return
    }

    if (form.senha !== form.confirmarSenha) {
      setFeedback({ type: "error", text: "As senhas nao coincidem." })
      return
    }

    if (tipo === "usuario" && !form.nomeCompleto) {
      setFeedback({ type: "error", text: "Informe o nome completo." })
      return
    }

    if (
      tipo === "instituicao" &&
      (!form.razaoSocial || !form.cnpj || !form.estado)
    ) {
      setFeedback({
        type: "error",
        text: "Preencha razao social, CNPJ e estado.",
      })
      return
    }

    setLoading(true)

    try {
      await register({
        tipo,
        nomeCompleto: form.nomeCompleto,
        email: form.email,
        senha: form.senha,
        razaoSocial: form.razaoSocial,
        cnpj: form.cnpj,
        estado: form.estado,
        documentoVerificacao: form.documentoVerificacao,
      })

      setFeedback({
        type: "success",
        text:
          tipo === "instituicao"
            ? "Cadastro realizado com sucesso. Sua instituicao foi encaminhada para analise."
            : "Conta criada com sucesso. Agora voce ja pode entrar.",
      })

      setTimeout(() => navigate("/login"), 1200)
    } catch (error) {
      setFeedback({ type: "error", text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <main className="cadastro">
        <section className="cadastro-hero">
          <div className="container">
            <h1>Crie sua conta</h1>
            <p>
              Escolha o tipo de cadastro e preencha seus dados para comecar.
            </p>
          </div>
        </section>

        <section className="cadastro-form-section">
          <div className="container">
            <div className="cadastro-toggle">
              <button
                type="button"
                className={tipo === "usuario" ? "active" : ""}
                onClick={() => setTipo("usuario")}
              >
                Sou Adotante
              </button>
              <button
                type="button"
                className={tipo === "instituicao" ? "active" : ""}
                onClick={() => setTipo("instituicao")}
              >
                Sou Instituicao
              </button>
            </div>

            <form className="cadastro-form" onSubmit={handleSubmit}>
              {feedback.text ? (
                <div className={`message-box ${feedback.type}`}>{feedback.text}</div>
              ) : null}

              {tipo === "usuario" && (
                <>
                  <div className="form-group">
                    <label>Nome completo</label>
                    <input
                      type="text"
                      placeholder="Ex: Ana Souza"
                      value={form.nomeCompleto}
                      onChange={(event) =>
                        updateField("nomeCompleto", event.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>E-mail</label>
                    <input
                      type="email"
                      placeholder="exemplo@email.com"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Senha</label>
                    <input
                      type="password"
                      placeholder="********"
                      value={form.senha}
                      onChange={(event) => updateField("senha", event.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirmar senha</label>
                    <input
                      type="password"
                      placeholder="********"
                      value={form.confirmarSenha}
                      onChange={(event) =>
                        updateField("confirmarSenha", event.target.value)
                      }
                    />
                  </div>
                </>
              )}

              {tipo === "instituicao" && (
                <>
                  <div className="form-group">
                    <label>Razao social</label>
                    <input
                      type="text"
                      placeholder="Ex: ONG Patinhas Solidarias"
                      value={form.razaoSocial}
                      onChange={(event) =>
                        updateField("razaoSocial", event.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>CNPJ</label>
                    <input
                      type="text"
                      placeholder="00.000.000/0000-00"
                      value={form.cnpj}
                      onChange={(event) => updateField("cnpj", event.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Estado</label>
                    <input
                      type="text"
                      placeholder="Ex: MS"
                      value={form.estado}
                      onChange={(event) => updateField("estado", event.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>E-mail</label>
                    <input
                      type="email"
                      placeholder="contato@ong.org"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Senha</label>
                    <input
                      type="password"
                      placeholder="********"
                      value={form.senha}
                      onChange={(event) => updateField("senha", event.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirmar senha</label>
                    <input
                      type="password"
                      placeholder="********"
                      value={form.confirmarSenha}
                      onChange={(event) =>
                        updateField("confirmarSenha", event.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Documento de verificacao</label>
                    <input
                      type="text"
                      placeholder="Ex: estatuto-social.pdf"
                      value={form.documentoVerificacao}
                      onChange={(event) =>
                        updateField("documentoVerificacao", event.target.value)
                      }
                    />
                  </div>
                </>
              )}

              <button type="submit" className="btn btn_cadastro primary" disabled={loading}>
                {loading ? "Criando conta..." : "Criar conta"}
              </button>

              <p className="form-footer">
                Ja tem conta? <Link to="/login">Entrar</Link>
              </p>
            </form>
          </div>
        </section>
      </main>
    </>
  )
}
