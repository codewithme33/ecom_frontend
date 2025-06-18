import React from 'react';
import { Button } from 'react-bootstrap';
import {Notyf} from 'notyf';

export default function ArchiveProduct({ productId, isActive, fetchData }) {
    
    // console.log(productId);
    // console.log(isActive);

    const notyf = new Notyf();

    
    const archiveToggle = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/archive`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productId })
            });
            const data = await response.json();
            if (response.ok) {
                notyf.success(data.message || 'Successfully Disabled');
                fetchData(); // Refresh data in the AdminView
            } else {
                notyf.error(data.message || 'Failed to archive product.');
            }
        } catch (error) {
            notyf.error('An error occurred.');
            // console.error(error);
        }
    };

    
    const activateToggle = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/activate`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productId })
            });
            const data = await response.json();
            if (response.ok) {
                notyf.success(data.message || 'Successfully Activated');
                fetchData(); // Refresh data in the AdminView
            } else {
                notyf.error(data.message || 'Failed to activate product.');
            }
        } catch (error) {
            notyf.error('An error occurred.');
            // console.error(error);
        }
    };

    return (
        <Button
            variant={isActive ? "danger" : "success"}
            onClick={isActive ? archiveToggle : activateToggle}
        >
            {isActive ? "Disable" : "Activate"}
        </Button>
    );
}
