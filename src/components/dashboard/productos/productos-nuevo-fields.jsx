import { CameraIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export const productosFormFields = [
    {
      title: "Datos del producto",
      desc: "Maneja los datos de publicación del nuevo producto.",
      fields: [
        {
          name: "nombre",
          label: "Nombre",
          input: <Input type="text" className="h-8 " />,
          desc: "Este será el nombre del producto que se les mostrará a los clientes.",
        },
        {
          name: "precio_compra",
          label: "Costo",
          input: <Input type="text" className="h-8" />,
  
          desc: "Coloca el costo invertido en la compra del producto que vas a publicar.",
        },
        {
          name: "ganancia",
          label: "Ganancia",
          input: <Input type="text" className="h-8" />,
          desc: "Establece la ganancia que desea ganar por cada venta del producto.",
        },
        {
          name: "precio_venta",
          label: "Precio final",
          input: <Input readOnly type="text" className="h-8" />,
          desc: "Este es el precio de venta que se le mostrará al cliente.",
        },
        {
          name: "existencias",
          label: "Stock",
          input: <Input type="number" className="h-8 w-[180px]" />,
          desc: "Establece la cantidad de piezas que tienes disponibles a venta de este producto.",
        },
      ],
    },
    {
      title: "Descripción",
      desc: "Maneja los datos de descripción del nuevo producto.",
      fields: [
        {
          name: "descripcion",
          label: "Descripción",
          input: (
            <Textarea
              className="resize-none"
              placeholder="Cuéntanos un poco sobre el producto"
            />
          ),
          desc: "Proporciona una descripción que ayude al cliente comprender el producto.",
        },
        {
          name: "marca",
          label: "Marca",
          input: <></>,
          desc: "Selecciona la marca a la que pertenece el producto.",
        },
        {
          name: "categoria",
          label: "Categoría",
          input: <></>,
          desc: "Selecciona la categoría a la que pertenece el producto.",
        },
      ],
    },
  
    {
      title: "Fotos del producto",
      desc: "Maneja las fotografías de publicación del nuevo producto.",
      fields: [
        {
          name: "fotos",
          label: (
            <>
              <Label>Fotos</Label>
  
              <div className="rounded aspect-square border shadow-sm h-20 w-[5.5rem] hover:bg-zinc-100 hover:ease-in-out duration-200 flex flex-col justify-center items-center">
                <CameraIcon className="w-8" />
                <span className="text-sm">Agregar</span>
              </div>
            </>
          ),
          input: (
            <Input
              className="hidden"
              type="file"
              accept="image/png, image/gif, image/jpeg"
            />
          ),
          desc: "Selecciona fotografías del producto.",
        },
      ],
    },
  ];