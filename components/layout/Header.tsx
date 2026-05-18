// niente "use client" perché questo é un server component
import Link from "next/link";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";
import { AdminMenu } from "./AdminMenu";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/devices", label: "Devices" },
  { href: "/rooms", label: "Rooms" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* sinsitra - Logo / nome app */}
          <Link
            href="/dashboard"
            className="font-semibold text-foreground shrink-0"
          >
            Iot Nonna
          </Link>
          {/*destra - Navigazione principale e admin*/}
          <div className="flex items-center gap-6">
            {/* Navigazione principale */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <AdminMenu />

            <div className="mx-2 h-4 w-px bg-border" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
