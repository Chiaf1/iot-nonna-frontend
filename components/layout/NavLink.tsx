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
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-neutral-100 text-neutral-900"
          : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50",
      )}
    >
      {children}
    </Link>
  );
}
