import { useState, useEffect } from 'react';
import './UnidadAdministrativa.css';

// Componente principal: gestión de unidades administrativas
// eslint-disable-next-line react/prop-types
export const UnidadAdministrativa = ({ onClose }) => {
    // Estado: lista de unidades cargadas desde el backend de Spring Boot
    const [unidades, setUnidades] = useState([]);
    // Estado: unidad que el usuario ha seleccionado haciendo clic en la tabla
    const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);

    // Estados para controlar la apertura/cierre de modales
    const [mostrarFormulario, setMostrarFormulario] = useState(false);   // Modal de nuevo/edición
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false); // Modal de confirmación para eliminar
    const [mostrarAlerta, setMostrarAlerta] = useState(false);             // Modal de alerta (errores/avisos)
    const [mensajeAlerta, setMensajeAlerta] = useState('');                // Texto dinámico de la alerta

    // Estado para los campos del formulario dentro del modal
    const [datosFormulario, setDatosFormulario] = useState({
        unidad: '',
        ciudad: '',
        descripcion: '',
        entidad: 'ENTIDAD-1' // Valor por defecto en caso de requerirse para el POST
    });

    // Función para cargar datos REALES desde la base de datos
    const cargarUnidades = async () => {
        try {
            // Hacemos la petición GET a tu servidor local de Spring Boot
            const response = await fetch('http://localhost:8080/api/unidades-administrativas');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUnidades(data); // Guardamos los datos reales en la tabla

        } catch (error) {
            console.error("Error al cargar las unidades de la base de datos:", error);
            setMensajeAlerta("No se pudo conectar con el servidor backend.");
            setMostrarAlerta(true);
        }
    };

    // Efecto que se ejecuta al montar el componente
    useEffect(() => {
        cargarUnidades();
    }, []); // El array vacío asegura que solo se ejecute una vez al abrir la ventana

    // Función para grabar o actualizar la unidad (POST o PUT inteligente)
    const grabarUnidad = async (payload) => {
        try {
            // Si el payload tiene ID, es una edición (PUT). Si no, es uno nuevo (POST).
            const esEdicion = payload.id !== null;
            const url = esEdicion
                ? `http://localhost:8080/api/unidades-administrativas/${payload.id}`
                : 'http://localhost:8080/api/unidades-administrativas';
            const metodoHTTP = esEdicion ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: metodoHTTP,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Error al guardar el registro en el servidor.");
            }

            // Recargamos la lista y cerramos modales
            await cargarUnidades();
            setMostrarFormulario(false);
            setUnidadSeleccionada(null); // Limpiar selección

            // Mostrar mensaje de éxito
            setMensajeAlerta(esEdicion ? 'Unidad actualizada correctamente.' : 'Unidad registrada correctamente.');
            setMostrarAlerta(true);

        } catch (error) {
            console.error("Error al grabar unidad:", error);
            setMensajeAlerta("No se pudo guardar la unidad administrativa.");
            setMostrarAlerta(true);
        }
    };

    // Maneja los cambios de texto dentro del formulario modal
    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setDatosFormulario(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Al hacer clic en Grabar en el modal
    const alEnviarFormulario = (e) => {
        e.preventDefault();
        // Validar campos mínimos obligatorios
        if (!datosFormulario.unidad.trim() || !datosFormulario.ciudad.trim()) {
            setMensajeAlerta('Por favor, complete los campos obligatorios (Unidad y Ciudad).');
            setMostrarAlerta(true);
            return;
        }

        // Estructura del objeto a enviar
        const payload = {
            ...datosFormulario,
            // Si estás editando, conservamos el ID original
            id: unidadSeleccionada ? unidadSeleccionada.id : null
        };

        grabarUnidad(payload);
    };

    // Configura el formulario para un Nuevo registro
    const manejarNuevo = () => {
        setUnidadSeleccionada(null);
        setDatosFormulario({
            unidad: '',
            ciudad: '',
            descripcion: '',
            entidad: 'ENTIDAD-1' // Ajustar según las necesidades de tu sistema
        });
        setMostrarFormulario(true);
    };

    // Maneja el botón "Seleccionar": valida que haya unidades y que se haya elegido una
    const manejarSeleccionar = () => {
        if (unidades.length === 0) {
            setMensajeAlerta('No hay ninguna Unidad Administrativa, ingrese y seleccione una.');
            setMostrarAlerta(true);
        } else if (!unidadSeleccionada) {
            setMensajeAlerta('No se seleccionó ninguna Unidad Administrativa.');
            setMostrarAlerta(true);
        }
    };

    // Función genérica para manejar edición o eliminación (según el tipo)
    const manejarEdicionOEliminacion = (tipo) => {
        if (!unidadSeleccionada) {
            setMensajeAlerta('No se seleccionó ninguna Unidad Administrativa.');
            setMostrarAlerta(true);
        } else {
            if (tipo === 'editar') {
                setDatosFormulario({
                    unidad: unidadSeleccionada.unidad || '',
                    ciudad: unidadSeleccionada.ciudad || '',
                    descripcion: unidadSeleccionada.descripcion || '',
                    entidad: unidadSeleccionada.entidad || ''
                });
                setMostrarFormulario(true);
            }
            if (tipo === 'eliminar') setMostrarConfirmacion(true);
        }
    };

    // Simula la eliminación (en lugar de hacer una llamada real a una API)
    const simularEliminacion = () => {
        setMostrarConfirmacion(false);
        setMensajeAlerta('No se pudo efectuar la eliminación, inténtelo más tarde.');
        setMostrarAlerta(true);
    };

    // Renderizado del componente
    return (
        <div className="window-frame">
            {/* Barra de título de la ventana principal */}
            <div className="window-titlebar">
                Unidad Administrativa
            </div>

            <div className="window-body">
                {/* Título de la sección */}
                <div className="section-title">
                    ADMINISTRACION UNIDAD ADMINISTRATIVA
                </div>

                {/* Panel hundido que contiene la tabla */}
                <div className="panel">
                    <div className="table-wrapper">
                        <div className="table-scroll-area">
                            <table className="data-table">
                                <thead>
                                <tr>
                                    <th style={{ width: '12%' }}>ENTIDAD</th>
                                    <th style={{ width: '15%' }}>UNIDAD</th>
                                    <th style={{ width: '43%' }}>DESCRIPCION</th>
                                    <th style={{ width: '22%' }}>CIUDAD</th>
                                </tr>
                                </thead>
                                <tbody id="tableBody">
                                {/* Mapeo de las unidades para pintar cada fila */}
                                {unidades.map((item) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => setUnidadSeleccionada(item)}
                                        className={unidadSeleccionada?.id === item.id ? 'fila-seleccionada' : ''}
                                    >
                                        <td>{item.entidad}</td>
                                        <td>{item.unidad}</td>
                                        <td>{item.descripcion}</td>
                                        <td>{item.ciudad}</td>
                                    </tr>
                                ))}
                                {/* Filas vacías para dar altura visual al contenedor */}
                                <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
                                <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
                                <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Barra de botones de acción principal */}
                <div className="button-bar">
                    <button className="btn" onClick={manejarNuevo}>Nuevo</button>
                    <button className="btn" onClick={() => manejarEdicionOEliminacion('editar')}>Editar</button>
                    <button className="btn" onClick={() => manejarEdicionOEliminacion('eliminar')}>Eliminar</button>
                    <button className="btn" onClick={manejarSeleccionar}>Seleccionar</button>
                    <button className="btn" onClick={onClose}>Salir</button>
                </div>
            </div>

            {/* -------------------- MODALES -------------------- */}

            {/* Modal de formulario (Nuevo / Editar) */}
            {mostrarFormulario && (
                <div className="modal-overlay">
                    <div className="window-frame form-modal">
                        <div className="window-titlebar">UNIDAD ADMINISTRATIVA</div>
                        <div className="window-body">
                            <form onSubmit={alEnviarFormulario}>
                                <div className="panel form-cuerpo">
                                    <div className="form-fila">
                                        <label>Unidad Administrativa:</label>
                                        <input
                                            type="text"
                                            name="unidad"
                                            className="input-corto"
                                            value={datosFormulario.unidad}
                                            onChange={manejarCambioInput}
                                        />
                                    </div>
                                    <div className="form-fila">
                                        <label>Ciudad:</label>
                                        <input
                                            type="text"
                                            name="ciudad"
                                            className="input-largo"
                                            value={datosFormulario.ciudad}
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
                                <p>¿Está seguro de eliminar esta unidad administrativa?</p>
                            </div>
                            <div className="button-bar">
                                <button className="btn" onClick={simularEliminacion}>Aceptar</button>
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