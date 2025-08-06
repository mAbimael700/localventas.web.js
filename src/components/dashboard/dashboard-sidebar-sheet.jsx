import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { TiendaSwitcher } from "./commerce-switch";

export const SidebarSheet = ({ menuData }) => {
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("ventas");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="flex lg:hidden">
          <HamburgerMenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Panel de control</SheetTitle>



          <h1 className="font-semibold text-base text-start">Selecciona una tienda</h1>
          <TiendaSwitcher />
          
            {menuData ? (
              menuData.map((menu) => (
                <Link
                  key={`menu-${menu.key}`}
                  to={menu.component}
                  className={cn(
                    "inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
                    menu.key === selectedMenu && "bg-accent"
                  )}
                  onClick={() => {
                    setOpen(false);
                    setSelectedMenu(menu.key);
                  }}
                >
                  {menu.nombre}
                </Link>
              ))
            ) : (
              <></>
            )}
        
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
