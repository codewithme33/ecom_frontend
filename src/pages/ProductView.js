import { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import { CartContext } from '../context/CartContext';

import UserContext from '../context/UserContext';

export default function ProductView() {
    const notyf = new Notyf();
    const { setCartCount } = useContext(CartContext);
    const { productId } = useParams();
    const { user } = useContext(UserContext); // `user` contains user information, including role
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1); // Default to 1

    const handleQuantityChange = (event) => {
        const value = Math.max(1, Number(event.target.value)); // Prevent value below 1
        setQuantity(value);
    };

    const addToCart = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                productId: productId,
                price: price,
                quantity: quantity,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                if (data.message === 'Product not found.') {
                    notyf.error('Product not found.');
                } else if (data.message === 'Item added to cart successfully') {
                    const newItemCount = data.cart.cartItems.reduce(
                        (total, item) => total + item.quantity,
                        0
                    );
                    setCartCount(newItemCount); // Update cart count globally
                    notyf.success('Added to Cart Successfully');
                    navigate('/products');
                } else {
                    notyf.error('Internal Server Error. Notify System Admin.');
                }
            });
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`)
            .then((res) => res.json())
            .then((data) => {
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
            });
    }, [productId]);

    return (
        <Container className="mt-5">
            <Table bordered responsive="md">
                <thead className="text-center table-success">
                    <tr>
                        <th className="text-center">
                            <h2>{name}</h2>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div>
                                <p>{description}</p>
                                <p>रू {price}</p>
                                <div className="d-flex  align-items-center">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                    >
                                        -
                                    </Button>
                                    <Form.Control
                                        type="number"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        className="mx-2"
                                        style={{ textAlign: 'center', width: '80px' }}
                                    />
                                    <Button
                                        variant="secondary"
                                        onClick={() => setQuantity((prev) => prev + 1)}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            {user.id !== null ? (
                                user.isAdmin === true ? (
                                    <div className="mt-3 text-danger">
                                        Admins cannot add items to the cart.
                                    </div>
                                ) : (
                                    <Button
                                        variant="primary"
                                        className="mt-3"
                                        block
                                        onClick={addToCart}
                                    >
                                        Add to Cart
                                    </Button>
                                )
                            ) : (
                                <Link className="btn btn-danger btn-block mt-3" to="/login">
                                    Log in to Add to Cart
                                </Link>
                            )}
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </Container>
    );
}
