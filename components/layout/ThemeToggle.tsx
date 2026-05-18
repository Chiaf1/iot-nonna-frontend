"use client";

import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Aspetta che il componente sia montato sul client
  // prima di renderizzare, così server e client sono allineati
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Renderizza un placeholder della stessa dimensione
    // così il layout non "salta" quando appare il bottone vero
    return <div className="h-8 w-8" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Cambia tema"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
