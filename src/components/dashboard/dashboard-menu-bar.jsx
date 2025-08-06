

export const DashboardMenuBar = () => {
  return (
    <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Productos</MenubarTrigger>
          <MenubarContent>
            <MenubarItem asChild>
              <Link to=".">
                Ver productos <MenubarShortcut>⌘T</MenubarShortcut>
              </Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link to="./producto-nuevo">Crear producto</Link>
            </MenubarItem>
            <MenubarSeparator />

            <MenubarItem>
              Imprimir... <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Marcas</MenubarTrigger>
          <MenubarContent>
            <MenubarItem asChild>
              <Link to="./marcas">Ver marcas</Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link to="./marcas/marca-nuevo">Crear marca</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Categorías</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Ver categorías</MenubarItem>

            <MenubarItem>
              Crear categoría <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
  )
}
