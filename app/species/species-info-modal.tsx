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
          <DialogTitle className="text-3xl">{species.scientific_name}</DialogTitle>
          <DialogDescription className="text-xl">
            <i>{species.common_name}</i>
          </DialogDescription>
        </DialogHeader>
        <p>
          <b>Kingdom:</b> {species.kingdom}
        </p>
        <p>
          <b>Total Population:</b> {species.total_population}
        </p>
        <p>
          <b>Description</b> <br /> {species.description}
        </p>
        {/*
          <pre
            style={{
              width: "100%",
              overflow: "hidden",
            }}
          >
            {JSON.stringify(species, null, 4)}
          </pre>
        */}
        <DialogClose asChild>
          <Button type="button" className="ml-1 mr-1 flex-auto" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
