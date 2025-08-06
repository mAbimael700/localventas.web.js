import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ProductoCard,
  ProductoCardSkeleton,
} from "../../../components/commerce/productos/producto-card";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { useParams } from "react-router-dom";
import { getProductosByTienda, getProductosPublicByTienda } from "../../../services/productos";
import { getCategoriaById } from "../../../services/categorias";

export const CommerceProductosCategoria = ({}) => {
  const [categoriaData, setCategoriaData] = useState(null);
  const [productosData, setProductosData] = useState(null);

  const { categoria, tienda } = useParams();

  async function getCategoria() {
    const response = await getCategoriaById({
      categoriaId: categoria,
      tiendaId: tienda,
    });

    if (response.ok) {
      const json = await response.json();

      setCategoriaData(json.body.data);
    } else {
      setCategoriaData({});
    }
  }

  async function getProductos() {
    const response = await getProductosPublicByTienda({
      tiendaId: tienda,
      queryParams: [`categoria=${categoria}`],
    });

    if (response.ok) {
      const json = await response.json();
      setProductosData(json.body.data);
    } else {
      setProductosData([]);
    }
  }

  useEffect(() => {
    getCategoria();
    getProductos();
  }, [categoria, tienda]);
  return (
    <div>
      <div className="space-y-5 p-5 flex items-center flex-col">
        <div className="w-[90vw] space-y-5">
          <header>
            <h1 className="text-3xl font-semibold">
              {categoriaData && categoriaData.categoria}
            </h1>
            <p className="text-muted-foreground ">
              Compra los productos de la categoría{" "}
              {categoriaData && categoriaData.categoria}
            </p>
          </header>

          <Button className="h-8">
            <MixerHorizontalIcon className="h-4 w-4 mr-2" />
            Filtrar
          </Button>

          <section className=" grid gap-1 grid-cols-[repeat(auto-fill,minmax(225px,1fr))] lg:gap-5 md:gap-5 place-items-center">
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
