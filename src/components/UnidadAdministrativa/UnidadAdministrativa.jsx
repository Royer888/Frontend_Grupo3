import { useState } from 'react';
import './UnidadAdministrativa.css';

const unidadesIniciales = [
    { id: 1, entidad: '10', unidad: '10', descripcion: 'ADMINISTRACION CENTRAL', ciudad: 'POTOSI' },
    { id: 2, entidad: '10', unidad: '20', descripcion: 'JEFATURA DE ESTUDIOS', ciudad: 'POTOSI' }
];

export const UnidadAdministrativa = ({ onClose }) => {
    const [unidades] = useState(unidadesIniciales);
    const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');

    const manejarSeleccionar = () => {
        if (unidades.length === 0) {
            setMensajeAlerta('No hay ninguna Unidad Administrativa, ingrese y seleccione una.');
            setMostrarAlerta(true);
        } else if (!unidadSeleccionada) {
            setMensajeAlerta('No se selecciono ninguna Unidad Administrativa.');
            setMostrarAlerta(true);
        }
    };

    const manejarEdicionOEliminacion = (tipo) => {
        if (!unidadSeleccionada) {
            setMensajeAlerta('No se selecciono ninguna Unidad Administrativa.');
            setMostrarAlerta(true);
        } else {
            if (tipo === 'editar') setMostrarFormulario(true);
            if (tipo === 'eliminar') setMostrarConfirmacion(true);
        }
    };

    const simularEliminacion = () => {
        setMostrarConfirmacion(false);
        setMensajeAlerta('No se pudo efectuar la eliminacion, intentelo mas tarde.');
        setMostrarAlerta(true);
    };

    return (
        <div className="window-frame">
            <div className="window-titlebar">
                Unidad Administrativa
            </div>

            <div className="window-body">
                <div className="section-title">
                    ADMINISTRACION UNIDAD ADMINISTRATIVA
                </div>

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
                                <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
                                <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
                                <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="button-bar">
                    <button className="btn" onClick={() => setMostrarFormulario(true)}>Nuevo</button>
                    <button className="btn" onClick={() => manejarEdicionOEliminacion('editar')}>Editar</button>
                    <button className="btn" onClick={() => manejarEdicionOEliminacion('eliminar')}>Eliminar</button>
                    <button className="btn" onClick={manejarSeleccionar}>Seleccionar</button>
                    <button className="btn" onClick={onClose}>Salir</button>
                </div>
            </div>

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
                                    <label>Descripcion:</label>
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
                                <p>Esta seguro de eliminar esta unidad administrativa?</p>
                            </div>
                            <div className="button-bar">
                                <button className="btn" onClick={simularEliminacion}>Aceptar</button>
                                <button className="btn" onClick={() => setMostrarConfirmacion(false)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
