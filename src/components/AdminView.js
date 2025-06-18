import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EditProduct from './EditProduct.js';

import ArchiveProduct from './ArchiveProduct';

export default function AdminView({ productsData, fetchData }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // console.log(productsData);

        const productsArr = productsData.map(product => (
            <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td className={product.isActive ? "text-success" : "text-danger"}>
                    {product.isActive ? "Available" : "Unavailable"}
                </td>
                <td>
                    <EditProduct product={product} fetchData={fetchData} />
                </td>
                <td className="text-center">
                   
                    <ArchiveProduct productId={product._id} isActive={product.isActive} fetchData={fetchData} />
                </td>
            </tr>
        ));
        

        setProducts(productsArr);
    }, [productsData]);

    return (
        <>
            <h1 className="text-center my-4">Admin Dashboard</h1>
             <section className="text-center">
             <Button className="mb-2 btn-block me-2 bg-primary"><Link className="text-light text-decoration-none" to="/addproduct">Add New Product</Link></Button> 
             <Button className="mb-2 btn-block bg-success"><Link className="text-light text-decoration-none" to="/all-orders">Show User Orders</Link></Button> 
             </section>
            
            <Table striped bordered hover responsive>
                <thead className="table-success">
                    <tr className="text-center">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Availability</th>
                        <th colSpan="2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products}
                </tbody>
            </Table>    
        </>
    );
}
