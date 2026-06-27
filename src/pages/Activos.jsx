import { useEffect, useMemo, useState } from 'react';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import Modal from '../components/Common/Modal';
import Table from '../components/Common/Table';
import {
  createActivo,
  deleteActivo,
  getActivos,
  updateActivo,
} from '../services/activoService';
import { getDepartamentos } from '../services/departamentoService';
import { getEntidades } from '../services/entidadService';
import { getEstados } from '../services/estadoService';
import { getOrganismos } from '../services/organismoFinService';
import { getUnidades } from '../services/unidadAdministrativaService';
import '../styles/pages.css';

const emptyForm = {
  id: '',
  codigo: '',
  descripcion: '',
  marca: '',
  modelo: '',
  serie: '',
  precio: '',
  fechaCompra: '',
  departamentoId: '',
  estadoId: '',
  organismoFinId: '',
  unidadAdministrativaId: '',
  entidadId: '',
  usuarioRegistro: '',
};

const columns = [
  { key: 'codigo', label: 'CODIGO' },
  { key: 'descripcion', label: 'DESCRIPCION' },
  { key: 'marca', label: 'MARCA' },
  { key: 'modelo', label: 'MODELO' },
  { key: 'serie', label: 'SERIE' },
  { key: 'precio', label: 'PRECIO' },
  { key: 'fechaCompra', label: 'FECHA COMPRA' },
  { key: 'departamento', label: 'DEPARTAMENTO' },
  { key: 'estado', label: 'ESTADO' },
  { key: 'unidadAdministrativa', label: 'UNIDAD' },
];

const getArrayData = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

const getId = (item) => {
  if (!item) return '';
  return String(item.id ?? item.codigo ?? item.unidad ?? item.entidad ?? '');
};

const getLabel = (item) => {
  if (!item) return '';
  return (
    item.descripcion ??
    item.nombre ??
    item.detalle ??
    item.codigo ??
    item.unidad ??
    item.entidad ??
    item.estadoUni ??
    getId(item)
  );
};

const findById = (items, id) => items.find((item) => getId(item) === String(id)) ?? null;

const getCatalogId = (value) => {
  if (value && typeof value === 'object') return getId(value);
  return value ? String(value) : '';
};

const formatDate = (value) => {
  if (!value) return '';
  return String(value).slice(0, 10);
};

