import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const programs = [
  {
    id: "btech",
    name: "BTech",
    description: "Bachelor of Technology",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "bca",
    name: "BCA",
    description: "Bachelor of Computer Applications",
    color: "from-green-500 to-green-600"
  },
  {
    id: "mca",
    name: "MCA",
    description: "Master of Computer Applications",
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "mtech",
    name: "MTech",
    description: "Master of Technology",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    id: "bba",
    name: "BBA",
    description: "Bachelor of Business Administration",
    color: "from-orange-500 to-orange-600"
  },
  {
    id: "mba",
    name: "MBA",
    description: "Master of Business Administration",
    color: "from-red-500 to-red-600"
  }
];

export default function PYQ() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Previous Year Question Papers
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Access previous year question papers for all programs and branches.
        </p>
        <div className="border-t border-gray-200 pt-6">
          <p className="text-red-600 font-medium">
            Note: Before downloading any previous year papers, please check your current syllabus.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {programs.map((program) => (
          <Link 
            key={program.id} 
            to={`/pyq/${program.id}`}
            className="transition-transform hover:scale-105"
          >
            <Card className="h-full overflow-hidden border-0 shadow-lg">
              <div className={`bg-gradient-to-r ${program.color} py-6 px-5 text-white`}>
                <h2 className="text-3xl font-bold">{program.name}</h2>
                <p className="text-white/80 mt-1">{program.description}</p>
              </div>
              <CardContent className="p-5 bg-white">
                <div className="flex items-center text-gray-700 gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>View Question Papers</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 