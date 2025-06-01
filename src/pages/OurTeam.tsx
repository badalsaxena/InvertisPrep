import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  category: 'leadership' | 'development' | 'design' | 'marketing';
  social: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
}

const teamMembers: TeamMember[] = [
  // Leadership Team
  {
    id: 1,
    name: "Mr. Ahqaf Ali",
    role: "Founder & CEO, Full Stack Developer",
    bio: "Mr. Ahqaf Ali founded InvertisPrep with a vision to make quality education resources accessible to all students at Invertis University.",
    image: "ahqaf.jpg",
    category: 'leadership',
    social: {
      linkedin: "https://www.linkedin.com/in/ahqaf-ali/",
      github: "https://github.com/ahqafcoder",
      portfolio: "https://ahqafali.site"
    }
  },
  {
    id: 2,
    name: "Mr. Vivek Vishwakarma",
    role: "Cyber Security Head & Testing Expert",
    bio: "Mr. Vivek Vishwakarma is responsible for the Cyber Security of the InvertisPrep platform. He is a good cyber security expert and a testing expert.",
    image: "vivek.jpg",
    category: 'development',
    social: {
      linkedin: "https://www.linkedin.com/in/vivek-vishwakarma-953697321/",
      portfolio: "https://vivek-my-portfolio.netlify.app/",
      github: "https://github.com/v45cfghh"
    }
  },
  
  
  // Development Team
  {
    id: 3,
    name: "Mr. Pratyaksh Parashari",
    role: "Resource Head ",
    bio: "Mr. Pratyaksh Parashari leads our Resource team and is responsible for the resource collection and management of the InvertisPrep platform.",
    image: "pratyaksh.jpg",
    category: 'development',
    social: {
      linkedin: "https://www.linkedin.com/in/pratyaksh-parashari-696454343/",
      github: "https://github.com/rahul"
    }
  },
  {
    id: 4,
    name: "Mr. Kamal Yadav",
    role: "Resource Team",
    bio: "Mr. Kamal Yadav is a part of resource team and is responsible for the resource collection and management of the InvertisPrep platform.",
    image: "kamal.jpg",
    category: 'development',
    social: {
      linkedin: "https://linkedin.com/in/neha-singh",
      github: "https://github.com/neha"
    }
  },
  
  
  // Design Team
  {
    id: 5,
    name: "Mr. Shashank Mishra",
    role: "Resource Team",
    bio: "Mr. Shashank Mishra has done a great job in the resource team and is responsible for the resource collection and management of the InvertisPrep platform.",
    image: "shashank.jpg",
    category: 'design',
    social: {
      linkedin: "https://linkedin.com/in/ananya-reddy"
    }
  },
  
  
];

const OurTeam: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Our Team</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Meet the dedicated individuals who work tirelessly behind the scenes to make InvertisPrep the best resource for Invertis University students.
        </p>
        <Separator className="my-8 max-w-md mx-auto" />
      </div>

      {/* Team Tabs */}
      <Tabs defaultValue="all" className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="leadership">Leadership</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>
        
        {/* All Team Members */}
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </TabsContent>
        
        {/* Leadership Team */}
        <TabsContent value="leadership" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {teamMembers
              .filter(member => member.category === 'leadership')
              .map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
          </div>
        </TabsContent>
        
        {/* Development Team */}
        <TabsContent value="development" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {teamMembers
              .filter(member => member.category === 'development')
              .map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
          </div>
        </TabsContent>
        
        {/* Design Team */}
        <TabsContent value="design" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {teamMembers
              .filter(member => member.category === 'design')
              .map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
          </div>
        </TabsContent>
        
        {/* Marketing Team */}
        <TabsContent value="marketing" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {teamMembers
              .filter(member => member.category === 'marketing')
              .map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Join Our Team CTA */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">Join Our Team</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals who are passionate about education and technology.
            If you're interested in joining our team, check out our current openings.
          </p>
          <Button size="lg">
            View Open Positions
          </Button>
        </div>
      </div>
    </div>
  );
};

// Team Member Card Component
const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 w-full max-w-sm">
      <div className="flex justify-center pt-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10">
          <img 
            src={member.image} 
            alt={member.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
      <CardContent className="p-6 text-center">
        <h3 className="text-xl font-bold mb-1">{member.name}</h3>
        <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
        <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
        
        <div className="flex items-center justify-center gap-3 mt-4">
          {member.social.github && (
            <a 
              href={member.social.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary transition-colors"
              aria-label={`${member.name}'s GitHub`}
            >
              <Github className="h-5 w-5" />
            </a>
          )}
          
          {member.social.linkedin && (
            <a 
              href={member.social.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary transition-colors"
              aria-label={`${member.name}'s LinkedIn`}
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          
          {member.social.portfolio && (
            <a 
              href={member.social.portfolio} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary transition-colors"
              aria-label={`${member.name}'s Portfolio`}
            >
              <Globe className="h-5 w-5" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OurTeam; 