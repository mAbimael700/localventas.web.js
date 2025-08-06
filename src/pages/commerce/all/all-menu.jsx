import React, { useEffect, useState } from "react";
import { getAllTiendas } from "../../../services/tiendas";
import { TiendaCard } from "../../../components/dashboard/main/tienda-card";
import { LazyCargandoLoader } from "../../../components/loaders/lazy-text-loader";
import { NavbarInfo } from "../../../components/info-navbar";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Banner from "../../../assets/tiendas-banner.png";
import { cn } from "../../../lib/utils";
import { Search } from "../../../components/search-input";
export const CommerceAllMenu = () => {
  const [tiendas, setTiendas] = useState(null);

  async function getTiendas() {
    const response = await getAllTiendas();

    if (response) {
      setTiendas(response);
    }
  }

  useEffect(() => {
    getTiendas();
  }, []);
  return (
    <div className="pb-6">
      <div className="border-b bg-primary text-primary-foreground">
        <NavbarInfo />
      </div>

      <div className="space-y-5">
        <header className=" relative w-screen h-[350px] bg-primary flex justify-center">
          <div className="flex items-center  gap-12">
            {/* <LazyLoadImage
              effect="opacity"
              src={Banner}
              alt="Banner de tienda"
              className={cn(
                " hidden md:block w-auto pointer-events-none h-[350px]"
              )}
            /> */}

            <h1 className="text-5xl font-bold text-primary-foreground ">
              Tiendas alojadas en <span className="title">Localventas</span>
            </h1>
          </div>

          <Link
            className="text-xs text-primary-foreground absolute right-6 bottom-4"
            to="https://www.freepik.com/free-psd/online-store-icon-isolated-3d-render-illustration_32463151.htm#fromView=search&page=2&position=17&uuid=96dd305a-35af-4ef2-89bb-c1359cf32980"
          >
            Image by xvector on Freepik
          </Link>
        </header>
        <main className="flex flex-col w-screen items-center">
          <section className=" flex flex-col gap-5 w-4/5 justify-center">
            <Search className='h-8' placeholder="Buscar tienda..."/>
            {tiendas ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(255px,1fr))] h-auto gap-5 ">
                {tiendas.map((tienda) => (
                  <TiendaCard
                    key={`card-tienda-${tienda.id}`}
                    tienda={tienda}
                    to={`/commerce/${tienda.id}/productos`}
                  />
                ))}
              </div>
            ) : (
              <LazyCargandoLoader label="Cargando tiendas..." />
            )}
          </section>
        </main>
      </div>
    </div>
  );
};
