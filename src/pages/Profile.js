import { useState, useEffect, useContext } from 'react';
import { Container, Row } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

import { Notyf } from 'notyf';

import UserContext from '../context/UserContext';

export default function Profile(){

    const notyf = new Notyf();

    const {user}  = useContext(UserContext);

    const [details, setDetails] = useState({});
    

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            }
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            // Set the user states values with the user details upon successful login.
            if (typeof data !== undefined) {

            setDetails(data.user);
            // console.log(data.user);

            } else if (data.error === "User not found") {

                notyf.error("User Not Found")

            } else {

                notyf.error("Something Went Wrong. Contact Your System Admin.")
            }
        });
    }, [])
   
    return (
        (user.id === null) ?
            <Navigate to="/" />
            :
            <Container>
                <Row className="mt-5 p-5 bg-primary text-white">
                    <h1 className="mb-5 ">Profile</h1>
                    <h2 className="mt-3">{`${details.firstName} ${details.lastName}`}</h2>
                    <hr />
                    <h4>Contacts</h4>
                    <ul>
                        <li>Email: {details.email}</li>
                        <li>Mobile No: {details.mobileNo}</li>
                    </ul>
                </Row>
            </Container>
    )

}