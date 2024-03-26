import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function NotFound() {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => Math.max(currentCount - 1, 0));
    }, 1000);
    count === 0 && navigate("/");
    return () => clearInterval(interval);
  }, [count, navigate]);

  return (
    <div>
      <h1>This Page doesn't exist</h1>
      <p>
        you'll be redirect to Home in {count}, if nothing happens{" "}
        <Link to="/" className="text-info">
          click here{" "}
        </Link>
      </p>
    </div>
  );
}

export default NotFound;
