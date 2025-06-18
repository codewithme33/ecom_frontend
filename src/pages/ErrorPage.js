import React from 'react';
import Banner from '../components/Banner.js';

const ErrorPage = () => {
    const data = {
        title: '404 - Not Found',
        content: 'The page you are looking for cannot be found.',
        destination: '/',
        buttonLabel: 'Back home'
    };

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <Banner data={data} />
        </div>
    );
};

export default ErrorPage;
