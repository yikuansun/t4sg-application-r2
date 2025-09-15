"use client";

import { Dialog } from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
import { useState } from "react";
type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesInfoModal({ species }: { species: Species }) {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {JSON.stringify(species)}
    </Dialog>
  );
}
