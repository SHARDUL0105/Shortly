import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

export const shortenUrl = (data) => API.post("/shorten", data);
export const getStats = (code) => API.get(`/shorten/${code}/stats`);
