import { Ticket, Bell, LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-2">
        <Ticket className="text-primary w-8 h-8" />
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">FideliLocal</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-primary/10 transition-colors">
          <Bell className="w-6 h-6" />
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors focus:outline-none cursor-pointer">
            <Avatar className="w-full h-full">
              <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQqA1lF8n27uCqP2f790h7XN7mKjT1nK4tM0r8bQpY3XQ73kL1tL2y088Z6M3J4tM3h318t_z8W8lC_9f9o0s4iC7r7W7z1g0Mh6C4mYv_k5u8hN2hT7T3hP_1I_7x1j11" alt="Perfil de usuario" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
