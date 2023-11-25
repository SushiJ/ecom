import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { Icon } from "@iconify/react";

import { useAppSelector } from "../hooks/redux";

export function Header() {
  const totalItems = useAppSelector((state) => state.cart.products.length);
  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="md" collapseOnSelect>
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
                {totalItems > 0 && (
                  <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                    {totalItems}
                  </Badge>
                )}
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
