// import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

// Add CSS for blinking heart animation
const heartBlink = `
  @keyframes heartBeat {
    0% { transform: scale(1); }
    15% { transform: scale(1.25); }
    30% { transform: scale(1); }
    45% { transform: scale(1.25); }
    60% { transform: scale(1); }
  }
  
  .heart-icon {
    display: inline-block;
    color: #ff3366;
    animation: heartBeat 2s infinite;
  }
`;

export function Footer() {
  const footerLinks = {
    "Quick Links": [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Resources", path: "/resources" },
      { name: "PYQ", path: "/pyq" },
      { name: "Quizzo", path: "/quizzo" },
    ],
    "Resources": [
      { name: "Study Materials", path: "/resources" },
      { name: "Previous Year Papers", path: "/pyq" },
      { name: "Quiz Battles", path: "/quizzo" },
      { name: "Blog", path: "/blog" },
      { name: "Admin Panel", path: "/admin" },
    ],
    "Support": [
      { name: "Bug Report", path: "/bug-report" },
      { name: "Privacy Policy", path: "/privacy-policy" },
      { name: "Terms of Service", path: "/terms-of-service" },
      { name: "Contact Us", path: "/contact-us" },
      { name: "FAQ", path: "/faq" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-200">
      {/* Add the heart animation style */}
      <style>{heartBlink}</style>
      
      {/* Desktop Footer */}
      <div className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                INVERTISPREP
              </span>
            </Link>
            <p className="text-sm text-gray-400">
              Your gateway to academic excellence at Invertis University.
            </p>
            {/* Get Started Button */}
            
            {/* Newsletter */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-300">Subscribe to our newsletter</p>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-[200px] bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
                />
                <Button variant="outline" className="border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-gray-100">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} InvertisPrep. All rights reserved.
          </p>
          
          <div className="text-sm text-gray-400">
            <p className="flex items-center">
              Made with <span className="heart-icon mx-1">❤️</span> by{" "}
              <a 
                href="https://www.ahqafali.site" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors ml-1"
              >
                AhqafCoder
              </a> & Team
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="sm:hidden px-4 py-6">
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(footerLinks).map(([title, links]) => (
            <AccordionItem key={title} value={title} className="border-gray-800">
              <AccordionTrigger className="text-sm font-semibold text-gray-200 hover:text-gray-100">
                {title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 py-2">
                  {links.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Mobile Newsletter */}
        <div className="mt-6 space-y-6">
          
        
          <h3 className="text-sm font-semibold text-gray-200">Subscribe to our newsletter</h3>
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
            />
            <Button variant="outline" className="border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-gray-100">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="my-6 bg-gray-800" />

        {/* Mobile Bottom Section - Updated for better responsiveness */}
        <div className="flex flex-col space-y-3">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} InvertisPrep. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 flex items-center justify-center flex-wrap">
            Made with <span className="heart-icon mx-1">❤️</span> by{" "}
            <a 
              href="https://www.ahqafali.site" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors ml-1"
            >
              AhqafCoder 
            </a> & Team
          </p>
        </div>
      </div>
    </footer>
  );
} 