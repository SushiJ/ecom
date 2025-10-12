import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../features/products/slice";

import Loader from "../../components/Loader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@iconify/react";
import Paginate from "@/components/Paginate";
// import Paginate from "../../components/Paginate";

const ProductList = () => {
  const { pageNum, keyword } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNum,
    keyword,
  });

  const [createProductMutation, { isLoading: loadingCreateProductMutation }] =
    useCreateProductMutation();

  const [deleteMutation, { isLoading: loadingDeleteMutation }] = useDeleteProductMutation();

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
    if (window.confirm(`Are you sure you want to delete ${productId} product?`)) {
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
      <div className="flex items-center w-full justify-between">
        <h1 className="text-center text-sm italic">Products</h1>
        <Button
          className="my-3 place-self-end"
          size="sm"
          onClick={createProductHandler}
          disabled={loadingCreateProductMutation}
        >
          Create
        </Button>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <pre>{JSON.stringify(error, null, 2)}</pre>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead>PRICE</TableHead>
                <TableHead>CATEGORY</TableHead>
                <TableHead>BRAND</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.products.map(product => (
                <TableRow key={product._id}>
                  <TableCell>{product._id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell className="lg:flex space-y-2 lg:space-y-0">
                    <Link to={`/admin/product/${product._id}/edit`} className="underline">
                      Edit
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteProductHandler(product._id)}
                      disabled={loadingDeleteMutation}
                    >
                      <Icon icon="ic:baseline-delete" width="24" height="24" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
      <Paginate pages={data.pages} page={data.page} isAdmin />
    </>
  );
};

export default ProductList;
