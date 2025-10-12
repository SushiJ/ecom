import { Link } from "react-router-dom";

export function GoBack(props: { to: string }) {
  return (
    <Link
      className="text-xs italic bg-neutral-200 dark:text-neutral-900 dark:bg-neutral-50 px-2 py-1 rounded shadow-md"
      to={props.to}
    >
      Go Back
    </Link>
  );
}
