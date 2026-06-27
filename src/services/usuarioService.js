import api from "./api";

export const loginUsuario = (data) => {
  return api.post("/usuarios/login", data);
};

export const getUsuarios = () => {
  return api.get("/usuarios");
};

export const createUsuario = (data) => {
  return api.post("/usuarios", data);
};

export const updateUsuario = (id, data) => {
  return api.put(`/usuarios/${id}`, data);
};

export const deleteUsuario = (id) => {
  return api.delete(`/usuarios/${id}`);
};
