import api from './api';

const ENDPOINT = '/unidades-administrativas';

export const getUnidades = async () => {
  const { data } = await api.get(ENDPOINT);
  return data;
};

export const createUnidad = async (data) => {
  const response = await api.post(ENDPOINT, data);
  return response.data;
};

export const updateUnidad = async (id, data) => {
  const response = await api.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

export const deleteUnidad = async (id) => {
  const response = await api.delete(`${ENDPOINT}/${id}`);
  return response.data;
};
