import { useState, useEffect, useContext } from 'react';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import UserContext from '../context/UserContext';


export default function Products() {

    const {user} = useContext(UserContext);
    const [products, setProducts] = useState([]);


    const fetchData = () => {

      let fetchUrl = user.isAdmin === true ? `${process.env.REACT_APP_API_BASE_URL}/products/all` : `http://ec2-3-16-131-196.us-east-2.compute.amazonaws.com/b5/products/active`

            fetch(fetchUrl, {
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            }
        })
        .then(res => res.json())
        .then(data => {

            setProducts(data);

        });
    }

    useEffect(() => {

        fetchData()

    }, [user]);
    // console.log(user);
    

       return(
         user.isAdmin ===true
    ? <AdminView productsData={products} fetchData={fetchData} />
    : <UserView productsData={products} />
    )
}