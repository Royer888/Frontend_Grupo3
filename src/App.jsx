import { useState } from "react";
import "./App.css";
import MainLayout from "./components/layout/MainLayout";
import Activos from "./pages/Activos";
import Dashboard from "./pages/Dashboard";
import Entidad from "./pages/Entidad";
import ObjetoGasto from "./pages/ObjetoGasto";
import OrganismoFinanciero from "./pages/OrganismoFinanciero";
import UnidadAdministrativa from "./pages/UnidadAdministrativa";

function App() {
  const [pantallaActiva, setPantallaActiva] = useState("inicio");

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
      case "activos":
        return <Activos />;
      case "inicio":
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout
      pantallaActiva={pantallaActiva}
      onNavigate={setPantallaActiva}
      onSalir={() => setPantallaActiva("inicio")}
    >
      {renderPantalla()}
    </MainLayout>
  );
}

export default App;
