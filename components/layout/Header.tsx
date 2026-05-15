// niente "use client" perché questo é un server component
import Link from "next/link";
import { NavLink } from "./NavLink";

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
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo / nome app */}
          <Link href="/dashboard" className="font-semibold text-neutral-900">
            Iot Nonna
          </Link>

          {/* Navigazione principale */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}

            {/* Separatore visivo */}
            <div className="mx-2 h-4 w-px bg-neutral-200" />

            {/* Sezione admin con label */}
            <span className="text-xs text-neutral-400 mr-1">Admin</span>
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
