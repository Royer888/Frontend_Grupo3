import api from './api';

export const loginUsuario = async (credenciales) => {
  const response = await api.post('/usuarios/login', credenciales);
  return response.data;
};
