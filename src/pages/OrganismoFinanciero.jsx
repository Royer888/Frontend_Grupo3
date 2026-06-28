import { useEffect, useState } from "react";
import {
  createOrganismo,
  deleteOrganismo,
  getOrganismos,
  updateOrganismo,
} from "../services/organismoFinService";
import "../styles/pages.css";

const initialForm = {
  of: "",
  gestion: "",
  des: "",
  sigla: "",
};

function OrganismoFinanciero() {
  const [organismos, setOrganismos] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [organismoSeleccionado, setOrganismoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarOrganismos = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getOrganismos();
      setOrganismos(response.data || []);
    } catch {
      setError("No se pudo cargar la lista de organismos financieros.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cargarInicial = async () => {
      await cargarOrganismos();
    };

    cargarInicial();
  }, []);

  const limpiarFormulario = () => {
    setFormData(initialForm);
    setOrganismoSeleccionado(null);
    setModoEdicion(false);
  };

  const handleNuevo = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
    setError("");
    setMensaje("");
  };

  const handleSeleccionar = (organismo) => {
    setOrganismoSeleccionado(organismo);
  };

  const handleEditar = () => {
    if (!organismoSeleccionado) {
      setError("Seleccione un organismo financiero para editar.");
      return;
    }

    setFormData({
      of: organismoSeleccionado.of || "",
      gestion: organismoSeleccionado.gestion || "",
      des: organismoSeleccionado.des || "",
      sigla: organismoSeleccionado.sigla || "",
    });
    setModoEdicion(true);
    setMostrarFormulario(true);
    setError("");
    setMensaje("");
  };

  const handleEliminar = async () => {
    if (!organismoSeleccionado) {
      setError("Seleccione un organismo financiero para eliminar.");
      return;
    }

    const confirmar = window.confirm(
      `Esta seguro de eliminar el organismo ${organismoSeleccionado.sigla || organismoSeleccionado.of}?`
    );

    if (!confirmar) return;

    try {
      await deleteOrganismo(organismoSeleccionado.of);
      setMensaje("Organismo financiero eliminado correctamente.");
      setOrganismoSeleccionado(null);
      await cargarOrganismos();
    } catch {
      setError("No se pudo eliminar el organismo financiero.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validarFormulario = () => {
    if (!String(formData.of).trim()) return "El codigo OF es obligatorio.";
    if (!String(formData.gestion).trim()) return "La gestion es obligatoria.";
    if (!formData.des.trim()) return "La descripcion es obligatoria.";
    if (!formData.sigla.trim()) return "La sigla es obligatoria.";
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
      of: formData.of,
      gestion: formData.gestion ? Number(formData.gestion) : 0,
      des: formData.des,
      sigla: formData.sigla,
    };

    try {
      setError("");

      if (modoEdicion && organismoSeleccionado) {
        await updateOrganismo(organismoSeleccionado.of, payload);
        setMensaje("Organismo financiero actualizado correctamente.");
      } else {
        await createOrganismo(payload);
        setMensaje("Organismo financiero registrado correctamente.");
      }

      setMostrarFormulario(false);
      limpiarFormulario();
      await cargarOrganismos();
    } catch {
      setError("No se pudo guardar el organismo financiero.");
    }
  };

  return (
    <section className="page-panel">
      <h2>ORGANISMO FINANCIADOR</h2>

      {loading && <p>Cargando organismos financieros...</p>}
      {error && <div className="page-error">{error}</div>}
      {mensaje && <div className="page-success">{mensaje}</div>}

      <div className="table-container">
        <table className="vsiaf-table">
          <thead>
            <tr>
              <th>OF</th>
              <th>GESTION</th>
              <th>DESCRIPCION</th>
              <th>SIGLA</th>
            </tr>
          </thead>
          <tbody>
            {organismos.length === 0 ? (
              <tr>
                <td colSpan="4">Sin registros</td>
              </tr>
            ) : (
              organismos.map((organismo) => (
                <tr
                  key={organismo.of}
                  className={
                    organismoSeleccionado?.of === organismo.of ? "selected-row" : ""
                  }
                  onClick={() => handleSeleccionar(organismo)}
                >
                  <td>{organismo.of}</td>
                  <td>{organismo.gestion}</td>
                  <td>{organismo.des}</td>
                  <td>{organismo.sigla}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="page-actions">
        <button type="button" onClick={handleNuevo}>Nuevo</button>
        <button type="button" onClick={handleEditar}>Editar</button>
        <button type="button" className="danger-button" onClick={handleEliminar}>Eliminar</button>
        <button type="button" onClick={cargarOrganismos}>Actualizar</button>
      </div>

      {mostrarFormulario && (
        <div className="form-panel">
          <h3>{modoEdicion ? "Editar Organismo Financiero" : "Nuevo Organismo Financiero"}</h3>
          <form onSubmit={handleGuardar} className="page-form">
            <label>
              OF
              <input
                type="text"
                name="of"
                value={formData.of}
                onChange={handleChange}
                disabled={modoEdicion}
              />
            </label>
            <label>
              Gestion
              <input
                type="number"
                name="gestion"
                value={formData.gestion}
                onChange={handleChange}
              />
            </label>
            <label>
              Descripcion
              <input
                type="text"
                name="des"
                value={formData.des}
                onChange={handleChange}
              />
            </label>
            <label>
              Sigla
              <input
                type="text"
                name="sigla"
                value={formData.sigla}
                onChange={handleChange}
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

export default OrganismoFinanciero;
