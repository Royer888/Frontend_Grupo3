import api from './api';

const ENDPOINT = '/organismos';

export const getOrganismos = async () => {
  const { data } = await api.get(ENDPOINT);
  return data;
};

export const createOrganismo = async (data) => {
  const response = await api.post(ENDPOINT, data);
  return response.data;
};

// IMPORTANTE: usa "of" en lugar de "id"
export const updateOrganismo = async (of, data) => {
  const response = await api.put(`${ENDPOINT}/${of}`, data);
  return response.data;
};

// IMPORTANTE: usa "of" en lugar de "id"
export const deleteOrganismo = async (of) => {
  const response = await api.delete(`${ENDPOINT}/${of}`);
  return response.data;
};