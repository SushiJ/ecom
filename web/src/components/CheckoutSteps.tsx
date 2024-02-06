import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CheckoutSteps = ({
  step1 = false,
  step2 = false,
  step3 = false,
  step4 = false,
}: {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
}) => {
  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item>
        {step1 ? (
          <Link to="/login" className="text-decoration-none">
            Sign In
          </Link>
        ) : (
          <p className="opacity-50">Sign In</p>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <Link to="/shipping" className="text-decoration-none">
            Shipping
          </Link>
        ) : (
          <p className="opacity-50">Shipping</p>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <Link to="/payment" className="text-decoration-none">
            Payment
          </Link>
        ) : (
          <p className="opacity-50">Payment</p>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <Link to="/placeorder" className="text-decoration-none">
            Place order
          </Link>
        ) : (
          <p className="opacity-50">Place order</p>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
