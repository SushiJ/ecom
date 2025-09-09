import { Link, useParams } from "react-router-dom";

import { Separator } from "@/components/ui/separator";
import { Rating } from "@/components/Rating";
import { Title } from "@/components/Title";
import Paginate from "@/components/Paginate";
import ProductCarousel from "@/components/ProductCarousel";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Product } from "../types/product";
import { useGetProductsQuery } from "../features/products/slice";
import truncate from "../lib/truncate";
import { useDelay } from "@/lib/utils";
import Loader from "@/components/Loader";
import { GoBack } from "@/components/ui/goback";

export default function Home() {
	const { pageNum, keyword } = useParams();
	const { data, isError, isLoading } = useGetProductsQuery({
		pageNum,
		keyword,
	});

	const delay = useDelay(200);

	if (isLoading || delay) {
		return <Loader />;
	}

	if ((isError && !isLoading) || !data) {
		return <p className="text-center text-lg">Something went wrong</p>;
	}

	if (data.products.length === 0) {
		return (
			<section className="space-y-4">
				<GoBack to="/" />
				<p>Looks like that didn't match with any products</p>
			</section>
		);
	}

	return (
		<section>
			<Title title="Latest Products" className="text-neutral-500 text-md" />
			<ProductCarousel />
			<Separator className="my-8" />
			<div className="grid md:grid-cols-2 gap-2">
				{data.products.map((p) => (
					<div key={p._id}>
						<Product product={p} />
					</div>
				))}
			</div>
			<Paginate pages={data.pages} page={data.page} keyword={keyword} />
		</section>
	);
}

function Product(props: { product: Product }) {
	return (
		<Card className="shadow-none h-[450px]">
			<Link to={`/products/${props.product._id}`}>
				<CardHeader className="flex flex-col items-center">
					<img
						src={props.product.image}
						className="rounded h-48 w-48 object-cover"
					/>
					<CardTitle>{props.product.name}</CardTitle>
					<CardDescription>
						{truncate(props.product.description)}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p>$ {props.product.price}</p>
					<Rating
						value={props.product.rating}
						text={`${props.product.numReviews} reviews`}
					/>
				</CardContent>
			</Link>
		</Card>
	);
}
