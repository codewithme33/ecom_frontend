import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

import { Notyf } from 'notyf';

import UserContext from '../context/UserContext.js';
import ResetPassword from '../components/ResetPassword.js'

export default function ChangePassword(){


       return (
            <Container>
                <Row className="pt-4 mt-4">
                    <Col>
                        <ResetPassword />
                    </Col>
                </Row>
            </Container>
    )

}