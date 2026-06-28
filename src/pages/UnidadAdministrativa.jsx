import { useEffect, useState } from "react";
import {
  getUnidades,
  createUnidad,
  updateUnidad,
  deleteUnidad,
} from "../services/unidadAdministrativaService";
import "../styles/pages.css";

const initialForm = {
  entidad: "",
  unidad: "",
  descripcion: "",
  ciudad: "",
  estadoUni: "",
};

function UnidadAdministrativa() {
  const [unidades, setUnidades] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarUnidades = async () => {
    try {
      setLoading(true);
      setError("");

      // CORRECCIÓN 1: Recibimos la data directa y le ponemos un seguro || []
      const response = await getUnidades();
      setUnidades(response.data || []);
    } catch {
      setError("No se pudo cargar la lista de unidades administrativas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarUnidades();
  }, []);

  const limpiarFormulario = () => {
    setFormData(initialForm);
    setUnidadSeleccionada(null);
    setModoEdicion(false);
  };

  const handleNuevo = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
    setError("");
    setMensaje("");
  };

  const handleSeleccionar = (unidad) => {
    setUnidadSeleccionada(unidad);
  };

  const handleEditar = () => {
    if (!unidadSeleccionada) {
      setError("Seleccione una unidad administrativa para editar.");
      return;
    }

    setFormData({
      entidad: unidadSeleccionada.entidad || "",
      unidad: unidadSeleccionada.unidad || "",
      descripcion: unidadSeleccionada.descripcion || "",
      ciudad: unidadSeleccionada.ciudad || "",
      estadoUni: unidadSeleccionada.estadoUni || "",
    });

    setModoEdicion(true);
    setMostrarFormulario(true);
    setError("");
    setMensaje("");
  };

  const handleEliminar = async () => {
    if (!unidadSeleccionada) {
      setError("Seleccione una unidad administrativa para eliminar.");
      return;
    }

    const confirmar = window.confirm(
        `¿Está seguro de eliminar la unidad ${unidadSeleccionada.unidad}?`
    );

    if (!confirmar) {
      return;
    }

    try {
      await deleteUnidad(unidadSeleccionada.id);
      setMensaje("Unidad administrativa eliminada correctamente.");
      setUnidadSeleccionada(null);
      await cargarUnidades();
    } catch  {
      setError("No se pudo eliminar la unidad administrativa.");
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
    if (!formData.entidad.trim()) {
      return "La entidad es obligatoria.";
    }

    if (!formData.unidad.trim()) {
      return "La unidad es obligatoria.";
    }

    if (!formData.descripcion.trim()) {
      return "La descripción es obligatoria.";
    }

    if (!formData.ciudad.trim()) {
      return "La ciudad es obligatoria.";
    }

    if (!formData.estadoUni.trim()) {
      return "El estado es obligatorio.";
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

    try {
      setError("");

      if (modoEdicion && unidadSeleccionada) {
        await updateUnidad(unidadSeleccionada.id, formData);
        setMensaje("Unidad administrativa actualizada correctamente.");
      } else {
        await createUnidad(formData);
        setMensaje("Unidad administrativa registrada correctamente.");
      }

      setMostrarFormulario(false);
      limpiarFormulario();
      await cargarUnidades();
    } catch  {
      setError("No se pudo guardar la unidad administrativa.");
    }
  };

  return (
      <section className="page-panel">
        <h2>ADMINISTRACIÓN DE UNIDAD ADMINISTRATIVA</h2>

        {loading && <p>Cargando unidades administrativas...</p>}
        {error && <div className="page-error">{error}</div>}
        {mensaje && <div className="page-success">{mensaje}</div>}

        <div className="table-container">
          <table className="vsiaf-table">
            <thead>
            <tr>
              <th>ID</th>
              <th>ENTIDAD</th>
              <th>UNIDAD</th>
              <th>DESCRIPCIÓN</th>
              <th>CIUDAD</th>
              <th>ESTADO</th>
            </tr>
            </thead>

            <tbody>
            {/* CORRECCIÓN 2: Escudo protector en caso de que unidades sea null o undefined */}
            {!unidades || unidades.length === 0 ? (
                <tr>
                  <td colSpan="6">Sin registros</td>
                </tr>
            ) : (
                unidades?.map((item) => (
                    <tr
                        key={item.id}
                        className={
                          unidadSeleccionada?.id === item.id ? "selected-row" : ""
                        }
                        onClick={() => handleSeleccionar(item)}
                    >
                      <td>{item.id}</td>
                      <td>{item.entidad}</td>
                      <td>{item.unidad}</td>
                      <td>{item.descripcion}</td>
                      <td>{item.ciudad}</td>
                      <td>{item.estadoUni}</td>
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
          <button type="button" onClick={cargarUnidades}>
            Actualizar
          </button>
        </div>

        {mostrarFormulario && (
            <div className="form-panel">
              <h3>
                {modoEdicion
                    ? "Editar Unidad Administrativa"
                    : "Nueva Unidad Administrativa"}
              </h3>

              <form onSubmit={handleGuardar} className="page-form">
                <label>
                  Entidad
                  <input
                      type="text"
                      name="entidad"
                      value={formData.entidad}
                      onChange={handleChange}
                  />
                </label>

                <label>
                  Unidad
                  <input
                      type="text"
                      name="unidad"
                      value={formData.unidad}
                      onChange={handleChange}
                  />
                </label>

                <label>
                  Descripción
                  <input
                      type="text"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                  />
                </label>

                <label>
                  Ciudad
                  <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                  />
                </label>

                <label>
                  Estado
                  <select
                      name="estadoUni"
                      value={formData.estadoUni}
                      onChange={handleChange}
                  >
                    <option value="">Seleccione...</option>
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                  </select>
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

export default UnidadAdministrativa;
