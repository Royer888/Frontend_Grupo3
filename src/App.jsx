import { useState } from "react";
import "./App.css";

import Button from "./components/Common/Button";

import { UnidadAdministrativa } from "./components/UnidadAdministrativa/UnidadAdministrativa";
import { ObjetoGasto } from "./components/ObjetoGasto/ObjetoGasto";
import { Usuario } from "./components/Usuario/Usuario";


function App() {
  // Estado local: Controla si la ventanita de Unidad Administrativa está abierta
  const [mostrarUnidadAdmin, setMostrarUnidadAdmin] = useState(false);
  // NUEVO: estado para la ventana de Objeto de Gasto
  const [mostrarObjetoGasto, setMostrarObjetoGasto] = useState(false);
  const [mostrarUsuario, setMostrarUsuario] = useState(false);

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
            <div className="logo-sub">Sistema de Activos Fijos</div>
          </div>
          <div className="header-user-info">
            <span><strong>USUARIO:</strong> admin</span>
            <span><strong>BACKUPS:</strong> None</span>
          </div>
        </div>

        {/* Main */}
        <div className="main">
          <aside className="sidebar">
            <h2 className="sidebar-title">MENU PRINCIPAL</h2>

            {/* Tu módulo base */}
            <div onClick={() => setMostrarUnidadAdmin(true)}>
              <Button label="Unidad Administrativa" />
            </div>

            <Button label="Entidad" />

            {/* NUEVO: botón Objeto de Gasto ahora abre la ventana */}
            <div onClick={() => setMostrarObjetoGasto(true)}>
              <Button label="Objeto de Gasto" />
            </div>

            <Button label="Organismo Financiador" />
            <Button label="Activos Fijos" />

            {/* Botón Usuarios ahora abre la ventana */}
            <div onClick={() => setMostrarUsuario(true)}>
              <Button label="Usuarios" />
            </div>
          </aside>

          <section className="content">
            <div className="content-info">
              <span>ENTIDAD: 0</span>
              <span>UNIDAD: 0</span>
            </div>

            <div className="content-body">
              {/* Ventana: Unidad Administrativa (Tarea 9) */}
              {mostrarUnidadAdmin && (
                  <div className="modal-container">
                    <UnidadAdministrativa onClose={() => setMostrarUnidadAdmin(false)} />
                  </div>
              )}

              {/* NUEVO: Ventana de Objeto de Gasto */}
              {mostrarObjetoGasto && (
                  <div className="modal-container">
                    <ObjetoGasto onClose={() => setMostrarObjetoGasto(false)} />
                  </div>
              )}

              {/* Ventana de Usuarios */}
              {mostrarUsuario && (
                  <div className="modal-container">
                    <Usuario onClose={() => setMostrarUsuario(false)} />
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