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
              <span className="text-2xl font-black text-indigo-600 tracking-tighter font-['Montserrat'] uppercase bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                INVERTISPREP
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium font-['Poppins']">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium font-['Poppins']">
              About
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium font-['Poppins']">
              Services
            </Link>
            <Link to="/resources" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium font-['Poppins']">
              Resources
            </Link>
            <Link to="/quizzo" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium font-['Poppins']">
              Quizzo
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none"
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
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 font-['Poppins']"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 font-['Poppins']"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 font-['Poppins']"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/resources"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 font-['Poppins']"
              onClick={() => setIsOpen(false)}
            >
              Resources
            </Link>
            <Link
              to="/quizzo"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 font-['Poppins']"
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