"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesInfoModal({
  species,
  open,
  setOpen,
}: {
  species: Species;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Species Info</DialogTitle>
          <DialogDescription>This is the species info modal.</DialogDescription>
        </DialogHeader>
        {JSON.stringify(species)}
        <DialogClose asChild>
          <Button type="button" className="ml-1 mr-1 flex-auto" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
