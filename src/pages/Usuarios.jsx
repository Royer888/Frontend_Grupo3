import { useEffect, useState } from "react";
import {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
} from "../services/usuarioService";
import "../styles/pages.css";

const initialForm = {
    nombre: "",
    apellido: "",
    usuario: "",
    password: "",
};

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [formData, setFormData] = useState(initialForm);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            setError("");


            const response = await getUsuarios();
            setUsuarios(response.data);
        } catch {
            setError("No se pudo cargar la lista de usuarios.");
        } finally {
            setLoading(false);
        }


    };

    useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
        cargarUsuarios();
    }, []);

    const limpiarFormulario = () => {
        setFormData(initialForm);
        setUsuarioSeleccionado(null);
        setModoEdicion(false);
    };

    const handleNuevo = () => {
        limpiarFormulario();
        setMostrarFormulario(true);
        setError("");
        setMensaje("");
    };

    const handleSeleccionar = (usuario) => {
        setUsuarioSeleccionado(usuario);
    };

    const handleEditar = () => {
        if (!usuarioSeleccionado) {
            setError("Seleccione un usuario para editar.");
            return;
        }


        setFormData({
            nombre: usuarioSeleccionado.nombre || "",
            apellido: usuarioSeleccionado.apellido || "",
            usuario: usuarioSeleccionado.usuario || "",
            password: "",
        });

        setModoEdicion(true);
        setMostrarFormulario(true);
        setError("");
        setMensaje("");


    };

    const handleEliminar = async () => {
        if (!usuarioSeleccionado) {
            setError("Seleccione un usuario para eliminar.");
            return;
        }


        const confirmar = window.confirm(
            `¿Está seguro de eliminar el usuario ${usuarioSeleccionado.usuario}?`
        );

        if (!confirmar) {
            return;
        }

        try {
            await deleteUsuario(usuarioSeleccionado.id);
            setMensaje("Usuario eliminado correctamente.");
            setUsuarioSeleccionado(null);
            await cargarUsuarios();
        } catch {
            setError("No se pudo eliminar el usuario.");
        }


    };

    const handleChange = (event) => {
        const { name, value } = event.target;


        setFormData({
            ...formData,
            [name]: value,
        });


    };

    const validarFormulario = () => {
        if (!formData.nombre.trim()) {
            return "El nombre es obligatorio.";
        }


        if (!formData.apellido.trim()) {
            return "El apellido es obligatorio.";
        }

        if (!formData.usuario.trim()) {
            return "El usuario es obligatorio.";
        }

        if (!modoEdicion && !formData.password.trim()) {
            return "La contraseña es obligatoria.";
        }

        return "";


    };

    const handleGuardar = async (event) => {
        event.preventDefault();


        const mensajeValidacion = validarFormulario();

        if (mensajeValidacion) {
            setError(mensajeValidacion);
            return;
        }

        const payload = {
            nombre: formData.nombre,
            apellido: formData.apellido,
            usuario: formData.usuario,
            password: formData.password,
        };

        try {
            setError("");

            if (modoEdicion && usuarioSeleccionado) {
                await updateUsuario(usuarioSeleccionado.id, payload);
                setMensaje("Usuario actualizado correctamente.");
            } else {
                await createUsuario(payload);
                setMensaje("Usuario registrado correctamente.");
            }

            setMostrarFormulario(false);
            limpiarFormulario();
            await cargarUsuarios();
        } catch {
            setError("No se pudo guardar el usuario.");
        }


    };

    return ( <section className="page-panel"> <h2>ADMINISTRACIÓN DE USUARIOS</h2>


            {loading && <p>Cargando usuarios...</p>}
            {error && <div className="page-error">{error}</div>}
            {mensaje && <div className="page-success">{mensaje}</div>}

            <div className="table-container">
                <table className="vsiaf-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>NOMBRE</th>
                        <th>APELLIDO</th>
                        <th>USUARIO</th>
                    </tr>
                    </thead>

                    <tbody>
                    {usuarios.length === 0 ? (
                        <tr>
                            <td colSpan="4">Sin registros</td>
                        </tr>
                    ) : (
                        usuarios.map((item) => (
                            <tr
                                key={item.id}
                                className={
                                    usuarioSeleccionado?.id === item.id ? "selected-row" : ""
                                }
                                onClick={() => handleSeleccionar(item)}
                            >
                                <td>{item.id}</td>
                                <td>{item.nombre}</td>
                                <td>{item.apellido}</td>
                                <td>{item.usuario}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <div className="page-actions">
                <button type="button" onClick={handleNuevo}>
                    Nuevo
                </button>
                <button type="button" onClick={handleEditar}>
                    Editar
                </button>
                <button type="button" className="danger-button" onClick={handleEliminar}>
                    Eliminar
                </button>
                <button type="button" onClick={cargarUsuarios}>
                    Actualizar
                </button>
            </div>

            {mostrarFormulario && (
                <div className="form-panel">
                    <h3>{modoEdicion ? "Editar Usuario" : "Nuevo Usuario"}</h3>

                    <form onSubmit={handleGuardar} className="page-form">
                        <label>
                            Nombre
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Apellido
                            <input
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Usuario
                            <input
                                type="text"
                                name="usuario"
                                value={formData.usuario}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Contraseña
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={
                                    modoEdicion
                                        ? "Ingrese nueva contraseña o mantenga la actual según backend"
                                        : "Ingrese contraseña"
                                }
                            />
                        </label>

                        <div className="form-actions">
                            <button type="submit">Guardar</button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMostrarFormulario(false);
                                    limpiarFormulario();
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>


    );
}

export default Usuarios;
