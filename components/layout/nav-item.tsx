"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ScanLine, Ticket, User, LogIn, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const IconMap: Record<string, LucideIcon> = {
  home: Home,
  search: Search,
  scan: ScanLine,
  ticket: Ticket,
  user: User,
  login: LogIn,
};

interface NavItemProps {
  href: string;
  iconName: string;
  label: string;
}

export function NavItem({ href, iconName, label }: NavItemProps) {
  const pathname = usePathname();
  const Icon = IconMap[iconName] || Home;
  const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <Link 
      href={href} 
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-300 relative group",
        isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-slate-600"
      )}
    >
      <div className="relative">
        <Icon 
          className={cn(
            "w-6 h-6 transition-all duration-300",
            isActive ? "fill-primary/20 stroke-[2.5px]" : "stroke-[1.5px] group-hover:scale-110"
          )} 
        />
        {isActive && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-background animate-pulse" />
        )}
      </div>
      <span className={cn(
        "text-[10px] font-black uppercase tracking-widest transition-all duration-300",
        isActive ? "opacity-100 translate-y-0" : "opacity-70 group-hover:opacity-100"
      )}>
        {label}
      </span>
      
      {/* Active Indicator Bar */}
      {isActive && (
        <div className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full" />
      )}
    </Link>
  );
}
