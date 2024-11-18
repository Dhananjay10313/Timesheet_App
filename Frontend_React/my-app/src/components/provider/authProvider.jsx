import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken_] = useState("k");
  const [userState,setUserState_] = useState({"uid":1})
  const [route,setRoute] = useState("/dashboard")

  const setToken = (newToken) => {
    setToken_(newToken);
  };

  const setUserState = (newUserState) => {
    setUserState_(newUserState);
  }

  // useEffect(() => {
  //   if (token) {
  //     axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  //     localStorage.setItem("token", token);
  //   } else {
  //     delete axios.defaults.headers.common["Authorization"];
  //     localStorage.removeItem("token");
  //   }
  // }, [token]);

  // console.log({ token, userState, route }); // Debugging line

  
  return (
    <AuthContext.Provider value={{token, setToken, userState, setUserState, route, setRoute}}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
