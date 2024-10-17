import { client } from "./axiosClient";

import { useAuth } from "../provider/authProvider";
import { useState } from "react";

export default function login({ username, password }) {
  //   const { token, setToken } = useAuth();
  const [ak, kl] = useState();

  //   console.log(id);

  //   console.log(empid);

  return client
    .post(
      "/login",
      {
        id: username,
        key: password,
      },
      { authorization: false }
    )
    .then((response) => {
      console.log(response.data);
      setToken(response.data);
    });
}
