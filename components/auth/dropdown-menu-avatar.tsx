"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  LogOutIcon,
  Settings,
  User,
  LayoutDashboard,
  Ticket
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface DropdownMenuAvatarProps {
  role: string;
  user: {
    email?: string;
    user_metadata?: {
      avatar_url?: string;
      full_name?: string;
    };
  }
}

export function DropdownMenuAvatar({ user, role }: DropdownMenuAvatarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-10 h-10 rounded-full border border-border overflow-hidden p-0 hover:border-primary transition-colors focus:outline-none cursor-pointer">
        <Avatar className="w-full h-full">
          <AvatarImage 
            src={user.user_metadata?.avatar_url || "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"} 
            alt={user.user_metadata?.full_name || "Perfil de usuario"}
            referrerPolicy="no-referrer"
          />
          <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || "Mi cuenta"}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          {role === 'business_owner' && (
            <Link href="/dashboard">
              <DropdownMenuItem className="cursor-pointer font-medium text-primary focus:text-primary focus:bg-primary/10">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Panel de Negocio</span>
              </DropdownMenuItem>
            </Link>
          )}
          <Link href="/profile" className="w-full">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/rewards" className="w-full">
            <DropdownMenuItem className="cursor-pointer">
              <Ticket className="mr-2 h-4 w-4" />
              <span>Mis Tarjetas</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
