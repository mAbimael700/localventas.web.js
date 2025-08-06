export function ProductosMenuReducer(data, action) {
  const { type, payload } = action;

  switch (type) {
    case "SET_INITIAL_STATE": {
      return payload;
    }

    case "SET_MARCA_SELECTED": {
      return {
        ...data,
        marcaSelected: payload,
      };
    }

    case "SET_MARCAS": {
      const { marcas } = payload;
      return {
        ...data,
        ...marcas,
      };
    }

    case "SET_CATEGORIAS": {
      const { categorias } = payload;
      return {
        ...data,
        ...categorias,
      };
    }

    default: {
      throw Error("Unknown action: " + type);
    }
  }
}
