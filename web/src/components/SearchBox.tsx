import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  keyword: z.optional(z.string()),
});

export function SearchBox() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      keyword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.keyword) {
      navigate(`/search/${values.keyword.trim()}`);
    } else {
      navigate("/");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2">
        <FormField
          control={form.control}
          name="keyword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Search products..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="outline" size="sm">
          Submit
        </Button>
      </form>
      <Button
        type="reset"
        variant="outline"
        size="sm"
        onClick={() => {
          form.resetField("keyword", {
            defaultValue: "",
          });
          navigate("/");
        }}
      >
        reset
      </Button>
    </Form>
  );
}

export default SearchBox;
