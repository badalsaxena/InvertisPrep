import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, ChevronRight, BookOpen, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Program data with interface
export interface Program {
  id: string;
  name: string;
  fullName: string;
  description: string;
  subjects?: string[];
}

// Subject mappings for each program
const programSubjects: Record<string, string[]> = {
  "btech": [
    "Data Structures & Algorithms", 
    "Computer Networks", 
    "Operating Systems", 
    "Database Management Systems", 
    "Object Oriented Programming",
    "Computer Organization",
    "Software Engineering",
    "Web Development",
    "Artificial Intelligence"
  ],
  "bca": [
    "Programming Fundamentals",
    "Data Structures",
    "Database Systems",
    "Computer Networks",
    "Operating Systems",
    "Web Technologies",
    "Software Engineering"
  ],
  "bcom": [
    "Financial Accounting",
    "Business Economics",
    "Business Law",
    "Corporate Accounting",
    "Cost Accounting",
    "Income Tax",
    "Auditing"
  ],
  "bsc": [
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "Computer Science",
    "Statistics",
    "Environmental Science"
  ],
  "mca": [
    "Advanced Data Structures",
    "Advanced Database Systems",
    "Advanced Computer Networks",
    "Machine Learning",
    "Cloud Computing",
    "Mobile Application Development",
    "Data Mining"
  ],
  "mtech": [
    "Advanced Algorithms",
    "Advanced Computer Architecture",
    "Distributed Systems",
    "Information Security",
    "Wireless Networks",
    "Image Processing",
    "Advanced Software Engineering"
  ],
  "bba": [
    "Principles of Management",
    "Financial Management",
    "Marketing Management",
    "Human Resource Management",
    "Operations Management",
    "Business Ethics",
    "Strategic Management"
  ],
  "mba": [
    "Advanced Financial Management",
    "Marketing Research",
    "Organizational Behavior",
    "Business Analytics",
    "Project Management",
    "International Business",
    "Entrepreneurship"
  ],
  "pharmacy": [
    "Pharmaceutical Chemistry",
    "Pharmacology",
    "Pharmaceutics",
    "Pharmacognosy",
    "Clinical Pharmacy",
    "Pharmacotherapeutics",
    "Pharmaceutical Analysis"
  ],
  "ba": [
    "English Literature",
    "History",
    "Political Science",
    "Sociology",
    "Economics",
    "Psychology",
    "Philosophy"
  ],
  "bjmc": [
    "Introduction to Journalism",
    "Media Ethics",
    "Digital Media Production",
    "Public Relations",
    "Advertising",
    "Television & Radio Journalism",
    "Media Law"
  ],
  "fashion_design": [
    "Fashion Illustration",
    "Textile Design",
    "Garment Construction",
    "Fashion Marketing",
    "Fashion Merchandising",
    "Computer-Aided Design",
    "Fashion Portfolio Development"
  ],
  "education": [
    "Educational Psychology",
    "Teaching Methodology",
    "Educational Technology",
    "Curriculum Development",
    "Classroom Management",
    "Educational Assessment",
    "Inclusive Education"
  ],
  "applied_science": [
    "Applied Mathematics",
    "Applied Physics",
    "Applied Chemistry",
    "Biotechnology",
    "Material Science",
    "Environmental Science",
    "Food Technology"
  ],
  "msc": [
    "Advanced Analytical Techniques",
    "Research Methodology",
    "Quantum Mechanics",
    "Molecular Biology",
    "Organic Chemistry",
    "Differential Equations",
    "Bioinformatics"
  ]
};

