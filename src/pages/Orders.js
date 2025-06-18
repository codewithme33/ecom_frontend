import React, { useState, useEffect } from 'react';
import { Table, Alert, Button, Modal, Badge } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [products, setProducts] = useState({}); // New state for storing product details
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

    // Fetch user's orders
    const fetchOrders = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`,
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

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">My Orders</h1>
            {loading ? (
                <Alert variant="info" className="text-center">
                    <strong>Loading orders...</strong>
                </Alert>
            ) : orders.length > 0 ? (
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead className="table-primary">
                            <tr>
                                <th>Order ID</th>
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
                                    <td>{new Date(order.orderedOn).toLocaleDateString()}</td>
                                    <td>रू{order.totalPrice}</td>
                                    <td>
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
                    <h4>You have no orders!</h4>
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
                            <strong>Ordered On:</strong>{' '}
                            {new Date(selectedOrder.orderedOn).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Total Price:</strong> रू{selectedOrder.totalPrice}
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

export default OrdersPage;
