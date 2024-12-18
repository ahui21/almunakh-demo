'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      {/* Search Section */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search..." 
          className="pl-10 w-full bg-gray-50 border-0 focus-visible:ring-1"
        />
      </div>

      {/* Profile Section */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/avatars/placeholder.jpg" alt="Sarah Wilson" />
              <AvatarFallback>SW</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Sarah Wilson</p>
              <p className="text-xs leading-none text-muted-foreground">
                sarah.wilson@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}