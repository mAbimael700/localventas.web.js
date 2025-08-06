import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
  } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import { Checkbox } from "@/components/ui/checkbox";
  import { Separator } from "@/components/ui/separator";
  import lionImg from "@/assets/lionred_001.png";
  import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
  import { ProductOptions } from "./product-options";
  
  export const ProductCardTest = ({producto}) => {
    
    return (
      <>
        <Card className="grid lg:grid-cols-[8px_200px_minmax(220px,auto)_minmax(350px,auto)]  md:grid-cols-[minmax(auto,15px)_minmax(150px,200px)_minmax(350px,auto)] grid-cols-[25px_minmax(100px,200px)_1fr]  p-2.5  gap-3 shadow-sm">
          <div className="flex items-center px-2 py-1">
            <Checkbox />
          </div>
  
          <picture className="m-[auto_auto] lg:w-[100px] md:w-[100px] col-span-3 lg:col-span-1 md:col-span-1 flex items-center  aspect-square  rounded-sm bg-gray-200">
            <img className="" src={producto.img} alt="" />
          </picture>
  
          <div className="relative px-1 col-span-3 lg:col-span-1 md:col-span-1">
            <Separator
              orientation="vertical"
              className="absolute -left-7 opacity-0 md:opacity-100 lg:opacity-100"
            />
            <span className="font-normal text-xs text-gray-500">#{producto.folio}</span>
            <CardTitle className="text-lg">{producto.nombre}</CardTitle>
            <span className="font-normal text-sm text-gray-800">
              {producto.fecha_creacion}
            </span>
  
            <ProductOptions />
          </div>
  
          
          <ScrollArea className="col-span-3 lg:col-span-1  rounded-sm md:col-span-3 ">
            <div className=" grid grid-cols-[repeat(7,_100px_1px)]  px-2 outline-none py-5 col-span-3 lg:col-span-1 relative text-sm  gap-2  text-gray-800 items-center justify-center bg-gray-100 ">
              <Badge
                variant="secondary"
                className="absolute top-0 rounded-sm font-medium select-none bg-slate-200 hover:bg-slate-300-100"
              >
                3 visitas
              </Badge>
  
              <div className="font-semibold text-center m-[0_auto]">
                <button className="select-none mb-0.5">Precio</button> <br />
                <span className="font-medium text-gray-600 tabular-nums">$ {producto.precio}</span>
              </div>
  
              <Separator orientation="vertical" />
  
              <div className="font-semibold text-center  text-sm m-[0_auto]">
                <button className="select-none mb-0.5">Costo</button>
                <br />
                <span className="font-medium  text-gray-600 tabular-nums">$ {producto.costo} </span>
              </div>
  
              <Separator orientation="vertical" />
  
              <div className="font-semibold text-center m-[0_auto]">
                <button className="select-none mb-0.5"> Ganancia </button> <br />
                <span className="font-medium text-gray-600">$ {producto.ganancia}</span>
              </div>
  
              <Separator orientation="vertical" />
              <div className="font-semibold text-center m-[0_auto]">
                <button className="select-none mb-0.5">Ganancias totales</button>{" "}
                <br />
                <span className="font-medium text-gray-600">$ 2,399.75</span>
              </div>
  
              <Separator orientation="vertical" />
              <div className="font-semibold text-center m-[0_auto]">
                <button className="select-none mb-0.5">Stock</button>
                <br />
                <span className="font-medium text-gray-600">{producto.stock}</span>
              </div>
              <Separator orientation="vertical" />
  
              <div className="font-semibold text-center text-medium m-[0_auto]">
                <button className="select-none mb-0.5">Piezas vendidas</button>
                <br />
                <span className="font-medium text-gray-600">24</span>
              </div>
              <Separator orientation="vertical" />
  
              <div className="font-semibold text-center m-[0_auto]">
                <button className="select-none mb-0.5 ">Estado</button>
                <br />
                <span className="font-medium text-gray-600">
                  <Badge className="capitalize">{producto.estado}</Badge>
                </span>
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Card>
      </>
    );
  };
  