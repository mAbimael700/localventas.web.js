import { Card } from "@/components/ui/card";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { Search } from "../search-input";
import { ProductCard } from "../../components/dashboard/product-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductFilterButton } from "./product-filter-button";
import { ProductCardTest } from "./product-card-test";
import lionImg from "../../assets/lionred_001.png";

const productData = {
  img: lionImg,
  nombre: "Playera Gecko's Blanca",
  folio: '44432224',
  fecha_creacion : '12 de Diciembre de 2023',
  costo: 100,
  ganancia: 200,
  stock: 4,
  estado: "activo",
  precio: 300

}

export const ProductList = () => {
  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center justify-between ">
        <div className="flex gap-3 items-center">
          <Search placeholder={"Buscar producto."} />

          <ProductFilterButton />
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button variant="outline">
            <PlusCircledIcon className="mr-2 h-5 w-5" />
            Agregar
          </Button>
          <span className="lg:text-sm md:text-sm font-medium px-3 sm:text-xs">
            1 Productos
          </span>
        </div>
      </div>

      <Card className="">
        <div className="px-5 py-1 flex gap-10 items-center">
          <Checkbox />

          <div className="space-x-1">
            <Button variant="ghost" disabled>
              Pausar
            </Button>
            <Button variant="ghost" disabled>
              Reactivar
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-transparent hover:text-destructive"
              disabled
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <ProductCardTest producto={productData} />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <Button variant="outline" size="icon">
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="font-semibold text-sm pr-2">
          Mostrando 1 a 4 del total de 4 publicaciones
        </div>
      </div>
    </div>
  );
};
