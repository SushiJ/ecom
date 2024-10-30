import { useForm } from "react-hook-form";
import { Form, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

function SearchBox() {
  const navigate = useNavigate();
  const { keyword } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<{ keyword?: string }>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    // defaultValues: keyword,
  });

  function submitHandler(values: { keyword?: string }) {
    if (values.keyword) {
      navigate(`/search/${values.keyword.trim()}`);
      // resetField("keyword", "");
    } else {
      navigate("/");
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit(submitHandler)}>
        {/* <Form.Control */}
        {/*   type="text" */}
        {/*   {...register("keyword", { required: "Enter query..." })} */}
        {/*   placeholder="Search Products..." */}
        {/*   className="mr-sm-2 ml-sm-5" */}
        {/* ></Form.Control> */}
        {/* {errors.keyword && ( */}
        {/*   <Form.Text className="text-danger"> */}
        {/*     {errors.keyword.message} */}
        {/*   </Form.Text> */}
        {/* )} */}
        <Button type="submit" variant="ghost" size="sm">
          Search
        </Button>
      </Form>
      <Button
        type="reset"
        variant="ghost"
        size="sm"
      // onClick={() => resetField("keyword", "")}
      >
        clear
      </Button>
    </>
  );
}

export default SearchBox;
