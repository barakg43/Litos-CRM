import axios from "axios";
const DEV_IP = "barak-pc";

const isDevEnv = process.env.NODE_ENV === "development";
const BASE_URL = isDevEnv
  ? `http://${DEV_IP}:8080/quik/api`
  : "http://10.10.40.20:8080/quik/api";
// const BASE_URL = "http://barak-pc:8080/quik/api";
export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  //   withCredentials: true, // disable for now due a bug in render
});
// httpClient.interceptors.response.use((response) => response.data);
