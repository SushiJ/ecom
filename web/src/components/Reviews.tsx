import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Review } from "../types/product";

import { useCreateProductReviewsMutation } from "../features/products/slice";
import { useAppSelector } from "../hooks/redux";

import { Rating } from "@/components/Rating";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	SelectContent,
	SelectTrigger,
	SelectValue,
	Select,
	SelectItem,
} from "@/components/ui/select";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type ReviewProps = {
	id: string;
	isLoading: boolean;
	reviews: Array<Review>;
	refetch: () => void;
};

const formSchema = z.object({
	rating: z.string(),
	comment: z.string(),
});

function Reviews(props: ReviewProps) {
	const user = useAppSelector((state) => state.auth.userInfo);

	const [createReview, { isLoading: loadingProductReview }] =
		useCreateProductReviewsMutation();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	// TODO: Refresh the page, so that new review shows up
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log("submitting");
		console.log(values);
		try {
			await createReview({
				id: props.id,
				rating: +values.rating,
				comment: values.comment,
			}).unwrap();
			// FIX: This doesn't work Like how I'd like it to
			props.refetch();
			toast.success("Review created successfully");
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			toast.error(err.data.error);
		} finally {
			form.reset({
				rating: "",
				comment: "",
			});
		}
	};

	if (loadingProductReview) {
		return <Loader />;
	}

	return (
		<div>
			<div>
				<h2>Reviews</h2>
				{props.reviews.length === 0 && <Badge>No Reviews</Badge>}
				<ul>
					{props.reviews.map((review, idx) => (
						<li key={idx}>
							<Card className="mb-4 rounded-2xl shadow-sm">
								<CardHeader className="flex flex-col gap-1">
									<CardTitle className="text-lg font-semibold">
										{review.user.name}
									</CardTitle>
									<Rating value={review.rating} />
									<p className="text-xs text-muted-foreground">
										{review.createdAt?.substring(0, 10)}
									</p>
								</CardHeader>
								<CardContent>
									<p className="text-sm leading-relaxed">{review.comment}</p>
								</CardContent>
							</Card>
						</li>
					))}
					<li>
						<h2>Write a Customer Review</h2>
						{user && user._id ? (
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<fieldset>
										<FormField
											control={form.control}
											name="rating"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Rating</FormLabel>
													<Select onValueChange={field.onChange}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select rating" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="1">1 - Poor</SelectItem>
															<SelectItem value="2">2 - Fair</SelectItem>
															<SelectItem value="3">3 - Good</SelectItem>
															<SelectItem value="4">4 - Very Good</SelectItem>
															<SelectItem value="5">5 - Excellent</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="comment"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Comment</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															placeholder="Additional info about the product"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button
											disabled={loadingProductReview}
											type="submit"
											className="mt-4"
										>
											Submit
										</Button>
									</fieldset>
								</form>
							</Form>
						) : (
							<p>
								Please <Link to="/login">sign in</Link> to write a review
							</p>
						)}
					</li>
				</ul>
			</div>
		</div>
	);
}

export default Reviews;
