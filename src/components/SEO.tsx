import React, { useEffect } from 'react';

type SEOProps = {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  children?: React.ReactNode;
};

export default function SEO({
  title = 'InvertisPrep - Academic Resources for Invertis University Students',
  description = 'Access previous year papers, study materials, quizzes, and collaborative learning resources designed specifically for Invertis University students.',
  keywords = 'Invertis University, previous year papers, study materials, quiz, academic resources, Invertis, InvertisPrep',
  image = '/logo.png',
  url = 'https://invertisprep.vercel.app',
  type = 'website',
  children
}: SEOProps) {
  const siteTitle = title.includes('InvertisPrep') ? title : `${title} | InvertisPrep`;
  
  useEffect(() => {
    // Update document title
    document.title = siteTitle;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);
    
    // Update OpenGraph tags
    updateMeta('og:title', title);
    updateMeta('og:description', description);
    updateMeta('og:image', image);
    updateMeta('og:url', url);
    updateMeta('og:type', type);
    updateMeta('og:site_name', 'InvertisPrep');
    
    // Update Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    
    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', url);
    
    // Cleanup function
    return () => {
      // No cleanup needed as we're just modifying existing meta tags
    };
  }, [siteTitle, description, keywords, image, url, type]);
  
  const updateMeta = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };
  
  return <>{children}</>;
} 