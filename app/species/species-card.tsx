"use client";
/*
Note: "use client" is a Next.js App Router directive that tells React to render the component as
a client component rather than a server component. This establishes the server-client boundary,
providing access to client-side functionality such as hooks and event handlers to this component and
any of its imported children. Although the SpeciesCard component itself does not use any client-side
functionality, it is beneficial to move it to the client because it is rendered in a list with a unique
key prop in species/page.tsx. When multiple component instances are rendered from a list, React uses the unique key prop
on the client-side to correctly match component state and props should the order of the list ever change.
React server components don't track state between rerenders, so leaving the uniquely identified components (e.g. SpeciesCard)
can cause errors with matching props and state in child components if the list order changes.
*/
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Database } from "@/lib/schema";
import Image from "next/image";
import { useState } from "react";
import DeleteSpeciesDialog from "./delete-species-dialog";
import EditSpeciesDialog from "./edit-species-dialog";
import SpeciesInfoModal from "./species-info-modal";
type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesCard({ species, editable }: { species: Species; editable: boolean }) {
  // control whether the modal is open (passed into the modal component as a prop)
  const [modalOpen, setModalOpen] = useState(false);
  // whether the edit species dialog is open
  const [editing, setEditing] = useState(false);
  // confirm delete dialog
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="relative m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.scientific_name}</h3>
      <h4 className="text-lg font-light italic">{species.common_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
      {/* Replace the button with the detailed view dialog. */}
      <Button
        className="mt-3 w-full"
        onClick={() => {
          setModalOpen(!modalOpen);
        }}
      >
        Learn More
      </Button>
      {editable && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="absolute right-2 top-2 h-6 w-6 rounded-full bg-slate-800 bg-opacity-50 p-0 backdrop-blur-sm"
            >
              <Icons.ellipsis className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditing(true);
              }}
            >
              <Icons.post className="mr-2 h-3 w-3" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDeleting(true);
              }}
            >
              <Icons.trash className="mr-2 h-3 w-3" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <SpeciesInfoModal species={species} open={modalOpen} setOpen={setModalOpen} />
      <EditSpeciesDialog species={species} open={editing} setOpen={setEditing} />
      <DeleteSpeciesDialog open={deleting} setOpen={setDeleting} species={species} />
    </div>
  );
}
