import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
export const AuthUserFormLayout = ({ children, className }) => {
  const { pathname } = useLocation();
  return (
    <div className="absolute lg:top-0 ">
      <div className="container relative h-screen w-screen first-letter:flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          to={pathname === "/login" ? "/signup" : "/login"}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "hidden lg:block lg:absolute right-4 top-4 md:right-8 md:top-8",
            
          )}
        >
          {pathname === "/login" ? "Registrarse" : pathname === "/signup" ?" Iniciar sesión" : ''}
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-6 text-background lg:flex dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--red-background)] from-5%  to-red-950 to-95%" />
          <Link
            to={"/"}
            className="fixed z-20 title flex items-center text-lg "
          >
            LOCALVENTAS
          </Link>
          <div className="relative z-20 mt-auto bg" >
            <blockquote className="space-y-2 fixed bottom-7 w-[40%]">
              <p className="text-lg ">
                &ldquo;Esta herramienta me ayudó a mejorar la exposición de los
                productos de mis negocios a un mayor público y ahora mis
                clientes pueden comprar de forma más cómoda.&rdquo;
              </p>
              <footer className="text-sm bg-transparent p-0">
                <br />
                Nereyda Landero
              </footer>
            </blockquote>

            
          </div>
          
        </div>
        <div className="lg:p-8 flex justify-center items-center h-full">
          <div
            className={cn(
              " lg:mx-auto flex flex-col justify-center space-y-6 sm:w-[380px] py-6",
              className
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
