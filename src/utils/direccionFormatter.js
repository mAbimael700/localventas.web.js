import { capitalizeFirstLetter } from "./capitalizeFirstLetter";

export function formatDireccion(direccion) {
  let string;

  const {
    calle,
    colonia,
    codigo_postal,
    ciudad,
    numInt,
    numExt,
    estado,
    pais,
  } = direccion || {};

  string = `C. ${capitalizeFirstLetter(calle)} Num. Ext. ${numExt}, ${numInt && `Num. Int ${numInt},`} ${codigo_postal} ${ciudad}, ${estado && estado.nombre}, ${pais && pais.nombre}`;

  return string;
}
