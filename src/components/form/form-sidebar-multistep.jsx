import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SidebarNav({ className, items, step, changeFn, ...props }) {
  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 py-0",
        className
      )}
      {...props}
    >
      {items.map((item, i) => (
        <Button
          key={item.name}
          onClick={() => changeFn({ step: i, isSidebar: true })}
          variant="ghost"
          type="button"
          className={cn(
            "hover:bg-transparent w-full lg:justify-start",
            i === step
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            className
          )}
        >
          {item.title}
        </Button>
      ))}
    </nav>
  );
}
