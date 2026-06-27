import api from './api';

const ENDPOINT = '/organismos';

export const getOrganismos = async () => {
  const { data } = await api.get(ENDPOINT);
  return data;
};

export const getOrganismosFin = async () => {
  const { data } = await api.get(ENDPOINT);
  return data;
};

export const createOrganismoFin = async (data) => {
  const response = await api.post(ENDPOINT, data);
  return response.data;
};

export const updateOrganismoFin = async (id, data) => {
  const response = await api.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

export const deleteOrganismoFin = async (id) => {
  const response = await api.delete(`${ENDPOINT}/${id}`);
  return response.data;
};
