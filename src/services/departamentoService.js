import api from './api';

export const getDepartamentos = async () => {
  const { data } = await api.get('/departamentos');
  return data;
};
