import { useEffect, useState } from "react";
import {
  getEntidades,
  createEntidad,
  updateEntidad,
  deleteEntidad,
} from "../services/entidadService";
import "../styles/pages.css";

const initialForm = {
  gestion: "",
  sectorEnt: "",
  subsecEnt: "",
  areaEnt: "",
  subareaent: "",
  nivelInst: "",
  desEstruct: "",
  siglaestru: "",
  apropiable: "",
};

function Entidad() {
  const [entidades, setEntidades] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [entidadSeleccionada, setEntidadSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarEntidades = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getEntidades();
      setEntidades(response.data);
    } catch {
      setError("No se pudo cargar la lista de entidades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await cargarEntidades();
    };
    fetchData();
  }, []);

  const limpiarFormulario = () => {
    setFormData(initialForm);
    setEntidadSeleccionada(null);
    setModoEdicion(false);
  };

  const handleNuevo = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
    setError("");
    setMensaje("");
  };

  const handleSeleccionar = (entidad) => {
    setEntidadSeleccionada(entidad);
  };

  const handleEditar = () => {
    if (!entidadSeleccionada) {
      setError("Seleccione una entidad para editar.");
      return;
    }

    setFormData({
      gestion: entidadSeleccionada.gestion || "",
      sectorEnt: entidadSeleccionada.sectorEnt || "",
      subsecEnt: entidadSeleccionada.subsecEnt || "",
      areaEnt: entidadSeleccionada.areaEnt || "",
      subareaent: entidadSeleccionada.subareaent || "",
      nivelInst: entidadSeleccionada.nivelInst || "",
      desEstruct: entidadSeleccionada.desEstruct || "",
      siglaestru: entidadSeleccionada.siglaestru || "",
      apropiable: entidadSeleccionada.apropiable || "",
    });

    setModoEdicion(true);
    setMostrarFormulario(true);
    setError("");
    setMensaje("");
  };

  const handleEliminar = async () => {
    if (!entidadSeleccionada) {
      setError("Seleccione una entidad para eliminar.");
      return;
    }

    const confirmar = window.confirm(
      `¿Está seguro de eliminar la entidad ${entidadSeleccionada.siglaestru}?`
    );

    if (!confirmar) return;

    try {
      await deleteEntidad(entidadSeleccionada.siglaestru);
      setMensaje("Entidad eliminada correctamente.");
      setEntidadSeleccionada(null);
      await cargarEntidades();
    } catch {
      setError("No se pudo eliminar la entidad.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validarFormulario = () => {
    if (!formData.siglaestru.trim()) return "La sigla de estructura es obligatoria.";
    if (!formData.desEstruct.trim()) return "La descripción de estructura es obligatoria.";
    if (!formData.gestion.toString().trim()) return "La gestión es obligatoria.";
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
      siglaestru: formData.siglaestru,
      des_estruct: formData.desEstruct,
      gestion: formData.gestion ? Number(formData.gestion) : 0,
      sector_ent: formData.sectorEnt ? Number(formData.sectorEnt) : 0,
      subsec_ent: formData.subsecEnt ? Number(formData.subsecEnt) : 0,
      area_ent: formData.areaEnt ? Number(formData.areaEnt) : 0,
      subareaent: formData.subareaent ? Number(formData.subareaent) : 0,
      nivel_inst: formData.nivelInst ? Number(formData.nivelInst) : 0,
      apropiable: formData.apropiable === "SI" ? "S" : "N",
    };

    try {
      setError("");
      if (modoEdicion && entidadSeleccionada) {
        await updateEntidad(entidadSeleccionada.siglaestru, payload);
        setMensaje("Entidad actualizada correctamente.");
      } else {
        await createEntidad(payload);
        setMensaje("Entidad registrada correctamente.");
      }
      setMostrarFormulario(false);
      limpiarFormulario();
      await cargarEntidades();
    } catch {
      setError("No se pudo guardar la entidad.");
    }
  };

  return (
    <section className="page-panel">
      <h2>ADMINISTRACIÓN DE ENTIDAD</h2>

      {loading && <p>Cargando entidades...</p>}
      {error && <div className="page-error">{error}</div>}
      {mensaje && <div className="page-success">{mensaje}</div>}

      <div className="table-container">
        <table className="vsiaf-table">
          <thead>
            <tr>
              <th>SIGLA</th>
              <th>DESCRIPCIÓN</th>
              <th>GESTIÓN</th>
              <th>SECTOR</th>
              <th>SUBSECTOR</th>
              <th>ÁREA</th>
              <th>NIVEL</th>
              <th>APROPIABLE</th>
            </tr>
          </thead>
          <tbody>
            {entidades.length === 0 ? (
              <tr>
                <td colSpan="8">Sin registros</td>
              </tr>
            ) : (
              entidades.map((entidad) => (
                <tr
                  key={entidad.siglaestru}
                  className={
                    entidadSeleccionada?.siglaestru === entidad.siglaestru
                      ? "selected-row"
                      : ""
                  }
                  onClick={() => handleSeleccionar(entidad)}
                >
                  <td>{entidad.siglaestru}</td>
                  <td>{entidad.des_estruct}</td>
                  <td>{entidad.gestion}</td>
                  <td>{entidad.sector_ent}</td>
                  <td>{entidad.subsec_ent}</td>
                  <td>{entidad.area_ent}</td>
                  <td>{entidad.nivel_inst}</td>
                  <td>{entidad.apropiable}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="page-actions">
        <button type="button" onClick={handleNuevo}>Nuevo</button>
        <button type="button" onClick={handleEditar}>Editar</button>
        <button type="button" onClick={handleEliminar}>Eliminar</button>
        <button type="button" onClick={cargarEntidades}>Actualizar</button>
      </div>

      {mostrarFormulario && (
        <div className="form-panel">
          <h3>{modoEdicion ? "Editar Entidad" : "Nueva Entidad"}</h3>
          <form onSubmit={handleGuardar} className="page-form">
            <label>
              Sigla estructura
              <input
                type="text"
                name="siglaestru"
                value={formData.siglaestru}
                onChange={handleChange}
                disabled={modoEdicion}
              />
            </label>
            <label>
              Descripción estructura
              <input
                type="text"
                name="desEstruct"
                value={formData.desEstruct}
                onChange={handleChange}
              />
            </label>
            <label>
              Gestión
              <input
                type="number"
                name="gestion"
                value={formData.gestion}
                onChange={handleChange}
              />
            </label>
            <label>
              Sector Entidad
              <input
                type="text"
                name="sectorEnt"
                value={formData.sectorEnt}
                onChange={handleChange}
              />
            </label>
            <label>
              Subsector Entidad
              <input
                type="text"
                name="subsecEnt"
                value={formData.subsecEnt}
                onChange={handleChange}
              />
            </label>
            <label>
              Área Entidad
              <input
                type="text"
                name="areaEnt"
                value={formData.areaEnt}
                onChange={handleChange}
              />
            </label>
            <label>
              Subárea Entidad
              <input
                type="text"
                name="subareaent"
                value={formData.subareaent}
                onChange={handleChange}
              />
            </label>
            <label>
              Nivel Institucional
              <input
                type="text"
                name="nivelInst"
                value={formData.nivelInst}
                onChange={handleChange}
              />
            </label>
            <label>
              Apropiable
              <select
                name="apropiable"
                value={formData.apropiable}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
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

export default Entidad;