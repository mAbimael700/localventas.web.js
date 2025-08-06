import React from "react";
import { useCommerce } from "../../../hooks/commerce/useCommerce";
import { LazyCargandoLoader } from "../../../components/loaders/lazy-text-loader";

export const CategoriasMain = () => {
  const { tienda } = useCommerce();
  return (
    <div>
      {tienda && Object.keys(tienda).length > 0 ? (
        <div>
          <h1 className="font-medium text-2xl">Categorias de la tienda {tienda.nombre}</h1>
        </div>
      ) : (
        <LazyCargandoLoader label="Cargando categorias de la tienda..." />
      )}
    </div>
  );
};
