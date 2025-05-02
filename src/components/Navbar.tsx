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
import { 
  Menu, 
  ChevronDown, 
  LogOut, 
  Home, 
  BookOpen, 
  Trophy, 
  Info, 
  MessageSquare, 
  Mail, 
  ExternalLink,
  User,
  BarChart,
  Coins,
  PlusCircle,
  X,
  Medal
} from "lucide-react";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    { name: "Home", path: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    { name: "Resources", path: "/resources", icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { name: "PYQ", path: "/pyq", icon: <ExternalLink className="h-4 w-4 mr-2" /> },
    { name: "Quizzo", path: "/quizzo", icon: <Trophy className="h-4 w-4 mr-2" /> },
    { name: "Blog", path: "/blog", icon: <MessageSquare className="h-4 w-4 mr-2" />, mobileOnly: true },
    { name: "Contact", path: "/contact-us", icon: <Mail className="h-4 w-4 mr-2" /> },
  ];

  // Format user name for display
  const formatDisplayName = () => {
    if (!user) return "";
    if (user.displayName) return user.displayName.split(" ")[0];
    return user.email?.split("@")[0] || "";
  };

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
                {navLinks.filter(link => !link.mobileOnly).map((link) => (
                  <NavigationMenuItem key={link.path}>
                    <Link to={link.path}>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        {link.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
                
                {/* Leaderboard - Special Release */}
                <NavigationMenuItem>
                  <Link to="">
                    <NavigationMenuLink className="group h-10 flex items-center justify-center relative px-4 py-2 rounded-md border-none bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium shadow-md hover:shadow-lg transition-all animate-pulse">
                      <Medal className="h-4 w-4 mr-1.5" />
                      <span>Leaderboard</span>
                      <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                        SOON
                      </div>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                {/* More Dropdown */}
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className={navigationMenuTriggerStyle()}>
                        More <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/our-team" className="w-full">Our Team</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                        <Link to="/about" className="w-full">About</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/our-mentors" className="w-full">Our Mentors</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/bug-report" className="w-full">Report Bug</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/terms-of-service" className="w-full">Terms of Service</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile menu button - Replaced with Sheet */}
          {isMounted && (
            <div className="sm:hidden flex items-center">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="default"
                    className="inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <div className="h-full flex flex-col">
                    {/* User Profile Section at Top */}
                    <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                      {user ? (
                        <div className="flex flex-col items-center">
                          <Avatar className="h-16 w-16 mb-3 ring-2 ring-white shadow-md">
                            <AvatarImage 
                              src={user.photoURL || undefined} 
                              alt={user.displayName || "User"}
                              referrerPolicy="no-referrer"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white text-lg">
                              {user.displayName ? getInitials(user.displayName) : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-center">
                            <p className="font-bold text-lg text-gray-800">{user.displayName || "User"}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-4">
                          <SheetHeader>
                            <SheetTitle className="text-center">Welcome to InvertisPrep</SheetTitle>
                          </SheetHeader>
                          <div className="w-full space-y-2">
                            <Link to="/login" className="w-full" onClick={() => setOpen(false)}>
                              <Button variant="outline" className="w-full">Login</Button>
                            </Link>
                            <Link to="/signup" className="w-full" onClick={() => setOpen(false)}>
                              <Button className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Sign up</Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Navigation Links */}
                    <div className="flex-1 overflow-auto py-2">
                      {/* Main Nav Links */}
                      <div className="space-y-1 px-2">
                        {navLinks.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                            onClick={() => setOpen(false)}
                          >
                            {link.icon}
                            {link.name}
                          </Link>
                        ))}
                        
                        {/* Leaderboard - Special Item for Mobile */}
                        <Link
                          to="/leaderboard"
                          className="flex items-center px-3 py-2 my-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition-colors shadow-sm relative"
                          onClick={() => setOpen(false)}
                        >
                          <Medal className="h-4 w-4 mr-2" />
                          Leaderboard
                          <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                            NEW
                          </span>
                        </Link>
                        
                        {/* User Menu Links (when logged in) */}
                        {user && (
                          <>
                            <Separator className="my-2" />
                            <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Account
                            </p>
                            <div className="space-y-1">
                              <Link
                                to="/dashboard"
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                onClick={() => setOpen(false)}
                              >
                                <Home className="h-4 w-4 mr-2" />
                                Dashboard
                              </Link>
                              <Link
                                to="/profile"
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                onClick={() => setOpen(false)}
                              >
                                <User className="h-4 w-4 mr-2" />
                                Profile
                              </Link>
                              <Link
                                to="/academic-progress"
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                onClick={() => setOpen(false)}
                              >
                                <BarChart className="h-4 w-4 mr-2" />
                                Academic Progress
                              </Link>
                              <Link
                                to="/qcoins"
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                onClick={() => setOpen(false)}
                              >
                                <Coins className="h-4 w-4 mr-2" />
                                QCoins Wallet
                              </Link>
                              <Link
                                to="/qcoins/topup"
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                onClick={() => setOpen(false)}
                              >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Top Up QCoins
                              </Link>
                            </div>
                          </>
                        )}
                        
                        <Separator className="my-2" />
                        
                        {/* More Menu Items */}
                        <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          More
                        </p>
                        <Link
                          to="/our-mentors"
                          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Our Mentors
                        </Link>
                        <Link
                          to="/our-team"
                          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Our Team
                        </Link>
                        <Link
                          to="/bug-report"
                          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Report Bug
                        </Link>
                        <Link
                          to="/terms-of-service"
                          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Terms of Service
                        </Link>
                      </div>
                    </div>
                    
                    {/* Logout Button at Bottom */}
                    {user && (
                      <div className="p-4 border-t border-gray-200">
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-center" 
                          onClick={() => {
                            handleLogout();
                            setOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Log out
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}

          {/* Styled User Box (Desktop) */}
          <div className="hidden sm:flex sm:items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-purple-100 shadow-sm hover:shadow-md transition-all"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage 
                        src={user.photoURL || undefined} 
                        alt={user.displayName || "User"}
                        referrerPolicy="no-referrer"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white text-xs">
                        {user.displayName ? getInitials(user.displayName) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-700">{formatDisplayName()}</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
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
                  <DropdownMenuItem asChild>
                    <Link to="/academic-progress" className="w-full">Academic Progress</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/qcoins" className="w-full">QCoins Wallet</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/qcoins/topup" className="w-full">Top Up QCoins</Link>
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
    </nav>
  );
} 