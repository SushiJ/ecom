// import { Nav } from "react-bootstrap";
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
    <ul className="flex justify-center space-x-4">
      <li>{step1 ? <Link to="/login">Sign In</Link> : <p className="opacity-50">Sign In</p>}</li>
      <li>
        {step2 ? <Link to="/shipping">Shipping</Link> : <p className="opacity-50">Shipping</p>}
      </li>
      <li>{step3 ? <Link to="/payment">Payment</Link> : <p className="opacity-50">Payment</p>}</li>
      <li>
        {step4 ? (
          <Link to="/placeorder">Place order</Link>
        ) : (
          <p className="opacity-50">Place order</p>
        )}
      </li>
    </ul>
  );
};

export default CheckoutSteps;
