import { useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';

import UserContext from '../context/UserContext';
import { CartContext } from '../context/CartContext';

export default function Logout(){

	 const { setCartCount } = useContext(CartContext);
	const { setUser, unsetUser } = useContext(UserContext);
	//clear the local storage
	unsetUser();
	//localStorage.clear();
	 setCartCount(0); 

	useEffect(()=>{
		setUser({
			id: null,
			isAdmin: null
		})
	})
	return(
		<Navigate to ='/login'/>
	)

}