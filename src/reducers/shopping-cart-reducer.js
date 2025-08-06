export function ShopCartReducer(cart, action) {
  const { type, payload } = action;

  const findElement = (element) => {
    const { folio } = element;
    return cart.items.findIndex((item) => item.folio === folio);
  };

  // ACTIONS

  if (type === "SET_INITIAL_STATE") {
    return payload;
  } else if (type === "SET_QUANTITY_ELEMENT") {
    const { product, quantity: cantidad } = payload;
    const elementsInCartIndex = findElement(product);

    const quantity = parseInt(cantidad);
    if (elementsInCartIndex >= 0) {
      const newCart = structuredClone(cart);

      if (quantity > 0 && quantity <= product.stock) {
        newCart.items[elementsInCartIndex].cantidad = quantity;
      } else if (product.stock < quantity) {
        newCart.items[elementsInCartIndex].cantidad = product.stock;
      } else {
        newCart.items[elementsInCartIndex].cantidad = 1;
      }
      return newCart;
    }

    return cart;
  } else if (type === "ADD_TO_CART") {
    const elementsInCartIndex = findElement(payload);

    if (elementsInCartIndex >= 0) {
      const newCart = structuredClone(cart);
      const cantidad = newCart.items[elementsInCartIndex].cantidad;
      const stock = newCart.items[elementsInCartIndex].stock;

      if (cantidad !== stock) {
        newCart.items[elementsInCartIndex].cantidad += 1;
      } else {
        newCart.items[elementsInCartIndex].cantidad = cantidad;
      }
      return newCart;
    }

    const newCart = {
      ...cart,
      items: [
        ...cart.items,
        {
          ...payload,
          cantidad: 1,
        },
      ],
    };

    return newCart;
  } else if (type === "SUBTRACT_TO_CART") {
    const elementsInCartIndex = findElement(payload);

    if (elementsInCartIndex >= 0) {
      const newCart = structuredClone(cart);
      const cantidad = newCart.items[elementsInCartIndex].cantidad;

      if (cantidad > 1) {
        newCart.items[elementsInCartIndex].cantidad -= 1;
      } else {
        newCart.items[elementsInCartIndex].cantidad = 1;
      }
      return newCart;
    }
  } else if (type === "REMOVE_FROM_CART") {
    const { folio } = payload;
    return {
      ...cart,
      items: cart.items?.filter((item) => item.folio !== folio),
    };
  } else if (action.type === "CLEAR_CART") {
    return { ...cart, items: [] };
  } else {
    throw Error("Unknown action: " + type);
  }
}
