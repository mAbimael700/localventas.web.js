import * as z from "zod";
import Decimal from "decimal.js";

export const productosSchema = z
  .object({
    nombre: z
      .string({ required_error: "Por favor ingrese el nombre del producto." })
      .min(2, { message: "El producto debe tener mínimo dos caracteres." })
      .max(50),
    precio_compra: z
      .string({ required_error: "Por favor ingresa el costo del producto." })
      .min(1, {
        message: "Por favor ingresa el costo del producto.",
      })
      .refine((precio) => !isNaN(parseFloat(precio)), {
        message: "El precio debe ser un número",
      })
      .transform((str) => {
        const parsedValue = parseFloat(str);
        return isNaN(parsedValue) ? undefined : parsedValue;
      }),
    ganancia: z
      .string({ required_error: "Por favor ingresa la ganancia del producto." })
      .min(1, {
        message: "Por favor ingresa el costo del producto.",
      })
      .refine((precio) => !isNaN(parseFloat(precio)), {
        message: "El precio debe ser un número",
      })
      .transform((str) => {
        const parsedValue = parseFloat(str);
        return isNaN(parsedValue) ? undefined : parsedValue;
      }),
    /* precio_venta: z
      .string({ required_error: "Por favor ingresa la ganancia del producto." })
      .min(1, {
        message: "Por favor ingresa el costo del producto.",
      })
      .refine((precio) => !isNaN(parseFloat(precio)), {
        message: "El precio debe ser un número",
      })
      .transform((str) => {
        const parsedValue = parseFloat(str);
        return isNaN(parsedValue) ? undefined : parsedValue;
      }), */
    descripcion: z.string(),
    cve_marca: z.number().int().positive(),
    cve_categoria: z.number().int().positive(),
    existencias: z
      .string({
        required_error: "Por favor ingresa las existencias del producto.",
      })

      .refine(
        (numb) => {
          const isNumber = !isNaN(parseFloat(numb));
          const number = parseFloat(numb);

          return isNumber && number > -1;
        },
        {
          message: "El precio debe ser un número",
        }
      )
      .transform((str) => {
        const parsedValue = parseFloat(str);
        return isNaN(parsedValue) ? undefined : parsedValue;
      }),
    fotografias: z
      .array(
        z
          .object({
            nombre: z.string().optional(),
            path: z.string().optional(),
            id: z.number().int().positive().optional(),
            estado: z.boolean(),
            principal: z.boolean().default(false),
            file: z.custom((file) => {
              return file instanceof File
                ? file
                : "Debe ser un archivo de tipo File";
            }),
          })
          .transform((data) => ({
            ...data,
            nombre: data.file ? data.file.name : data.nombre,
          }))
      )
      .min(1)
      .max(10, {
        message:
          "Solo puedes mostrar 10 fotografías en una publicación por producto.",
      }),
  })
  /* .refine(
    (data) => {

    
      let precioVenta = new Decimal(data.precio_venta);
      let precioCompra = new Decimal(data.precio_compra);
      let precioGanancia = new Decimal(data.ganancia);

      console.log(precioVenta.equals(precioCompra.add(precioGanancia)));
      return precioVenta.equals(precioCompra.add(precioGanancia));
    },
    {
      message:
        "El precio de venta debe ser la suma de precio_compra y ganancia.",
    }
  ) */
  .transform((data) => ({
    ...data,

    precio_venta: new Decimal(data.precio_compra)
      .add(new Decimal(data.ganancia))
      .toNumber(),
  }));
