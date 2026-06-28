import api from "./api";

export const loginUsuario = async (credenciales) => {
  const response = await api.post("/usuarios/login", credenciales);
  return response.data;
};

export const getUsuarios = () => {
  return api.get("/usuarios");
};

export const createUsuario = (data) => {
  return api.post("/usuarios", data);
};

export const updateUsuario = (id, data) => {
  // Se usan backticks porque incluye la variable ${id}
  return api.put(`/usuarios/${id}`, data);
};

export const deleteUsuario = (id) => {
  // Corrección: Ahora usa backticks correctamente para la ruta dinámica
  return api.delete(`/usuarios/${id}`);
};