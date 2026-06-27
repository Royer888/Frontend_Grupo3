import { useState } from "react"; // 1. Importamos useState
import "./App.css";
import Button from "./components/Common/Button";
// 2. Importamos tu nuevo componente (verifica que la ruta sea correcta)
import { UnidadAdministrativa } from "./components/UnidadAdministrativa/UnidadAdministrativa";
function App() {
  // 3. Creamos el interruptor: por defecto está en "false" (apagado)
  const [mostrarUnidadAdmin, setMostrarUnidadAdmin] = useState(false);

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

            {/* 4. Le conectamos el evento onClick al botón para encender el interruptor */}
            <div onClick={() => setMostrarUnidadAdmin(true)}>
              <Button label="Unidad Administrativa" />
            </div>

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

              {/* 5. La magia: Si el estado es "true", dibujamos tu componente */}
              {mostrarUnidadAdmin && (
                  <div className="modal-container">
                    <UnidadAdministrativa />
                  </div>
              )}

              <div className="content-footer">
                <Button label="Acerca de..." />
                <Button label="Salir" />
              </div>

            </div>

          </section>

        </div>

      </div>
  );
}

export default App;