import { CommerceNav } from "../../components/commerce/commerce-nav";
import { Search } from "../../components/search-input";
import { Link, Outlet, useParams } from "react-router-dom";
import { UserNav } from "../../components/dashboard/user-nav";
import { SearchIcon, ShoppingCart, UserPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../auth/auth-provider";
import { buttonVariants } from "@/components/ui/button";
import { ProductsSearch } from "../../components/commerce/main-navbar/products-search";
import { getTiendaById } from "../../services/tiendas";
import { useEffect, useState } from "react";
import { EnterIcon } from "@radix-ui/react-icons";
import { useMediaQuery } from "@uidotdev/usehooks";
import { ShoppingCartProvider } from "../../contexts/shopping-cart-context";
import { useShoppingCart } from "../../hooks/shopping-cart/useShoppingCart";
import { useCommerce } from "../../hooks/commerce/useCommerce";

export const CommerceLayout = () => {
  const { tienda: tiendaData, marcas, categorias } = useCommerce();

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { tienda } = useParams();
  const { getQuantityProducts, cart } = useShoppingCart();

  const menuBar = [
    { nombre: "Productos", key: "productos", component: "./productos" },
  ];

  const auth = useAuth();
  return (
    <div className="flex-col md:flex bg-accent">
      <div className="bg-primary text-primary-foreground border-b border-muted-foreground">
        <div className="flex h-16 items-center justify-between px-4  ">
          <div className="flex space-x-5 mx-5 items-center">
            <CommerceNav menuData={menuBar} tiendaData={tiendaData} />
          </div>

          <div className="flex items-center gap-4  ">
            <div className="flex items-center gap-4">
              <ProductsSearch />

              <div className="relative">
                <Link
                  to={`/commerce/${tienda}/cart`}
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8",
                  })}
                >
                  <ShoppingCart className="h-4" />
                </Link>
                {cart.items?.length > 0 && (
                  <span className="text-xs rounded-full bg-primary-foreground absolute bottom-0 flex items-center justify-center h-4 w-4 font-semibold  overflow-hidden text-primary">
                    {getQuantityProducts()}
                  </span>
                )}
              </div>
            </div>

            {auth.isAuthenticated ? (
              <UserNav className="text-black" />
            ) : (
              <div className="pl-3 hidden md:flex gap-3">
                <Link
                  className={buttonVariants({
                    variant: "ghost",
                    size: isDesktop ? "" : "icon",
                  })}
                  to="/login"
                >
                  {isDesktop ? "Ingresar" : <EnterIcon className="h-5 w-5" />}
                </Link>
                <Link
                  className={buttonVariants({
                    variant: "ghost",
                    size: isDesktop ? "" : "icon",
                  })}
                  to="/signup"
                >
                  {isDesktop ? (
                    "Registrarse"
                  ) : (
                    <UserPlusIcon className="h-5 w-5" />
                  )}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="z-10 shadow min-h-screen">
        <Outlet />
      </main>

      <footer className="bg-primary text-primary-foreground min-h-[190px] p-10 pb-5 flex w-full flex-col relative gap-6 justify-between">
        {tiendaData && (
          <div className="grid grid-cols-4">
            <div className="space-y-2 md:col-span-2 col-span-4 ">
              <h3 className="font-semibold text-xl">{tiendaData.nombre}</h3>
              <p className="text-sm">{tiendaData.descripcion}</p>
              <Link
                to={`/commerce/${tienda}/productos`}
                className="text-sm flex gap-2 items-center"
              >
                <EnterIcon /> Ir al página principal
              </Link>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-medium">Marcas</h4>
              <ul>
                {Array.from(marcas)
                  .slice(0, 5)
                  .map((marca) => (
                    <li className="text-sm" key={`marca-footer-${marca.id}`}>
                       <Link
                        to={`/commerce/${tienda}/marcas/${marca.id}`}
                      >
                        {marca.marca}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-medium">Categorías</h4>
              <ul>
                {Array.from(categorias)
                  .slice(0, 5)
                  .map((categoria) => (
                    <li
                      className="text-sm"
                      key={`categoria-footer-${categoria.cve_categoria}`}
                    >
                      <Link
                        to={`/commerce/${tienda}/categorias/${categoria.cve_categoria}`}
                      >
                        {categoria.nombre}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        <div className="self-center text-sm">
          Página proveída por <span className="title ">Localventas</span>
        </div>
      </footer>
    </div>
  );
};
