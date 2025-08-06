// Suponiendo que `ramaCategoria` contiene la estructura de la rama de la categoría que deseas mostrar en el breadcrumb
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function renderBreadcrumbFromFamily(familia, tiendaId) {
    const breadcrumbs = [];
  
    let currentCategory = familia;
  
    // Iterar sobre cada nivel de la familia y agregar el breadcrumb correspondiente
    while (currentCategory) {
      // Agregar el separator, excepto para el primer elemento
      if (breadcrumbs.length > 0) {
        breadcrumbs.push(
          <BreadcrumbSeparator  key={`separator-${currentCategory.cve_categoria}`} />
        );
      }
  
      breadcrumbs.push(
        <BreadcrumbItem key={currentCategory.cve_categoria}>
          <BreadcrumbLink href={`/commerce/${tiendaId}/categorias/${currentCategory.cve_categoria}`}>
            {currentCategory.nombre}
          </BreadcrumbLink>
        </BreadcrumbItem>
      );
  
      currentCategory = currentCategory.parent; // Mover al padre para continuar hacia arriba en la jerarquía
    }
  
    return (
      <Breadcrumb className="text-sm hidden md:block">
        <BreadcrumbList>
          {breadcrumbs.reverse()}{" "}
          {/* Invertir el orden para que vaya desde el padre hasta el hijo más profundo */}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }
  

// Uso de la función con la estructura `familia`

