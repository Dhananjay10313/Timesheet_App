import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { useAuth } from '../provider/authProvider';
import { ToastContainer, toast } from "react-toastify";
import './LoginForm.css'; // Import custom CSS for additional styling

function LoginForm({ Authenticate }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { userState, setUserState, setToken } = useAuth();

    useEffect(() => {
        console.log("userState2", userState);

    }, [userState]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log("Username:", username);
        //console.log("Password:", password);

        try {
            const response = await axios.post(
                "http://localhost:8000/token",
                {
                    id: parseInt(username),
                    key: password
                }
            );

            //console.log(response.data);
            const token = response.data.access_token;
            localStorage.setItem('token', token);
            //console.log("tokeeen", localStorage.getItem('token'));
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
            //console.log(ret1.data);
            setUserState(ret1.data);
            //console.log("userState1", userState);
            localStorage.setItem("bnStatus", JSON.stringify(false))
            Authenticate();
            
        } catch (error) {
            console.error("Error during authentication:", error);
            toast.error("Invalid Credentials");
        }
    };

    return (
        
        <Container className="login-container">
            <ToastContainer />
            <Row className="justify-content-md-center">
                <Col md={6} lg={4}>
                    <Card className="login-card">
                        <Card.Body>
                            <Card.Title className="text-center">Login</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Employee ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Employee ID"
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
                                <Button variant="primary" type="submit" className="w-100 mt-3">
                                    Submit
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginForm;
