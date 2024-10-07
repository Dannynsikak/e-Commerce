import { Badge, Container, Nav, Navbar } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { ToggleButton } from "./components/ToogleBtn";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, calculatePrices } from "./slices/CartSlice";
import { AppDispatch, RootState } from "./store";
import { CartItem } from "./types/Cart";

function App() {
  const dispatch: AppDispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);

  const handleAddItem = (item: CartItem) => {
    dispatch(addItemToCart(item));
    dispatch(calculatePrices()); // Recalculate prices after adding item
  };

  return (
    <div className="d-flex flex-column vh-full ">
      <header>
        <Navbar expand="lg">
          <Container>
            <Navbar.Brand>tsamazona</Navbar.Brand>
          </Container>
          <Nav>
            <Link href="/cart" className="nav-link">
              Cart
              {cart.cartItems.length > 0 && (
                <Badge pill bg="danger">
                  {" "}
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                </Badge>
              )}
            </Link>
            <a href="/signin" className="nav-link">
              Sign In
            </a>
            <ToggleButton />
          </Nav>
        </Navbar>{" "}
      </header>
      <main>
        <Container className="mt-3">
          <Outlet />{" "}
        </Container>
      </main>
      <footer>
        <div className="text-center">All right reserverd</div>
      </footer>
    </div>
  );
}

export default App;
