import { useState } from "react";
import "../../Styles/Cadastro.css";

export default function Cadastro() {
  const [tipo, setTipo] = useState("usuario");

  return (
    <main className="cadastro">
      <section className="cadastro-hero">
        <div className="container">
          <h1>Crie sua conta</h1>
          <p>
            Escolha o tipo de cadastro e preencha seus dados para começar.
          </p>
        </div>
      </section>

      <section className="cadastro-form-section">
        <div className="container">
          <div className="cadastro-toggle">
            <button
              className={tipo === "usuario" ? "active" : ""}
              onClick={() => setTipo("usuario")}
            >
              Sou Adotante
            </button>
            <button
              className={tipo === "instituicao" ? "active" : ""}
              onClick={() => setTipo("instituicao")}
            >
              Sou Instituição
            </button>
          </div>

          <form className="cadastro-form">
            {tipo === "usuario" && (
              <>
                <div className="form-group">
                  <label>Nome completo</label>
                  <input type="text" placeholder="Ex: Ana Souza" />
                </div>

                <div className="form-group">
                  <label>E-mail</label>
                  <input type="email" placeholder="exemplo@email.com" />
                </div>

                <div className="form-group">
                  <label>Senha</label>
                  <input type="password" placeholder="********" />
                </div>

                <div className="form-group">
                  <label>Confirmar senha</label>
                  <input type="password" placeholder="********" />
                </div>
              </>
            )}

            {tipo === "instituicao" && (
              <>
                <div className="form-group">
                  <label>Razão social</label>
                  <input type="text" placeholder="Ex: ONG Patinhas Solidárias" />
                </div>

                <div className="form-group">
                  <label>CNPJ</label>
                  <input type="text" placeholder="00.000.000/0000-00" />
                </div>

                <div className="form-group">
                  <label>Estado</label>
                  <input type="text" placeholder="Ex: MS" />
                </div>

                <div className="form-group">
                  <label>E-mail</label>
                  <input type="email" placeholder="contato@ong.org" />
                </div>

                <div className="form-group">
                  <label>Senha</label>
                  <input type="password" placeholder="********" />
                </div>

                <div className="form-group">
                  <label>Documento de verificação</label>
                  <input type="file" />
                </div>
              </>
            )}

            <button type="submit" className="btn_cadastro primary">
              Criar conta
            </button>

            <p className="form-footer">
              Já tem conta? <a href="/Login">Entrar</a>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
