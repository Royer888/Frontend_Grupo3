import { useEffect, useState } from 'react';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import Modal from '../components/Common/Modal';
import Table from '../components/Common/Table';
import {
  createUnidad,
  deleteUnidad,
  getUnidades,
  updateUnidad,
} from '../services/unidadAdministrativaService';
import '../styles/pages.css';

const emptyForm = {
  id: '',
  entidad: '',
  unidad: '',
  descripcion: '',
  ciudad: '',
  estadoUni: 'ACTIVO',
};

const columns = [
  { key: 'entidad', label: 'ENTIDAD' },
  { key: 'unidad', label: 'UNIDAD' },
  { key: 'descripcion', label: 'DESCRIPCION' },
  { key: 'ciudad', label: 'CIUDAD' },
  { key: 'estadoUni', label: 'ESTADO' },
];

const getArrayData = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

function UnidadAdministrativa() {
  const [unidades, setUnidades] = useState([]);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const cargarUnidades = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUnidades();
      setUnidades(getArrayData(data));
      setFilaSeleccionada(null);
    } catch {
      setError('No se pudo cargar la lista de unidades administrativas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let activo = true;

    const cargarInicial = async () => {
      try {
        const data = await getUnidades();
        if (!activo) return;
        setUnidades(getArrayData(data));
        setFilaSeleccionada(null);
      } catch {
        if (activo) setError('No se pudo cargar la lista de unidades administrativas.');
      } finally {
        if (activo) setLoading(false);
      }
    };

    cargarInicial();

    return () => {
      activo = false;
    };
  }, []);

  const abrirNuevo = () => {
    setForm(emptyForm);
    setErrores({});
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const abrirEditar = () => {
    if (!filaSeleccionada) {
      alert('Seleccione una fila para editar.');
      return;
    }

    setForm({
      id: filaSeleccionada.id ?? '',
      entidad: filaSeleccionada.entidad ?? '',
      unidad: filaSeleccionada.unidad ?? '',
      descripcion: filaSeleccionada.descripcion ?? '',
      ciudad: filaSeleccionada.ciudad ?? '',
      estadoUni: filaSeleccionada.estadoUni ?? 'ACTIVO',
    });
    setErrores({});
    setModoEdicion(true);
    setModalAbierto(true);
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!String(form.entidad).trim()) nuevosErrores.entidad = 'La entidad es obligatoria';
    if (!String(form.unidad).trim()) nuevosErrores.unidad = 'La unidad es obligatoria';
    if (!String(form.descripcion).trim()) {
      nuevosErrores.descripcion = 'La descripcion es obligatoria';
    }
    if (!String(form.ciudad).trim()) nuevosErrores.ciudad = 'La ciudad es obligatoria';
    if (!String(form.estadoUni).trim()) nuevosErrores.estadoUni = 'El estado es obligatorio';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardar = async () => {
    if (!validar()) return;

    try {
      setSaving(true);
      setError('');
      const payload = {
        entidad: form.entidad,
        unidad: form.unidad,
        descripcion: form.descripcion,
        ciudad: form.ciudad,
        estadoUni: form.estadoUni,
      };

      if (modoEdicion) {
        await updateUnidad(form.id, payload);
      } else {
        await createUnidad(payload);
      }

      setModalAbierto(false);
      await cargarUnidades();
    } catch {
      setError('No se pudo guardar la unidad administrativa.');
    } finally {
      setSaving(false);
    }
  };

  const eliminar = async () => {
    if (!filaSeleccionada) {
      alert('Seleccione una fila para eliminar.');
      return;
    }

    const confirmar = window.confirm(
      `Esta seguro de eliminar la unidad ${filaSeleccionada.unidad}?`
    );

    if (!confirmar) return;

    try {
      setSaving(true);
      setError('');
      await deleteUnidad(filaSeleccionada.id);
      await cargarUnidades();
    } catch {
      setError('No se pudo eliminar la unidad administrativa.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (campo) => (event) => {
    setForm({ ...form, [campo]: event.target.value });
  };

  return (
    <div className="module-panel">
      <h2 className="module-title">ADMINISTRACION UNIDAD ADMINISTRATIVA</h2>

      {error && <div className="module-error">{error}</div>}

      {loading ? (
        <div className="module-status">Cargando datos...</div>
      ) : (
        <Table
          columns={columns}
          data={unidades}
          getRowKey={(row) => row.id}
          selectedKey={filaSeleccionada?.id}
          onRowClick={(row) => setFilaSeleccionada(row)}
        />
      )}

      <div className="module-actions">
        <Button label="Nuevo" onClick={abrirNuevo} disabled={saving} />
        <Button label="Editar" onClick={abrirEditar} disabled={saving} />
        <Button label="Eliminar" variant="danger" onClick={eliminar} disabled={saving} />
        <Button label="Actualizar" onClick={cargarUnidades} disabled={loading || saving} />
      </div>

      <Modal
        isOpen={modalAbierto}
        title="Unidad Administrativa"
        onClose={() => setModalAbierto(false)}
      >
        <Input
          label="Entidad"
          value={form.entidad}
          onChange={handleChange('entidad')}
          error={errores.entidad}
        />
        <Input
          label="Unidad"
          value={form.unidad}
          onChange={handleChange('unidad')}
          error={errores.unidad}
        />
        <Input
          label="Descripcion"
          value={form.descripcion}
          onChange={handleChange('descripcion')}
          error={errores.descripcion}
        />
        <Input
          label="Ciudad"
          value={form.ciudad}
          onChange={handleChange('ciudad')}
          error={errores.ciudad}
        />
        <Input
          label="Estado"
          value={form.estadoUni}
          onChange={handleChange('estadoUni')}
          error={errores.estadoUni}
        />

        <div className="modal-actions">
          <Button
            label={saving ? 'Grabando...' : 'Grabar'}
            onClick={guardar}
            disabled={saving}
          />
          <Button label="Salir" onClick={() => setModalAbierto(false)} disabled={saving} />
        </div>
      </Modal>
    </div>
  );
}

export default UnidadAdministrativa;
