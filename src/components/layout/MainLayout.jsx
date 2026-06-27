import Button from '../Common/Button';
import Header from './Header';
import Sidebar from './Sidebar';
import './MainLayout.css';

function MainLayout({ pantallaActiva, onNavigate, onSalir, children }) {
  return (
    <div className="app">
      <Header />

      <div className="main">
        <Sidebar pantallaActiva={pantallaActiva} onNavigate={onNavigate} />

        <section className="content">
          <div className="content-info">
            <span>ENTIDAD: 0</span>
            <span>UNIDAD: 0</span>
          </div>

          <div className="content-body">
            <div className="content-page">{children}</div>

            <div className="content-footer">
              <Button label="Acerca de..." />
              <Button label="Salir" onClick={onSalir} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MainLayout;
