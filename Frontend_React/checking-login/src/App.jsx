// import { useEffect } from "react";
// import AuthProvider from "./provider/authProvider";
// import Routes from "./routes";

// function App() {
//   useEffect(() => {
//     localStorage.removeItem("token");
//   }, []);

//   return (
//     <AuthProvider>
//       <Routes />
//     </AuthProvider>
//   );
// }

// export default App;

//

import React, { useState } from "react";
import axios from "axios";

function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  const login = async () => {
    try {
      axios.post("http://localhost:8000/login", {
        id: 1,
        key: "12345",
      }).then((response) => {
          console.log(response.data);
          setToken(response.data);
        });
      // setToken(response.data.access_token);
      // console.log(response.data.access_token);
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  const getUser = async () => {
    try {
      const file = {
        id: 1 // Your user ID here
      }
      const response = await axios.post(
        "http://localhost:8000/getTicketDataByUser"
       ,
        {
          "id":1
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  return (
    <div>
      <button onClick={login}>Login</button>
      <button onClick={getUser}>Get User</button>
      {user && <div>{`Hello, ${user.full_name}`}</div>}
    </div>
  );
}

export default App;
