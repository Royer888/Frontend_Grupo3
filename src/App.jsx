import { useCallback, useEffect, useRef, useState } from "react";
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

const TIEMPO_INACTIVIDAD = 10 * 60 * 1000;
const EVENTOS_ACTIVIDAD = ["mousemove", "keydown", "click", "scroll"];

function App() {
  const [pantallaActiva, setPantallaActiva] = useState("inicio");
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const timeoutInactividadRef = useRef(null);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem("usuarioLogueado");
    setUsuarioLogueado(null);
    setPantallaActiva("inicio");
  }, []);

  const handleLogin = (usuario) => {
    localStorage.removeItem("usuarioLogueado");
    setUsuarioLogueado(usuario);
    setPantallaActiva("inicio");
  };

  useEffect(() => {
    if (!usuarioLogueado) {
      return undefined;
    }

    const reiniciarTemporizador = () => {
      if (timeoutInactividadRef.current) {
        clearTimeout(timeoutInactividadRef.current);
      }

      timeoutInactividadRef.current = setTimeout(() => {
        cerrarSesion();
      }, TIEMPO_INACTIVIDAD);
    };

    EVENTOS_ACTIVIDAD.forEach((evento) => {
      window.addEventListener(evento, reiniciarTemporizador);
    });

    reiniciarTemporizador();

    return () => {
      if (timeoutInactividadRef.current) {
        clearTimeout(timeoutInactividadRef.current);
      }

      EVENTOS_ACTIVIDAD.forEach((evento) => {
        window.removeEventListener(evento, reiniciarTemporizador);
      });
    };
  }, [cerrarSesion, usuarioLogueado]);

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

  if (!usuarioLogueado) {
    return <Login onLogin={handleLogin} />;
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
