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
  departamento: '',
  estado: '',
  organismoFin: '',
  unidadAdministrativa: '',
  entidad: '',
  usuarioRegistro: '',
};

const columns = [
  { key: 'codigo', label: 'CÓDIGO' },
  { key: 'descripcion', label: 'DESCRIPCIÓN' },
  { key: 'marca', label: 'MARCA' },
  { key: 'modelo', label: 'MODELO' },
  { key: 'serie', label: 'SERIE' },
  { key: 'precio', label: 'PRECIO' },
  { key: 'fechaCompra', label: 'FECHA COMPRA' },
  { key: 'departamento', label: 'DEPARTAMENTO' },
  { key: 'estado', label: 'ESTADO' },
  { key: 'organismoFin', label: 'ORGANISMO' },
  { key: 'unidadAdministrativa', label: 'UNIDAD' },
  { key: 'entidad', label: 'ENTIDAD' },
  { key: 'usuarioRegistro', label: 'USUARIO REGISTRO' },
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

const obtenerTextoBase = (item, campos) => {
  if (item === null || item === undefined) return '';
  if (typeof item !== 'object') return String(item);

  const valor = campos.find((campo) => item[campo] !== null && item[campo] !== undefined && item[campo] !== '');
  return valor ? String(item[valor]) : getId(item);
};

const obtenerTextoEstado = (item) => {
  return obtenerTextoBase(item, ['codestado', 'nomestado', 'descripcion', 'estado', 'nombre']);
};

const obtenerTextoOrganismo = (item) => {
  return obtenerTextoBase(item, ['of', 'sigla', 'des', 'descripcion', 'nombre']);
};

const obtenerTextoUnidad = (item) => {
  return obtenerTextoBase(item, ['descripcion', 'unidad', 'ciudad', 'estadoUni', 'nombre']);
};

const obtenerTextoEntidad = (item) => {
  return obtenerTextoBase(item, ['siglaestru', 'desEstruct', 'gestion', 'entidad', 'nombre']);
};

const obtenerTextoDepartamento = (item) => {
  return obtenerTextoBase(item, ['departamento', 'nombre', 'descripcion', 'ciudad']);
};

const formatDate = (value) => {
  if (!value) return '';
  return String(value).slice(0, 10);
};

const mostrarValor = (valor) => {
  return valor === null || valor === undefined || valor === '' ? '-' : valor;
};

const crearOpcionesRespaldo = (activosData, campo) => {
  return [...new Set(getArrayData(activosData).map((activo) => activo[campo]).filter(Boolean))];
};

const obtenerCatalogoConRespaldo = (catalogo, activosData, campo) => {
  const datosCatalogo = getArrayData(catalogo);
  return datosCatalogo.length > 0 ? datosCatalogo : crearOpcionesRespaldo(activosData, campo);
};

const construirCatalogos = ({
  departamentos,
  estados,
  organismos,
  entidades,
  unidades,
  activosData,
}) => ({
  departamentos: obtenerCatalogoConRespaldo(departamentos, activosData, 'departamento'),
  estados: obtenerCatalogoConRespaldo(estados, activosData, 'estado'),
  organismos: obtenerCatalogoConRespaldo(organismos, activosData, 'organismoFin'),
  entidades: obtenerCatalogoConRespaldo(entidades, activosData, 'entidad'),
  unidades: obtenerCatalogoConRespaldo(unidades, activosData, 'unidadAdministrativa'),
});

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
        id: activo.id,
        codigo: mostrarValor(activo.codigo),
        descripcion: mostrarValor(activo.descripcion),
        marca: mostrarValor(activo.marca),
        modelo: mostrarValor(activo.modelo),
        serie: mostrarValor(activo.serie),
        precio: mostrarValor(activo.precio),
        fechaCompra: mostrarValor(formatDate(activo.fechaCompra)),
        departamento: mostrarValor(activo.departamento),
        estado: mostrarValor(activo.estado),
        organismoFin: mostrarValor(activo.organismoFin),
        unidadAdministrativa: mostrarValor(activo.unidadAdministrativa),
        entidad: mostrarValor(activo.entidad),
        usuarioRegistro: mostrarValor(activo.usuarioRegistro),
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
      const [departamentosResponse, estadosResponse, organismosResponse, entidadesResponse, unidadesResponse] = await Promise.all([
        getDepartamentos().then((data) => ({ data })),
        getEstados().then((data) => ({ data })),
        getOrganismos().then((data) => ({ data })),
        getEntidades().then((data) => ({ data })),
        getUnidades().then((data) => ({ data })),
      ]);

      console.log("Estados:", estadosResponse.data);
      console.log("Organismos:", organismosResponse.data);
      console.log("Entidades:", entidadesResponse.data);
      console.log("Unidades:", unidadesResponse.data);

      setCatalogos(construirCatalogos({
        departamentos: departamentosResponse.data,
        estados: estadosResponse.data,
        organismos: organismosResponse.data,
        entidades: entidadesResponse.data,
        unidades: unidadesResponse.data,
        activosData: activos,
      }));
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
        const [activosData, departamentosResponse, estadosResponse, organismosResponse, entidadesResponse, unidadesResponse] =
          await Promise.all([
            getActivos(),
            getDepartamentos().then((data) => ({ data })),
            getEstados().then((data) => ({ data })),
            getOrganismos().then((data) => ({ data })),
            getEntidades().then((data) => ({ data })),
            getUnidades().then((data) => ({ data })),
          ]);

        if (!activo) return;

        console.log("Estados:", estadosResponse.data);
        console.log("Organismos:", organismosResponse.data);
        console.log("Entidades:", entidadesResponse.data);
        console.log("Unidades:", unidadesResponse.data);

        setActivos(getArrayData(activosData));
        setCatalogos(construirCatalogos({
          departamentos: departamentosResponse.data,
          estados: estadosResponse.data,
          organismos: organismosResponse.data,
          entidades: entidadesResponse.data,
          unidades: unidadesResponse.data,
          activosData,
        }));
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
      departamento: filaSeleccionada.departamento ?? '',
      estado: filaSeleccionada.estado ?? '',
      organismoFin: filaSeleccionada.organismoFin ?? '',
      unidadAdministrativa: filaSeleccionada.unidadAdministrativa ?? '',
      entidad: filaSeleccionada.entidad ?? '',
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
    if (!form.departamento) nuevosErrores.departamento = 'El departamento es obligatorio.';
    if (!form.estado) nuevosErrores.estado = 'El estado es obligatorio.';
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
    departamento: form.departamento,
    estado: form.estado,
    organismoFin: form.organismoFin,
    unidadAdministrativa: form.unidadAdministrativa,
    entidad: form.entidad,
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

  const renderSelect = (campo, label, items, obtenerTexto, errorCampo) => (
    <label className="form-field">
      <span>{label}</span>
      <select value={form[campo]} onChange={handleChange(campo)} disabled={saving}>
        <option value="">Seleccione...</option>
        {items.map((item, index) => {
          const texto = obtenerTexto(item);

          return (
            <option key={`${texto}-${index}`} value={texto}>
              {texto}
            </option>
          );
        })}
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
            'departamento',
            'Departamento',
            catalogos.departamentos,
            obtenerTextoDepartamento,
            errores.departamento
          )}
          {renderSelect('estado', 'Estado', catalogos.estados, obtenerTextoEstado, errores.estado)}
          {renderSelect('organismoFin', 'Organismo financiador', catalogos.organismos, obtenerTextoOrganismo)}
          {renderSelect('unidadAdministrativa', 'Unidad administrativa', catalogos.unidades, obtenerTextoUnidad)}
          {renderSelect('entidad', 'Entidad', catalogos.entidades, obtenerTextoEntidad)}
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
