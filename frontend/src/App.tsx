import { Badge, Container, Nav, Navbar } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { ToggleButton } from "./components/ToogleBtn";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux"; // Import useSelector
import { RootState } from "./store"; // Import RootState
import { LinkContainer } from "react-router-bootstrap";

function App() {
  const cart = useSelector((state: RootState) => state.cart); // Access the cart state

  return (
    <div className="d-flex flex-column vh-full">
      <ToastContainer position="bottom-center" limit={1} />
      <header>
        <Navbar expand="lg">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>tsamazona</Navbar.Brand>
            </LinkContainer>
            <Nav>
              <Link to="/cart" className="nav-link">
                {" "}
                {/* Change href to to */}
                Cart
                {cart.cartItems.length > 0 && (
                  <Badge pill bg="danger">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                    {/* Correctly access the quantity */}
                  </Badge>
                )}
              </Link>
              <Link to="/signin" className="nav-link">
                {" "}
                {/* Change href to to */}
                Sign In
              </Link>
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
        <div className="text-center">All rights reserved</div>{" "}
        {/* Fixed spelling */}
      </footer>
    </div>
  );
}

export default App;
