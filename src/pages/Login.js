import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import { Notyf } from 'notyf';

export default function Login() {
    const notyf = new Notyf();
    const { user, setUser } = useContext(UserContext);
    const { setCartCount } = useContext(CartContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);

    function authenticate(e) {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.access !== undefined) {
                    localStorage.setItem('token', data.access);
                    retrieveUserDetails(data.access);
                    setEmail('');
                    setPassword('');
                    notyf.success('Successful Login');
                } else if (data.message === 'Incorrect email or password') {
                    notyf.error('Incorrect Credentials. Try Again');
                } else {
                    notyf.error('User Not Found. Try Again.');
                }
            });
    }

    function retrieveUserDetails(token) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setUser({
                    id: data.user._id,
                    isAdmin: data.user.isAdmin,
                    firstName: data.user.firstName,
                });
            });
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            retrieveUserDetails(token);
        }
    }, []);

    useEffect(() => {
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    return user.isAdmin ? (
        <Navigate to="/products" />
    ) : user.id ? (
        <Navigate to="/" />
    ) : (
        <Container fluid className="d-flex align-items-center justify-content-center mt-5">
            <Row className="w-100">
                <Col xs={12} md={8} lg={6} xl={5} className="mx-auto">
                    <Form onSubmit={authenticate} className="p-5 shadow-lg rounded bg-light">
                        <h1 className="mb-4 text-center">Login</h1>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="p-2"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="p-2"
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={!isActive}
                            className="w-100 py-2 mb-3"
                        >
                            Login
                        </Button>
                        <div className="text-center">
                            Not a member? <Link to="/register">Register</Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
