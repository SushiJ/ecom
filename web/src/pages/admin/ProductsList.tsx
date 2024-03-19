import { Table, Button, Row, Col, Alert } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../features/products/slice";

import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";

const ProductList = () => {
  const { pageNum, keyword } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNum,
    keyword,
  });

  const [createProductMutation, { isLoading: loadingCreateProductMutation }] =
    useCreateProductMutation();

  const [deleteMutation, { isLoading: loadingDeleteMutation }] =
    useDeleteProductMutation();

  async function createProductHandler() {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProductMutation();
        refetch();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        toast.error(e, {
          type: "error",
        });
      }
    }
  }

  async function deleteProductHandler(productId: string) {
    if (
      window.confirm(`Are you sure you want to delete ${productId} product?`)
    ) {
      try {
        await deleteMutation(productId);
        refetch();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        toast.error(e, {
          type: "error",
        });
      }
    }
  }

  if (!data) {
    return <p>What?</p>;
  }

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button
            className="my-3"
            onClick={createProductHandler}
            disabled={loadingCreateProductMutation}
          >
            Create Product
          </Button>
        </Col>
      </Row>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Alert variant="danger">{JSON.stringify(error, null, 2)}</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Link
                      to={`/admin/product/${product._id}/edit`}
                      className="btn btn-info btn-sm me-4"
                    >
                      Edit
                    </Link>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteProductHandler(product._id)}
                      disabled={loadingDeleteMutation}
                    >
                      delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin />
        </>
      )}
    </>
  );
};

export default ProductList;
