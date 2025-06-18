import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Form, Button, InputGroup, Alert, Tooltip, OverlayTrigger, Table } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const CartPage = () => {
      const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const { setCartCount } = useContext(CartContext);
    const [quantities, setQuantities] = useState({});
    const [products, setProducts] = useState({});  // New state for storing product details
    const notyf = new Notyf();

    // Fetch user's cart
    const getCart = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`,
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
                setCart(data.cart);
                setCartCount(data.cart.cartItems.reduce((total, item) => total + item.quantity, 0));
                
                // Initialize quantities state
                const initialQuantities = {};
                data.cart.cartItems.forEach(item => {
                    initialQuantities[item.productId] = item.quantity;
                });
                setQuantities(initialQuantities);

                // Fetch product details for each productId in the cart
                fetchProductDetails(data.cart.cartItems.map(item => item.productId));
            } else {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to fetch cart.');
            }
        } catch (err) {
            notyf.error('Your Cart is Empty');
        }
    };

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

    // Delete a specific item from the cart
    const deleteCart = async (productId) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setCart(data.updatedCart);
                const updatedQuantities = { ...quantities };
                delete updatedQuantities[productId];
                setQuantities(updatedQuantities);
                const updatedCount = data.updatedCart.cartItems.reduce(
                    (total, item) => total + item.quantity,
                    0
                );
                setCartCount(updatedCount); 
                notyf.success('Item removed successfully!');
            } else {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to remove item.');
            }
        } catch (err) {
            notyf.error(err.message);
        }
    };

    // Debounced function for updating quantity
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    // Update quantity for a specific item in the cart
    const updateQuantity = async (productId, newQuantity) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ productId, newQuantity }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setCart(data.updatedCart);
                const updatedCount = data.updatedCart.cartItems.reduce(
                    (total, item) => total + item.quantity,
                    0
                );
                setCartCount(updatedCount); // Update cart count globally
                notyf.success('Quantity updated successfully!');
            } else {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to update quantity.');
            }
        } catch (err) {
            notyf.error(err.message);
        }
    };

    // Debounced function for updating quantity
    const debouncedUpdateQuantity = debounce(updateQuantity, 500);

    // Handle input change for quantity
    const updateCart = (productId, value) => {
        // Update local quantities state
        const newQuantities = { ...quantities, [productId]: value };
        setQuantities(newQuantities);

        // Call the debounced function only if the value is valid
        const newQuantity = parseInt(value, 10);
        if (newQuantity > 0) {
            debouncedUpdateQuantity(productId, newQuantity);
        }
    };

    // Clear the entire cart
    const clearCart = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setCart(data.cart);
                setQuantities({});
                setCartCount(0); // Update cart count globally
                notyf.success('Cart cleared successfully!');
            } else {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to clear cart.');
            }
        } catch (err) {
            notyf.error(err.message);
        }
    };

     // Checkout function
    const handleCheckout = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/orders/checkout`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        userId: localStorage.getItem('userId'), // Adjust this if userId is stored elsewhere
                        productsOrdered: cart.cartItems.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            subtotal: item.subtotal,
                        })),
                        totalPrice: cart.totalPrice,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                notyf.success('Order placed successfully!');
                setCart(null); // Clear cart after checkout
                setQuantities({});
                setCartCount(0); // Reset cart count globally
                navigate('/orders');
            } else {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Checkout failed.');
            }
        } catch (err) {
            notyf.error(err.message);
        }
    };


    useEffect(() => {
        getCart();
    }, []);

    return (
      <div className="container mt-5">
    <h1>My Cart</h1>

    {cart?.cartItems?.length > 0 ? (
        <>
            <Table striped bordered hover>
                <thead className="table-success">
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.cartItems.map((item) => (
                        <tr key={item.productId}>
                            <td>
                                <strong>{products[item.productId]?.name || 'Loading...'}</strong>
                            </td>
                            <td>
                                <strong>रू{products[item.productId]?.price || 'Loading...'}</strong>
                            </td>
                            <td>
                                <InputGroup>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => updateCart(item.productId, Math.max(1, quantities[item.productId] - 1))}
                                    >
                                        -
                                    </Button>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={quantities[item.productId]}
                                        onChange={(e) => updateCart(item.productId, e.target.value)}
                                        className="text-center"
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => updateCart(item.productId, quantities[item.productId] + 1)}
                                    >
                                        +
                                    </Button>
                                </InputGroup>
                            </td>
                            <td>रू{item.subtotal}</td>
                            <td>
                                <Button variant="danger" onClick={() => deleteCart(item.productId)}>
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="4" className="text-end">
                            <strong>Total Price: रू{cart.totalPrice}</strong>
                        </td>
                        <td className="text-left">
                            <Button className="bg-success" variant="primary" onClick={handleCheckout}>
                                Checkout
                            </Button>
                        </td>
                    </tr>
                </tfoot>
            </Table>
            <Button variant="warning" className="mt-3" onClick={clearCart}>
                Clear Cart
            </Button>
        </>
    ) : (
        <Alert variant="info" className="mt-5 text-center">
            <h4>Your cart is empty!</h4>
            <Link to="/products" className="btn btn-primary mt-3">
                Start Shopping
            </Link>
        </Alert>
    )}
</div>
    );
};

export default CartPage;
