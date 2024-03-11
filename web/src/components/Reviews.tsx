import { Row, Col, ListGroup, Alert, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import { Rating } from "./Rating";

import { useCreateProductReviewsMutation } from "../features/products/slice";

import { Review } from "../types/product";
import { useAppSelector } from "../hooks/redux";
import Loader from "./Loader";

type ReviewProps = {
  id: string;
  isLoading: boolean;
  reviews: Array<Review>;
};

function Reviews(props: ReviewProps) {
  const user = useAppSelector((state) => state.auth.userInfo);

  const [createReview, { isLoading: loadingProductReview, reset }] =
    useCreateProductReviewsMutation();

  type FormValues = {
    rating: number;
    comment: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  // TODO: Why is it submitting two times?
  const onSubmit = async (values: FormValues) => {
    try {
      await createReview({
        id: props.id,
        rating: values.rating,
        comment: values.comment,
      }).unwrap();
      reset();
      toast.success("Review created successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.data.error);
    } finally {
      setValue("rating", "");
      setValue("comment", "");
    }
  };

  if (loadingProductReview) {
    return <Loader />;
  }

  return (
    <Row>
      <Col md={6}>
        <h2>Reviews</h2>
        {props.reviews.length === 0 && <Alert variant="info">No Reviews</Alert>}
        <ListGroup variant="flush">
          {props.reviews.map((review) => (
            <ListGroup.Item key={review._id}>
              <strong>{review.user.name}</strong>
              <Rating value={review.rating} />
              {/* <p>{review.createdAt?.substring(0, 10)}</p> */}
              <p>{review.comment}</p>
            </ListGroup.Item>
          ))}
          <ListGroup.Item>
            <h2>Write a Customer Review</h2>
            {user._id ? (
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="my-2" controlId="rating">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    as="select"
                    required
                    {...register("rating", {
                      required: "Rating is required",
                    })}
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </Form.Control>
                  {errors.rating && (
                    <Form.Text className="text-danger">
                      {errors.rating.message}
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="my-2" controlId="comment">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    {...register("comment", {
                      required: "Comment is required",
                    })}
                  ></Form.Control>
                  {errors.comment && (
                    <Form.Text className="text-danger">
                      {errors.comment.message}
                    </Form.Text>
                  )}
                </Form.Group>

                <Button
                  disabled={loadingProductReview}
                  type="submit"
                  variant="primary"
                >
                  Submit
                </Button>
              </Form>
            ) : (
              <Alert>
                Please <Link to="/login">sign in</Link> to write a review
              </Alert>
            )}
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Row>
  );
}

export default Reviews;
