import api from "./api";

export const getObjetosGasto = () => {
  return api.get("/objgasto");
};

export const createObjetoGasto = (data) => {
  return api.post("/objgasto", data);
};

export const updateObjetoGasto = (id, data) => {
  return api.put(`/objgasto/${id}`, data);
};

export const deleteObjetoGasto = (id) => {
  return api.delete(`/objgasto/${id}`);
};
