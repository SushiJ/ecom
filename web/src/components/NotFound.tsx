import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function NotFound() {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(currentCount => Math.max(currentCount - 1, 0));
    }, 1000);
    count === 0 && navigate("/");
    return () => clearInterval(interval);
  }, [count, navigate]);

  return (
    <section className="h-full grid place-items-center">
      <div className="space-y-2">
        <h1>Uh, oh</h1>
        <h1>{location.pathname} is not a page on shoppee.com</h1>
        <p>
          you'll be redirect to Home in {count} seconds, if nothing happens please{" "}
          <Link to="/" className="text-info underline font-semibold">
            click here
          </Link>
        </p>
      </div>
    </section>
  );
}

export default NotFound;
