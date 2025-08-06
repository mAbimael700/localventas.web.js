import { productosSchema } from "../../../schemas/productos-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Skeleton } from "@/components/ui/skeleton";

import { Check, ChevronsUpDown, PlusCircleIcon, Save } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/Toaster";
import { ToastAction } from "@/components/ui/toast";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Decimal from "decimal.js";
import {
  CameraIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { NavigatePreviousButton } from "../../../components/form/navigate-previous-button";
import { SidebarNav } from "../../../components/form/form-sidebar-multistep";
import { getMarcasByTienda } from "../../../services/marcas";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../auth/auth-provider";
import { MarcasSheetForm } from "../../../components/dashboard/productos/marcas/marcas-sheet-form";
import { API_URL } from "../../../auth/constants";
import { getCategoriasByTienda } from "../../../services/categorias";
import { CategoriasSheetForm } from "../../../components/dashboard/productos/categorias-sheet-form";
import { Loader } from "../../../components/loaders/loader";

import {
  ProductoCard,
  currencyFormat,
} from "../../../components/commerce/productos/producto-card";

const sidebarItems = [
  { name: "producto", title: "Producto" },
  { name: "detalles", title: "Detalles" },
  { name: "fotos", title: "Fotos" },
  { name: "resumen", title: "Resumen" },
];

const fieldsList = [
  { id: 1, fields: ["nombre", "descripcion"] },
  {
    id: 2,
    fields: [
      "precio_compra",
      "ganancia",
      "existencias",
      "cve_marca",
      "cve_categoria",
    ],
  },
  {
    id: 3,
    fields: ["fotografias"],
  },
  {
    id: 4,
    fields: [],
  },
];

export const ProductoForm = ({
  isUpdateForm,
  productoData,
  posted,
  setPosted,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [formStep, setFormStep] = useState(0);
  const [precioVenta, setPrecioVenta] = useState("");
  const [marcaFormOpen, setMarcaFormOpen] = useState(false);
  const [categoriaFormOpen, setCategoriaFormOpen] = useState(false);
  const [marcaPosted, setMarcaPosted] = useState(false);
  const [categoriaPosted, setCategoriaPosted] = useState(false);
  const [marcas, setMarcas] = useState(null);
  const [categorias, setCategorias] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const { toast } = useToast();
  const goTo = useNavigate();
  const { tienda } = useParams();
  const { getAccessToken } = useAuth();
  const token = getAccessToken();
  const location = useLocation();

  async function submitData(data) {
    setIsUploading(true);
    const {
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      ganancia,
      existencias,
      cve_marca,
      cve_categoria,
      fotografias,
    } = data;

    const formData = new FormData();

    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("precio_compra", precio_compra);
    formData.append("precio_venta", precio_venta);
    formData.append("ganancia", ganancia);
    formData.append("existencias", existencias);
    formData.append("cve_categoria", cve_categoria);
    formData.append("cve_marca", cve_marca);
    formData.append("cve_tienda", tienda);

    fotografias.forEach((foto, index) => {
      Object.entries(foto).forEach(([key, value]) => {
        if (key !== "file") {
          // Excluir el campo 'file'
          formData.append(`fotografias[${index}][${key}]`, value);
        }
      });
    });

    fotografias.forEach((e) => {
      if (e.file) {
        formData.append("files", e.file);
      }
    });

    const response = await fetch(`${API_URL}/tiendas/${tienda}/productos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      setIsUploading(false);

      setTimeout(() => {
        toast({
          title: (
            <div className="text-base flex items-center gap-2 font-semibold">
              <CheckCircledIcon className="text-emerald-300 h-8 w-8" /> Producto
              publicado!
            </div>
          ),
          description: "El producto ha sido registrado exitosamente.",
        });

        setTimeout(() => {
          goTo(`/dashboard/${tienda}/productos`);
        }, 1400); // Puedes ajustar el tiempo de espera según sea necesario
      }, 0); // Puedes ajustar el tiempo de espera según sea necesario
    } else {
      setIsUploading(false);
      const json = await response.json();
      setError(json.body.error_message);

      toast({
        variant: "destructive",
        title: (
          <span className="flex gap-2 items-center">
            <ExclamationTriangleIcon /> Error
          </span>
        ),
        description: <>{error}</>,
        action: <ToastAction altText="Okay">Entendido</ToastAction>,
      });
    }
  }

  function handlePricipalPhoto(path) {
    const photos = form.watch("fotografias");

    let newArray = photos;
    newArray.forEach((e) => (e.principal = false));

    const index = newArray.findIndex((e) => e.path === path);
    newArray[index].principal = true;

    form.setValue("fotografias", newArray);
  }

  function handleDeletePhoto(path) {
    const photos = form.watch("fotografias");
    let newArray = photos;

    const currElem = newArray.find((e) => e.path === path);
    const currElemIndex = newArray.findIndex((e) => e.path === path);

    let newPhotoArray = [];
    if (currElem.id) {
      newArray[currElemIndex].estado = false;

      if (newArray[currElemIndex].principal === true) {
        newArray[currElemIndex].principal = false;
        const newPrincipalIndex = photos.findIndex((e) => e.estado === true);
        newArray[newPrincipalIndex].principal = true;
      }

      newPhotoArray = newArray;
    } else {
      newPhotoArray = newArray.filter((e) => e.path !== path);
    }

    form.setValue("fotografias", newPhotoArray);
  }

  async function updateData(data) {
    setIsUploading(true);

    const {
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      ganancia,
      existencias,
      cve_marca,
      cve_categoria,
      fotografias,
    } = data;

    const formData = new FormData();

    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("precio_compra", precio_compra);
    formData.append("precio_venta", precio_venta);
    formData.append("ganancia", ganancia);
    formData.append("existencias", existencias);
    formData.append("cve_categoria", cve_categoria);
    formData.append("cve_marca", cve_marca);
    formData.append("cve_tienda", tienda);

    fotografias.forEach((foto, index) => {
      Object.entries(foto).forEach(([key, value]) => {
        if (key !== "file") {
          // Excluir el campo 'file'
          formData.append(`fotografias[${index}][${key}]`, value);
        }
      });
    });

    fotografias.forEach((e) => {
      if (e.file) {
        formData.append("files", e.file);
      }
    });

    if (productoData) {
      const productId = productoData.folio;

      console.log(formData.values());
      const response = await fetch(
        `${API_URL}/tiendas/${tienda}/productos/${productId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setPosted((prev) => !prev);
        setIsUploading(false);

        setTimeout(() => {
          toast({
            title: (
              <div className="flex items-center gap-2 ">
                <CheckCircledIcon className="text-emerald-600" /> ¡Producto
                actualizado!
              </div>
            ),
            description: "El producto ha sido actualizado exitosamente.",
          });
        }, 700);
      } else {
        setIsUploading(false);
        const json = await response.json();

        setError(json.body.error_message);
        toast({
          variant: "destructive",
          title: (
            <span className="flex gap-2 items-center">
              <ExclamationTriangleIcon /> Error
            </span>
          ),
          description: error,
          action: <ToastAction altText="Okay">Entendido</ToastAction>,
        });
      }
    }
  }

  function getMarcas() {
    const response = getMarcasByTienda({
      tiendaId: tienda,
      accessToken: token,
    });

    response.then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setMarcas(data.body);
      } else {
        setMarcas(null);
      }
    });
  }

  function getCategorias() {
    const response = getCategoriasByTienda({
      tiendaId: tienda,
      accessToken: token,
    });

    response.then(async (res) => {
      if (res.ok) {
        const data = await res.json();

        setCategorias(data.body);
      } else {
        setCategorias([]);
      }
    });
  }

  const form = useForm({
    resolver: zodResolver(productosSchema),
    mode: "all",
    defaultValues:
      isUpdateForm && productoData
        ? {
            nombre: productoData.producto,
            descripcion: productoData.descripcion,
            precio_compra: String(productoData.costo),
            precio_venta: String(productoData.precio),
            ganancia: String(productoData.ganancia),
            existencias: String(productoData.stock),
            cve_categoria: productoData.cve_categoria,
            cve_marca: productoData.cve_marca,
            fotografias: productoData.photos,
          }
        : {
            nombre: "",
            descripcion: "",
            precio_compra: "",
            precio_venta: "",
            ganancia: "",
            existencias: "",
            cve_categoria: "",
            cve_marca: "",
            fotografias: [],
          },
  });

  function onSelectFile(e) {
    const selectedFiles = e.target.files;
    const filesToArray = Array.from(selectedFiles);

    const images = filesToArray.map((file) => {
      return URL.createObjectURL(file);
    });

    setSelectedImages((previousImages) => previousImages.concat(images));
    setFiles((prev) => {
      const updatedFiles = [...prev, ...filesToArray];
      return updatedFiles;
    });

    let filesToObj = filesToArray.map((file, i) => {
      if (form.watch("fotografias").length < 1) {
        return {
          estado: true,
          principal: i === 0 ? true : false,
          file: file,
        };
      } else {
        return {
          estado: true,
          principal: false,
          file: file,
        };
      }
    });

    images.forEach((img, i) => (filesToObj[i].path = img));
    form.setValue("fotografias", [...form.watch("fotografias"), ...filesToObj]);
  }

  function moverElementoAlInicio(array, posicion) {
    // Verifica que la posición sea válida
    if (posicion < 0 || posicion >= array.length) {
      console.error(
        "La posición especificada está fuera de los límites del array."
      );
      return array;
    }

    // Elimina el elemento de la posición especificada
    const newArray = [...array];

    // Eliminamos el elemento de la posición especificada
    const elemento = newArray.splice(posicion, 1)[0];

    // Agregamos el elemento al principio del array
    newArray.unshift(elemento);

    // Retornamos el nuevo array modificado
    return newArray;
  }

  const nombre = form.watch("nombre");
  const desc = form.watch("descripcion");
  const costo = new Decimal(parseFloat(form.watch("precio_compra"))) || 0;
  const ganancia = new Decimal(parseFloat(form.watch("ganancia"))) || 0;

  function onSubmit(values) {
    if (isUpdateForm) {
      return updateData(values);
    }
    return submitData(values);
  }

  const completeFormStep = async ({ step, isSidebar = false }) => {
    const fields = fieldsList[formStep].fields;
    const output = await form.trigger(fields, { shouldFocus: true });

    if (!output) {
      formValidateError();
      return;
    }

    if (formStep < fieldsList.length - 1) {
      if (formStep === fieldsList.length - 1) {
        await form.handleSubmit()();
      }

      if (!isSidebar) {
        return setFormStep((cur) => cur + 1);
      }
    }

    if (isSidebar) {
      if (formStep === fieldsList.length) {
        await form.handleSubmit()();
      }

      return setFormStep(step);
    }
  };

  const previewFormStep = () => {
    setFormStep((cur) => (cur > 0 ? cur - 1 : 0));
  };

  function formValidateError(title, desc) {
    toast({
      variant: "destructive",
      title: title || "¡Olvidaste completar el formulario!",
      description: desc || "Por favor, complete el formulario.",
      action: <ToastAction altText="Okay">Entendido</ToastAction>,
    });
  }

  useEffect(() => getMarcas(), [tienda, token, marcaPosted]);

  useEffect(() => getCategorias(), [tienda, token, categoriaPosted]);

  useEffect(() => {
    if (isUpdateForm && productoData) {
      setPrecioVenta(productoData.precio);
      form.setValue("fotografias", productoData.photos);
      setSelectedImages(Array.from(productoData.photos).map((img) => img.path));

      if (selectedImages) {
        setSelectedImages((prev) =>
          moverElementoAlInicio(
            prev,
            Array.from(productoData.photos).findIndex(
              (img) => img.principal === true
            )
          )
        );
      }

      if (location.state) {
        if (location.state.formStep !== null)
          setFormStep(location.state.formStep);
      }
    }
  }, [productoData, tienda, posted]);

  useEffect(() => {
    if (isUploading) {
      toast({
        title: (
          <div className="text-base flex items-center gap-2 font-semibold">
            <Loader /> Subiendo producto...
          </div>
        ),
        description: "Espere un momento por favor.",
      });
    }
  }, [isUploading]);

  return (
    <div className="absolute top-20 left-0 bg-background w-screen ">
      <section className="px-6 space-y-4">
        <div className="flex flex-col gap-0.5">
          <Label className="text-xl font-semibold tracking-tight">
            {isUpdateForm ? "Actualizar producto" : "Crear un nuevo producto"}
          </Label>
          <span className="text-muted-foreground text-sm pb-2">
            Maneja los datos de publicación del producto.
          </span>
        </div>

        <Separator />

        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="min-w-[200px] -mx-4 lg:w-1/5 py-2 pl-4 ">
            <SidebarNav
              items={sidebarItems}
              step={formStep}
              changeFn={completeFormStep}
            />
          </aside>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 py-4 lg:w-[60%] min-h-[70vh] flex flex-col justify-between"
            >
              {formStep === 0 && (
                <section className="space-y-5">
                  <div>
                    <h1 className="font-medium text-lg">
                      Información del producto
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      Maneja los datos de publicación del nuevo producto.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-8">
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Laptop Acer Aspire 3 16gb RAM 512 SSD"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Este será el nombre del producto que se les mostrará
                            a los clientes.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="descripcion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Textarea
                              className=" h-36"
                              placeholder="Cuéntanos detalles de tu producto"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Cuéntanos un poco sobre el producto.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>
              )}

              {formStep === 1 && (
                <section className="space-y-5 pb-3">
                  <div>
                    <h1 className="font-medium text-lg">
                      Detalles del producto
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      Esta información será utilizada por la aplicación para sus
                      funciones.
                    </p>
                  </div>

                  <Separator />

                  <div className="flex gap-3 justify-between">
                    <FormField
                      control={form.control}
                      name="precio_compra"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Costo del producto</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="$ 10,000"
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e); // Actualizar el valor del campo 'ganancia'
                                // Calcular el nuevo valor de precioVenta
                                const curr = new Decimal(
                                  parseFloat(e.target.value.replace(/ /g, ""))
                                );
                                const newPrecioVenta = ganancia.add(curr);
                                // Actualizar el valor de 'precioVenta' en el estado o donde lo estés almacenando
                                form.setValue("precio_venta", newPrecioVenta);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Coloca el costo invertido en la compra del producto
                            que vas a publicar.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ganancia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ganancia por venta</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="$ 6,000"
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e); // Actualizar el valor del campo 'ganancia'
                                // Calcular el nuevo valor de precioVenta
                                const curr = new Decimal(
                                  parseFloat(e.target.value.replace(/ /g, ""))
                                );
                                const newPrecioVenta = costo.add(curr);
                                // Actualizar el valor de 'precioVenta' en el estado o donde lo estés almacenando

                                form.setValue("precio_venta", newPrecioVenta);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Establece la ganancia que desea ganar por cada venta
                            del producto.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="precio_venta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio a venta del producto</FormLabel>
                        <FormControl>
                          <Input
                            readOnly
                            placeholder="Ingrese valores númericos"
                            value={isNaN(field.value) ? "" : field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Este es el precio de venta que se le mostrará al
                          cliente.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="existencias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Existencias</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Establece la cantidad de piezas que tienes disponibles
                          a venta de este producto.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 justify-between">
                    <FormField
                      control={form.control}
                      name="cve_marca"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Marca</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-[220px] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value && marcas
                                    ? marcas.find(
                                        (marca) => marca.id === field.value
                                      )?.marca
                                    : "Selecciona una marca"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[220px]  p-0">
                              <Command>
                                <CommandInput placeholder="Buscar marca..." />
                                <CommandEmpty>
                                  Marca no encontrada.
                                </CommandEmpty>

                                <CommandGroup className="shadow">
                                  <CommandItem
                                    onSelect={() => setMarcaFormOpen(true)}
                                    className="flex items-center "
                                  >
                                    <PlusCircleIcon className="h-4 -pl-5" />{" "}
                                    Agregar marca
                                  </CommandItem>
                                </CommandGroup>

                                <CommandGroup className="max-h-[250px] overflow-y-scroll">
                                  {marcas ? (
                                    marcas.map((marca) => (
                                      <CommandItem
                                        value={marca.id}
                                        key={`${marca.marca}-command-item`}
                                        onSelect={() => {
                                          if (field.value === marca.id) {
                                            return form.setValue(
                                              "cve_marca",
                                              undefined
                                            );
                                          }

                                          form.setValue("cve_marca", marca.id);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            marca.id === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {marca.marca}
                                      </CommandItem>
                                    ))
                                  ) : (
                                    <>
                                      <Skeleton className="h-4 w-[250px]" />
                                      <Skeleton className="h-4 w-[250px]" />
                                      <Skeleton className="h-4 w-[250px]" />
                                    </>
                                  )}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Esta será la marca con la que se identificará tu
                            producto.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cve_categoria"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Categoría</FormLabel>
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
                                    ? (() => {
                                        console.log(
                                          "Valor del campo:",
                                          field.value
                                        );
                                        console.log("Categorías:", categorias);

                                        const findCategoryRecursive = (
                                          categorias,
                                          id
                                        ) => {
                                          for (const categoria of categorias) {
                                            if (
                                              categoria.cve_categoria === id
                                            ) {
                                              return categoria;
                                            } else if (categoria.children) {
                                              const foundChild =
                                                findCategoryRecursive(
                                                  categoria.children,
                                                  id
                                                );
                                              if (foundChild) {
                                                return foundChild;
                                              }
                                            }
                                          }
                                          return null;
                                        };

                                        const foundCategory =
                                          findCategoryRecursive(
                                            categorias,
                                            field.value
                                          );

                                        console.log(
                                          "Categoría encontrada:",
                                          foundCategory
                                        );

                                        return foundCategory
                                          ? foundCategory.nombre
                                          : "Selecciona una categoría";
                                      })()
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

                                <CommandGroup className="shadow">
                                  <CommandItem
                                    onSelect={() => setCategoriaFormOpen(true)}
                                    className="flex items-center "
                                  >
                                    <PlusCircleIcon className="h-4 -pl-5" />{" "}
                                    Agregar categoría
                                  </CommandItem>
                                </CommandGroup>

                                <div className="max-h-[250px] overflow-y-scroll">
                                  {categorias ? (
                                    categorias.map((categoria) => {
                                      if (categoria.children) {
                                        return (
                                          <CommandGroup
                                            className="border-b "
                                            heading={categoria.nombre}
                                            key={`cmd-${categoria.nombre}`}
                                          >
                                            <CommandItem
                                              value={`${categoria.nombre}`}
                                              onSelect={() => {
                                                form.setValue(
                                                  "cve_categoria",
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
                                                <div
                                                  key={`cmd-${children.nombre}`}
                                                >
                                                  <CommandItem
                                                    value={
                                                      children.nombre +
                                                      " " +
                                                      categoria.nombre
                                                    }
                                                    onSelect={() => {
                                                      form.setValue(
                                                        "cve_categoria",
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

                                                  {children.children &&
                                                    children.children.map(
                                                      (c) => (
                                                        <CommandItem
                                                          value={
                                                            c.nombre +
                                                            " " +
                                                            children.nombre +
                                                            " " +
                                                            categoria.nombre
                                                          }
                                                          key={`cmd-${c.nombre}`}
                                                          onSelect={() => {
                                                            form.setValue(
                                                              "cve_categoria",
                                                              c.cve_categoria
                                                            );
                                                          }}
                                                        >
                                                          <Check
                                                            className={cn(
                                                              "mr-2 h-4 w-4",
                                                              c.cve_categoria ===
                                                                field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                            )}
                                                          />
                                                          {c.nombre}
                                                        </CommandItem>
                                                      )
                                                    )}
                                                </div>
                                              )
                                            )}
                                          </CommandGroup>
                                        );
                                      } else {
                                        return (
                                          <CommandGroup
                                            heading={categoria.nombre}
                                            key={`cmd-ind-${categoria.nombre}`}
                                          >
                                            <CommandItem
                                              value={categoria.nombre}
                                              onSelect={() => {
                                                form.setValue(
                                                  "cve_categoria",
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

                          <FormDescription>
                            Esta será la marca con la que se identificará tu
                            producto.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>
              )}

              {formStep === 2 && (
                <section className="space-y-5">
                  <pre className="mt-2 w-[340px] rounded-md fixed hidden right-20 top-0 overflow-y-auto max-h-[400px] bg-slate-950 p-4">
                    <code className="text-white">
                      {JSON.stringify(form.watch("fotografias"), null, 2)}
                    </code>
                  </pre>
                  <div>
                    <h1 className="font-medium text-lg">
                      Fotografías del producto
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      Selecciona las imagenes de la publicación del producto.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-8">
                    <FormField
                      control={form.control}
                      name="fotografias"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Label>Fotografías</Label>
                          <FormLabel
                            className={buttonVariants({
                              variant: "outline",
                              className:
                                "border-dashed border-gray-300 flex-col h-28",
                            })}
                          >
                            <CameraIcon className="w-8" />
                            Da clic para agregar
                            <span className="text-sm text-muted-foreground font-normal">
                              O arrastra la fotografía deseada
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="hidden"
                              type="file"
                              multiple={true}
                              onChange={onSelectFile}
                              accept="image/png, image/jpeg"
                            />
                          </FormControl>
                          <FormDescription>
                            Selecciona fotografías del producto.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedImages && (
                      <div className="space-y-3">
                        {selectedImages.length > 0 && (
                          <Label>Imagenes seleccionadas</Label>
                        )}
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
                          {selectedImages.map((img, i) => (
                            <section className="h-full" key={`img-${i}`}>
                              <div className="rounded p-3 border shadow flex flex-col items-center h-full  space-y-3">
                                <picture className="aspect-square rounded min-h-[200px] flex items-center justify-center border">
                                  <img
                                    src={img}
                                    className="w-auto max-h-[200px]"
                                    alt="upload"
                                  />
                                </picture>

                                <div className="space-y-3 flex flex-col h-full justify-between">
                                  {i === 0 ? (
                                    <div className="flex flex-col">
                                      <Label className="text-sm">
                                        Foto principal
                                      </Label>
                                      <p className="text-sm text-muted-foreground">
                                        Esta será la fotografía que aparecerá de
                                        portada.
                                      </p>
                                    </div>
                                  ) : (
                                    <Label className="text-sm">
                                      Fotografía {i + 1}
                                    </Label>
                                  )}

                                  <div className="space-y-2.5">
                                    {i !== 0 && (
                                      <Button
                                        type="button"
                                        className="min-w-full"
                                        onClick={() => {
                                          setSelectedImages(
                                            moverElementoAlInicio(
                                              selectedImages,
                                              i
                                            )
                                          );

                                          handlePricipalPhoto(img);
                                        }}
                                      >
                                        Establecer como portada
                                      </Button>
                                    )}

                                    <Button
                                      type="button"
                                      variant="destructive"
                                      className="min-w-full"
                                      onClick={() => {
                                        setSelectedImages((previousImages) => {
                                          const updatedImages =
                                            previousImages.filter(
                                              (e, index) => index !== i
                                            );

                                          handleDeletePhoto(img);

                                          return updatedImages;
                                        });
                                      }}
                                    >
                                      <TrashIcon /> Eliminar
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </section>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {formStep === 3 && (
                <section className="space-y-5 relative transition-all">
                  <div>
                    <h1 className="font-medium text-lg">
                      Resumen del producto
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      Vista previa de los datos del producto.
                    </p>
                  </div>

                  <Separator />

                  <Tabs defaultValue="info">
                    <TabsList>
                      <TabsTrigger value="info">Detalles</TabsTrigger>
                      <TabsTrigger value="photos">Fotografías</TabsTrigger>

                      {/* <TabsTrigger value="preview">Vista previa</TabsTrigger> */}
                    </TabsList>
                    <TabsContent value="info">
                      <div className="shadow-sm grid-cols-7 grid">
                        <picture className="bg-accent col-span-7 lg:col-span-3 md:col-span-3  flex items-center justify-center rounded-s border h-full p-4  border-e-0">
                          <img
                            src={selectedImages[0]}
                            alt="principal-photo"
                            className="max-h-[500px] w-auto"
                          />
                        </picture>

                        <div className="p-5 rounded-e border col-span-7 lg:col-span-4 md:col-span-4 space-y-3">
                          <div className="space-y-2">
                            <h1 className="text-2xl font-semibold">{nombre}</h1>

                            <div>
                              <span className="font-semibold">Descripción</span>
                              <p className="whitespace-pre-wrap text-sm max-h-[200px] overflow-y-auto">
                                {desc}
                              </p>
                            </div>

                            <p className=" text-xl font-semibold">
                              <span className=" text-sm">Precio de venta</span>{" "}
                              <br />
                              {currencyFormat(
                                parseFloat(form.watch("precio_venta"))
                              )}
                            </p>

                            <div>
                              <p className="text-sm font-semibold">
                                Existencias
                              </p>
                              <p>{form.watch("existencias")} </p>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2 text-sm">
                            <span className="font-semibold">
                              Características principales
                            </span>
                            <div className="rounded border shadow-sm">
                              <div className="odd:bg-background even:bg-accent p-3 rounded-t flex items-center justify-between w-full">
                                <span className="font-semibold">Marca:</span>{" "}
                                {marcas &&
                                  marcas.find(
                                    (e) => e.id === form.watch("cve_marca")
                                  )?.marca}
                              </div>

                              {/* <div className="odd:bg-background even:bg-accent p-3 rounded-b flex items-center justify-between w-full">
                            <span className="font-semibold">Categoría:</span>{" "}
                            {
                              
                            }
                          </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="photos">
                      <div>
                        <Label>Fotografías del producto</Label>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
                          {selectedImages.map((img, i) => (
                            <picture
                              key={"uploaded-img" + i}
                              className="flex items-center border aspect-square justify-center rounded max-h-[300px] shadow-sm p-5"
                            >
                              <img
                                src={img}
                                alt="upload"
                                className="max-h-[300px] w-auto"
                              />
                            </picture>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* <TabsContent value="preview">
                      <div>
                        <Label className="text-sm">
                          Vista previa del producto en tienda
                        </Label>
                        <ProductoCard
                          isHorizontal={true}
                          nombre={form.watch("nombre")}
                          pictureSrc={selectedImages[0]}
                          precio={parseFloat(form.watch("precio_venta"))}
                          marca={
                            marcas &&
                            marcas.find((e) => e.id === form.watch("cve_marca"))
                              ?.marca
                          }
                        />
                      </div>
                    </TabsContent> */}
                  </Tabs>
                </section>
              )}

              <div className="flex justify-between relative w-full">
                {!isUpdateForm ? (
                  <>
                    <Button
                      disabled={isUploading}
                      variant="outline"
                      className={formStep === 0 && "opacity-0 cursor-default"}
                      type="button"
                      onClick={previewFormStep}
                    >
                      Anterior
                    </Button>

                    <Button
                      type="button"
                      disabled={isUploading}
                      onClick={completeFormStep}
                      className={
                        formStep < fieldsList.length - 1 ? "block" : "hidden"
                      }
                    >
                      Siguiente
                    </Button>

                    <Button
                      type="submit"
                      disabled={isUploading}
                      className={
                        formStep > fieldsList.length - 2 ? "block" : "hidden"
                      }
                    >
                      Crear
                    </Button>
                  </>
                ) : (
                  <div className="fixed bottom-14  md:right-20">
                     <Button type="submit" className="shadow-lg"  cdisabled={isUploading}>
                      <Save className="h-5 w-5 mr-2" /> Guardar cambios
                    </Button>
                    
                    
                  </div>
                )}
              </div>
            </form>
          </Form>
        </div>
      </section>

      <MarcasSheetForm
        open={marcaFormOpen}
        openChange={setMarcaFormOpen}
        posted={marcaPosted}
        setPosted={setMarcaPosted}
      />
      <CategoriasSheetForm
        open={categoriaFormOpen}
        openChange={setCategoriaFormOpen}
        setPosted={setCategoriaPosted}
        posted={categoriaPosted}
      />
      <Toaster />
    </div>
  );
};
