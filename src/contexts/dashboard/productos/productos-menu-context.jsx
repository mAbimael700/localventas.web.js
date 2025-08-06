import React, { createContext, useReducer, useState } from "react";
import { ProductosMenuReducer } from "../../../reducers/dashboard/productos/productos-menu-reducer";

export const ProductosMenuContext = createContext({
  marcas: [],
  categorias: [],
  marcaSelected: {},
  categoriaSelected: {},
  openMarcaForm: false,
  openCategoriaForm: false,
  openChangeMarcaForm: () => {},
  setMarcaSelected: () => {},
});

const initialState = {
  marcas: [],
  categorias: [],
  marcaSelected: {},
  categoriaSelected: {},
};

export const ProductosMenuProvider = ({ children }) => {
  const [menuData, dispatch] = useReducer(ProductosMenuReducer, initialState);
  const [openMarcaForm, setOpenMarcaForm] = useState(false);

  function openChangeMarcaForm() {
    dispatch({
      type: "SET_MARCA_SELECTED",
      payload: {},
    });
    return setOpenMarcaForm((prev) => !prev);
  }
  
  function setMarcaSelected(marca) {
    dispatch({
      type: "SET_MARCA_SELECTED",
      payload: marca,
    });
  }

  const values = {
    ...menuData,
    openMarcaForm,
    openChangeMarcaForm,
    setMarcaSelected,
  };
  return (
    <ProductosMenuContext.Provider value={values}>
      {children}
    </ProductosMenuContext.Provider>
  );
};
