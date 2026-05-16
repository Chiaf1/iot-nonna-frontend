"use client";

// Accetta come props una funzione asyncrona sensza argomenti
// che ritorna void. Una server action
type Props = {
  action: () => Promise<void>;
  label?: string;
};

export function DeleteButton({ action, label = "Elimina" }: Props) {
  return <button onClick={() => action()}>{label}</button>;
}
