import { Loader } from "./loader";

export const LazyCargandoLoader = ({ label = "Cargando..." }) => {
  return (
    <div className="text-muted-foreground text-sm flex items-center gap-2">
      <Loader className="h-5" /> <span>{label}</span>
    </div>
  );
};
