import api from "./api";

export const getOrganismos = () => {
  return api.get("/organismos");
};

export const createOrganismo = (data) => {
  return api.post("/organismos", data);
};

export const updateOrganismo = (of, data) => {
  return api.put(`/organismos/${of}`, data);
};

export const deleteOrganismo = (of) => {
  return api.delete(`/organismos/${of}`);
};
