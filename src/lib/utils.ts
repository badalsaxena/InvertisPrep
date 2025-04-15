import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts and formats a readable subject name from PDF filename
 * Example: "CSE_2023_Sem1_MATHEMATICS_I.pdf" -> "Mathematics I"
 */
export function extractSubjectName(filename: string): string {
  // Remove .pdf extension if present
  let name = filename.replace(/\.pdf$/i, '');
  
  // Remove common prefixes like CSE_2023_Sem1_ using regex
  name = name.replace(/^[A-Z]+_\d{4}(?:_Sem\d+)?_/i, '');
  
  // Replace underscores with spaces
  name = name.replace(/_/g, ' ');
  
  // Handle special cases where words already have spaces
  name = name.replace(/INTRODUCTION TO/i, 'Introduction to');
  
  // Capitalize each word properly while preserving acronyms
  return name.split(' ').map(word => {
    // Keep acronyms like IT, CS, AI in uppercase
    if (word.length <= 2) return word.toUpperCase();
    // Otherwise capitalize first letter only
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}
