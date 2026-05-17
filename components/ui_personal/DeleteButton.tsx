"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

// Accetta come props una funzione asyncrona sensza argomenti
// che ritorna void. Una server action
type Props = {
  action: () => Promise<void>;
  label?: string;
};

export function DeleteButton({ action, label = "Elimina" }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {/* As a child passale props al button invece di wrapparlo */}
        <Button variant="destructive" size="sm">
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sei Sicuro?</AlertDialogTitle>
          <AlertDialogDescription>
            Questa oporazione non può essere annullata.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annulla</AlertDialogCancel>
          <AlertDialogAction onClick={() => action()}>
            Conferma
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
