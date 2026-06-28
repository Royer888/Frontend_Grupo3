import { useState } from "react";
import "./App.css";
import MainLayout from "./components/layout/MainLayout";
import Activos from "./pages/Activos";
import Dashboard from "./pages/Dashboard";
import Entidad from "./pages/Entidad";
import Login from "./pages/Login";
import ObjetoGasto from "./pages/ObjetoGasto";
import OrganismoFinanciero from "./pages/OrganismoFinanciero";
import UnidadAdministrativa from "./pages/UnidadAdministrativa";
import Usuarios from "./pages/Usuarios";

const getUsuarioGuardado = () => {
  const usuarioStorage = localStorage.getItem("usuarioLogueado");
  if (!usuarioStorage) return null;

  try {
    return JSON.parse(usuarioStorage);
  } catch {
    localStorage.removeItem("usuarioLogueado");
    return null;
  }
};

function App() {
  const [pantallaActiva, setPantallaActiva] = useState("inicio");
  const [usuarioLogueado, setUsuarioLogueado] = useState(getUsuarioGuardado);

  const renderPantalla = () => {
    switch (pantallaActiva) {
      case "unidad-administrativa":
        return <UnidadAdministrativa />;
      case "entidad":
        return <Entidad />;
      case "objeto-gasto":
        return <ObjetoGasto />;
      case "organismo-financiero":

        return <OrganismoFinanciero />;
      case "usuarios":
        return <Usuarios />;
      case "activos":
        return <Activos />;
      case "inicio":
      default:
        return <Dashboard />;
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioLogueado");
    setUsuarioLogueado(null);
    setPantallaActiva("inicio");
  };

  if (!usuarioLogueado) {
    return <Login onLogin={setUsuarioLogueado} />;
  }

  return (
    <MainLayout
      pantallaActiva={pantallaActiva}
      onNavigate={setPantallaActiva}
      onSalir={cerrarSesion}
      usuarioLogueado={usuarioLogueado}
    >
      {renderPantalla()}
    </MainLayout>
  );
}

export default App;
