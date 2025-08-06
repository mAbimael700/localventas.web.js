
import { Loader } from "./loader";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
export const LazyDataTableLoader = ({ className, label }) => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-1/3 rounded-md" />
      <div
        className={cn(
          "animate-pulse bg-accent shadow-sm rounded-sm",
          " flex items-center justify-center",
          className
        )}
      >
        <div className="">
          <span className="text-muted-foreground  text-sm flex gap-2 items-center">
            <Loader className="h-5 w-5" /> {label || "Cargando..."}
          </span>
        </div>
      </div>
    </div>
  );
};
