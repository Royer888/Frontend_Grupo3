import api from './api';

const ENDPOINT = '/entidades';

export const getEntidades = async () => {
  const { data } = await api.get(ENDPOINT);
  return data;
};

export const createEntidad = async (data) => {
  const response = await api.post(ENDPOINT, data);
  return response.data;
};

export const updateEntidad = async (id, data) => {
  const response = await api.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

export const deleteEntidad = async (id) => {
  const response = await api.delete(`${ENDPOINT}/${id}`);
  return response.data;
};
