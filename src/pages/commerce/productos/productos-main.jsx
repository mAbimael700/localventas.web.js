import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import {
  getProductosByTienda,
  getProductosPublicByTienda,
} from "../../../services/productos";
import {
  ProductoCard,
  ProductoCardSkeleton,
} from "../../../components/commerce/productos/producto-card";
import { ProductosSearch } from "./productos-search";
import defaultBanner from "../../../assets/default-banner.jpg";
export const ProductosMain = () => {
  const [queryParams] = useSearchParams();
  const [productos, setProductos] = useState(null);
  const { tienda } = useParams();

  async function getProductos() {
    const response = await getProductosPublicByTienda({ tiendaId: tienda });

    if (response.ok) {
      const json = await response.json();
      setProductos(json.body.data);
    } else {
      setProductos([]);
    }
  }

  useEffect(() => {
    getProductos();
  }, [tienda]);

  return (
    <main className="space-y-5">
      {queryParams.has("s") ? (
        <ProductosSearch />
      ) : (
        <div className="pb-10">
          <header className="h-32 md:h-72 z-10 bg-accent-foreground"></header>

          <section className="flex flex-col">
            <div className="w-full lg:w-[85vw] md:w-[85vw] place-self-center space-y-5 p-5 ">
              <Label className="text-lg place-self-start">
                Productos publicados
              </Label>
              <div className="gap-1 grid grid-cols-[repeat(auto-fill,minmax(225px,1fr))] lg:gap-5 md:gap-5">
                {productos
                  ? productos.map((e) => {
                      const photo = e.principal_photo;
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
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};
