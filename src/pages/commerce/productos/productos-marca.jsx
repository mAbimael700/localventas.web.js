import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ProductoCard,
  ProductoCardSkeleton,
} from "../../../components/commerce/productos/producto-card";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { useParams } from "react-router-dom";
import { getMarcaById } from "../../../services/marcas";
import {
  getProductosByTienda,
  getProductosPublicByTienda,
} from "../../../services/productos";
import { DialogFilterProducts } from "../../../components/commerce/cart/filters/dialog-filter-products";

export const CommerceProductosMarca = ({}) => {
  const [marcaData, setMarcaData] = useState(null);
  const [productosData, setProductosData] = useState(null);

  const { marca, tienda } = useParams();

  async function getMarca() {
    const response = await getMarcaById({ marcaId: marca, tiendaId: tienda });

    if (response.ok) {
      const json = await response.json();
      console.log(json);
      setMarcaData(json.body);
    } else {
      setMarcaData({});
    }
  }

  async function getProductos() {
    const response = await getProductosPublicByTienda({
      tiendaId: tienda,
      queryParams: [`marca=${marca}`],
    });

    if (response.ok) {
      const json = await response.json();
      setProductosData(json.body.data);
    } else {
      setProductosData([]);
    }
  }

  useEffect(() => {
    getMarca();
    getProductos();
  }, [marca, tienda]);
  return (
    <div>
      <div className="space-y-5 p-5 flex items-center flex-col">
        <div className="w-[90vw] space-y-5">
          <header>
            <h1 className="text-3xl font-semibold">
              {marcaData && marcaData.marca}
            </h1>
            <p className="text-muted-foreground ">
              Compra los productos de la marca {marcaData && marcaData.marca}
            </p>
          </header>

          <DialogFilterProducts/>

          <section className=" grid gap-1 grid-cols-[repeat(auto-fill,minmax(225px,1fr))] lg:gap-5 md:gap-5  ">
            {productosData
              ? productosData.map((e) => {
                  
                  return (
                    <ProductoCard
                      key={"product-card -" + e.folio}
                      className="rounded-sm "
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
    </div>
  );
};
