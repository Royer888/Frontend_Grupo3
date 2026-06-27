import { useState, useEffect } from 'react';
import '../UnidadAdministrativa/UnidadAdministrativa.css';

// Componente principal: gestión de objetos de gasto
// eslint-disable-next-line react/prop-types
export const ObjetoGasto = ({ onClose }) => {
  // Estado: lista de objetos de gasto cargados desde el backend
  const [objetos, setObjetos] = useState([]);
  // Estado: objeto seleccionado al hacer clic en la tabla
  const [seleccionado, setSeleccionado] = useState(null);

  // Control de modales
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState('');

  // Campos del formulario
  const [datosFormulario, setDatosFormulario] = useState({
    codigo: '',
    descripcion: ''
  });

  // Cargar todos los objetos de gasto desde la API
  const cargarObjetos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/objgasto');
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setObjetos(data);
    } catch (error) {
      console.error("Error al cargar objetos de gasto:", error);
      setMensajeAlerta("No se pudo conectar con el servidor backend.");
      setMostrarAlerta(true);
    }
  };

  useEffect(() => {
    cargarObjetos();
  }, []);

  // Guardar o actualizar (POST o PUT)
  const grabarObjeto = async (payload) => {
    try {
      const esEdicion = payload.id != null;
      const url = esEdicion
          ? `http://localhost:8080/api/objgasto/${payload.id}`
          : 'http://localhost:8080/api/objgasto';
      const metodoHTTP = esEdicion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: metodoHTTP,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: payload.codigo, descripcion: payload.descripcion })
      });

      if (!response.ok) throw new Error("Error al guardar en el servidor");

      await cargarObjetos();
      setMostrarFormulario(false);
      setSeleccionado(null);
      setMensajeAlerta(esEdicion ? 'Objeto de gasto actualizado correctamente.' : 'Objeto de gasto registrado correctamente.');
      setMostrarAlerta(true);
    } catch (error) {
      console.error("Error al grabar objeto:", error);
      setMensajeAlerta("No se pudo guardar el objeto de gasto.");
      setMostrarAlerta(true);
    }
  };

  // Eliminar objeto
  const eliminarObjeto = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/objgasto/${seleccionado.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error("Error al eliminar");
      setMostrarConfirmacion(false);
      await cargarObjetos();
      setSeleccionado(null);
      setMensajeAlerta('Objeto de gasto eliminado exitosamente.');
      setMostrarAlerta(true);
    } catch (error) {
      console.error("Error al eliminar:", error);
      setMostrarConfirmacion(false);
      setMensajeAlerta("No se pudo eliminar el objeto de gasto.");
      setMostrarAlerta(true);
    }
  };

  // Manejadores de botones principales
  const manejarNuevo = () => {
    setSeleccionado(null);
    setDatosFormulario({ codigo: '', descripcion: '' });
    setMostrarFormulario(true);
  };

  const manejarEditar = () => {
    if (!seleccionado) {
      setMensajeAlerta('No se seleccionó ningún objeto de gasto.');
      setMostrarAlerta(true);
    } else {
      setDatosFormulario({
        codigo: seleccionado.codigo || '',
        descripcion: seleccionado.descripcion || ''
      });
      setMostrarFormulario(true);
    }
  };

  const manejarEliminar = () => {
    if (!seleccionado) {
      setMensajeAlerta('No se seleccionó ningún objeto de gasto.');
      setMostrarAlerta(true);
    } else {
      setMostrarConfirmacion(true);
    }
  };

  const manejarSeleccionar = () => {
    if (objetos.length === 0) {
      setMensajeAlerta('No hay objetos de gasto registrados.');
    } else if (!seleccionado) {
      setMensajeAlerta('No se seleccionó ningún objeto de gasto.');
    } else {
      setMensajeAlerta(`Seleccionado: ${seleccionado.codigo} - ${seleccionado.descripcion}`);
    }
    setMostrarAlerta(true);
  };

  // Envío del formulario
  const alEnviarFormulario = (e) => {
    e.preventDefault();
    if (!datosFormulario.codigo.trim() || !datosFormulario.descripcion.trim()) {
      setMensajeAlerta('Complete los campos obligatorios (Código y Descripción).');
      setMostrarAlerta(true);
      return;
    }
    const payload = {
      ...datosFormulario,
      id: seleccionado ? seleccionado.id : null
    };
    grabarObjeto(payload);
  };

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({ ...prev, [name]: value }));
  };

  // Renderizado principal
  return (
      <div className="window-frame">
        {/* Barra de título */}
        <div className="window-titlebar">
          Objeto de Gasto
        </div>

        <div className="window-body">
          <div className="section-title">
            ADMINISTRACION OBJETO DE GASTO
          </div>

          {/* Tabla */}
          <div className="panel">
            <div className="table-wrapper">
              <div className="table-scroll-area">
                <table className="data-table">
                  <thead>
                  <tr>
                    <th style={{ width: '10%' }}>ID</th>
                    <th style={{ width: '25%' }}>CÓDIGO</th>
                    <th style={{ width: '65%' }}>DESCRIPCIÓN</th>
                  </tr>
                  </thead>
                  <tbody id="tableBody">
                  {objetos.map((item) => (
                      <tr
                          key={item.id}
                          onClick={() => setSeleccionado(item)}
                          className={seleccionado?.id === item.id ? 'fila-seleccionada' : ''}
                      >
                        <td>{item.id}</td>
                        <td>{item.codigo}</td>
                        <td>{item.descripcion}</td>
                      </tr>
                  ))}
                  {/* Filas vacías para altura visual */}
                  <tr><td>&nbsp;</td><td></td><td></td></tr>
                  <tr><td>&nbsp;</td><td></td><td></td></tr>
                  <tr><td>&nbsp;</td><td></td><td></td></tr>
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
                <div className="window-titlebar">OBJETO DE GASTO</div>
                <div className="window-body">
                  <form onSubmit={alEnviarFormulario}>
                    <div className="panel form-cuerpo">
                      <div className="form-fila">
                        <label>Código:</label>
                        <input
                            type="text"
                            name="codigo"
                            className="input-corto"
                            value={datosFormulario.codigo}
                            onChange={manejarCambioInput}
                        />
                      </div>
                      <div className="form-fila">
                        <label>Descripción:</label>
                        <textarea
                            name="descripcion"
                            className="input-area"
                            value={datosFormulario.descripcion}
                            onChange={manejarCambioInput}
                        ></textarea>
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
                    <p>¿Está seguro de eliminar este objeto de gasto?</p>
                  </div>
                  <div className="button-bar">
                    <button className="btn" onClick={eliminarObjeto}>Aceptar</button>
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