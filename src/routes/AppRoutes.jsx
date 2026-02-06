import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/publico/Home"
import Cadastro from "../pages/publico/Cadastro"
import Login from "../pages/publico/Login"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Cadastro" element={<Cadastro />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
