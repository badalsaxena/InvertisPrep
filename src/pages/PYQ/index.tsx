import React from "react";
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
import { GraduationCap, ChevronRight, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Program data
const programs = [
  {
    id: "btech",
    name: "BTech",
    fullName: "Bachelor of Technology",
    description: "4-year undergraduate program focusing on engineering"
  },
  {
    id: "bca",
    name: "BCA",
    fullName: "Bachelor of Computer Applications",
    description: "3-year undergraduate program focusing on computer applications"
  },
  {
    id: "bcom",
    name: "BCom",
    fullName: "Bachelor of Commerce",
    description: "3-year undergraduate program focusing on commerce and business studies"
  },
  {
    id: "bsc",
    name: "BSc",
    fullName: "Bachelor of Science",
    description: "3-year undergraduate program focusing on science and its applications"
  },
  {
    id: "mca",
    name: "MCA",
    fullName: "Master of Computer Applications",
    description: "2-year postgraduate program focusing on computer applications"
  },
  {
    id: "mtech",
    name: "MTech",
    fullName: "Master of Technology",
    description: "2-year postgraduate program focusing on advanced engineering"
  },
  {
    id: "bba",
    name: "BBA",
    fullName: "Bachelor of Business Administration",
    description: "3-year undergraduate program focusing on business management"
  },
  {
    id: "mba",
    name: "MBA",
    fullName: "Master of Business Administration",
    description: "2-year postgraduate program focusing on advanced business management"
  }
];

function PYQPage() {
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
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 text-sm mt-6">
          <p><strong>Note:</strong> Before downloading any previous year papers, please check your current syllabus.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {programs.map((program) => (
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
    </div>
  );
}

export default PYQPage; 