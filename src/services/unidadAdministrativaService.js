import api from "./api";

export const getUnidades = () => {
  return api.get("/unidades-administrativas");
};

export const createUnidad = (data) => {
  return api.post("/unidades-administrativas", data);
};

export const updateUnidad = (id, data) => {
  return api.put(`/unidades-administrativas/${id}`, data );
};

export const deleteUnidad = (id) => {
  return api.delete(`/unidades-administrativas/${id}`);
};