import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate, useParams } from "react-router-dom";
import { useShoppingCart } from "../../../hooks/shopping-cart/useShoppingCart";

export const currencyFormat = (value, currency = "USD") => {
  if (isNaN(value)) {
    return (
      <span className="text-muted-foreground text-sm ">
        Formato <br />
        no válido.
      </span>
    );
  }

  // Format the amount as a dollar amount
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);

  return formatted;
};

export const ProductoCardSkeleton = () => {
  return (
    <Card className="w-full md:w-[250px] border-none lg:w-[250px] lg:block md:block flex justify-self-center shadow-sm hover:transition-all col-span-full md:col-span-1 lg:col-span-1">
      <CardHeader className="p-3 ">
        <Skeleton className="aspect-square rounded-sm min-w-[180px]" />
      </CardHeader>

      <span className="w-full">
        <CardContent className="space-y-1 py-3 ">
          <div className="space-y-1">
            <Skeleton className="h-5 " />
            <Skeleton className="h-5 w-16" />
          </div>

          <Skeleton className="h-5" />

          <Skeleton className="h-7 w-20" />
        </CardContent>
        <CardFooter className="p-3">
          <Skeleton className="h-8 w-full" />
        </CardFooter>
      </span>
    </Card>
  );
};

export const ProductoCard = ({
  isHorizontal = false,
  productoData,
  className,
}) => {
  const { tienda } = useParams();
  const {
    producto,
    precio_venta,
    marca,
    categoria,
    principal_photo,
    folio,
    tienda: tiendaData,
  } = productoData;
  const goTo = useNavigate();
  const { addToCart } = useShoppingCart();

  function handleAddToCart(e) {
    e.stopPropagation();
    addToCart(productoData);
  }

  return (
    <Card
      onClick={() => folio && goTo(`/commerce/${tienda}/productos/${folio}`)}
      className={cn(
        "w-full shadow-sm flex hover:transition-all rounded-sm hover:shadow-md cursor-pointer",
        className,
        !isHorizontal &&
          "md:w-[250px] lg:w-[250px] md:flex-col lg:flex-col col-span-3 md:col-span-1 lg:col-span-1"
      )}
    >
      <CardHeader
        className={cn(
          "p-2 w-[250px] justify-center flex items-center border-b border-muted",
          isHorizontal && "w-[250px]"
        )}
      >
        <picture className="max-h-[200px] aspect-square rounded-sm flex items-center justify-center">
          {principal_photo ? (
            <LazyLoadImage
              effect="opacity"
              src={principal_photo?.path}
              alt={producto}
              className={cn(
                "max-h-[200px]  w-auto pointer-events-none",
                isHorizontal && "max-w-[100px] md:max-w-[200px] "
              )}
            />
          ) : (
            <QuestionMarkCircledIcon className="h-[160px] w-full text-muted-foreground" />
          )}
        </picture>
      </CardHeader>

      {/* {!isHorizontal && <Separator className="hidden md:block lg:block" />} */}

      <span className="align-middle h-full w-full flex flex-col justify-between">
        <CardContent className="space-y-3 py-3 flex-col flex">
          <div className="space-y-1.5 hidden  md:block  items-center ">
            {marca && <Badge className="rounded mr-2">{marca}</Badge>}

            {categoria && (
              <Badge className="rounded" variant="secondary">
                {categoria}
              </Badge>
            )}
          </div>

          <h1 className="text-xl font-medium order-2 md:order-1">
            {currencyFormat(precio_venta)}
          </h1>
          <div className="order-1 md:order-2">
            <h2 className="">{producto}</h2>
            <p className="text-xs text-muted-foreground">
              Vendido por {tiendaData.nombre}
            </p>
          </div>
        </CardContent>

        <CardFooter className="pt-auto p-3 ">
          <Button
            onClick={handleAddToCart}
            type="button"
            variant="outline"
            className="w-full h-9 rounded-sm text-foreground hover:bg-primary hover:text-background"
          >
            Agregar al carrito
          </Button>
        </CardFooter>
      </span>
    </Card>
  );
};
