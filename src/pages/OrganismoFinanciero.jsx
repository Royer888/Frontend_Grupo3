import { useEffect, useState } from "react";
import {
  getOrganismos,
  createOrganismo,
  updateOrganismo,
  deleteOrganismo,
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
      const data = await getOrganismos();  // ← Cambio principal: response → data
      console.log("Datos recibidos:", data);

      if (Array.isArray(data)) {
        setOrganismos(data);
        setError(""); // Limpiar error si hay datos
      } else {
        setOrganismos([]);
        setError("No se pudieron cargar los organismos financieros.");
      }
    } catch {
      setError("No se pudo cargar la lista de organismos financieros.");
      setOrganismos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await cargarOrganismos();
    };
    fetchData();
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
      `¿Está seguro de eliminar el organismo ${organismoSeleccionado.sigla}?`
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
    if (!formData.of.toString().trim()) return "El código OF es obligatorio.";
    if (!formData.gestion.toString().trim()) return "La gestión es obligatoria.";
    if (!formData.des.trim()) return "La descripción es obligatoria.";
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
      of: Number(formData.of),
      gestion: Number(formData.gestion),
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
      <h2>ADMINISTRACIÓN DE ORGANISMO FINANCIERO</h2>

      {loading && <p>Cargando organismos financieros...</p>}
      {error && <div className="page-error">{error}</div>}
      {mensaje && <div className="page-success">{mensaje}</div>}

      <div className="table-container">
        <table className="vsiaf-table">
          <thead>
            <tr>
              <th>OF</th>
              <th>GESTIÓN</th>
              <th>DESCRIPCIÓN</th>
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
                    organismoSeleccionado?.of === organismo.of
                      ? "selected-row"
                      : ""
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
        <button type="button" onClick={handleEliminar}>Eliminar</button>
        <button type="button" onClick={cargarOrganismos}>Actualizar</button>
      </div>

      {mostrarFormulario && (
        <div className="form-panel">
          <h3>
            {modoEdicion
              ? "Editar Organismo Financiero"
              : "Nuevo Organismo Financiero"}
          </h3>
          <form onSubmit={handleGuardar} className="page-form">
            <label>
              Código OF
              <input
                type="number"
                name="of"
                value={formData.of}
                onChange={handleChange}
                disabled={modoEdicion}
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
              Descripción
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