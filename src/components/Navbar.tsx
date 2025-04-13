import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: "PYQ", path: "/pyq" },
    { name: "Quizzo", path: "/quizzo" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                INVERTISPREP
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links - Centered */}
          <div className="hidden sm:flex flex-1 justify-center items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.path}>
                    <Link to={link.path}>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        {link.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="default"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Desktop Auth Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage 
                        src={user.photoURL || undefined} 
                        alt={user.displayName || "User"}
                        referrerPolicy="no-referrer"
                      />
                      <AvatarFallback>
                        {user.displayName ? getInitials(user.displayName) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem className="font-medium">
                    {user.displayName || user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 shadow-md">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {/* Mobile Navigation Links */}
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Mobile Auth Menu */}
          {user ? (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-3 px-4 py-2">
                <Avatar>
                  <AvatarImage 
                    src={user.photoURL || undefined} 
                    alt={user.displayName || "User"}
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback>
                    {user.displayName ? getInitials(user.displayName) : "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {user.displayName || user.email}
                </span>
              </div>
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-200 mt-4 pt-4 px-4 space-y-2">
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-purple-50 rounded-md border border-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 rounded-md shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 