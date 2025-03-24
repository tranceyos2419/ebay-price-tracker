"use client";

import { Button } from "@/components/ui/button";
import DataModal from "./DataModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { TableViewProps } from "./TableView";

function UserNav() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-13 w-13 cursor-pointer">
            <AvatarImage src="" alt="dawit" />
            <AvatarFallback>YF</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">yoshi</p>
            <p className="text-xs leading-none text-muted-foreground">
              yoshi@gmail.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <>
                <Sun className="mr-2 h-4 w-4 cursor-pointer" /> Light Mode
              </>
            ) : (
              <>
                <Moon className="mr-2 h-4 w-4 cursor-pointer" /> Dark Mode
              </>
            )}
            <DropdownMenuShortcut>⇧⌘T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const NavBar = ({
  onAddSuccess,
}: {
  onAddSuccess?: (newRow: TableViewProps["initialData"][0]) => void;
}) => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex space-x-2">
        <DataModal onAddSuccess={onAddSuccess} />
        <Button className="bg-orange-600 hover:bg-orange-700 cursor-pointer">
          UPDATE
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 cursor-pointer">
          DELETE
        </Button>
      </div>

      <div className="flex items-center gap-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Button>
        <UserNav />
      </div>
    </div>
  );
};

export default NavBar;
