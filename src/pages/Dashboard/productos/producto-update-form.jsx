import React, { useEffect, useState } from "react";
import { ProductoForm } from "./producto-form";
import { getProductoById } from "../../../services/productos";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../../auth/auth-provider";

export const ProductoUpdateForm = () => {
  const [productoData, setProductoData] = useState(null);
  const [posted, setPosted] = useState(false);

  const { tienda, producto } = useParams();
  const { getAccessToken } = useAuth();

  async function getProducto() {
    const response = await getProductoById({
      tiendaId: tienda,
      productoId: producto,
      accessToken: getAccessToken(),
    });

    if (response.ok) {
      const json = await response.json();
      setProductoData(json.body.data);
    } else {
      setProductoData(null);
    }
  }

  useEffect(() => {
    getProducto();
  }, [tienda, producto, posted]);

  return (
    <div>
      {productoData && (
        <ProductoForm
          isUpdateForm={true}
          productoData={productoData}
          posted={posted}
          setPosted={setPosted}
        />
      )}
    </div>
  );
};
