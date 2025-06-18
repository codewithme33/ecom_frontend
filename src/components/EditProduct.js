import { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function EditProduct({ product, fetchData }) {
    const notyf = new Notyf();
    const [productId, setProductId] = useState(product._id);
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price);
    const [showEdit, setShowEdit] = useState(false);

    useEffect(() => {
        if (showEdit) {
            setProductId(product._id);
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
        }
    }, [product, showEdit]);

    const openEdit = (product) => {
        setProductId(product._id);
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setShowEdit(true);
    };

    const closeEdit = () => {
        setShowEdit(false);
        setName('');
        setDescription('');
        setPrice(0);
    };

    const editProduct = (e, productId) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            notyf.error("User is not authenticated");
            return;
        }

        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: name,
                description: description,
                price: price,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    notyf.success("Successfully Updated");
                    closeEdit();
                    fetchData();
                } else {
                    notyf.error("Something went wrong");
                    closeEdit();
                }
            })
            .catch((err) => {
                console.error(err);
                notyf.error("An error occurred");
            });
    };

    return (
        <>
            <Button variant="primary" size="sm" onClick={() => openEdit(product)}> Update </Button>
            <Modal show={showEdit} onHide={closeEdit}>
                <Form onSubmit={(e) => editProduct(e, productId)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="productName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="productDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="productPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeEdit}>Close</Button>
                        <Button variant="success" type="submit">Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}
