import React, { useEffect, useState } from "react";
import {
  getProductoById,
  getProductoPublicById,
} from "../../../services/productos";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LazyCargandoLoader } from "../../../components/loaders/lazy-text-loader";
import { currencyFormat } from "../../../components/commerce/productos/producto-card";
import {
  ChevronLeftIcon,
  HeartFilledIcon,
  HeartIcon,
  Share1Icon,
  StarIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "../../../lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { ShareDialog } from "../../../components/alert/product-share-dialog";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { renderBreadcrumbFromFamily } from "../../../components/commerce/productos/producto-breadcum";
import {
  ArrowLeftRightIcon,
  CreditCardIcon,
  ShareIcon,
  Wallet2,
} from "lucide-react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useShoppingCart } from "../../../hooks/shopping-cart/useShoppingCart";
import { formatDireccion } from "../../../utils/direccionFormatter";
import { useCommerce } from "../../../hooks/commerce/useCommerce";

export const ProductosIndividual = () => {
  const [productoData, setProductoData] = useState(null);
  const [favoriteProduct, setFavoriteProduct] = useState(false);
  const [breadcumbs, setBreadcumbs] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const goTo = useNavigate();
  const { tienda, producto } = useParams();
  const { addToCart, existElement } = useShoppingCart();
  const { tienda: tiendaData, metodosPago } = useCommerce();
  const { descripcion: tiendaDescription } = tiendaData;
  function handleSubmitFavorite() {
    setFavoriteProduct((prev) => !prev);
  }

  const existProductInCart = () => {
    if (productoData) return existElement(productoData);
  };

  const direccionPrincipalTienda = () => {};
  async function getProducto() {
    const response = await getProductoPublicById({
      productoId: producto,
      tiendaId: tienda,
    });

    if (response.ok) {
      const json = await response.json();
      setProductoData(json.body.data);
      setSelectedImg(json.body.data.principal_photo);
      setBreadcumbs(
        renderBreadcrumbFromFamily(json.body.data.categoria.familia, tienda)
      );
    } else {
      goTo(`/commerce/${tienda}/productos`);
    }
  }

  function handleAddToCart() {
    if (productoData) addToCart(productoData);
  }

  useEffect(() => {
    getProducto();
  }, [tienda, producto]);

  return (
    <div className="flex flex-col justify-center py-7 px-4 space-y-3">
      <div className="text-sm  w-full md:w-[75vw] place-self-center flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={`/commerce/${tienda}/productos`}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary"
          >
            <ChevronLeftIcon /> Regresar
          </Link>
          <Separator
            orientation="vertical"
            className="h-4 hidden md:block    bg-zinc-300"
          />
          <div></div>
          {breadcumbs}
        </div>

        <ShareDialog folio={productoData && productoData.folio} tienda={tienda}>
          <span className="flex items-center gap-1 text-muted-foreground hover:text-primary ">
            <ShareIcon className="h-4" />
            Compartir
          </span>
        </ShareDialog>
      </div>

      {productoData ? (
        <div className="flex flex-col justify-center gap-2">
          <div className=" grid grid-cols-6  place-self-center shadow bg-background gap-y-2 rounded md:w-[75vw] p-3">
            <div className="col-span-6 lg:col-span-4 flex flex-col lg:flex-row md:flex-row items-center">
              <Carousel
                orientation={isDesktop ? "vertical" : "horizontal"}
                className={cn(
                  "ml-5 lg:border-y rounded mb-3 place-self-start",
                  isDesktop ? "w-[100px] " : "h-[150px] py-3 order-2"
                )}
              >
                <CarouselContent
                  className={cn("-mt-1 ", isDesktop ? "max-h-[500px]" : "")}
                >
                  {productoData.photos?.map((photo, index) => (
                    <CarouselItem
                      key={index}
                      className="pt-1 md:basis-1/2 max-w-[120px]"
                      onClick={() => setSelectedImg(photo.path)}
                    >
                      <div className="p-1">
                        <Card
                          className={cn(
                            "rounded-sm flex items-center justify-center",
                            selectedImg === photo.path &&
                              "border-ring border-2 rounded-sm"
                          )}
                        >
                          <CardContent
                            className={cn(
                              "flex items-center aspect-square  w-auto  justify-center p-1"
                            )}
                          >
                            <LazyLoadImage
                              effect="opacity"
                              className=""
                              src={photo.path}
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <picture className="flex items-center justify-center h-[350px] lg:h-[500px] w-full  col-span-5">
                {selectedImg && (
                  <LazyLoadImage
                    src={selectedImg}
                    effect="opacity"
                    className="max-w-[450px] max-h-[350px] lg:max-h-[500px] "
                  />
                )}
              </picture>
            </div>

            <div className="px-6 py-3 space-y-4  md:border rounded col-span-6 lg:col-span-2 flex justify-between flex-col">
              <div className="space-y-5 relative">
                <div className="grid grid-cols-2 justify-between">
                  {productoData.piezas_vendidas > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {productoData.piezas_vendidas} vendidos
                    </span>
                  )}

                  <button onClick={handleSubmitFavorite} className="place-self-end">
                    {favoriteProduct ? (
                      <HeartFilledIcon className="h-5 w-5" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div>
                  <h1 className="font-semibold text-3xl">
                    {productoData.producto}
                  </h1>
                  <Link
                    to={`/commerce/${tienda}/marcas/${productoData.marca.id}`}
                    className="text-sm text-primary"
                  >
                    Marca: {productoData.marca.nombre}
                  </Link>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">0.0</span>

                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((e, i) => (
                        <StarIcon className="h-5 w-5 " key={`start-${i}`} />
                      ))}
                    </div>

                    <span className="text-sm text-muted-foreground">(0)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <p className="text-2xl">
                    {currencyFormat(productoData.precio)}
                  </p>
                  {productoData.stock > 0 && (
                    <div>
                      <h3 className="font-medium">Stock disponible</h3>
                      <span className="text-sm text-muted-foreground">
                        El producto está preparado para su venta.
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold">Cantidad</h2>
                  <Input
                    type="number"
                    defaultValue="1"
                    className="max-w-[80px] font-semibold"
                  />
                  <span className="text-muted-foreground text-sm">
                    ({productoData.stock} disponibles){" "}
                    {productoData.stock < 10 && "¡Ultimas piezas!"}
                  </span>
                </div>
                <div className="space-y-2">
                  <Button className="w-full">Comprar ahora</Button>

                  <Button
                    className="w-full bg-accent hover:bg-background"
                    variant="outline"
                    onClick={handleAddToCart}
                  >
                    Agregar al carrito
                  </Button>
                </div>

                <div className="pb-3 space-y-4">
                  <section>
                    <h1 className="font-medium">Información de la tienda</h1>
                    <div className="flex gap-1 items-center font-normal">
                      <h2 className="text-sm">Vendido por </h2>
                      <Link
                        to={`/commerce/${tienda}/productos`}
                        className="uppercase text-blue-700"
                      >
                        {productoData.tienda.nombre}
                      </Link>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-medium">
                      Dirección de la tienda
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {tiendaDescription || ""}
                    </p>
                  </section>
                </div>
              </div>
            </div>


            

            <div className="col-span-6 lg:col-span-4 p-5 space-y-5 ">
            <Separator className='w-[98%]'/>
              <div className="space-y-4 md:px-2">
                <h3 className="font-semibold text-xl">Descripción</h3>
                <p className="text-muted-foreground whitespace-pre-wrap ">
                  {productoData.descripcion}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-y-4 md:px-2 ">
                <h3 className="font-semibold text-xl col-span-2">
                  Características
                </h3>
                <div className="space-y-4 col-span-2">
              
                  <div className="rounded border border-muted text-sm">
                    <div className="odd:bg-accent even:bg-background p-3 rounded-t flex items-center justify-between w-full">
                      <span className="font-semibold">Marca:</span>{" "}
                      {productoData.marca.nombre}
                    </div>

                    <div className="odd:bg-accent even:bg-background p-3 rounded-b flex items-center justify-between w-full">
                      <span className="font-semibold">Categoría:</span>{" "}
                      {productoData.categoria.nombre}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 md:border col-span-6 md:col-span-2 rounded space-y-10">
              <section>
                <h3 className="text-xl font-medium">Métodos de págo</h3>
                <p className="text-sm text-muted-foreground">
                  Nuestra tienda cuenta con los siguiente métodos de pago
                </p>
              </section>

              {metodosPago ? (
                <ul className="text-sm space-y-5">
                  {metodosPago.map((method) => (
                    <li className="flex gap-2 items-center">
                      {method.nombre === "Efectivo" ? (
                        <Wallet2 className="h-5 w-5" />
                      ) : method.nombre === "Transferencia" ? (
                        <ArrowLeftRightIcon className="h-5 w-5 " />
                      ) : (
                        <CreditCardIcon className="h-5 w-5" />
                      )}
                      {method.nombre}
                    </li>
                  ))}
                </ul>
              ) : (
                <LazyCargandoLoader />
              )}
            </div>
          </div>

          <div className="place-self-center md:w-[75vw] text-end text-sm">
            Publicación #<strong>{productoData?.folio}</strong>
          </div>
        </div>
      ) : (
        <LazyCargandoLoader />
      )}
    </div>
  );
};
