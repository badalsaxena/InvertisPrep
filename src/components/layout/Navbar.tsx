import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black tracking-tighter font-['Montserrat'] uppercase bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                INVERTISPREP
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium font-['Poppins'] relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium font-['Poppins'] relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium font-['Poppins'] relative group">
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/resources" className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium font-['Poppins'] relative group">
              Resources
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/pyq" className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium font-['Poppins'] relative group">
              PYQ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/quizzo" className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium font-['Poppins'] relative group">
              Quizzo
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-pink-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-indigo-50 font-['Poppins'] transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-indigo-50 font-['Poppins'] transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-indigo-50 font-['Poppins'] transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/resources"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-indigo-50 font-['Poppins'] transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Resources
            </Link>
            <Link
              to="/pyq"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-indigo-50 font-['Poppins'] transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              PYQ
            </Link>
            <Link
              to="/quizzo"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-indigo-50 font-['Poppins'] transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Quizzo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}