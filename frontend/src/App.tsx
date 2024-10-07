import { Container, Nav, Navbar } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { ToggleButton } from "./components/ToogleBtn";

function App() {
  return (
    <div className="d-flex flex-column vh-full ">
      <header>
        <Navbar expand="lg">
          <Container>
            <Navbar.Brand>tsamazona</Navbar.Brand>
          </Container>
          <Nav>
            <a href="/cart" className="nav-link">
              Cart
            </a>
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
