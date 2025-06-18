import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function UpdateProfile({ fetchData, userDetails }) {
    const notyf = new Notyf();

    // Form state with mobileNo
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobileNo: '' 
    });

    // Populate form data with userDetails when it changes
    useEffect(() => {
        if (userDetails) {
            setFormData({
                firstName: userDetails.firstName || '',
                lastName: userDetails.lastName || '',
                mobileNo: userDetails.mobileNo || '' 
            });
        }
    }, [userDetails]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        })
        .then((res) => res.json())
        .then((data) => {
            if (data && data._id) {
                notyf.success('Profile updated successfully!');
                fetchData(); // Refresh user details
            } else {
                notyf.error(data.message || 'Error updating profile.');
            }
        })
        .catch(() => {
            notyf.error('Failed to connect to the server.');
        });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h3 className="mb-4">Update Profile</h3>
            <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="mobileNo">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Mobile Number"
                    name="mobileNo" 
                    value={formData.mobileNo}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Update Profile
            </Button>
        </Form>
    );
}
