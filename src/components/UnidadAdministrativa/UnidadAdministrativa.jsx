import { useState, useEffect } from 'react';
import './UnidadAdministrativa.css';

// Componente principal: gestión de unidades administrativas
// eslint-disable-next-line react/prop-types
export const UnidadAdministrativa = ({ onClose }) => {
    // Estado: lista de unidades cargadas desde el "backend" (simulado)
    const [unidades, setUnidades] = useState([]);
    // Estado: unidad que el usuario ha seleccionado haciendo clic en la tabla
    const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);

    // Estados para controlar la apertura/cierre de modales
    const [mostrarFormulario, setMostrarFormulario] = useState(false);   // Modal de nuevo/edición
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false); // Modal de confirmación para eliminar
    const [mostrarAlerta, setMostrarAlerta] = useState(false);           // Modal de alerta (errores/avisos)
    const [mensajeAlerta, setMensajeAlerta] = useState('');              // Texto dinámico de la alerta

    // Efecto que se ejecuta al montar el componente: carga datos de ejemplo
    useEffect(() => {
        setUnidades([
            { id: 1, entidad: '10', unidad: '10', descripcion: 'ADMINISTRACION CENTRAL', ciudad: 'POTOSI' },
            { id: 2, entidad: '10', unidad: '20', descripcion: 'JEFATURA DE ESTUDIOS', ciudad: 'POTOSI' }
        ]);
    }, []); // El array vacío asegura que solo se ejecute una vez

    // Maneja el botón "Seleccionar": valida que haya unidades y que se haya elegido una
    const manejarSeleccionar = () => {
        if (unidades.length === 0) {
            setMensajeAlerta('No hay ninguna Unidad Administrativa, ingrese y seleccione una.');
            setMostrarAlerta(true);
        } else if (!unidadSeleccionada) {
            setMensajeAlerta('No se seleccionó ninguna Unidad Administrativa.');
            setMostrarAlerta(true);
        }
        // Si todo está bien, aquí iría la lógica de selección (ej. cerrar modal y pasar el dato)
    };

    // Función genérica para manejar edición o eliminación (según el tipo)
    const manejarEdicionOEliminacion = (tipo) => {
        if (!unidadSeleccionada) {
            setMensajeAlerta('No se seleccionó ninguna Unidad Administrativa.');
            setMostrarAlerta(true);
        } else {
            if (tipo === 'editar') setMostrarFormulario(true);
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
                                    {/* Se definen anchos fijos para mantener la estructura */}
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
                                {/* Filas vacías para dar altura visual al contenedor (efecto de "scroll") */}
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
                    <button className="btn" onClick={() => setMostrarFormulario(true)}>Nuevo</button>
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
                            <div className="panel form-cuerpo">
                                <div className="form-fila">
                                    <label>Unidad Administrativa:</label>
                                    <input type="text" className="input-corto" defaultValue={unidadSeleccionada?.unidad || ''} />
                                </div>
                                <div className="form-fila">
                                    <label>Ciudad:</label>
                                    <input type="text" className="input-largo" defaultValue={unidadSeleccionada?.ciudad || ''} />
                                </div>
                                <div className="form-fila">
                                    <label>Descripción:</label>
                                    <textarea className="input-area" defaultValue={unidadSeleccionada?.descripcion || ''}></textarea>
                                </div>
                            </div>
                            <div className="button-bar">
                                <button className="btn">Grabar</button>
                                <button className="btn" onClick={() => setMostrarFormulario(false)}>Salir</button>
                            </div>
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

            {/* Modal de alerta genérica (mensajes de error/información) */}
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