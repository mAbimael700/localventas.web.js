import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useShoppingCart } from "../../../hooks/shopping-cart/useShoppingCart";
import { Input } from "@/components/ui/input";
import Decimal from "decimal.js";
import { currencyFormat } from "../../../utils/numberFormatting";

export const ProductoCartItem = ({ producto }) => {
  const { tienda } = useParams();

  const { addToCart, removeToCart, setQuantityElement, subtractToCart } = useShoppingCart();

  const {
    folio,
    producto: nombre,
    nombre: name,
    categoria,
    marca,
    stock,
    principal_photo,
    cantidad,
    precio_venta,
  } = producto;

  function handleAddProduct() {
    addToCart(producto);
  }

  function handleSubtractProduct(){
    subtractToCart(producto)
  }

  function handleOnChange(e) {
    setQuantityElement(producto, e.target.value);
  }

  function handleDeleteProduct() {
    removeToCart(producto);
  }

  const decimalPrecioVenta = new Decimal(precio_venta || 0);
  const decimalCantidad = new Decimal(cantidad || 0);
  const total = () => decimalCantidad.times(decimalPrecioVenta).toNumber();
  return (
    <Card className=" rounded-sm shadow-sm border-0 hover:bg-accent p-3">
      <CardContent className="p-2 grid grid-cols-8 justify-between items-start gap-5">
        <div className="flex flex-row gap-5 col-span-5">
          <picture className="rounded border aspect-square h-[70px] w-[70px] p-0.5 flex items-center justify-center">
            <LazyLoadImage
              className="max-h-[67px]"
              effect="opacity"
              src={principal_photo?.path || principal_photo}
            />
          </picture>

          <div className="space-y-2">
            <div>
              <Link to={`/commerce/${tienda}/productos/${folio}`}>
                <CardTitle className="py-0 text-lg">{nombre || name}</CardTitle>
                <div className="flex gap-3">
                  <CardDescription># {folio}</CardDescription>
                  <span className="text-sm text-muted-foreground">
                    Marca: <Link>{marca.nombre || marca}</Link>
                  </span>
                </div>
              </Link>
            </div>

            <button
              className="font-medium text-sm hover:text-destructive transition-all"
              onClick={handleDeleteProduct}
            >
              Eliminar
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 justify-center items-center col-span-2">
          <div className="flex items-center">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 rounded-e-none rounded-s-sm"
              onClick={handleSubtractProduct}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              className="h-7 rounded-e-none border-s-0  border-e-0 rounded-s-none w-[70px]"
              value={cantidad}
              onChange={handleOnChange}
            />
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 rounded-s-none rounded-e-sm"
              onClick={handleAddProduct}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{stock} disponibles</p>
        </div>

        <div className="tabular-nums min-w-[70px] font-medium">
          {currencyFormat(total())}
        </div>
      </CardContent>
    </Card>
  );
};
