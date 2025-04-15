import { departments } from "@/data/resources";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronRight, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PYQ() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Previous Year Questions
        </h1>
        <p className="text-lg text-gray-600">
          Access previous year question papers for all departments and semesters.
        </p>
      </div>

      {/* New Wizard Banner */}
      <div className="max-w-4xl mx-auto mb-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-6 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-blue-600" />
              Find Question Papers
            </h2>
            <p className="text-gray-600 mt-1">
              Use our step-by-step wizard to find and download the exact resources you need.
            </p>
          </div>
          <Link to="/pyq-wizard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Launch Wizard
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-12 max-w-6xl mx-auto">
        {departments.map((department) => (
          <div key={department.id} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{department.name}</h2>
                <p className="text-gray-600 mt-1">{department.description}</p>
              </div>
              <Link 
                to="/pyq-wizard"
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
              >
                Find Papers
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {department.branches ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {department.branches.map((branch) => (
                  <Link key={branch.id} to="/pyq-wizard">
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full">
                      <CardHeader>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {branch.name}
                        </CardTitle>
                        <CardDescription>
                          {branch.semesters.length} Semesters
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Previous Year Papers
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {department.semesters?.map((semester) => (
                  <Link key={semester} to="/pyq-wizard">
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full">
                      <CardHeader>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          Semester {semester}
                        </CardTitle>
                        <CardDescription>
                          View Question Papers
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Previous Year Papers
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 