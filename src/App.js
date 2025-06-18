import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import AppNavbar from './components/AppNavbar.js';
import Register from './pages/Register.js';
import Login from './pages/Login.js';
import Logout from './pages/Logout.js';
import Profile from './pages/Profile';
import Products from './pages/Product';
import ProductView from './pages/ProductView.js';
import Home from './pages/Home.js';
import ChangePassword from './pages/ChangePassword.js';
import AddProduct from './pages/AddProduct.js';
import Cart from './pages/CartPage.js';
import { CartProvider } from './context/CartContext';
import Orders from './pages/Orders.js';
import Allorders from './pages/AdminOrder.js';
import UserManagement from './pages/UserManagement.js';

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
    firstName: null,
  });

  function unsetUser() {
    localStorage.clear();
  }

  // This useEffect should check if the token exists and fetch the user details.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.user) {
            setUser({
              id: data.user._id,
              isAdmin: data.user.isAdmin,
              firstName: data.user.firstName,
            });
          } else {
            unsetUser(); // If no user found, clear the session
          }
        })
        .catch(() => unsetUser()); // In case of error, clear the session
    }
  }, []); // Only runs once on mount

  return (
    <CartProvider>
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<ProductView />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/cart" element={<Cart />}/>
            <Route path="/orders" element={<Orders />} />
            <Route path="/all-orders" element={<Allorders />} />
            <Route path="/user-management" element={<UserManagement />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
    </CartProvider>
  );
}

export default App;
