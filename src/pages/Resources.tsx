import { Button } from "@/components/ui/button";
import { ClockIcon } from "lucide-react";

export default function Resources() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Academic Resources
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Access notes, study materials, and other academic resources all in one place.
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <ClockIcon className="h-16 w-16 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Coming Soon!
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto mb-6">
              We're working hard to bring you a comprehensive collection of academic resources. Please check back later.
            </p>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 