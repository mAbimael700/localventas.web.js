import { DataTable } from "@/components/dashboard/data-table/data-table";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  productosColumns,
  columnProductOptions,
} from "../../../components/dashboard/productos/productos-columns";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getMarcasByTienda } from "../../../services/marcas";
import { getCategoriasByTienda } from "../../../services/categorias";
import { useAuth } from "../../../auth/auth-provider";
import { useEffect, useState } from "react";
import { getProductosByTienda } from "../../../services/productos";
import { ProductosMenubar } from "../../../components/dashboard/productos/productos-menubar";

export const ProductosList = () => {
  const { tienda } = useParams();
  const { getAccessToken } = useAuth();
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);

  const [productOptions, setProductOptions] = useState({});
  const token = getAccessToken();
  const goTo = useNavigate();

  const [marcaFormOpen, setMarcaFormOpen] = useState(false);
  const [marcaPosted, setMarcaPosted] = useState(false);
  const [categoriaPosted, setCategoriaPosted] = useState(false);
  const [categoriaFormOpen, setCategoriaFormOpen] = useState(false);

  const columns = productosColumns({ isVentaView: false });

  useEffect(() => {
    const getMarcas = async () => {
      // Obtener marcas
      const marcasResponse = await getMarcasByTienda({
        tiendaId: tienda,
        accessToken: token,
      });

      if (marcasResponse.ok) {
        const marcasData = await marcasResponse.json();
        setMarcas(marcasData.body);
      } else if (marcasResponse.status === 204) {
        setMarcas([]);
      } else {
        setMarcas([]);
      }
    };

    getMarcas();
  }, [getAccessToken(), tienda, marcaPosted]);

  useEffect(() => {
    // Obtener categorias
    async function getCategorias() {
      const categoriasResponse = await getCategoriasByTienda({
        tiendaId: tienda,
        accessToken: token,
      });

      if (categoriasResponse.ok) {
        const categoriasData = await categoriasResponse.json();

        function flattenCategories(data, parentID = null) {
          let flatList = [];
          data.forEach((category) => {
            flatList.push({
              cve_categoria: category.cve_categoria,
              nombre: category.nombre,
              cve_categoria_padre: parentID,
            });
            if (category.children) {
              flatList = flatList.concat(
                flattenCategories(category.children, category.cve_categoria)
              );
            }
          });
          return flatList;
        }

        // Generar la lista plana de categorías
        const flatCategories = flattenCategories(categoriasData.body);
        setCategorias(flatCategories);
      } else if (categoriasResponse.status === 204) {
        setCategorias([]);
      } else {
        setCategorias([]);
      }
    }

    getCategorias();
  }, [getAccessToken(), tienda, categoriaPosted]);

  useEffect(() => {
    // Una vez que se obtienen tanto las marcas como las categorias, generar las opciones para la tabla
    const options = columnProductOptions({
      marcasData: marcas,
      categoriasData: categorias,
    });
    setProductOptions(options);
  }, [marcas, categorias]);

  useEffect(() => {
    async function getProductos() {
      const response = await getProductosByTienda({
        tiendaId: tienda,
        accessToken: token,
      });

      if (response.ok) {
        const result = await response.json();
        setProductos(result.body.data);
      } else {
        setProductos([]);
      }
    }

    getProductos();
  }, [tienda, token]);

  return (
    <div className="relative">
      

      <Button
        className="h-8 p-2 absolute font-semibold -top-1 right-2 hidden"
        asChild
      >
        <Link to="./producto-nuevo">
          <PlusCircledIcon className="mr-2" />
          Crear
        </Link>
      </Button>

      <div className="p-2 space-y-3">
        <div>
          <h1 className="font-semibold text-lg">Productos de la tienda</h1>
          <span className="text-sm text-muted-foreground">
            Todos los productos registrados en la tienda
          </span>
        </div>

        {productos ? (
          <DataTable
            columns={columns}
            columnsOptions={productOptions}
            data={productos}
          >
            <DataTable.Navigation>
              <DataTable.NavigationItem
                onClick={() => goTo("./producto-nuevo")}
                className="hidden lg:flex h-8"
              >
                <PlusCircledIcon className="mr-2 " /> Crear producto
              </DataTable.NavigationItem>
            </DataTable.Navigation>
          </DataTable>
        ) : (
          <>Cargando...</>
        )}
      </div>
    </div>
  );
};
