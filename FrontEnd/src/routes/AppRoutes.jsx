import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/publico/Home"
import Cadastro from "../pages/publico/Cadastro"
import Login from "../pages/publico/Login"
import ListaAnimais from "../pages/publico/ListaAnimais"
import DetalhesAnimais from "../pages/publico/DetalhesAnimais"
import Dashboard from "../pages/instituicao/Dashboard"
import CadastrarAnimais from "../pages/instituicao/CadastrarAnimais"
import EditarAnimais from "../pages/instituicao/EditarAnimais"
import GerenciarAnimais from "../pages/instituicao/GerenciarAnimais"
import Perfil from "../pages/usuario/Perfil"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/animais" element={<ListaAnimais />} />
        <Route path="/animais/:id" element={<DetalhesAnimais />} />
        <Route path="/instituicao/dashboard" element={<Dashboard />} />
        <Route path="/instituicao/animais/novo" element={<CadastrarAnimais />} />
        <Route path="/instituicao/animais" element={<GerenciarAnimais />} />
        <Route path="/instituicao/animais/:id/editar" element={<EditarAnimais />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
