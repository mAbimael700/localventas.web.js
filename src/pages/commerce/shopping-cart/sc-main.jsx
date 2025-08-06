import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "../../../auth/auth-provider";
import { Link, useParams } from "react-router-dom";
import { NavigatePreviousButton } from "../../../components/form/navigate-previous-button";
import { useShoppingCart } from "../../../hooks/shopping-cart/useShoppingCart";
import { ProductoCartItem } from "../../../components/commerce/cart/producto-cart-item";

import { cn } from "../../../lib/utils";
import CartVector from "@/assets/shopping-cart/shopping-cart_vector.png";
export const ShoppingCartMain = () => {
  const auth = useAuth();
  const { cart, getQuantityProducts, getTotalPriceCart } = useShoppingCart();
  const { tienda: tiendaId } = useParams();

  const cantidadProductos = getQuantityProducts();
  const totalCarrito = getTotalPriceCart();
  return (
    <div className="p-5 flex flex-col  items-center min-h-screen">
      {auth.isAuthenticated ? (
        <main className="grid grid-cols-3 md:w-[80%] gap-5 py-4">
          <section className="col-span-3  md:col-span-2">
            <Card
              className={cn(
                "rounded-sm",
                cart.length < 1 &&
                  "bg-secondary  p-6 w-full flex justify-center h-[450px] items-center"
              )}
            >
              {cart.items?.length > 0 ? (
                <>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Productos en el carrito
                    </CardTitle>
                  </CardHeader>

                  <Separator />

                  <CardContent className="px-0">
                    {cart.items.map((item) => (
                      <ProductoCartItem
                        producto={item}
                        key={`item-${item.folio}`}
                      />
                    ))}
                  </CardContent>
                  <CardFooter className="flex"></CardFooter>
                </>
              ) : (
                <div className="flex flex-col items-center gap-5 h-[55vh] justify-center p-10 bg-accent">
                  <img
                    src={CartVector}
                    alt=""
                    className="w-[100px] h-auto  drop-shadow opacity-60 grayscale  "
                  />

                  <div className="text-center">
                    <h2 className=" ">
                      !Empieza creando un carrito de compras!
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Agrega productos y realiza el pedido en un solo pedido.
                    </p>
                  </div>

                  <Link
                    to={`/commerce/${tiendaId}/productos`}
                    className={buttonVariants()}
                  >
                    Agrega productos de la tienda
                  </Link>
                </div>
              )}
            </Card>
          </section>

          <section className="col-span-3 md:col-span-1">
            <Card
              className={cn(
                "rounded-sm",
                cantidadProductos < 1 && "bg-accent text-muted-foreground"
              )}
            >
              <CardHeader>
                <CardTitle className="text-lg">Resumen de compra</CardTitle>
              </CardHeader>

              <Separator />
              {cantidadProductos > 0 ? (
                <>
                  <CardContent className="py-4 space-y-2">
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <h3 className="">Productos ({cantidadProductos})</h3>

                      <p>{totalCarrito}</p>
                    </div>

                    <div className="font-semibold text-lg flex justify-between gap-3">
                      <h2 className="">Total</h2>
                      <span>{totalCarrito}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link
                      to={`/commerce/${tiendaId}/transaction/buying/cart/${cart?.id}/shipping-method`}
                      className={buttonVariants({
                        className: "rounded-sm w-full  p-4",
                      })}
                    >
                      Continuar con la compra
                    </Link>
                  </CardFooter>
                </>
              ) : (
                <div className="p-5 bg-accent text-muted-foreground ">
                  <p className="text-sm ">
                    Aquí aparecerán los elementos seleccionados de tu compra una
                    vez que agregues productos.
                  </p>
                </div>
              )}
            </Card>
          </section>

          <Link
            className="text-sm flex gap-2 text-muted-foreground items-center col-span-3 md:col-span-1"
            to={`/commerce/${tiendaId}/productos`}
          >
            Ver más productos en la tienda <ArrowRightIcon />
          </Link>
        </main>
      ) : (
        <main className="space-y-2">
          <NavigatePreviousButton />
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle>
                Debes iniciar sesión para guardar en el carrito
              </CardTitle>
              <CardDescription>Por favor ingrese sesión</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                to="/login"
                className={buttonVariants({ className: "w-full" })}
              >
                Iniciar sesión
              </Link>
            </CardContent>
            <CardFooter>
              <span className="text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <Link to="/signup" className="underline-offset-3 underline">
                  Registrate aquí
                </Link>
              </span>
            </CardFooter>
          </Card>
        </main>
      )}
    </div>
  );
};
