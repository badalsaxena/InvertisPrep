import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Linkedin, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Mentor {
  id: number;
  name: string;
  role: string;
  department: string;
  bio: string;
  image: string;
  email: string;
  linkedin?: string;
  website?: string;
  specializations: string[];
}

const mentors: Mentor[] = [
  {
    id: 1,
    name: "Ms. Harshita Kushwaha",
    role: "IT trainer Data Analyst",
    department: "Computer Science",
    bio: "As a highly motivated and dedicated professional, I bring a strong work ethic and passion for innovation to everything I do. I'm always looking for new opportunities to grow, learn, and make a meaningful impact.",
    image: "img11.jpg",
    email: "amrita.sharma@invertis.edu",
    linkedin: "hhttps://www.linkedin.com/in/harshita-kushwaha-532b87261/",
    
    specializations: ["Machine Learning", "C++", "Data Science"]
  },
  {
    id: 2,
    name: "Mr. Akshit Sharma",
    role: "Associate Professor & Trainer Head",
    department: "Computer Science",
    bio: "Passionate about marketing, mechanical engineering, and workshop innovations, I bring a diverse skill set that blends technical expertise with strategic thinking. With experience in AutoCAD, CREO, C, C++, and data structures & algorithms (DSA), I thrive in problem-solving and optimizing processes.",
    image: "img3.jpg",
    email: "rajesh.verma@invertis.edu",
    linkedin: "https://www.linkedin.com/in/akshit-sharma-790601189/",
    specializations: ["AutoCad", "C++", "DSA"]
  },
  {
    id: 3,
    name: "Mr. Sudhanshu Kumar",
    role: "Assistant Professor & Resource Management",
    department: "Business Administration",
    bio: "Mr. Sudhanshu Kumar is an expert in marketing strategies and consumer behavior. She has worked with several Fortune 500 companies as a consultant before joining academia.",
    image: "img2.webp",
    email: "priya.singh@invertis.edu",
    linkedin: "https://linkedin.com/in/priya-singh",
    specializations: ["Marketing", "Consumer Behavior", "Business Strategy"]
  },
  {
    id: 4,
    name: "Mr. Raman Tiwari",
    role: "Professor & Testing Expert",
    department: "Computer Science",
    bio: "Mr. Raman Tiwari has extensive experience in thermodynamics and fluid mechanics. He has been with Invertis University for over a decade and has mentored numerous successful students.",
    image: "img4.webp",
    email: "vikram.patel@invertis.edu",
    website: "https://vikrampatel.net",
    specializations: ["Thermodynamics", "Fluid Mechanics", "Heat Transfer"]
  },
  {
    id: 5,
    name: "Mr. Mudit Kumar",
    role: "Associate Professor & UI/UX Specialist",
    department: "Computer Science",
    bio: "Mr. Mudit Kumar specializes in cyber security and network protocols. She has collaborated with government agencies on various security projects and brings practical industry experience to her teaching.",
    image: "img5.webp",
    email: "anjali.mehta@invertis.edu",
    linkedin: "https://linkedin.com/in/anjali-mehta",
    specializations: ["Cyber Security", "Network Protocols", "Information Security"]
  },
  {
    id: 6,
    name: "Mr. Raghav Raj Chauhan",
    role: "Professor & Resource Management",
    department: "Computer Science",
    bio: "Mr. Raghav Raj Chauhan is a leading expert in structural engineering and sustainable construction. He has published extensively on earthquake-resistant structures and green building technologies.",
    image: "img6.jpg",
    email: "arjun.kumar@invertis.edu",
    linkedin: "https://linkedin.com/in/arjun-kumar",
    website: "https://arjunkumar.org",
    specializations: ["Structural Engineering", "Sustainable Construction", "Green Buildings"]
  }
];

const OurMentors: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Our Mentors</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Meet the exceptional faculty members who guide our students towards academic excellence and career success.
        </p>
        <Separator className="my-8 max-w-md mx-auto" />
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {mentors.map((mentor) => (
          <div 
            key={mentor.id} 
            className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-center pt-6">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-100">
                <img 
                  src={mentor.image} 
                  alt={mentor.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
            
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold mb-1">{mentor.name}</h3>
              <p className="text-primary font-medium text-sm mb-1">{mentor.role}</p>
              <p className="text-muted-foreground text-sm mb-3">{mentor.department}</p>
              
              <p className="text-sm text-gray-600 mb-4">{mentor.bio}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Specializations</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {mentor.specializations.map((spec, index) => (
                    <span 
                      key={index} 
                      className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button variant="outline" size="sm" className="rounded-full h-8 w-8 p-0">
                  <a href={`mailto:${mentor.email}`} aria-label={`Email ${mentor.name}`} className="flex items-center justify-center w-full h-full">
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
                
                {mentor.linkedin && (
                  <Button variant="outline" size="sm" className="rounded-full h-8 w-8 p-0">
                    <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${mentor.name}'s LinkedIn profile`} className="flex items-center justify-center w-full h-full">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                
                {mentor.website && (
                  <Button variant="outline" size="sm" className="rounded-full h-8 w-8 p-0">
                    <a href={mentor.website} target="_blank" rel="noopener noreferrer" aria-label={`${mentor.name}'s website`} className="flex items-center justify-center w-full h-full">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-xl max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">Interested in joining our faculty?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're always looking for passionate educators and researchers to join our team. If you're interested in teaching at Invertis University, we'd love to hear from you.
          </p>
          <Button size="lg">
            <a href="mailto:careers@invertis.edu" className="flex items-center justify-center w-full h-full">Contact Us</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OurMentors; 