import Button from '../Common/Button';
import './Sidebar.css';

const menuItems = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'unidad-administrativa', label: 'Unidad Administrativa' },
  { id: 'entidad', label: 'Entidad' },
  { id: 'objeto-gasto', label: 'Objeto de Gasto' },
  { id: 'organismo-financiero', label: 'Organismo Financiador' },
  { id: 'activos', label: 'Activos Fijos' },
  { id: 'usuarios', label: 'Usuarios' },
];

function Sidebar({ pantallaActiva, onNavigate }) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">MENU PRINCIPAL</h2>

      {menuItems.map((item) => (
        <Button
          key={item.id}
          label={item.label}
          variant={pantallaActiva === item.id ? 'active' : 'primary'}
          onClick={() => onNavigate(item.id)}


        />
      ))}
    </aside>

  );
}

export default Sidebar;