// Program data
export const programs: Program[] = [
  {
    id: "btech",
    name: "BTech",
    fullName: "Bachelor of Technology",
    description: "4-year undergraduate program focusing on engineering",
    subjects: programSubjects["btech"]
  },
  {
    id: "bca",
    name: "BCA",
    fullName: "Bachelor of Computer Applications",
    description: "3-year undergraduate program focusing on computer applications",
    subjects: programSubjects["bca"]
  },
  {
    id: "bcom",
    name: "BCom",
    fullName: "Bachelor of Commerce",
    description: "3-year undergraduate program focusing on commerce",
    subjects: programSubjects["bcom"]
  },
  {
    id: "bsc",
    name: "BSc",
    fullName: "Bachelor of Science",
    description: "3-year undergraduate program focusing on science",
    subjects: programSubjects["bsc"]
  },
  {
    id: "mca",
    name: "MCA",
    fullName: "Master of Computer Applications",
    description: "2-year postgraduate program focusing on computer applications",
    subjects: programSubjects["mca"]
  },
  {
    id: "mtech",
    name: "MTech",
    fullName: "Master of Technology",
    description: "2-year postgraduate program focusing on advanced engineering",
    subjects: programSubjects["mtech"]
  },
  {
    id: "bba",
    name: "BBA",
    fullName: "Bachelor of Business Administration",
    description: "3-year undergraduate program focusing on business management",
    subjects: programSubjects["bba"]
  },
  {
    id: "mba",
    name: "MBA",
    fullName: "Master of Business Administration",
    description: "2-year postgraduate program focusing on advanced business management",
    subjects: programSubjects["mba"]
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    fullName: "Bachelor of Pharmacy",
    description: "4-year undergraduate program focusing on pharmaceutical sciences",
    subjects: programSubjects["pharmacy"]
  },
  {
    id: "ba",
    name: "BA",
    fullName: "Bachelor of Arts",
    description: "3-year undergraduate program focusing on humanities and social sciences",
    subjects: programSubjects["ba"]
  },
  {
    id: "bjmc",
    name: "BJMC",
    fullName: "Bachelor of Journalism & Mass Communication",
    description: "3-year undergraduate program focusing on media and communication",
    subjects: programSubjects["bjmc"]
  },
  {
    id: "fashion_design",
    name: "Fashion Design",
    fullName: "Bachelor of Design in Fashion",
    description: "4-year undergraduate program focusing on fashion and textile design",
    subjects: programSubjects["fashion_design"]
  },
  {
    id: "education",
    name: "Education",
    fullName: "Bachelor of Education",
    description: "2-year program preparing students for teaching careers",
    subjects: programSubjects["education"]
  },
  {
    id: "applied_science",
    name: "Applied Science",
    fullName: "Bachelor of Applied Sciences",
    description: "3-year program focusing on practical applications of scientific principles",
    subjects: programSubjects["applied_science"]
  },
  {
    id: "msc",
    name: "MSc",
    fullName: "Master of Science",
    description: "2-year postgraduate program with advanced scientific specialization",
    subjects: programSubjects["msc"]
  }
];

function PYQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPrograms = programs.filter(program => 
    program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Previous Year Question Papers
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Access previous year question papers for all programs and branches.
        </p>
        <Separator className="my-6" />
        
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search programs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 text-sm mt-6">
          <p><strong>Note:</strong> Before downloading any previous year papers, please check your current syllabus.</p>
        </div>
      </div>

      <Tabs defaultValue="grid" className="max-w-6xl mx-auto">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredPrograms.map((program) => (
              <Link to={`/pyq/${program.id}`} key={program.id} className="no-underline">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold">
                          {program.name}
                        </CardTitle>
                        <CardDescription>
                          {program.fullName}
                        </CardDescription>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground">
                      {program.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full justify-between group">
                      <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Question Papers
                      </span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="detailed">
          <div className="space-y-6 max-w-4xl mx-auto">
            {filteredPrograms.map((program) => (
              <Card key={program.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{program.name} - {program.fullName}</CardTitle>
                      <CardDescription className="mt-1.5">{program.description}</CardDescription>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium mb-3">Available Subjects:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    {program.subjects?.map((subject, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                        {subject}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 flex justify-end">
                  <Link to={`/pyq/${program.id}`}>
                    <Button className="group">
                      View All Question Papers
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PYQPage; 