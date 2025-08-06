import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export const ProductFilterButton = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button variant="ghost">
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />

            <span className="sm:bg-none">Filtrar y ordenar</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="m-1">
          <DialogHeader>
            <DialogTitle>Filtrar y ordenar</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
