import api from "./api";

export const getEntidades = () => {
  return api.get("/entidad");
};

export const createEntidad = (data) => {
  return api.post("/entidad", data);
};

export const updateEntidad = (siglaestru, data) => {
  return api.put(`/entidad/${siglaestru}`, data);
};

export const deleteEntidad = (siglaestru) => {
  return api.delete(`/entidad/${siglaestru}`);
};