function Activos() {
  const [activos, setActivos] = useState([]);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingCatalogos, setLoadingCatalogos] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [catalogos, setCatalogos] = useState({
    departamentos: [],
    estados: [],
    organismos: [],
    entidades: [],
    unidades: [],
  });

  const activosTabla = useMemo(
    () =>
      activos.map((activo) => ({
        ...activo,
        precio: activo.precio ?? '',
        fechaCompra: formatDate(activo.fechaCompra),
        departamento: getLabel(activo.departamento),
        estado: getLabel(activo.estado),
        organismoFin: getLabel(activo.organismoFin),
        unidadAdministrativa: getLabel(activo.unidadAdministrativa),
        entidad: getLabel(activo.entidad),
      })),
    [activos]
  );

  const cargarActivos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getActivos();
      setActivos(getArrayData(data));
      setFilaSeleccionada(null);
    } catch {
      setError('No se pudo cargar la lista de activos fijos.');
    } finally {
      setLoading(false);
    }
  };

  const cargarCatalogos = async () => {
    try {
      setLoadingCatalogos(true);
      setError('');
      const [departamentos, estados, organismos, entidades, unidades] = await Promise.all([
        getDepartamentos(),
        getEstados(),
        getOrganismos(),
        getEntidades(),
        getUnidades(),
      ]);

      setCatalogos({
        departamentos: getArrayData(departamentos),
        estados: getArrayData(estados),
        organismos: getArrayData(organismos),
        entidades: getArrayData(entidades),
        unidades: getArrayData(unidades),
      });
    } catch {
      setError('No se pudieron cargar los catalogos.');
    } finally {
      setLoadingCatalogos(false);
    }
  };

  useEffect(() => {
    let activo = true;

    const cargarInicial = async () => {
      try {
        const [activosData, departamentos, estados, organismos, entidades, unidades] =
          await Promise.all([
            getActivos(),
            getDepartamentos(),
            getEstados(),
            getOrganismos(),
            getEntidades(),
            getUnidades(),
          ]);

        if (!activo) return;

        setActivos(getArrayData(activosData));
        setCatalogos({
          departamentos: getArrayData(departamentos),
          estados: getArrayData(estados),
          organismos: getArrayData(organismos),
          entidades: getArrayData(entidades),
          unidades: getArrayData(unidades),
        });
      } catch {
        if (activo) setError('No se pudo cargar la informacion de activos fijos.');
      } finally {
        if (activo) {
          setLoading(false);
          setLoadingCatalogos(false);
        }
      }
    };

    cargarInicial();

    return () => {
      activo = false;
    };
  }, []);

  const limpiarMensajes = () => {
    setError('');
    setSuccess('');
  };

  const abrirNuevo = () => {
    limpiarMensajes();
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

    limpiarMensajes();
    setForm({
      id: filaSeleccionada.id ?? '',
      codigo: filaSeleccionada.codigo ?? '',
      descripcion: filaSeleccionada.descripcion ?? '',
      marca: filaSeleccionada.marca ?? '',
      modelo: filaSeleccionada.modelo ?? '',
      serie: filaSeleccionada.serie ?? '',
      precio: filaSeleccionada.precio ?? '',
      fechaCompra: formatDate(filaSeleccionada.fechaCompra),
      departamentoId: getCatalogId(filaSeleccionada.departamento),
      estadoId: getCatalogId(filaSeleccionada.estado),
      organismoFinId: getCatalogId(filaSeleccionada.organismoFin),
      unidadAdministrativaId: getCatalogId(filaSeleccionada.unidadAdministrativa),
      entidadId: getCatalogId(filaSeleccionada.entidad),
      usuarioRegistro: filaSeleccionada.usuarioRegistro ?? '',
    });
    setErrores({});
    setModoEdicion(true);
    setModalAbierto(true);
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!String(form.codigo).trim()) nuevosErrores.codigo = 'El codigo es obligatorio.';
    if (!String(form.descripcion).trim()) {
      nuevosErrores.descripcion = 'La descripcion es obligatoria.';
    }
    if (!form.departamentoId) nuevosErrores.departamentoId = 'El departamento es obligatorio.';
    if (!form.estadoId) nuevosErrores.estadoId = 'El estado es obligatorio.';
    if (!form.fechaCompra) nuevosErrores.fechaCompra = 'La fecha de compra es obligatoria.';
    if (form.precio !== '' && Number.isNaN(Number(form.precio))) {
      nuevosErrores.precio = 'El precio debe ser un numero.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const crearPayload = () => ({
    codigo: form.codigo,
    descripcion: form.descripcion,
    marca: form.marca,
    modelo: form.modelo,
    serie: form.serie,
    precio: form.precio === '' ? null : Number(form.precio),
    fechaCompra: form.fechaCompra,
    departamento: findById(catalogos.departamentos, form.departamentoId),
    estado: findById(catalogos.estados, form.estadoId),
    organismoFin: findById(catalogos.organismos, form.organismoFinId),
    unidadAdministrativa: findById(catalogos.unidades, form.unidadAdministrativaId),
    entidad: findById(catalogos.entidades, form.entidadId),
    usuarioRegistro: form.usuarioRegistro,
  });

  const guardar = async () => {
    if (!validar()) return;

    try {
      setSaving(true);
      limpiarMensajes();

      if (modoEdicion) {
        await updateActivo(form.id, crearPayload());
        setSuccess('Activo fijo actualizado correctamente.');
      } else {
        await createActivo(crearPayload());
        setSuccess('Activo fijo registrado correctamente.');
      }

      setModalAbierto(false);
      await cargarActivos();
    } catch {
      setError('No se pudo guardar el activo fijo.');
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
      `Esta seguro de eliminar el activo ${filaSeleccionada.codigo}?`
    );

    if (!confirmar) return;

    try {
      setSaving(true);
      limpiarMensajes();
      await deleteActivo(filaSeleccionada.id);
      setSuccess('Activo fijo eliminado correctamente.');
      await cargarActivos();
    } catch {
      setError('No se pudo eliminar el activo fijo.');
    } finally {
      setSaving(false);
    }
  };

  const actualizar = async () => {
    await Promise.all([cargarActivos(), cargarCatalogos()]);
    setSuccess('Datos actualizados correctamente.');
  };

  const handleChange = (campo) => (event) => {
    setForm({ ...form, [campo]: event.target.value });
  };

  const renderSelect = (campo, label, items, errorCampo) => (
    <label className="form-field">
      <span>{label}</span>
      <select value={form[campo]} onChange={handleChange(campo)} disabled={saving}>
        <option value="">Seleccione...</option>
        {items.map((item) => (
          <option key={getId(item)} value={getId(item)}>
            {getLabel(item)}
          </option>
        ))}
      </select>
      {errorCampo && <small>{errorCampo}</small>}
    </label>
  );

  const deshabilitarAcciones = loading || loadingCatalogos || saving;

  return (
    <div className="module-panel module-panel-wide">
      <h2 className="module-title">GESTION DE ACTIVOS FIJOS</h2>

      {error && <div className="module-error">{error}</div>}
      {success && <div className="module-success">{success}</div>}

      {loading ? (
        <div className="module-status">Cargando activos fijos...</div>
      ) : (
        <div className="table-wrapper">
          <Table
            columns={columns}
            data={activosTabla}
            getRowKey={(row) => row.id}
            selectedKey={filaSeleccionada?.id}
            onRowClick={(row) => setFilaSeleccionada(activos.find((activo) => activo.id === row.id))}
          />
        </div>
      )}

      {loadingCatalogos && <div className="module-status">Cargando catalogos...</div>}

      <div className="module-actions">
        <Button label="Nuevo" onClick={abrirNuevo} disabled={deshabilitarAcciones} />
        <Button label="Editar" onClick={abrirEditar} disabled={deshabilitarAcciones} />
        <Button label="Eliminar" variant="danger" onClick={eliminar} disabled={deshabilitarAcciones} />
        <Button label="Actualizar" onClick={actualizar} disabled={deshabilitarAcciones} />
      </div>

      <Modal
        isOpen={modalAbierto}
        title={modoEdicion ? 'Editar Activo Fijo' : 'Nuevo Activo Fijo'}
        onClose={() => setModalAbierto(false)}
      >
        <div className="form-grid">
          <Input
            label="Codigo"
            value={form.codigo}
            onChange={handleChange('codigo')}
            error={errores.codigo}
            disabled={saving}
          />
          <Input
            label="Descripcion"
            value={form.descripcion}
            onChange={handleChange('descripcion')}
            error={errores.descripcion}
            disabled={saving}
          />
          <Input
            label="Marca"
            value={form.marca}
            onChange={handleChange('marca')}
            disabled={saving}
          />
          <Input
            label="Modelo"
            value={form.modelo}
            onChange={handleChange('modelo')}
            disabled={saving}
          />
          <Input
            label="Serie"
            value={form.serie}
            onChange={handleChange('serie')}
            disabled={saving}
          />
          <Input
            label="Precio"
            value={form.precio}
            onChange={handleChange('precio')}
            error={errores.precio}
            disabled={saving}
          />
          <Input
            label="Fecha de compra"
            type="date"
            value={form.fechaCompra}
            onChange={handleChange('fechaCompra')}
            error={errores.fechaCompra}
            disabled={saving}
          />
          <Input
            label="Usuario registro"
            value={form.usuarioRegistro}
            onChange={handleChange('usuarioRegistro')}
            disabled={saving}
          />
          {renderSelect(
            'departamentoId',
            'Departamento',
            catalogos.departamentos,
            errores.departamentoId
          )}
          {renderSelect('estadoId', 'Estado', catalogos.estados, errores.estadoId)}
          {renderSelect('organismoFinId', 'Organismo financiador', catalogos.organismos)}
          {renderSelect('unidadAdministrativaId', 'Unidad administrativa', catalogos.unidades)}
          {renderSelect('entidadId', 'Entidad', catalogos.entidades)}
        </div>

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

export default Activos;
