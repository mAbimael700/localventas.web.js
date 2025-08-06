import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import * as z from "zod";
import { ChevronsUpDown, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/auth/auth-provider.jsx";
import {
  createCategoriasByTienda,
  getCategoriaById,
  getCategoriasByTienda,
} from "@/services/categorias.js";
import { API_URL } from "@/auth/constants.js";
import {Skeleton} from "@/components/ui/skeleton.jsx";

export const CategoriasSheetForm = ({
  open,
  openChange,
  onSubmitFn,
  posted,
  setPosted,
  categoriaId,
  setCategoriaId = () => {},
  isUpdate = false,
  setIsUpdate = () => {},
}) => {
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState(null);

  const { getAccessToken } = useAuth();
  const token = getAccessToken();
  const { tienda } = useParams();
  const { toast } = useToast();

  const fetchData = async () => {
    // Obtener categorias
    const categoriasResponse = await getCategoriasByTienda({
      tiendaId: tienda,
      accessToken: token,
    });

    if (categoriasResponse.ok) {
      const categoriasData = await categoriasResponse.json();
      setCategorias(categoriasData.body);
    } else {
      setCategorias([]);
    }
  };

  const categoriaSchema = z.object({
    nombre: z.string().min(2),
    pertenece_categoria: z.boolean().optional(),
    cve_categoria_padre: z.number().int().optional(),
  });

  const form = useForm({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: "",
      pertenece_categoria: false,
      cve_categoria_padre: "",
    },
  });

  useEffect(() => {
    if (open === false) {
      setPosted(false);
      form.reset({
        nombre: "",
        pertenece_categoria: false,
        cve_categoria_padre: undefined,
      });
    }
  }, [open, openChange]);

  useEffect(() => {
    fetchData();
  }, [token, tienda, posted]);

  async function createCategoria(data) {
    const response = await createCategoriasByTienda({
      input: { ...data, cve_tienda: tienda },
      accessToken: token,
    });

    if (response.ok) {
      form.reset({
        nombre: "",
        pertenece_categoria: false,
        cve_categoria_padre: undefined,
      });

      setPosted(true);
    } else {
      setPosted(false);
    }

    if (!onSubmitFn) {
      return toast({
        title: "Subiste los siguientes valores:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    }

    return onSubmitFn();
  }

  async function updateCategoria(data) {
    try {
      if (categoriaId) {
        const response = await fetch(
          `${API_URL}/tiendas/${tienda}/categorias/${categoriaId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          form.clearErrors();
          setError("");
          setPosted(true);
        } else {
          setPosted(false);
          const data = await response.json();
          //setError(data.body.error_message);
        }
      }
    } catch (error) {
      console.log(error);
      throw new Error("Hubo un error en la base de datos");
    }
  }

  async function onSubmit(data) {
    if (isUpdate) {
      return updateCategoria(data);
    }

    return createCategoria(data);
  }

  async function getCategoria() {
    if (isUpdate && open) {

      if (categoriaId) {
        const response = await getCategoriaById({
          tiendaId: tienda,
          categoriaId,
          accessToken: token,
        });

        if (response.ok) {
          const json = await response.json();
          const categoria = json.body.data;
          setCategoria(json.body.data);

          form.setValue("nombre", categoria.categoria);
          if (categoria.cve_categoria_padre !== -1) {
            form.setValue("pertenece_categoria", true);
            form.setValue("cve_categoria_padre", categoria.cve_categoria_padre);
          }
        } else {
          setCategoria({});
        }
      }
    }
  }

  useEffect(() => {
    getCategoria();
  }, [open, posted, isUpdate, categoriaId]);

  return (
    <Sheet open={open} onOpenChange={openChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {isUpdate ? "Actualizar categoría" : "Crear categoría"}
          </SheetTitle>
          <SheetDescription>
            Crea una categoría para que tus clientes puedan filtrar tus
            productos en nuestra plataforma.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Pantalon"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                    </div>

                    <FormDescription className="col-span-3">
                      Este es el nombre de la marca.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pertenece_categoria"
                render={({ field }) => (
                  <FormItem>
                    <div>
                      <div className=" flex space-x-3">
                        <div className=" grid gap-1.5 leading-none">
                          <FormLabel>¿Es una subcategoría?</FormLabel>
                          <FormDescription>
                            Selecciona si esta categoría es una subcategoría.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            {...field}
                          />
                        </FormControl>
                      </div>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("pertenece_categoria") === true && (
                <FormField
                  control={form.control}
                  name="cve_categoria_padre"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FormLabel>Categoría Padre</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[250px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value && categorias
                                  ? categorias.reduce((prev, categoria) => {
                                      if (prev) return prev;
                                      if (
                                        categoria.cve_categoria === field.value
                                      )
                                        return categoria.nombre;
                                      if (categoria.children) {
                                        const foundChild =
                                          categoria.children.find(
                                            (child) =>
                                              child.cve_categoria ===
                                              field.value
                                          );
                                        if (foundChild)
                                          return foundChild.nombre;
                                      }
                                      return prev;
                                    }, "")
                                  : "Selecciona una categoría"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[220px]  p-0">
                            <Command>
                              <CommandInput placeholder="Buscar categoría..." />
                              <CommandEmpty>
                                Categoría no encontrada.
                              </CommandEmpty>

                              <div className="max-h-[250px] overflow-y-scroll">
                                {categorias ? (
                                  categorias.map((categoria) => {
                                    if (categoria.children) {
                                      return (
                                        <CommandGroup
                                          key={`cmd-${categoria.nombre}`}
                                          heading={categoria.nombre}
                                        >
                                          <CommandItem
                                            value={`${categoria.nombre}`}
                                            onSelect={() => {
                                              form.setValue(
                                                "cve_categoria_padre",
                                                categoria.cve_categoria
                                              );
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                categoria.cve_categoria ===
                                                  field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {categoria.nombre}
                                          </CommandItem>
                                          {categoria.children.map(
                                            (children) => (
                                              <CommandItem
                                                value={
                                                  children.nombre +
                                                  " " +
                                                  categoria.nombre
                                                }
                                                key={`cmd-${children.nombre}`}
                                                onSelect={() => {
                                                  form.setValue(
                                                    "cve_categoria_padre",
                                                    children.cve_categoria
                                                  );
                                                }}
                                              >
                                                <Check
                                                  className={cn(
                                                    "mr-2 h-4 w-4",
                                                    children.cve_categoria ===
                                                      field.value
                                                      ? "opacity-100"
                                                      : "opacity-0"
                                                  )}
                                                />
                                                {children.nombre}
                                              </CommandItem>
                                            )
                                          )}
                                        </CommandGroup>
                                      );
                                    } else {
                                      return (
                                        <CommandGroup
                                          heading={categoria.nombre}
                                          className="border-b"
                                          key={`cmd-ind-${categoria.nombre}`}
                                        >
                                          <CommandItem
                                            value={categoria.nombre}
                                            onSelect={() => {
                                              form.setValue(
                                                "cve_categoria_padre",
                                                categoria.cve_categoria
                                              );
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                categoria.cve_categoria ===
                                                  field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {categoria.nombre}
                                          </CommandItem>
                                        </CommandGroup>
                                      );
                                    }
                                  })
                                ) : (
                                  <>
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[250px]" />
                                  </>
                                )}
                              </div>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <FormDescription>
                        Esta será la marca con la que se identificará tu
                        producto.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <SheetFooter>
                <Button type="submit">Guardar</Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
