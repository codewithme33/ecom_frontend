import React, { useState, useEffect } from 'react';
import { Table, Alert, Button, Modal, Badge, Dropdown, DropdownButton } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [products, setProducts] = useState({}); // State for storing product details
    const [users, setUsers] = useState({}); // State for storing user details
    
    const notyf = new Notyf();



    // Fetch product details by productIds
    const fetchProductDetails = async (productIds) => {
        try {
            const productDetails = {};
            for (const productId of productIds) {
                const response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/products/${productId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                if (response.ok) {
                    const product = await response.json();
                    productDetails[productId] = product;
                } else {
                    notyf.error('Failed to fetch product details.');
                }
            }
            setProducts(productDetails);
        } catch (err) {
            notyf.error(err.message);
        }
    };

//fetchning user
    const fetchUserDetails = async (userIds) => {
    try {
        const userDetails = {};
        const promises = userIds.map(userId => 
            fetch(`${process.env.REACT_APP_API_BASE_URL}/users/detail/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json',
                 Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            .then(response => response.json())
            .then(user => {
                // console.log(user);
                userDetails[userId] = `${user.user.firstName} ${user.user.lastName}`;
            })
            .catch(() => {
                notyf.error('Failed to fetch user details.');
            })
        );
       
        await Promise.all(promises); // Wait for all requests to finish
        setUsers(userDetails); // Store the fetched user details
        // console.log(userDetails);
    } catch (err) {
        notyf.error(err.message); // Error handling
    }
};


    // Fetch all orders (admin endpoint)
    const fetchOrders = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/orders/all-orders`,
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
                setOrders(data.orders || []);

                // Collect all product IDs across orders and fetch their details
                const productIds = data.orders
                    .flatMap(order => order.productsOrdered.map(product => product.productId));
                fetchProductDetails(productIds);

                // Collect all user IDs across orders and fetch their details
                const userIds = [...new Set(data.orders.map(order => order.userId))];
                fetchUserDetails(userIds);
            } else {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to fetch orders.');
            }
        } catch (err) {
            notyf.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    // Update the status of an order
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/orders/update-status/${orderId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                notyf.success("Order status updated successfully!");
                // Update the order in the local state
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === data.order._id ? data.order : order
                    )
                );
            } else {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to update order status.');
            }
        } catch (err) {
            notyf.error(err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">All Orders</h1>
            {loading ? (
                <Alert variant="info" className="text-center">
                    <strong>Loading orders...</strong>
                </Alert>
            ) : orders.length > 0 ? (
                <div className="table-responsive vh-100">
                    <Table striped bordered hover >
                        <thead className="table-success">
                            <tr>
                                <th>Order ID</th>
                                <th>Customer Name</th>
                                <th>Ordered On</th>
                                <th>Total Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{users[order.userId] || 'Loading...'}</td>
                                    <td>{new Date(order.orderedOn).toLocaleDateString()}</td>
                                    <td>रू{order.totalPrice}</td>
                                    <td>
                                        <DropdownButton 
                                            id={`dropdown-status-${order._id}`}
                                            title={ 
                                                <Badge
                                                    bg={
                                                        order.status === 'Pending'
                                                            ? 'warning'
                                                            : order.status === 'Completed'
                                                            ? 'success'
                                                            : 'danger'
                                                    }
                                                    text={order.status === 'Pending' ? 'dark' : ''}
                                                >
                                                    {order.status}
                                                </Badge>
                                            }
                                            variant="light"
                                        >
                                            <Dropdown.Item
                                                onClick={() => updateOrderStatus(order._id, 'Pending')}
                                            >
                                                Pending
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                onClick={() => updateOrderStatus(order._id, 'Completed')}
                                            >
                                                Completed
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                                            >
                                                Cancelled
                                            </Dropdown.Item>
                                        </DropdownButton>
                                    </td>
                                    <td>
                                        <Button
                                            variant="info"
                                            onClick={() => handleViewDetails(order)}
                                        >
                                            View Details
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            ) : (
                <Alert variant="warning" className="mt-5 text-center">
                    <h4>No orders found!</h4>
                </Alert>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <Modal show={showModal} onHide={closeModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Order Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>Order ID: {selectedOrder._id}</h5>
                        <p>
                            <strong>Customer Name:</strong> {users[selectedOrder.userId] || 'Loading...'}
                        </p>
                        <p>
                            <strong>Ordered On:</strong>{' '}
                            {new Date(selectedOrder.orderedOn).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Total Price:</strong> रू{selectedOrder.totalPrice}
                        </p>
                        <p>
                            <strong>Status:</strong>{' '}
                            <Badge
                                bg={
                                    selectedOrder.status === 'Pending'
                                        ? 'warning'
                                        : selectedOrder.status === 'Completed'
                                        ? 'success'
                                        : 'danger'
                                }
                                text={selectedOrder.status === 'Pending' ? 'dark' : ''}
                            >
                                {selectedOrder.status}
                            </Badge>
                        </p>
                        <h6 className="mt-3">Products Ordered:</h6>
                        <ul className="list-group">
                            {selectedOrder.productsOrdered.map((product, index) => (
                                <li className="list-group-item" key={index}>
                                    <strong>Product Name:</strong> {products[product.productId]?.name || 'Loading...'} <br />
                                    <strong>Quantity:</strong> {product.quantity} <br />
                                    <strong>Subtotal:</strong> रू{product.subtotal}
                                </li>
                            ))}
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default AdminOrdersPage;
