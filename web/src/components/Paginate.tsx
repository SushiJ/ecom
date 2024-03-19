import { Link } from "react-router-dom";
import { Pagination } from "react-bootstrap";

type PaginateProps = {
  isAdmin?: boolean;
  page: number;
  pages: number;
  keyword?: string;
};

function Paginate({
  page,
  pages,
  isAdmin = false,
  keyword,
}: PaginateProps): JSX.Element {
  if (pages > 1) {
    return (
      <Pagination className="align-self-center mt-4">
        {/* TODO: Rethink this? */}
        {[...Array(pages).keys()].map((x) => (
          <Link
            to={
              isAdmin
                ? `/admin/products/${x + 1}`
                : keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : `/page/${x + 1}`
            }
            key={x + 1}
            className="me-2 link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
          >
            {isActive(page, x + 1) ? (
              <span className="fw-bold p-2">{x + 1}</span>
            ) : (
              <span className="p-2">{x + 1}</span>
            )}
          </Link>
        ))}
      </Pagination>
    );
  }
  return <></>;
}

function isActive(page: number, compare: number) {
  return compare === page ? true : false;
}

export default Paginate;
