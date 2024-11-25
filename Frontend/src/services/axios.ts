import axios from "axios";
import { isDevelopmentEnvironment } from "./utils";
const DEV_IP = "barak-pc";

const BASE_URL = isDevelopmentEnvironment
  ? `http://${DEV_IP}:8080/quik/api`
  : "http://10.10.40.20:8080/quik/api";
export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
