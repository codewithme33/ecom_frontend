import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    const fetchCartData = async () => {
        try {
            const response = await fetch(
                `	http://ec2-3-16-131-196.us-east-2.compute.amazonaws.com/b5/cart/get-cart`,
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
                const totalItems = data.cart.cartItems.reduce(
                    (total, item) => total + item.quantity,
                    0
                );
                setCartCount(totalItems);
            }
        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
    };

    // Fetch cart data whenever the component mounts
    useEffect(() => {
        fetchCartData();
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, setCartCount, fetchCartData }}>
            {children}
        </CartContext.Provider>
    );
};
