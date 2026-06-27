import { useState, useEffect } from 'react';
import Table from '../components/Common/Table';
import Modal from '../components/Common/Modal';
import Input from '../components/Common/Input';
import Button from '../components/Common/Button';
import './UnidadAdministrativa.css';

// Datos simulados (mock) mientras el backend no tiene el endpoint real
const mockData = [
  { unidad: '025', descripcion: 'GACETA OFICIAL DE BOLIVIA', ciudad: 'LA PAZ' },
  { unidad: '252', descripcion: 'NIVEL CENTRAL', ciudad: 'LA PAZ' },
];

const columns = [
  { key: 'unidad', label: 'UNIDAD' },
  { key: 'descripcion', label: 'DESCRIPCION' },
  { key: 'ciudad', label: 'CIUDAD' },
];

function UnidadAdministrativa() {
  const [datos, setDatos] = useState([]);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [form, setForm] = useState({ unidad: '', descripcion: '', ciudad: '' });
  const [errores, setErrores] = useState({});

  // Simula la carga inicial desde la API
  useEffect(() => {
    // Cuando exista el endpoint real, aquí se reemplaza por:
    // api.get('/unidad-administrativa').then(res => setDatos(res.data));
    setDatos(mockData);
  }, []);

  const abrirNuevo = () => {
    setForm({ unidad: '', descripcion: '', ciudad: '' });
    setErrores({});
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const abrirEditar = () => {
    if (!filaSeleccionada) {
      alert('Seleccione una fila para editar.');
      return;
    }
    setForm(filaSeleccionada);
    setErrores({});
    setModoEdicion(true);
    setModalAbierto(true);
  };

  const eliminar = () => {
    if (!filaSeleccionada) {
      alert('Seleccione una fila para eliminar.');
      return;
    }
    const confirmar = window.confirm(
      `¿Está seguro de eliminar la unidad ${filaSeleccionada.unidad}?`
    );
    if (confirmar) {
      // Cuando exista el endpoint real:
      // api.delete(`/unidad-administrativa/${filaSeleccionada.unidad}`)
      setDatos(datos.filter(d => d.unidad !== filaSeleccionada.unidad));
      setFilaSeleccionada(null);
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.unidad.trim()) nuevosErrores.unidad = 'El código es obligatorio';
    if (!form.ciudad.trim()) nuevosErrores.ciudad = 'La ciudad es obligatoria';
    if (!form.descripcion.trim()) nuevosErrores.descripcion = 'La descripción es obligatoria';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardar = () => {
    if (!validar()) return;

    if (modoEdicion) {
      // Cuando exista el endpoint real:
      // api.put(`/unidad-administrativa/${form.unidad}`, form)
      setDatos(datos.map(d => (d.unidad === form.unidad ? form : d)));
    } else {
      // Cuando exista el endpoint real:
      // api.post('/unidad-administrativa', form)
      setDatos([...datos, form]);
    }
    setModalAbierto(false);
  };

  const handleChange = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  return (
    <div className="unidad-admin">
      <h2 className="unidad-admin-titulo">ADMINISTRACION UNIDAD ADMINISTRATIVA</h2>

      <Table
        columns={columns}
        data={datos}
        onRowClick={(row) => setFilaSeleccionada(row)}
      />

      <div className="unidad-admin-botones">
        <Button label="Nuevo" onClick={abrirNuevo} />
        <Button label="Editar" onClick={abrirEditar} />
        <Button label="Eliminar" variant="danger" onClick={eliminar} />
        <Button label="Salir" onClick={() => setFilaSeleccionada(null)} />
      </div>

      <Modal
        isOpen={modalAbierto}
        title="Unidad Administrativa"
        onClose={() => setModalAbierto(false)}
      >
        <Input
          label="Unidad Administrativa"
          value={form.unidad}
          onChange={handleChange('unidad')}
          error={errores.unidad}
          disabled={modoEdicion}
        />
        <Input
          label="Ciudad"
          value={form.ciudad}
          onChange={handleChange('ciudad')}
          error={errores.ciudad}
        />
        <Input
          label="Descripción"
          value={form.descripcion}
          onChange={handleChange('descripcion')}
          error={errores.descripcion}
        />

        <div className="unidad-admin-modal-botones">
          <Button label="Grabar" onClick={guardar} />
          <Button label="Salir" onClick={() => setModalAbierto(false)} />
        </div>
      </Modal>
    </div>
  );
}

export default UnidadAdministrativa;