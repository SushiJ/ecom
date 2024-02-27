import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useLogoutMutation } from "../features/user/slice";
import { resetCreds } from "../features/auth/slice";
import { resetCart } from "../features/cart/slice";

export function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const totalItems = useAppSelector((state) => state.cart.products.length);
  const { userInfo } = useAppSelector((state) => state.auth);

  const [logout] = useLogoutMutation();

  async function handleLogout() {
    try {
      await logout().unwrap();
      dispatch(resetCreds());
      dispatch(resetCart());
      navigate("/login");
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log(e as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast(e as any, {
        type: "error",
      });
    }
  }

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
              {/* Admin Links */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu" className="me-0">
                  <NavDropdown.Item onClick={() => navigate("/admin/products")}>
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate("/admin/orders")}>
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate("/admin/users")}>
                    Users
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {/* INFO: There's a bug where the menu is still after the user logs out, checking for name property fixes it */}
              {userInfo && userInfo.name ? (
                <NavDropdown
                  title={userInfo.name}
                  id="username"
                  className="me-0"
                >
                  <NavDropdown.Item onClick={() => navigate("/profile")}>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as="button" onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Link
                  to="/login"
                  className="d-flex align-items-center text-white text-decoration-none"
                >
                  <Icon icon="uil:signin" width="22" height="22" />
                  sign in / sign up
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
