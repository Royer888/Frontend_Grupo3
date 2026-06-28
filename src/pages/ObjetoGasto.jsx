import { useCallback, useEffect, useState } from "react";
import {
  createObjetoGasto,
  deleteObjetoGasto,
  getObjetosGasto,
  updateObjetoGasto,
} from "../services/objetoGastoService";
import "../styles/pages.css";

const initialForm = {
  objeto: "",
  descripcion: "",
  gestion: "",
  estado: "",
};

const obtenerIdObjeto = (item) => item.id ?? item.objeto ?? item.codobjeto;

const mostrarValor = (valor) => {
  return valor === null || valor === undefined || valor === "" ? "-" : valor;
};

function ObjetoGasto() {
  const [objetosGasto, setObjetosGasto] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [objetoSeleccionado, setObjetoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarObjetosGasto = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getObjetosGasto();
      setObjetosGasto(response.data || []);
    } catch {
      setError("No se pudo cargar la lista de objetos de gasto.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarObjetosGasto();
  }, [cargarObjetosGasto]);

  const limpiarFormulario = () => {
    setFormData(initialForm);
    setObjetoSeleccionado(null);
    setModoEdicion(false);
  };

  const handleNuevo = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
    setError("");
    setMensaje("");
  };

  const handleSeleccionar = (objetoGasto) => {
    setObjetoSeleccionado(objetoGasto);
  };

  const handleEditar = () => {
    if (!objetoSeleccionado) {
      setError("Seleccione un objeto de gasto para editar.");
      return;
    }

    setFormData({
      objeto: objetoSeleccionado.objeto ?? objetoSeleccionado.codobjeto ?? "",
      descripcion:
        objetoSeleccionado.descripcion ?? objetoSeleccionado.descobjeto ?? "",
      gestion: objetoSeleccionado.gestion ?? "",
      estado: objetoSeleccionado.estado ?? "",
    });
    setModoEdicion(true);
    setMostrarFormulario(true);
    setError("");
    setMensaje("");
  };

  const handleEliminar = async () => {
    if (!objetoSeleccionado) {
      setError("Seleccione un objeto de gasto para eliminar.");
      return;
    }

    const confirmar = window.confirm(
      `Esta seguro de eliminar el objeto de gasto ${
        objetoSeleccionado.objeto ?? objetoSeleccionado.codobjeto ?? ""
      }?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      setError("");
      await deleteObjetoGasto(obtenerIdObjeto(objetoSeleccionado));
      setMensaje("Objeto de gasto eliminado correctamente.");
      setObjetoSeleccionado(null);
      await cargarObjetosGasto();
    } catch {
      setError("No se pudo eliminar el objeto de gasto.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validarFormulario = () => {
    if (!formData.objeto.trim()) {
      return "El objeto de gasto es obligatorio.";
    }

    if (!formData.descripcion.trim()) {
      return "La descripcion es obligatoria.";
    }

    if (!formData.gestion.trim()) {
      return "La gestion es obligatoria.";
    }

    if (!formData.estado.trim()) {
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

    const payload = {
      objeto: formData.objeto.trim(),
      descripcion: formData.descripcion.trim(),
      gestion: formData.gestion.trim(),
      estado: formData.estado.trim(),
    };

    try {
      setError("");

      if (modoEdicion && objetoSeleccionado) {
        await updateObjetoGasto(obtenerIdObjeto(objetoSeleccionado), payload);
        setMensaje("Objeto de gasto actualizado correctamente.");
      } else {
        await createObjetoGasto(payload);
        setMensaje("Objeto de gasto registrado correctamente.");
      }

      setMostrarFormulario(false);
      limpiarFormulario();
      await cargarObjetosGasto();
    } catch {
      setError("No se pudo guardar el objeto de gasto.");
    }
  };

  return (
    <section className="page-panel">
      <h2>OBJETO DE GASTO</h2>

      {loading && <p className="module-status">Cargando objetos de gasto...</p>}
      {error && <div className="page-error">{error}</div>}
      {mensaje && <div className="page-success">{mensaje}</div>}

      <div className="table-container">
        <table className="vsiaf-table">
          <thead>
            <tr>
              <th>OBJETO</th>
              <th>DESCRIPCION</th>
              <th>GESTION</th>
              <th>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {objetosGasto.length === 0 ? (
              <tr>
                <td colSpan="4">Sin registros</td>
              </tr>
            ) : (
              objetosGasto.map((item) => {
                const itemId = obtenerIdObjeto(item);

                return (
                  <tr
                    key={itemId}
                    className={
                      obtenerIdObjeto(objetoSeleccionado || {}) === itemId
                        ? "selected-row"
                        : ""
                    }
                    onClick={() => handleSeleccionar(item)}
                  >
                    <td>{mostrarValor(item.objeto ?? item.codobjeto)}</td>
                    <td>
                      {mostrarValor(item.descripcion ?? item.descobjeto)}
                    </td>
                    <td>{mostrarValor(item.gestion)}</td>
                    <td>{mostrarValor(item.estado)}</td>
                  </tr>
                );
              })
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
        <button
          type="button"
          className="danger-button"
          onClick={handleEliminar}
        >
          Eliminar
        </button>
        <button type="button" onClick={cargarObjetosGasto}>
          Actualizar
        </button>
      </div>

      {mostrarFormulario && (
        <div className="form-panel">
          <h3>{modoEdicion ? "Editar Objeto de Gasto" : "Nuevo Objeto de Gasto"}</h3>

          <form onSubmit={handleGuardar} className="page-form">
            <label>
              Objeto de gasto
              <input
                type="text"
                name="objeto"
                value={formData.objeto}
                onChange={handleChange}
              />
            </label>

            <label>
              Descripcion
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </label>

            <label>
              Gestion
              <input
                type="text"
                name="gestion"
                value={formData.gestion}
                onChange={handleChange}
              />
            </label>

            <label>
              Estado
              <input
                type="text"
                name="estado"
                value={formData.estado}
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
                  setError("");
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

export default ObjetoGasto;
