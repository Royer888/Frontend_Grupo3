import api from './api';

export const getEstados = async () => {
  const { data } = await api.get('/estados');
  return data;
};
