"use client"; // <- fondamentale per poter usare gli hook, funzionano solo lato client

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // utility of shadcn per unire classi

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  // isActive é true se siamo su quella pagina o una sua sotto-pagina
  // es. href="/devices" é attivo anche su "/devices/123"
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "text-sm transition-colors px-3 py-1.5 rounded-md",
        isActive
          ? "bg-secodary text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
      )}
    >
      {children}
    </Link>
  );
}
