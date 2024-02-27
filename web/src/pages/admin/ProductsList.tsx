import { Table, Button, Row, Col, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useGetProductsQuery } from "../../features/products/slice";

const ProductList = () => {
  const { data, isLoading, error } = useGetProductsQuery();

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
          {/* <Button className='my-3' onClick={createProductHandler}> */}
          {/*   <FaPlus /> Create Product */}
          {/* </Button> */}
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
              {data.map((product) => (
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
                      onClick={() => {}}
                    >
                      delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* <Paginate pages={data.pages} page={data.page} isAdmin={true} /> */}
        </>
      )}
    </>
  );
};

export default ProductList;
