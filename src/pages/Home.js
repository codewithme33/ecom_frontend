import {useContext, useEffect } from 'react';
import Banner from '../components/Banner.js';
import FeaturedProducts from '../components/FeaturedProducts.js';
import { CartContext } from '../context/CartContext';

export default function Home() {
      const { fetchCartData } = useContext(CartContext);
    const data = {
        title: "Kinni Ho",
        content: "Ghar basi basi saman kinum !",
        destination: "/products",
        buttonLabel: "View Products!"
    }
      useEffect(() => {
        fetchCartData(); // Refresh cart data on Home.js load
    }, [fetchCartData]);

    return (
        <>
            <Banner data={data}/>
            <FeaturedProducts/>
        </>
    )
}