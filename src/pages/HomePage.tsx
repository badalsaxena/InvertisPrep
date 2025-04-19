import React from 'react';
import { Hero } from "@/components/layout/Hero";
import { Features } from "@/components/layout/Features";
import { Footer } from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

export default function HomePage() {
  // Define structured data for website
  const websiteData = {
    name: "InvertisPrep",
    url: "https://invertisprep.vercel.app",
    potentialAction: {
      "@type": "SearchAction",
      "target": "https://invertisprep.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // Structured data for organization
  const organizationData = {
    name: "InvertisPrep",
    url: "https://invertisprep.vercel.app",
    logo: "https://invertisprep.vercel.app/logo.png",
    sameAs: [
      "https://www.facebook.com/invertisprep",
      "https://twitter.com/invertisprep",
      "https://www.instagram.com/invertisprep"
    ],
    description: "InvertisPrep is an academic resource platform designed specifically for Invertis University students. It provides access to previous year question papers, study materials, quiz competitions, and a community-driven learning environment."
  };

  // Structured data for Invertis University
  const universityData = {
    name: "Invertis University",
    url: "https://www.invertisuniversity.ac.in",
    address: {
      "@type": "PostalAddress",
      "addressLocality": "Bareilly",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "243123",
      "addressCountry": "India",
      "streetAddress": "Bareilly - Lucknow National Highway-24"
    },
    description: "Invertis University is one of the top universities in Uttar Pradesh, India. Offering a wide range of courses across various disciplines."
  };

  return (
    <>
      {/* SEO Component */}
      <SEO 
        title="InvertisPrep - Academic Resources for Invertis University Students"
        description="Access previous year papers, study materials, quizzes, and collaborative learning resources designed specifically for Invertis University students."
        keywords="Invertis University, previous year papers, study materials, quiz, academic resources, Invertis, InvertisPrep"
        url="https://invertisprep.vercel.app"
      />
      
      {/* Structured Data */}
      <StructuredData type="WebSite" data={websiteData} />
      <StructuredData type="Organization" data={organizationData} />
      <StructuredData type="CollegeOrUniversity" data={universityData} />
      
      {/* Main Content */}
      <main>
        <Hero />
        <Features />
        <Footer />
      </main>
    </>
  );
} 