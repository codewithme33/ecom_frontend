import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';

import UserContext from '../context/UserContext';

import { Notyf } from 'notyf';

export default function Register() {
    const notyf = new Notyf();

    const { user } = useContext(UserContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (
            firstName &&
            lastName &&
            email &&
            mobileNo &&
            password &&
            confirmPassword &&
            password === confirmPassword &&
            mobileNo.length === 10
        ) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

    function registerUser(e) {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                mobileNo,
                password
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === "User registered successfully") {
                    setFirstName('');
                    setLastName('');
                    setEmail('');
                    setMobileNo('');
                    setPassword('');
                    setConfirmPassword('');

                    notyf.success("Registration successful");
                } else {
                    notyf.error(data.message || "Registration failed. Please try again.");
                }
            })
            .catch(err => {
                notyf.error("An error occurred. Please try again later.");
                console.error("Error:", err);
            });
    }

    return (
        user.id !== null ? (
            <Navigate to="/" />
        ) : (
            <Container fluid className="d-flex align-items-center justify-content-center mt-3">
                <Row className="w-100">
                    <Col xs={12} md={8} lg={6} xl={5} className="mx-auto">
                        <Form onSubmit={registerUser} className="p-4 shadow-lg rounded bg-light">
                            <h1 className="text-center">Register</h1>
                            <Form.Group>
                                <Form.Label>First Name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter First Name"
                                    required
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Last Name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Last Name"
                                    required
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Email:</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter Email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Mobile No:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter 11 Digit No."
                                    required
                                    value={mobileNo}
                                    onChange={e => setMobileNo(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password:</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter Password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Confirm Password:</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm Password"
                                    required
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                            </Form.Group>
                            {isActive ? (
                                <Button variant="primary" type="submit" id="submitBtn">
                                    Submit
                                </Button>
                            ) : (
                                <Button variant="danger" type="submit" id="submitBtn" disabled>
                                    Enter the details
                                </Button>
                            )}
                            <div className="text-center">
                                Already have an account? <Link to="/login">Click here</Link> to log in.
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    );
}
