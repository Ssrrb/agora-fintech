"use client";
import { usePathname } from "next/navigation";
import { NavButton } from "@/components/ui/nav-button";
import { ChartBarIcon, Info, Settings } from "lucide-react";
import {Sheet} from "@/components/ui/sheet";
import { useMedia } from "react-use";



const routes = [
  {
    href: "/markets",
    label: "Mercados",
    icon: <ChartBarIcon className="w-4 h-4" />
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <Info className="w-4 h-4" />
  },
  {
    href: "/settings",
    label: "Configuración",
    icon: <Settings className="w-4 h-4" />
  }
];

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center">
      <ul className="flex space-x-2 sm:space-x-4">
        {routes.map((route) => (
          <li key={route.href}>
            <NavButton
              href={route.href}
              label={route.label}
              icon={route.icon}
              isActive={pathname === route.href}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};