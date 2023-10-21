import { Navbar, Nav, Container } from "react-bootstrap";
import { Icon } from "@iconify/react";
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
                <Icon
                  icon="fluent:shopping-bag-16-regular"
                  width="24"
                  height="24"
                />
                Cart
              </Link>
              <Link
                to="/signin"
                className="d-flex align-items-center text-white text-decoration-none"
              >
                <Icon icon="fluent:person-12-regular" width="24" height="24" />
                Sign in
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
