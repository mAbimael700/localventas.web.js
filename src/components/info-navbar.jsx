/* eslint-disable react/prop-types */
import Navbar from "./index-navbar";
import "./css/info-navbar.css";
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useAuth } from "../auth/auth-provider";
import { UserNav } from "./dashboard/user-nav";

function NavbarSection({ className, children }) {
  return (
    <>
      <div className={cn("col", className)}>{children}</div>
    </>
  );
}

function NavbarButton({ children, href, isCircle, className }) {
  return (
    <>
      {isCircle ? (
        <li>
          <NavLink
            className={cn("rounded-full border p-2  hover:bg-red-600 transition-all  px-2 shadow ", className)}
            to={href}
            
          >
            {children}
          </NavLink>
        </li>
      ) : (
        <li className="btn font-normal">
          <NavLink
            className={({ isActive }) =>
              isActive ? "navbar_active" : className
            }
            to={href}
            end
          >
            {children}
          </NavLink>
        </li>
      )}
    </>
  );
}

export function NavbarInfo() {
  const [navbarColor, setNavbarColor] = useState("default");
  const [navbarBackgroundColor, setNavbarBackgroundColor] = useState("default");
  const location = useLocation();
  const auth = useAuth();

  const navbarStyle = {
    background:
      navbarBackgroundColor !== "default" ? navbarBackgroundColor : "transparent",
    color: navbarColor !== "default" ? navbarColor : "inherit",
  };

  useEffect(() => {
    // Determina el color del navbar en función de la ruta actual

    if (location.pathname === "/") {
      setNavbarColor("#fff");
      setNavbarBackgroundColor("transparent");
    } else {
      setNavbarColor("default");
      setNavbarBackgroundColor("default"); // Color predeterminado
    }
  }, [location.pathname]);

  return (
    <>
      <Navbar
        style={navbarStyle}
        backgroundColor={navbarBackgroundColor}
        color={navbarColor}
      >
        <DropdownMenu>
          <DropdownMenuTrigger className=" absolute md:hidden lg:hidden top-4 left-2 z-50">
            <HamburgerMenuIcon className="h-6 w-6" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ml-2">
            <DropdownMenuLabel>Menú</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={"/"}>Inicio</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={"./services"}>Servicios</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={"./about"}>¿Quiénes somos?</Link>
            </DropdownMenuItem>
            {!auth.isAuthenticated ? (
              <>
                <DropdownMenuItem asChild>
                  <Link to={"./login"}>Iniciar sesión</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={"./signup"}>Registrarse</Link>
                </DropdownMenuItem>
              </>
            ):  <><DropdownMenuItem asChild>
            <Link to={"./dashboard"}>Administrar</Link>
          </DropdownMenuItem></>}
            
          </DropdownMenuContent>
        </DropdownMenu>

        <NavbarSection
          className={cn(
            location.pathname === "/signup"
              ? "hidden"
              : location.pathname === "/login"
              ? "hidden"
              : location.pathname === "/select-plan"
              ? "hidden"
              : "hidden md:block lg:block"
          )}
        >
          <ul className="flex gap-6">
            <NavbarButton isActive href="/services">
              Servicios
            </NavbarButton>
            <NavbarButton href="/acerca">¿Quiénes somos?</NavbarButton>
            <NavbarButton href="/commerce/all">Tiendas</NavbarButton>
          </ul>
        </NavbarSection>

        <div
          className={cn(
            location.pathname === "/signup"
              ? "hidden"
              : location.pathname === "/login"
              ? "hidden"
              : location.pathname === "/select-plan"
              ? "hidden"
              : "text-center col-span-3 lg:col-span-1  md:col-span-1"
          )}
        >
          <Link to="/" className="title text-2xl self-center">
            Localventas
          </Link>
        </div>

        {auth.isAuthenticated ? (
          <NavbarSection className={"hidden md:flex gap-6 items-center "}>
            <NavbarButton href="/products">Productos</NavbarButton>
            <NavbarButton href="/dashboard">Administrar</NavbarButton>
            <span className="text-black">
              <UserNav />
            </span>
          </NavbarSection>
        ) : (
          <NavbarSection
            className={cn(
              location.pathname === "/signup"
                ? "hidden"
                : location.pathname === "/login"
                ? "hidden"
                : "hidden md:block lg:block"
            )}
          >
            <ul className="flex gap-6 ">
              <NavbarButton href="/products">Productos</NavbarButton>
              <NavbarButton href="/signup">Regístrate</NavbarButton>
              <NavbarButton href="/login" className="border border-background p-2 rounded-md ">

                Iniciar sesión
              </NavbarButton>
            </ul>
          </NavbarSection>
        )}
      </Navbar>

      <Outlet />
    </>
  );
}
