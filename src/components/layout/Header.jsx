import './Header.css';

function Header({ usuarioLogueado }) {
  const usuario = usuarioLogueado?.usuario ?? 'admin';

  return (
    <>
      <div className="top-bar">
        <span>SISTEMA DE ACTIVOS FIJOS</span>
      </div>

      <header className="header">
        <div className="flag-placeholder">
          <img src="/bandera_Bolivia.jpg" alt="Bandera de Bolivia" className="flag-image" />
        </div>

        <div className="header-logo">
          <div className="logo-text">V.S.I.A.F</div>
          <div className="logo-sub">Sistema de Activos Fijos</div>
        </div>

        <div className="header-user-info">
          <span>
            <strong>USUARIO:</strong> {usuario}
          </span>
          <span>
            <strong>BACKUPS:</strong> none
          </span>
        </div>
      </header>
    </>
  );
}

export default Header;
