import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card,Col,Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ProductCard({productProp}) {


    // console.log(productProp);
   
    const {_id, name, description, price } = productProp;

    // product 
    return (
        <Col className="my-2" xs={12} md={4}>
            <Card className = "cardHighlight mx-2">
                <Card.Body>
                    <Card.Title className="text-center">
                        <Link to={`/products/${_id}`}>{name}</Link>
                    </Card.Title>
                    <Card.Text>{description}</Card.Text>
                </Card.Body>
                <Card.Footer>
                    <h5 className="text-center">रू{price}</h5>
                    <Link className="btn btn-primary d-block" to={`/products/${_id}`}>Details</Link>
                </Card.Footer>
            </Card>
        </Col>

        )
}

ProductCard.propTypes = {

    productProp: PropTypes.shape({

        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired

    })
}