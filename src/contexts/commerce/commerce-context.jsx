import { createContext, useEffect, useReducer } from "react";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";
import { useAuth } from "../../auth/auth-provider";
import { CommerceReducer } from "../../reducers/commerce-reducer";
import { getCategoriasByTienda } from "../../services/categorias";
import { getMarcasByTienda } from "../../services/marcas";
import { getDireccionesByTienda, getTiendaById } from "../../services/tiendas";
import { getMetodosPago } from "../../services/metodo-pago";

export const CommerceContext = createContext();

export const CommerceProvider = ({ children }) => {
  const initialState = {
    tienda: {},
    direcciones: [],
    metodos_pago: [],
    categorias: [],
    marcas: [],
  };

  const [commerce, dispatch] = useReducer(CommerceReducer, initialState);
  const { tienda: tiendaId } = useParams();
  const { getAccessToken, getUser } = useAuth();

  async function getTienda() {
    try {
      const response = await getTiendaById({
        tiendaId,
      });
      return response;
    } catch (error) {
      return toast({
        description: error.message,
      });
    }
  }

  async function getCategorias() {
    const response = await getCategoriasByTienda({
      tiendaId,
    });

    const json = await response.json();
    if (response.ok) {
      return json.body;
    } else {
      return toast({
        description: json.error.toString(),
      });
    }
  }

  async function getMarcas() {
    const response = await getMarcasByTienda({
      tiendaId,
    });

    const json = await response.json();
    if (response.ok) {
      return json.body;
    } else {
      return toast({
        description: json.error.toString(),
      });
    }
  }

  async function getDirecciones() {
    try {
      const response = await getDireccionesByTienda({
        tiendaId,
      });
      return response;
    } catch (error) {
      return toast({
        description: error.message,
      });
    }
  }

  async function getMetodosPagoLocal() {
    const response = await getMetodosPago({});

    const json = await response.json();
    if (response.ok) {
      return json.body.data;
    } else {
      return toast({
        description: json.error.toString(),
      });
    }
  }

  async function getInitialState() {
    const tienda = await getTienda();
    const categorias = await getCategorias();
    const marcas = await getMarcas();
    const direcciones = await getDirecciones();
    const metodosPago = await getMetodosPagoLocal();

    const data = {
      tienda,
      categorias,
      marcas,
      direcciones,
      metodosPago,
    };

    dispatch({
      payload: data,
      type: "SET_INITIAL_STATE",
    });
  }

  const { tienda, direcciones, marcas, categorias, metodosPago } = commerce;

  useEffect(() => {
    getInitialState();
  }, [tiendaId]);

  const values = {
    commerce,
    tienda,
    direcciones,
    marcas,
    categorias,
    metodosPago,
  };

  return (
    <CommerceContext.Provider value={values}>
      {children}
    </CommerceContext.Provider>
  );
};
