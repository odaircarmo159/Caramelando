import { Link } from "react-router-dom"
import { useAuth } from "../../../hooks/useAuth"
import "../../../Styles/Header.css"

export default function Header() {
  const { user, loading } = useAuth()

  const profileLink =
    user?.tipo === "instituicao" ? "/instituicao/dashboard" : "/perfil"

  const profileLabel =
    user?.tipo === "instituicao" ? "Painel da ONG" : "Perfil do adotante"

  return (
    <header className="site-header">
      <div className="container header-content">
        <Link to="/" className="logo">
          Caramelando
        </Link>

        <nav className="nav">
          <Link to="/animais">Animais</Link>
          {!user ? <Link to="/cadastro">Cadastro</Link> : null}
          {user?.tipo === "instituicao" ? (
            <Link to="/instituicao/animais">Meus animais</Link>
          ) : (
            <Link to="/instituicao/dashboard">Area ONG</Link>
          )}
        </nav>

        {loading ? null : user ? (
          <Link to={profileLink} className="btn outline header-btn">
            {profileLabel}
          </Link>
        ) : (
          <Link to="/login" className="btn outline header-btn">
            Entrar
          </Link>
        )}

      </div>
    </header>
  )
}
