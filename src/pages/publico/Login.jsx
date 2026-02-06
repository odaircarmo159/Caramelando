import "../../Styles/Login.css";

export default function Login() {
  return (
    <main className="login">
      <section className="login-hero">
        <div className="container">
          <h1>Entrar</h1>
          <p>Acesse sua conta para continuar.</p>
        </div>
      </section>

      <section className="login-form-section">
        <div className="container">
          <form className="login-form">
            <div className="form-group">
              <label>E-mail</label>
              <input type="email" placeholder="exemplo@email.com" />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input type="password" placeholder="********" />
            </div>

            <button type="submit" className="btn_entrar primary">
              Entrar
            </button>

            <div className="login-links">
              <a href="/cadastro">Criar conta</a>
              <a href="/recuperar-senha">Esqueci minha senha</a>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
