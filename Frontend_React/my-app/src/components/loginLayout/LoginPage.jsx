// import React, { useState, useEffect } from "react";
// import { Form, Button, Container, Row, Col } from "react-bootstrap";
// import axios from "axios";
// import {useAuth} from '../provider/authProvider' 

// function LoginForm({Authenticate}) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   // const {setToken,setUserState} = useAuth()

//   // const { token, setUserState } = useAuth();
//   const { userState,setUserState, setToken } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Handle login logic here
//     console.log("Username:", username);
//     console.log("Password:", password);
//     const response = await axios.post(
//       "http://localhost:8000/token",
//       {
//         id:parseInt(username),
//         key:password
//       }
//     )


//     Authenticate()
//     console.log(response.data)
//     const token = response.data.access_token;
//     localStorage.setItem('token', token); 
//     console.log("tokeeen",localStorage.getItem('token')); 
//     setToken(token)

//     const ret1 = await axios.post(
//       "http://localhost:8000/getUserInfo",
//       {
//         emp_id:parseInt(username),
//         password:password
//       },
//       {headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json',
//     }},
//     ).then((ret1)=>{
//       console.log(ret1.data)

//       setUserState(ret1.data)
//       console.log("userState1", userState)
//     })
    
//   };


//   useEffect(() => {
//     console.log("userState2", userState);
// }, [userState]);


//   return (
//     <Container>
//       <Row className="justify-content-md-center">
//         <Col md={4}>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group controlId="formBasicEmail">
//               <Form.Label>Username</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </Form.Group>{" "}
//             <Form.Group controlId="formBasicPassword">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </Form.Group>
//             <Button variant="primary" type="submit">
//               Submit
//             </Button>{" "}
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default LoginForm;


import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useAuth } from '../provider/authProvider';

function LoginForm({ Authenticate }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { userState, setUserState, setToken } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Username:", username);
        console.log("Password:", password);

        try {
            const response = await axios.post(
                "http://localhost:8000/token",
                {
                    id: parseInt(username),
                    key: password
                }
            );

            Authenticate();
            console.log(response.data);
            const token = response.data.access_token;
            localStorage.setItem('token', token);
            console.log("tokeeen", localStorage.getItem('token'));
            setToken(token);

            const ret1 = await axios.post(
                "http://localhost:8000/getUserInfo",
                {
                    emp_id: parseInt(username),
                    password: password
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            const data = ret1.data;
            localStorage.setItem('userData', JSON.stringify(data));
            console.log(ret1.data);
            setUserState(ret1.data);
            console.log("userState1", userState);
            localStorage.setItem()
        } catch (error) {
            console.error("Error during authentication:", error);
        }
    };

    useEffect(() => {
        console.log("userState2", userState);
    }, [userState]);

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={4}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginForm;
