import axios from "axios";
export const api = axios.create({
  baseURL: "http://localhost:4000/api"
});

export async function fetchData(endpoint) {
  const res = await fetch(`/api/${endpoint}`);
  if (!res.ok) throw new Error(`Error fetching ${endpoint}`);
  return res.json();
}

export const getAll = (endpoint) => api.get(`/${endpoint}`);
export const createOne = (endpoint, data) => api.post(`/${endpoint}`, data);
export const updateOne = (endpoint, id, data) => api.put(`/${endpoint}/${id}`, data);
export const deleteOne = (endpoint, id) => api.delete(`/${endpoint}/${id}`);

const API_BASE = "http://localhost:4000/api";

export async function apiPut(endpoint, id, data) {
  console.log("put data", data)
  const res = await fetch(`${API_BASE}/${endpoint}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}