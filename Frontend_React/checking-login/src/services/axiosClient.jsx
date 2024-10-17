import { createAxiosClient } from "./createAxiosClient";
import { useAuth } from "../provider/authProvider";

// const REFRESH_TOKEN_URL = "http://localhost:5000/api/v1/auth/refreshToken";
const BASE_URL = "http://localhost:8000/";

function getCurrentAccessToken() {
  const { token } = useAuth();
  return token;
}

// function getCurrentRefreshToken() {
//   // this is how you access the zustand store outside of React.
//   return useAuthStore.getState().refreshToken;
// }

// function setRefreshedTokens(tokens) {
//   console.log("set tokens...");
// }

// async function logout() {
//   console.log("logout...");
// }

export const client = createAxiosClient({
  options: {
    baseURL: BASE_URL,
    timeout: 300000,
    headers: {
      "Content-Type": "application/json",
    },
  },
  getCurrentAccessToken,
  //   getCurrentRefreshToken,
  //   refreshTokenUrl: REFRESH_TOKEN_URL,
  //   logout,
  //   setRefreshedTokens,
});
