import { useState, useEffect } from 'react';
import '../UnidadAdministrativa/UnidadAdministrativa.css';

// Componente principal: CRUD de usuarios
// eslint-disable-next-line react/prop-types
export const Usuario = ({ onClose }) => {
  // Estado: lista de usuarios
  const [usuarios, setUsuarios] = useState([]);
  // Estado: usuario seleccionado en la tabla
  const [seleccionado, setSeleccionado] = useState(null);

  // Control de modales
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState('');

  // Campos del formulario
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    password: ''
  });

  // Cargar todos los usuarios desde la API
  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/usuarios');
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setMensajeAlerta("No se pudo conectar con el servidor backend.");
      setMostrarAlerta(true);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Guardar o actualizar (POST o PUT)
  const grabarUsuario = async (payload) => {
    try {
      const esEdicion = payload.id != null;
      const url = esEdicion
          ? `http://localhost:8080/api/usuarios/${payload.id}`
          : 'http://localhost:8080/api/usuarios';
      const metodoHTTP = esEdicion ? 'PUT' : 'POST';

      const datosAEnviar = {
        nombre: payload.nombre,
        apellido: payload.apellido,
        usuario: payload.usuario,
        password: payload.password
      };

      const response = await fetch(url, {
        method: metodoHTTP,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAEnviar)
      });

      if (!response.ok) throw new Error("Error al guardar en el servidor");

      await cargarUsuarios();
      setMostrarFormulario(false);
      setSeleccionado(null);
      setMensajeAlerta(esEdicion ? 'Usuario actualizado correctamente.' : 'Usuario registrado correctamente.');
      setMostrarAlerta(true);
    } catch (error) {
      console.error("Error al grabar usuario:", error);
      setMensajeAlerta("No se pudo guardar el usuario.");
      setMostrarAlerta(true);
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${seleccionado.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error("Error al eliminar");
      setMostrarConfirmacion(false);
      await cargarUsuarios();
      setSeleccionado(null);
      setMensajeAlerta('Usuario eliminado exitosamente.');
      setMostrarAlerta(true);
    } catch (error) {
      console.error("Error al eliminar:", error);
      setMostrarConfirmacion(false);
      setMensajeAlerta("No se pudo eliminar el usuario.");
      setMostrarAlerta(true);
    }
  };

  // Manejadores de botones
  const manejarNuevo = () => {
    setSeleccionado(null);
    setDatosFormulario({ nombre: '', apellido: '', usuario: '', password: '' });
    setMostrarFormulario(true);
  };

  const manejarEditar = () => {
    if (!seleccionado) {
      setMensajeAlerta('No se seleccionó ningún usuario.');
      setMostrarAlerta(true);
    } else {
      setDatosFormulario({
        nombre: seleccionado.nombre || '',
        apellido: seleccionado.apellido || '',
        usuario: seleccionado.usuario || '',
        password: ''
      });
      setMostrarFormulario(true);
    }
  };

  const manejarEliminar = () => {
    if (!seleccionado) {
      setMensajeAlerta('No se seleccionó ningún usuario.');
      setMostrarAlerta(true);
    } else {
      setMostrarConfirmacion(true);
    }
  };

  const manejarSeleccionar = () => {
    if (usuarios.length === 0) {
      setMensajeAlerta('No hay usuarios registrados.');
    } else if (!seleccionado) {
      setMensajeAlerta('No se seleccionó ningún usuario.');
    } else {
      setMensajeAlerta(`Seleccionado: ${seleccionado.usuario} - ${seleccionado.nombre} ${seleccionado.apellido}`);
    }
    setMostrarAlerta(true);
  };

  // Envío del formulario
  const alEnviarFormulario = (e) => {
    e.preventDefault();
    if (!datosFormulario.nombre.trim() || !datosFormulario.apellido.trim() || !datosFormulario.usuario.trim() || !datosFormulario.password.trim()) {
      setMensajeAlerta('Complete todos los campos (Nombre, Apellido, Usuario, Contraseña).');
      setMostrarAlerta(true);
      return;
    }
    const payload = {
      ...datosFormulario,
      id: seleccionado ? seleccionado.id : null
    };
    grabarUsuario(payload);
  };

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({ ...prev, [name]: value }));
  };

  // Renderizado principal
  return (
      <div className="window-frame">
        <div className="window-titlebar">
          Usuarios
        </div>

        <div className="window-body">
          <div className="section-title">
            ADMINISTRACIÓN DE USUARIOS
          </div>

          {/* Tabla de usuarios */}
          <div className="panel">
            <div className="table-wrapper">
              <div className="table-scroll-area">
                <table className="data-table">
                  <thead>
                  <tr>
                    <th style={{ width: '10%' }}>ID</th>
                    <th style={{ width: '25%' }}>NOMBRE</th>
                    <th style={{ width: '25%' }}>APELLIDO</th>
                    <th style={{ width: '40%' }}>USUARIO</th>
                  </tr>
                  </thead>
                  <tbody id="tableBody">
                  {usuarios.map((item) => (
                      <tr
                          key={item.id}
                          onClick={() => setSeleccionado(item)}
                          className={seleccionado?.id === item.id ? 'fila-seleccionada' : ''}
                      >
                        <td>{item.id}</td>
                        <td>{item.nombre}</td>
                        <td>{item.apellido}</td>
                        <td>{item.usuario}</td>
                      </tr>
                  ))}
                  <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
                  <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
                  <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Barra de botones */}
          <div className="button-bar">
            <button className="btn" onClick={manejarNuevo}>Nuevo</button>
            <button className="btn" onClick={manejarEditar}>Editar</button>
            <button className="btn" onClick={manejarEliminar}>Eliminar</button>
            <button className="btn" onClick={manejarSeleccionar}>Seleccionar</button>
            <button className="btn" onClick={onClose}>Salir</button>
          </div>
        </div>

        {/* Modal de formulario (Nuevo / Editar) */}
        {mostrarFormulario && (
            <div className="modal-overlay">
              <div className="window-frame form-modal">
                <div className="window-titlebar">USUARIO</div>
                <div className="window-body">
                  <form onSubmit={alEnviarFormulario}>
                    <div className="panel form-cuerpo">
                      <div className="form-fila">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            className="input-largo"
                            value={datosFormulario.nombre}
                            onChange={manejarCambioInput}
                        />
                      </div>
                      <div className="form-fila">
                        <label>Apellido:</label>
                        <input
                            type="text"
                            name="apellido"
                            className="input-largo"
                            value={datosFormulario.apellido}
                            onChange={manejarCambioInput}
                        />
                      </div>
                      <div className="form-fila">
                        <label>Usuario:</label>
                        <input
                            type="text"
                            name="usuario"
                            className="input-largo"
                            value={datosFormulario.usuario}
                            onChange={manejarCambioInput}
                        />
                      </div>
                      <div className="form-fila">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            name="password"
                            className="input-largo"
                            value={datosFormulario.password}
                            onChange={manejarCambioInput}
                            placeholder={seleccionado ? 'Dejar vacío para no cambiar' : ''}
                        />
                      </div>
                    </div>
                    <div className="button-bar">
                      <button type="submit" className="btn">Grabar</button>
                      <button type="button" className="btn" onClick={() => setMostrarFormulario(false)}>Salir</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
        )}

        {/* Modal de confirmación para eliminar */}
        {mostrarConfirmacion && (
            <div className="modal-overlay">
              <div className="window-frame dialogo-modal">
                <div className="window-titlebar">
                  <span>VSIAF</span>
                  <button className="btn-cerrar" onClick={() => setMostrarConfirmacion(false)}>X</button>
                </div>
                <div className="window-body">
                  <div className="dialogo-cuerpo">
                    <div className="icono-pregunta">?</div>
                    <p>¿Está seguro de eliminar este usuario?</p>
                  </div>
                  <div className="button-bar">
                    <button className="btn" onClick={eliminarUsuario}>Aceptar</button>
                    <button className="btn" onClick={() => setMostrarConfirmacion(false)}>Cancelar</button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Modal de alerta genérica */}
        {mostrarAlerta && (
            <div className="modal-overlay">
              <div className="window-frame dialogo-modal">
                <div className="window-titlebar">
                  <span>VSIAF</span>
                  <button className="btn-cerrar" onClick={() => setMostrarAlerta(false)}>X</button>
                </div>
                <div className="window-body">
                  <div className="dialogo-cuerpo">
                    <div className="icono-alerta-rojo">X</div>
                    <p>{mensajeAlerta}</p>
                  </div>
                  <div className="button-bar">
                    <button className="btn" onClick={() => setMostrarAlerta(false)}>Aceptar</button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};
