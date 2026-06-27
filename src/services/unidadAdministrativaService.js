import api from './api';

const ENDPOINT = '/unidades-administrativas';

export const getUnidades = async () => {
  const { data } = await api.get(ENDPOINT);
  return data;
};

export const createUnidad = async (unidadData) => {
  const { data } = await api.post(ENDPOINT, unidadData);
  return data;
};

export const updateUnidad = async (id, unidadData) => {
  const { data } = await api.put(`${ENDPOINT}/${id}`, unidadData);
  return data;
};

export const deleteUnidad = async (id) => {
  const { data } = await api.delete(`${ENDPOINT}/${id}`);
  return data;
};