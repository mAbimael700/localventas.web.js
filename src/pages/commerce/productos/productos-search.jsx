import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getProductosByTienda,
  getProductosPublicByTienda,
} from "../../../services/productos";
import {
  ProductoCard,
  ProductoCardSkeleton,
} from "../../../components/commerce/productos/producto-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { obtenerValores } from "../../../utils/facetedOptions";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";

export const ProductosSearch = () => {
  const [queryParams, setQueryParams] = useSearchParams();
  const { tienda } = useParams();
  const [productos, setProductos] = useState(null);
  const [filteredProducts, setFilteredProductos] = useState(null);
  const [marcasFilter, setMarcasFilter] = useState([]);
  const [categoriasFilter, setCategoriasFilter] = useState([]);

  const categoriaSchema = z.object({
    categorias: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
      }),
  });

  const marcaSchema = z.object({
    marcas: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
  });

  const categoriaForm = useForm({
    resolver: zodResolver(categoriaSchema),
    defaultValues: { categorias: [] },
  });

  const marcaForm = useForm({
    resolver: zodResolver(marcaSchema),
    defaultValues: { marcas: [] },
  });

  async function getProductos() {
    if (queryParams.has("s")) {
      const response = await getProductosPublicByTienda({
        tiendaId: tienda,
        queryParams: [`search=${queryParams.get("s")}`],
      });

      if (response.ok) {
        const json = await response.json();
        setProductos(json.body.data);
        setFilteredProductos(json.body.data);

        const categorias = obtenerValores(json.body.data, "categoria");
        const marcas = obtenerValores(json.body.data, "marca");
        setCategoriasFilter(categorias);
        setMarcasFilter(marcas);
      } else {
        setProductos([]);
        setFilteredProductos([]);
      }
    }
  }

  function onSubmitCategorias(data) {
    if (data.categorias.length > 0) {
      setFilteredProductos(
        productos.filter((e) => data.categorias.includes(e.categoria))
      );
    } else {
      setFilteredProductos(
        productos.filter((e) => !data.categorias.includes(e.categoria))
      );
    }
  }

  function onSubmitMarcas(data) {
    if (data.marcas.length > 0) {
      setFilteredProductos(
        productos.filter((e) => data.marcas.includes(e.marca))
      );
    } else {
      setFilteredProductos(
        productos.filter((e) => !data.marcas.includes(e.marca))
      );
    }
  }

  useEffect(() => {
    setCategoriasFilter([]);
    setMarcasFilter([]);
    getProductos();
  }, [tienda, queryParams.get("s")]);

  return (
    <div className="grid grid-cols-7 gap-5 p-5  min-h-[91vh]">
      <div className="w-full col-span-7 md:col-span-2 flex flex-col px-16 py-4 space-y-6">
        <header className="order-3 md:order-1">
          <h1 className="font-semibold text-3xl">
            {capitalizeFirstLetter(queryParams.get("s"))}
          </h1>
          <span className="text-sm text-muted-foreground">
            {productos && productos.length} resultado(s)
          </span>
        </header>

        <div className=" md:order-2 space-y-3">
          <Accordion type="single" className="pb-5" collapsible>
            <AccordionItem value="categorias">
              <AccordionTrigger>Categorías</AccordionTrigger>
              <AccordionContent>
                <section>
                  <Form {...categoriaForm}>
                    <form
                      onSubmit={categoriaForm.handleSubmit(onSubmitCategorias)}
                      className="space-y-8"
                    >
                      <FormField
                        control={categoriaForm.control}
                        name="categorias"
                        render={() => (
                          <FormItem>
                            {categoriasFilter.map((item) => (
                              <FormField
                                key={`categoria-${item}`}
                                control={categoriaForm.control}
                                name="categorias"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={`form-categoria-${item}`}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item)}
                                          onCheckedChange={(checked) => {
                                            checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  item,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item
                                                  )
                                                );

                                            return onSubmitCategorias(
                                              categoriaForm.getValues()
                                            );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {item}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </section>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="marcas">
              <AccordionTrigger>Marcas</AccordionTrigger>
              <AccordionContent>
                <section>
                  <Form {...marcaForm}>
                    <form
                      onSubmit={marcaForm.handleSubmit(onSubmitMarcas)}
                      className="space-y-8"
                    >
                      <FormField
                        control={marcaForm.control}
                        name="marcas"
                        render={() => (
                          <FormItem>
                            {marcasFilter.map((item) => (
                              <FormField
                                key={`marca-${item}`}
                                control={marcaForm.control}
                                name="marcas"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={`form-marca-${item}`}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item)}
                                          onCheckedChange={(checked) => {
                                            checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  item,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item
                                                  )
                                                );
                                            return onSubmitMarcas(
                                              marcaForm.getValues()
                                            );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {item}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </section>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="col-span-7 md:col-span-4 space-y-5 w-full">
        <section className=" grid gap-1 grid-cols-1 ">
          {productos && filteredProducts
            ? filteredProducts.map((e) => {
                const photo = e.principal_photo;
                return (
                  <ProductoCard
                    isHorizontal={true}
                    key={"product-card -" + e.folio}
                    className="rounded-sm w-full h-full px-4"
                    productoData={e}
                  />
                );
              })
            : Array.from({ length: 5 }).map((_, i, a) => (
                <ProductoCardSkeleton key={`skelenton-${a.length - i}`} />
              ))}
        </section>
      </div>
    </div>
  );
};
