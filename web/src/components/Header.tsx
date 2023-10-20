import { Navbar, Nav, Container } from "react-bootstrap";
import { User, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <Navbar.Brand>
            <Link to="/" className="text-decoration-none text-white">
              Shop
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Link
                to="/cart"
                className="d-flex align-items-center text-white text-decoration-none"
              >
                <ShoppingCart className="me-1" size="18" /> Cart
              </Link>
              <Link
                to="/signin"
                className="d-flex align-items-center text-white text-decoration-none"
              >
                <User className="me-1" size="18" /> Sign in
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
