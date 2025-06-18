import React, { useEffect, useState } from 'react';
import { Table, Button, Alert, Spinner, Pagination } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [usersPerPage] = useState(10); // Define users per page
    const notyf = new Notyf();

    // Fetch all users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/users/all-users`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setUsers(data.users || []);
            } else {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to fetch users.');
            }
        } catch (error) {
            notyf.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Set user as admin
    const makeAdmin = async (userId) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/set-as-admin`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.ok) {
                const updatedUser = await response.json();
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === updatedUser.updatedUser._id
                            ? { ...user, isAdmin: true }
                            : user
                    )
                );
                notyf.success('User promoted to admin successfully!');
            } else {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to update user.');
            }
        } catch (error) {
            notyf.error(error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(users.length / usersPerPage);

    // Render pagination
    const renderPagination = () => {
        let items = [];
        for (let page = 1; page <= totalPages; page++) {
            items.push(
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                >
                    {page}
                </Pagination.Item>
            );
        }
        return (
            <Pagination className="justify-content-center">
                <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                />
                {items}
                <Pagination.Next
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                />
            </Pagination>
        );
    };

    return (
        <div className="container mt-5">
            <h1>Registered Users</h1>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : users.length > 0 ? (
                <>
                    <Table striped bordered hover>
                        <thead className="table-success">
                            <tr>
                                <th>S.No</th>
                                <th>Full Name</th>
                                <th>Mobile Number</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{indexOfFirstUser + index + 1}</td>
                                    <td>{`${user.firstName} ${user.lastName}`}</td>
                                    <td>{user.mobileNo}</td>
                                    <td>{user.email}</td>
                                    <td>{user.isAdmin ? 'Admin' : 'Normal User'}</td>
                                    <td>
                                        {!user.isAdmin && (
                                            <Button
                                                variant="success"
                                                onClick={() => makeAdmin(user._id)}
                                            >
                                                Make Admin
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {renderPagination()}
                </>
            ) : (
                <Alert variant="info">No users found!</Alert>
            )}
        </div>
    );
};

export default UserManagement;
