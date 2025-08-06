import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,

  FormField,
  FormItem,

} from "@/components/ui/form";


export const ProductsSearch = () => {
  const goTo = useNavigate();
  const FormSchema = z.object({
    search: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
    },
  });

  async function handleSearch(data) {
    if (data.search.length > 0) {
      goTo(`./productos?s=${data.search}`)
    }

    
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSearch)}>
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center">
                  <Input className=" h-8 rounded-e-none text-black" type="search" placeholder="Buscar productos, categorias y más..." {...field} />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-8 rounded-s-none shadow-sm"
                  >
                    <SearchIcon className="h-5 w-5" />
                  </Button>

                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
