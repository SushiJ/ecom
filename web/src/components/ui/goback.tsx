import { Link } from "react-router-dom";

export function GoBack(props: { to: string }) {
  return (
    <Link
      className="text-xs italic bg-neutral-200 px-2 py-1 rounded shadow-md"
      to={props.to}
    >
      Go Back
    </Link>
  );
}
