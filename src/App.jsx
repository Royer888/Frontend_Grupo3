import { useState } from "react";
import "./App.css";
import Button from "./components/Common/Button";
import UnidadAdministrativa from "./Pages/UnidadAdministrativa";

function App() {
  const [pantallaActiva, setPantallaActiva] = useState(null);

  const renderPantalla = () => {
    switch (pantallaActiva) {
      case "unidad-administrativa":
        return <UnidadAdministrativa />;
      default:
        return null;
    }
  };

  return (
    <div className="app">

      {/* Barra superior */}
      <div className="top-bar">
        <span>SISTEMA DE ACTIVOS FIJOS</span>
      </div>

      {/* Header */}
      <div className="header">

        <div className="flag-placeholder">
          BANDERA
        </div>

        <div className="header-logo">
          <div className="logo-text">V.S.I.A.F</div>
          <div className="logo-sub">
            Sistema de Activos Fijos
          </div>
        </div>

        <div className="header-user-info">
          <span>
            <strong>USUARIO:</strong> admin
          </span>

          <span>
            <strong>BACKUPS:</strong> None
          </span>
        </div>

      </div>

      {/* Main */}
      <div className="main">

        <aside className="sidebar">

          <h2 className="sidebar-title">
            MENU PRINCIPAL
          </h2>

          <Button
            label="Unidad Administrativa"
            onClick={() => setPantallaActiva("unidad-administrativa")}
          />
          <Button label="Entidad" />
          <Button label="Objeto de Gasto" />
          <Button label="Organismo Financiador" />
          <Button label="Activos Fijos" />

        </aside>

        <section className="content">

          <div className="content-info">
            <span>ENTIDAD: 0</span>
            <span>UNIDAD: 0</span>
          </div>

          <div className="content-body">
            {renderPantalla()}

            <div className="content-footer">
              <Button label="Acerca de..." />
              <Button label="Salir" onClick={() => setPantallaActiva(null)} />
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default App;