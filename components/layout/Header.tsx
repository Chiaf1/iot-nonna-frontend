// niente "use client" perché questo é un server component
import Link from "next/link";
import { NavLink } from "./NavLink";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/devices", label: "Devices" },
  { href: "/rooms", label: "Rooms" },
];

const adminItems = [
  { href: "/admin/device-types", label: "Device types" },
  { href: "/admin/sensor-types", label: "Sensor types" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-6">
          {/* Logo / nome app */}
          <Link
            href="/dashboard"
            className="font-semibold text-foreground shrink-0"
          >
            Iot Nonna
          </Link>

          <Separator orientation="vertical" className="h-5" />

          {/* Navigazione principale */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Separator orientation="vertical" className="h-5" />

          {/* Sezione admin con label */}
          <nav className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1 shrink-0">
              Admin
            </span>
            {adminItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
