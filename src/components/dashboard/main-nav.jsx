import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
export function MainNav({ menuData, className, ...props }) {
  const menuList = menuData.map((menu) => (
    <Link
      className="text-sm font-medium transition-colors hover:text-primary"
      to={menu.component}
      key={menu.key}
    >
      {menu.nombre}
    </Link>
  ));

  return (
    <nav
      className={cn(
        " hidden lg:flex items-center space-x-4 lg:space-x-6 md:space-x-4",
        className
      )}
    >

      {menuData ? menuList : <span>No hay datos...</span>}
    </nav>
  );
}
