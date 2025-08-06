export function CommerceReducer(data, action) {
  const { type, payload } = action;

  switch (type) {
    case "SET_INITIAL_STATE": {
      return payload;
    }

    case "SET_DIRECCIONES": {
      const { direcciones } = payload;
      return {
        ...data,
        ...direcciones,
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
