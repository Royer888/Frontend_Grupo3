import api from './api';

const ENDPOINT = '/objetos-gasto';

export const getObjetosGasto = async () => {
  const { data } = await api.get(ENDPOINT);
  return data;
};

export const createObjetoGasto = async (data) => {
  const response = await api.post(ENDPOINT, data);
  return response.data;
};

export const updateObjetoGasto = async (id, data) => {
  const response = await api.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

export const deleteObjetoGasto = async (id) => {
  const response = await api.delete(`${ENDPOINT}/${id}`);
  return response.data;
};
