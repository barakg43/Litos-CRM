import axios from "axios";
// const BASE_URL = "http://barak-pc:9000";
const BASE_URL = import.meta.env.DEV
  ? "http://barak-pc:8080/api"
  : "http://10.10.40.20:8080/api";
export const httpClient = axios.create({
  baseURL: BASE_URL,
});
