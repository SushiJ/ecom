type PaginateProps = {
	isAdmin?: boolean;
	page: number;
	pages: number;
	keyword?: string;
};

import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

function Paginate(props: PaginateProps) {
	const { pathname } = useLocation();

	return (
		<Pagination className="mt-4">
			<PaginationContent className="space-x-2">
				{[...Array(props.pages).keys()].map((x) => (
					<PaginationItem key={x}>
						<Link
							className={cn(
								"py-2 px-3 hover:bg-neutral-100",
								x + 1 === Number(pathname.split("/")[2]) ? "font-bold" : "",
							)}
							to={
								props.isAdmin
									? `/admin/products/${x + 1}`
									: props.keyword
										? `/search/${props.keyword}/page/${x + 1}`
										: `/page/${x + 1}`
							}
						>
							{x + 1}
						</Link>
					</PaginationItem>
				))}
			</PaginationContent>
		</Pagination>
	);
}

export default Paginate;
