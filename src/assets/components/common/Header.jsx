import { Link } from "react-router-dom";
import "../../../Styles/Header.css"

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <Link to="/" className="logo">
          Caramelando
        </Link>

        <nav className="nav">
          <Link to="/animais">Animais</Link>
          <Link to="/ongs">ONGs</Link>
          <Link to="/sobre">Sobre</Link>
        </nav>

        <Link to="/login" className="btn outline header-btn">
          Entrar
        </Link>

      </div>
    </header>
  );
}

