import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/auth-provider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TiendaCard } from "../../components/dashboard/main/tienda-card";
import { UserNav } from "../../components/dashboard/user-nav";
import { TiendaNewCard } from "../../components/dashboard/main/tienda-new-card";
import boxImg from "@/assets/ecommerce-box.png";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { getTiendasByUser } from "../../services/tiendas";
import { UserNavbar } from "../../components/user/user-navbar";

const TiendasCardList = ({ tiendasList }) => {
  return tiendasList ? (
    Array.from(tiendasList).map((tienda) => (
      <TiendaCard
        tienda={tienda}
        key={`${tienda.id}-store`}
      />
    ))
  ) : (
    <>Loading...</>
  );
};

export const MainDashboardMenu = () => {
  const auth = useAuth();
  const [tiendas, setTiendas] = useState([]);

  const userid = auth.getUser()?.id;

  async function getTiendas() {
    try {
      const data = await getTiendasByUser({ userid });
      if (data.body) {
        setTiendas(data.body);
      } else {
        setTiendas([]);
      }
    } catch (error) {
      console.error("Error al obtener las tiendas:", error);
      // Manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario.
    }
  }
  useEffect(() => {
    if (userid) {
      getTiendas();
    }
  }, [userid]);

  return (
    <div className="h-screen space-y-4 flex flex-col items-center">
      <div className="flex bg-gradient-to-b from-red-700 from-60% to-red-900 items-center flex-col pb-6">
        <UserNavbar className="text-primary-foreground" />

        <main className="space-y-4 w-full md:w-fit lg:w-fit lg:-my-3 px-4">
          <section className={cn("space-y-2 lg:space-y-6")}>
            <Label className={"text-xl text-white font-semibold"}>
              Tus negocios en Localventas
            </Label>

            {tiendas && tiendas.length > 0 ? (
              <div className="max-h-96 scroll overflow-y-auto rounded-sm px-3 gradient-mask-none lg:gradient-mask-b-[#ffffff_375px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                  <TiendaNewCard />

                  <TiendasCardList tiendasList={tiendas} />
                </div>
              </div>
            ) : (
              <div className="w-[50rem]">
                <span className="text-primary-foreground">
                  Empieza un negocio en la plataforma. <br />
                  <br />
                </span>
                <TiendaNewCard />
              </div>
            )}
          </section>

          <Separator></Separator>
        </main>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5 px-2 w-full lg:w-[850px] ">
        <Card className="shadow-md col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">
              {tiendas && tiendas.length > 0
                ? "Selecciona una tienda para empezar a administrarla."
                : "Empieza creando una tienda en Localventas."}
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
        </Card>
        <Card className="shadow-md lg:col-span-2 md:col-span-2 flex">
          <CardHeader className="w-96">
            <CardTitle className="text-lg">
              Las tiendas en Localventas son los negocios que administras.
            </CardTitle>
            <CardDescription>
              Puedes administrar todos tus negocios en un solo lugar con nuestra
              plataforma de manera práctica y segura.
            </CardDescription>
            <Link
              className="text-xs self-end text-muted-foreground"
              to="https://www.freepik.com/free-psd/3d-rendering-online-order-parcel-delivery_29210270.htm#query=ecommerce&position=8&from_view=search&track=sph&uuid=342c4553-b687-4ec8-9b8c-7349e23f0b3d"
            >
              Image by jcomp on Freepik
            </Link>
          </CardHeader>

          <picture className="pointer-events-none">
            <img className="w-44" src={boxImg} alt="" />
          </picture>
        </Card>
      </section>
    </div>
  );
};
