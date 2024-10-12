import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "./provider/authProvider";
import login from "./services/services";
import { client } from "./services/axiosClient";
import axios from "axios";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const { token, setToken } = useAuth();
  console.log(token);
  // localStorage.removeItem("token");
  // const formData = {
  //   username: "johndoe",
  //   email: "johndoe@example.com",
  //   full_name: "fullName",
  //   disabled: true,
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username);
    // client
    //   .post("/token", {
    //     // Send as object directly
    //     username: "johndoe", // Access username from component state (assuming it's stored)
    //     email: "johndoe@example.com",
    //     full_name: "fullName",
    //     disabled: true,
    //   })
    //   .then((response) => {
    //     console.log(response.data);
    //     setToken(response.data);
    //   });

    axios
      .post("http://localhost:8000/token", formData, {
        "Content-Type": "application/x-www-form-urlencoded",
      })
      .then((response) => {
        console.log(response.data);
        const kl = response.data;
        setToken(kl.access_token);
      });

    // axios.get("http://localhost:5000/users/me/items/", {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });

    // axios
    //   .get("http://localhost:8000/getTicketDataByUser", {
    //     token:
    //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBpZCI6MX0.P0IbUHII1o7fU5P56UfL3KSXrJ_NBL3M5Gf8DGyK4bY",
    //   })
    // .then((response) => {
    //   console.log(response.data);
    //   setToken(response.data);
    // });
  };
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
            </Form.Group>{" "}
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
            </Button>{" "}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;
