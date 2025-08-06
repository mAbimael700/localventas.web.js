import tennis from "../assets/tennis.png";
import { Link } from "react-router-dom";
import { NavbarInfo } from "../components/info-navbar";
import { useAuth } from "../auth/auth-provider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import { cn } from "../lib/utils";
export const Index = () => {
  const auth = useAuth();
  return (
    <div className="bg-gradient-to-b from-red-700 from-50% to-red-950 min-h-screen flex flex-col gap-24">
      <NavbarInfo />

      <main className="text-[var(--color-light)]">
        <section
          className={cn(
            "w-ful flex flex-col items-center justify-center",
            !auth.isAuthenticated ? "space-y-12" : "space-y-8"
          )}
        >
          <header>
            <h1 className="text-5xl md:text-7xl sm:min-w-[500px] text-center md:min-w-[500px] lg:w-full lg:text-7xl font-['Gill_Sans_MT'] font-semibold">
              EMPIEZA TU NEGOCIO
            </h1>
          </header>
          <div>
            {!auth.isAuthenticated ? (
              <Link
                to="/signup"
                className=" rounded-full  flex px-4 py-2.5 items-center bg-[var(--red-highlight)] border-background border shadow hover:transition-all"
              >
                Comienza ahora
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <Label className="text-xl font-medium">
                  Descubre comercios en nuestra plataforma
                </Label>
                <Button className="rounded-full place-self-center border-none">
                  Navegar tiendas
                </Button>
              </div>
            )}
          </div>

          <picture className=" hidden md:flex lg:flex items-center justify-center w-[60%]">
            <img src={tennis} alt="" srcSet="" />
          </picture>
        </section>
      </main>
    </div>
  );
};
