import { Navbar, Nav, Container } from "react-bootstrap";
import { User, ShoppingCart } from "lucide-react";

export function Header() {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <Navbar.Brand href="/">Shop</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/cart" className="d-flex align-items-center">
                <ShoppingCart className="me-1" size="18" /> Cart
              </Nav.Link>
              <Nav.Link href="/signin" className="d-flex align-items-center">
                <User className="me-1" size="18" /> Sign in
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
