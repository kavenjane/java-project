import axios from "axios";

// One Axios instance that knows the backend address.
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Each function below calls one REST endpoint of the Spring Boot backend.
export const getItems = (name, type, status) =>
  api.get("/items", { params: { name, type, status } });

export const getItem = (id) => api.get(`/items/${id}`);

export const createItem = (item) => api.post("/items", item);

export const updateItem = (id, item) => api.put(`/items/${id}`, item);

export const deleteItem = (id) => api.delete(`/items/${id}`);

export const resolveItem = (id) => api.patch(`/items/${id}/resolve`);

// Turns an Axios error into a readable message for the user.
export function getErrorMessage(error) {
  if (!error.response) {
    return "Cannot reach the server. Is the backend running on port 8080?";
  }
  const data = error.response.data;
  if (data && data.errors && data.errors.length > 0) {
    return data.errors.join(". ");
  }
  return (data && data.message) || "Something went wrong.";
}
