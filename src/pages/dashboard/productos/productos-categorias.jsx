import { useEffect, useState } from "react";
import { DataTable } from "../../../components/dashboard/data-table/data-table";
import { CategoriasColumns } from "../../../components/dashboard/productos/categorias-columns";
import { ProductosMenubar } from "../../../components/dashboard/productos/productos-menubar";
import { Loader } from "../../../components/loaders/loader";
import { LazyCargandoLoader } from "../../../components/loaders/lazy-text-loader";
import { getCategoriasByTienda } from "../../../services/categorias";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../auth/auth-provider";
import { LazyDataTableLoader } from "../../../components/loaders/lazy-datatable-loader";

export const ProductosCategorias = () => {
  const [categorias, setCategorias] = useState(null);

  const [marcaFormOpen, setMarcaFormOpen] = useState(false);
  const [categoriaFormOpen, setCategoriaFormOpen] = useState(false);
  const [marcaPosted, setMarcaPosted] = useState(false);
  const [categoriaPosted, setCategoriaPosted] = useState(false);
  const [categoriaSelected, setCategoriaSelected] = useState(null);
  const [isCategoriaFormUpdated, setIsCategoriaFormUpdated] = useState(false);

  const { tienda } = useParams();
  const auth = useAuth();
  const token = auth.getAccessToken();

  async function getCategorias() {
    const categoriasResponse = await getCategoriasByTienda({
      tiendaId: tienda,
      accessToken: token,
    });

    if (categoriasResponse.ok) {
      const categoriasData = await categoriasResponse.json();

      function flattenCategories(data, parentID = null, parentName = null) {
        let flatList = [];
        data.forEach((category) => {
          flatList.push({
            cve_categoria: category.cve_categoria,
            nombre: category.nombre,
            categoria_padre: { id: parentID, nombre: parentName },
            activo: category.activo,
          });
          if (category.children) {
            flatList = flatList.concat(
              flattenCategories(
                category.children,
                category.cve_categoria,
                category.nombre
              )
            );
          }
        });
        return flatList;
      }

      // Generar la lista plana de categorías
      const flatCategories = flattenCategories(categoriasData.body);
      console.log(flatCategories);
      setCategorias(flatCategories);
    } else {
      setCategorias([]);
    }
  }

  const columns = CategoriasColumns({
    open: categoriaFormOpen,
    setOpen: setCategoriaFormOpen,
    isUpdateForm: isCategoriaFormUpdated,
    setIsUpdateForm: setIsCategoriaFormUpdated,
    categoriaId: categoriaSelected,
    setCategoriaId: setCategoriaSelected,
  });

  useEffect(() => {
    getCategorias();
  }, [tienda, token, categoriaPosted]);

  return (
    <div className="space-y-3 h-[83vh] ">
      <ProductosMenubar
        categoriaState={categoriaFormOpen}
        marcaState={marcaFormOpen}
        setMarcaFormOpen={setMarcaFormOpen}
        setCategoriaFormOpen={setCategoriaFormOpen}
        setCategoriaPosted={setCategoriaPosted}
        categoriaPosted={categoriaPosted}
        setMarcaPosted={setMarcaPosted}
        marcaPosted={marcaPosted}
        categoriaIsUpdate={isCategoriaFormUpdated}
        setCategoriaIsUpdate={setIsCategoriaFormUpdated}
        categoriaId={categoriaSelected}
        setCategoriaId={setCategoriaSelected}
      />

      <div className="grid grid-cols-5">
        <div className="shadow border p-5 rounded h-full col-span-3 space-y-5 ">
          <section>
            <h1 className="font-semibold text-lg ">
              Categorías de los productos
            </h1>
            <p className="text-sm text-muted-foreground">
              Maneja las categorías disponibles en tu tienda.
            </p>
          </section>

          {categorias ? (
            <DataTable columns={columns} data={categorias} />
          ) : (
            <LazyDataTableLoader className="min-h-[500px]" />
          )}
        </div>
      </div>
    </div>
  );
};
