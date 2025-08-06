import { toast } from "@/components/ui/use-toast";

import { createContext, useEffect, useReducer } from "react";
import { ShopCartReducer } from "../reducers/shopping-cart-reducer";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Decimal from "decimal.js";
import { currencyFormat } from "../utils/numberFormatting";
import {
  createCart,
  deleteItemCart,
  getCurrentCartTienda,
  setItemCart,
} from "../services/cart";
import { useAuth } from "../auth/auth-provider";

export const ShoppingCartContext = createContext({
  cart: {
    items: [],
  },
  addToCart: () => {},
  removeToCart: () => {},
  subtractToCart: () => {},
  clearCart: () => {},
  setQuantityElement: () => {},
  getQuantityProducts: () => {},
  getTotalPriceCart: () => {},
});

export const ShoppingCartProvider = ({ children }) => {
  const initialState = { items: [] };

  const [cart, dispatch] = useReducer(ShopCartReducer, initialState);
  const { tienda: tiendaId } = useParams();
  const { getAccessToken, getUser } = useAuth();
  const location = useLocation();
  const user = getUser();

  async function getCartTienda() {
    try {
      const currCart = await getCurrentCartTienda({
        accessToken: getAccessToken(),
        tiendaId,
      });
      if (currCart) {
        return dispatch({
          type: "SET_INITIAL_STATE",
          payload: currCart,
        }); // Update the state with filtered items
      }

      return dispatch({
        type: "SET_INITIAL_STATE",
        payload: initialState,
      });
    } catch (error) {
      console.error(error);
    }
  }

  function toastError(error) {
    toast({
      variant: "destructive",
      description: error.message.toString(),
    });
  }

  async function createCarrito() {
    try {
      const cart = await createCart({
        accessToken: getAccessToken(),
        input: { cve_tienda: parseInt(tiendaId), cve_usuario: user?.id },
      });
    } catch (error) {
      toastError(error);
    }
  }

  async function AddOneToCart(item) {
    const { folio, stock } = item;

    let newCantidad = getQuantyByProduct(item) + 1;

    if (newCantidad > stock) {
      newCantidad = stock;
    }

    const product = {
      folio,
      cve_tienda: tiendaId,
      cve_usuario: user.id,
      cantidad: newCantidad,
    };

    try {
      const response = await setItemCart({
        accessToken: getAccessToken(),
        input: product,
        tiendaId,
      });

      dispatch({
        type: "ADD_TO_CART",
        payload: item,
      });

      if (location.pathname !== `/commerce/${tiendaId}/cart`)
        toast({
          description: "Has agregado el producto al carrito",
        });
    } catch (error) {
      toastError(error);
    }
  }

  async function SubtractToCart(item) {
    const { folio } = item;

    let newCantidad = getQuantyByProduct(item) - 1;

    if (newCantidad < 1) {
      newCantidad = 1;
    }

    const product = {
      folio,
      cve_tienda: tiendaId,
      cve_usuario: user.id,
      cantidad: newCantidad,
    };

    try {
      const response = await setItemCart({
        accessToken: getAccessToken(),
        input: product,
        tiendaId,
      });

      dispatch({
        type: "SUBTRACT_TO_CART",
        payload: item,
      });

      if (location.pathname !== `/commerce/${tiendaId}/cart`)
        toast({
          description: "Has agregado el producto al carrito",
        });
    } catch (error) {
      toastError(error);
    }
  }

  async function deleteFromCart(item) {
    const { folio } = item;

    try {
      await deleteItemCart({
        accessToken: getAccessToken(),
        cartId: cart.id,
        itemId: folio,
      });
      dispatch({
        type: "REMOVE_FROM_CART",
        payload: item,
      });
    } catch (error) {
      toastError(error);
    }
  }

  const getQuantityProducts = () => {
    if (cart) {
      if (cart.items?.length === 0) {
        return 0;
      }

      const initialValue = 0;

      const cantidadProductos = cart.items?.reduce(
        (accumulator, currentValue) => accumulator + currentValue.cantidad,
        initialValue
      );

      return cantidadProductos;
    }
  };

  const getTotalPriceCart = () => {
    if (cart) {
      if (cart.items?.length === 0) {
        return 0;
      }

      const initialValue = 0;

      const cantidadProductos = cart.items?.reduce(
        (accumulator, currentValue) => {
          const accumulatorDecimal = new Decimal(accumulator);
          const cantidadProductoDecimal = new Decimal(
            currentValue.cantidad || 0
          );
          const precioProductoDecimal = new Decimal(
            currentValue.precio_venta || 0
          );

          const calculateTotal = cantidadProductoDecimal.times(
            precioProductoDecimal
          );

          return accumulatorDecimal.plus(calculateTotal).toNumber();
        },

        initialValue
      );

      return currencyFormat(cantidadProductos);
    }
  };

  const getQuantyByProduct = (item) => {
    const { folio } = item;
    const producto = cart.items.find((item) => item.folio === folio);

    if (producto) {
      return producto?.cantidad;
    } else {
      return 0;
    }
  };

  const addToCart = async (item) => {
    if (!cart.id) {
      createCarrito();
      getCartTienda();
    }

    await AddOneToCart(item);
  };

  const subtractToCart = async (item) => {
    await SubtractToCart(item);
  };

  const removeToCart = async (item) => {
    await deleteFromCart(item);
  };

  const clearCart = () =>
    dispatch({
      type: "CLEAR_CART",
    });

  const setQuantityElement = (item, quantity) =>
    dispatch({
      type: "SET_QUANTITY_ELEMENT",
      payload: { product: item, quantity },
    });

  const values = {
    cart,
    addToCart,
    subtractToCart,
    removeToCart,
    clearCart,
    setQuantityElement,
    getQuantityProducts,
    getTotalPriceCart,
  };

  useEffect(() => {
    getCartTienda();
  }, [tiendaId]);

  return (
    <ShoppingCartContext.Provider value={values}>
      {children}
    </ShoppingCartContext.Provider>
  );
};
