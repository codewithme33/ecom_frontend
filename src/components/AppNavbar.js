
import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, NavLink } from 'react-router-dom';
import {FaUser,FaUserCircle, FaKey, FaSignOutAlt, FaCaretDown,  FaCartPlus, FaTachometerAlt, FaRegUser } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import UserContext from '../context/UserContext.js';

export default function AppNavbar(){

	//state to store the user information stored in the login page
	//const [user, setUser] = useState(localStorage.getItem("token"));
	//console.log(user);

	const { cartCount } = useContext(CartContext);
	const { user } = useContext(UserContext);
	// console.log(user);

	return(
		<Navbar expand="lg" className="nav-bg">
		  <Container>
		    <Navbar.Brand as={NavLink} to="/"></Navbar.Brand>
		    <Navbar.Toggle aria-controls="basic-navbar-nav" />
		    <Navbar.Collapse id="basic-navbar-nav">
		      <Nav className="me-auto">
		      {(user.isAdmin) ?
		      <>
		        <Nav.Link as={NavLink} to="/products" exact="true">Dashboard</Nav.Link>
		         <Nav.Link as={Link} to="/addproduct">Add Product</Nav.Link>
		          <Nav.Link as={Link} to="/all-orders">Orders</Nav.Link>
		          <Nav.Link as={Link} to="/user-management">Users</Nav.Link>
		      </>
		      :
		      <>
		      <Nav.Link as={NavLink} to="/" exact="true">Home</Nav.Link>
		      <Nav.Link as={NavLink} to="/products" exact="true">Products</Nav.Link>
		      </>
		      }
		        </Nav>
		        <Nav>

		        {(user.id !== null) ? 
                    user.isAdmin 
                        ?
                        <>
                       
			               <NavDropdown
			                 title={
			                   <div className="d-flex align-items-center">
			                     <FaUserCircle size={18} className="mx-auto" />
			                     <span>Hi! {user.firstName}</span>
			                     {/* Custom dropdown caret */}
			                     <span className="ml-auto">
			                       <FaCaretDown size={18} />
			                     </span>
			                   </div>
			                 }
			                 id="basic-nav-dropdown"
			                 className="justify-content-end mr-auto"
			               >
							 	<Nav.Link as={NavLink} to="/profile" exact="true"><FaUser style={{ marginRight: '8px' }} />Profile</Nav.Link>
                          	 	<Nav.Link as={NavLink} to="/changepassword" exact="true" ><FaKey style={{ marginRight: '8px' }} />Change Password</Nav.Link>
                          	   	<NavDropdown.Divider />
                          	 	<Nav.Link as={NavLink} to="/logout" exact="true"> <FaSignOutAlt style={{ marginRight: '8px' }} />Logout</Nav.Link>
                          	</NavDropdown>  
                          	
              </>
                        :
                        <>
                       		 <Nav.Link as={Link} to="/cart">My Cart {cartCount > 0 && <span>({cartCount})</span>}</Nav.Link>
                       		 <Nav.Link as={Link} to="/orders">My Orders</Nav.Link>
                        	<NavDropdown title={
                        		<div className="d-flex align-items-center"><FaUserCircle size={18} className="mr-2" />
        						<span>Hi,{user.firstName}</span>  <span className="ml-auto">
			                       <FaCaretDown size={18} />
			                     </span>
      							</div>} id="basic-nav-dropdown" className="justify-content-end">
                        	 	<Nav.Link as={NavLink} to="/profile" exact="true"><FaUser style={{ marginRight: '8px' }} />Profile</Nav.Link>
                        	 	<Nav.Link as={NavLink} to="/changepassword" exact="true" ><FaKey style={{ marginRight: '8px' }} />Change Password</Nav.Link>
                        	   	<NavDropdown.Divider />
                        	 	<Nav.Link as={NavLink} to="/logout" exact="true"> <FaSignOutAlt style={{ marginRight: '8px' }} />Logout</Nav.Link>
                        	</NavDropdown>                            
                        </>
                    :
                    <>
                        <Nav.Link as={NavLink} to="/login" exact="true">Login</Nav.Link>
                        <Nav.Link as={NavLink} to="/register" exact="true">Register</Nav.Link>
                    </>
                }
         
		      </Nav>
		    </Navbar.Collapse>
		  </Container>
		</Navbar>
	)

}