import { CommerceLayout } from "../pages/commerce/commerce-layout.jsx";

import { CommerceProductosMarca } from "../pages/commerce/productos/productos-marca.jsx";
import { ProductosMain } from "../pages/commerce/productos/productos-main.jsx";
import { CommerceProductosCategoria } from "../pages/commerce/productos/productos-categoria.jsx";
import { ProductosIndividual } from "../pages/commerce/productos/productos-individual.jsx";
import { Outlet } from "react-router-dom";
import { ShoppingCartMain } from "../pages/commerce/shopping-cart/sc-main.jsx";
import { CommerceAllMenu } from "../pages/commerce/all/all-menu.jsx";
import { ShoppingCartProvider } from "../contexts/shopping-cart-context.jsx";
import { TransactionDireccion } from "../pages/commerce/transaction/direccion/transaction-direccion.jsx";
import { CommerceProvider } from "../contexts/commerce/commerce-context.jsx";
import { TransactionMenu } from "../pages/commerce/transaction/transaction-menu.jsx";
import { CategoriasMain } from "../pages/commerce/categorias/categorias-main.jsx";

export const routesCommerce = {
  path: "commerce",
  children: [
    { path: "all", element: <CommerceAllMenu /> },
    {
      path: ":tienda",
      element: (
        <CommerceProvider>
          <ShoppingCartProvider>
            <CommerceLayout />
          </ShoppingCartProvider>
        </CommerceProvider>
      ),
      children: [
        {
          path: "productos",
          element: <Outlet />,
          children: [
            { index: true, element: <ProductosMain /> },

            {
              path: ":producto",
              element: <ProductosIndividual />,
            },
          ],
        },
        {
          path: "transaction",
          element: <TransactionMenu />,
          children: [
            {
              path: "buying",
              children: [
                {
                  path: "cart/:cart",
                  children: [
                    {
                      path: "shipping-method",
                      element: <TransactionDireccion />,
                    },
                    //{ path: "delivery-time", element: <TransactionHoraEntrega /> },
                    //{ path: "payment-mehthod", element: <TransactionMetodoPago /> },
                  ],
                },
                {
                  path: "product/:product",

                  children: [
                    {
                      path: "shipping-method",
                      element: <TransactionDireccion />,
                    },
                    //{ path: "delivery-time", element: <TransactionHoraEntrega /> },
                    //{ path: "payment-mehthod", element: <TransactionMetodoPago /> },
                  ],
                },
              ],
            },
            {
              path: "buying/cart/:cart",
              children: [],
            },
          ],
        },
        {
          path: "cart",
          element: <ShoppingCartMain />,
        },
        {
          path: "marcas",
          children: [
            {
              path: ":marca",
              element: <CommerceProductosMarca />,
            },
          ],
        },
        {
          path: "categorias",

          children: [
            {
              index: true,
              element: <CategoriasMain />,
            },
            {
              path: ":categoria",
              element: <CommerceProductosCategoria />,
            },
          ],
        },
      ],
    },
  ],
};
