import { useState } from 'react';
import { loginUsuario } from '../services/usuarioService';
import './Login.css';

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);

  const validar = () => {
    const nuevosErrores = {};

    if (!usuario.trim()) nuevosErrores.usuario = 'El usuario es obligatorio.';
    if (!password.trim()) nuevosErrores.password = 'La contraseña es obligatoria.';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorGeneral('');

    if (!validar()) return;

    try {
      setCargando(true);
      const data = await loginUsuario({ usuario, password });
      const usuarioLogueado = data?.usuario ?? data?.username ?? data?.nombreUsuario ?? usuario;
      const sesion = {
        usuario: usuarioLogueado,
        data,
      };

      localStorage.setItem('usuarioLogueado', JSON.stringify(sesion));
      onLogin(sesion);
    } catch (error) {
      if (!error.response) {
        setErrorGeneral('No se pudo conectar con el servidor.');
      } else {
        setErrorGeneral('Usuario o contraseña incorrectos.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-top-bar">SISTEMA DE ACTIVOS FIJOS</div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">V.S.I.A.F</div>
          <div className="login-subtitle">Sistema de Activos Fijos</div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h1 className="login-title">Inicio de Sesion</h1>

          {errorGeneral && <div className="login-error-general">{errorGeneral}</div>}

          <label className="login-field">
            <span>Usuario</span>
            <input
              type="text"
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              disabled={cargando}
              autoComplete="username"
            />
            {errores.usuario && <small>{errores.usuario}</small>}
          </label>

          <label className="login-field">
            <span>Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={cargando}
              autoComplete="current-password"
            />
            {errores.password && <small>{errores.password}</small>}
          </label>

          <button className="login-button" type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
