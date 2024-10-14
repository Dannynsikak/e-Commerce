import { Badge, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { ToggleButton } from "./components/ToogleBtn";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux"; // Import useSelector and useDispatch
import { RootState } from "./store"; // Import RootState
import { LinkContainer } from "react-router-bootstrap";
import { signOut } from "./slices/userSlice";
import { resetCart } from "./slices/CartSlice";

function App() {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  // Define a handler for signing out
  const handleSignOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevented default anchor behavior
    dispatch(signOut()); // Dispatch the signOut action
    dispatch(resetCart()); // Clear the cart on sign out
  };

  return (
    <div className="d-flex flex-column vh-100">
      <ToastContainer position="bottom-center" limit={1} />
      <header>
        <Navbar expand="lg">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>tsamazona</Navbar.Brand>
            </LinkContainer>
            <Nav>
              <Link to="/cart" className="nav-link">
                Cart
                {cart.cartItems.length > 0 && (
                  <Badge pill bg="danger">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                  </Badge>
                )}
              </Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                  <Link
                    to="#signout"
                    className="dropdown-item"
                    onClick={handleSignOut} // Use the handler here
                  >
                    Sign Out
                  </Link>
                </NavDropdown>
              ) : (
                <Link className="nav-link" to="/signin">
                  Sign In
                </Link>
              )}
              <ToggleButton />
            </Nav>
          </Container>
        </Navbar>
      </header>
      <main>
        <Container className="mt-3">
          <Outlet />
        </Container>
      </main>
      <footer>
        <div className="text-center">All rights reserved</div>
      </footer>
    </div>
  );
}

export default App;
