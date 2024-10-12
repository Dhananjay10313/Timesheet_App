import axios from "axios";
import { useAuth } from "../provider/authProvider";

export function createAxiosClient({ options, getCurrentAccessToken }) {
  const client = axios.create(options);
  const token1 = localStorage.getItem("token");

  client.interceptors.request.use(
    (config) => {
      if (config.authorization !== false) {
        const token = token1;
        if (token) {
          config.headers.Authorization = "Bearer " + token;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return client;
}
