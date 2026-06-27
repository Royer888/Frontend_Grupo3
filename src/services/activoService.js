import api from './api';

const ENDPOINT = '/activos';

export const getActivos = async () => {
  const { data } = await api.get(ENDPOINT);
  return data;
};

export const getActivoById = async (id) => {
  const { data } = await api.get(`${ENDPOINT}/${id}`);
  return data;
};

export const getActivoByCodigo = async (codigo) => {
  const { data } = await api.get(`${ENDPOINT}/codigo/${codigo}`);
  return data;
};

export const createActivo = async (data) => {
  const response = await api.post(ENDPOINT, data);
  return response.data;
};

export const updateActivo = async (id, data) => {
  const response = await api.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

export const deleteActivo = async (id) => {
  const response = await api.delete(`${ENDPOINT}/${id}`);
  return response.data;
};
