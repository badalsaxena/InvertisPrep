import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold">InvertisPrep</h3>
            <p className="mt-4 text-gray-400">
              Your gateway to academic excellence. Access study materials, previous year papers, and compete in real-time quizzes.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                📧 invertisprep@example.com
              </li>
              <li className="text-gray-400">
                📞 +91 1234567890
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-2xl">
                  <FaFacebook />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-2xl">
                  <FaTwitter />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-2xl">
                  <FaInstagram />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-8 border-gray-700" />
        <div className="flex justify-between text-gray-400">
          <p>© {new Date().getFullYear()} InvertisPrep. All rights reserved.</p>
          <p>Made with ❤️ by Ahqaf and Team</p>
        </div>
      </div>
    </footer>
  );
} 