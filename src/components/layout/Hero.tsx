import { Link } from "react-router-dom";
import { BookOpen, Trophy, Users, Clock } from "lucide-react";

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 h-screen flex items-center" style={{ marginTop: '-40px', padding: '0 1rem' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Text Content */}
          <div className="max-w-xl mx-auto text-center lg:text-left">
            <div className="mb-4">
              <span className="inline-flex items-center rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                What's new
              </span>
              <span className="ml-3 inline-flex items-center text-sm font-medium leading-6 text-gray-600">
                Just shipped v1.0
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 font-['Montserrat']">
              Your Gateway to<br className="hidden sm:block" /> Academic Excellence
            </h1>
            
            <p className="mt-4 text-base sm:text-lg leading-7 text-gray-600 font-['Poppins']">
              Access previous year papers, study materials, and compete in real-time quizzes. All in one place, designed specifically for Invertis University students.
            </p>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/resources"
                className="rounded-md bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-['Poppins']"
              >
                Get Started
              </Link>
              <Link to="/about" className="text-sm font-semibold leading-6 text-gray-900 flex items-center justify-center font-['Poppins']">
                Learn more <span aria-hidden="true" className="ml-1">→</span>
              </Link>
            </div>
          </div>
          
          {/* Right Column - Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-indigo-600/10 p-4">
              <div className="flex items-center gap-x-3 mb-2">
                <BookOpen className="h-7 w-7 text-indigo-600" />
                <h3 className="text-base font-semibold leading-7 text-gray-900 font-['Poppins']">Study Materials</h3>
              </div>
              <p className="text-sm text-gray-600 font-['Poppins']">
                Access comprehensive study materials and previous year papers.
              </p>
            </div>
            
            <div className="rounded-xl bg-indigo-600/10 p-4">
              <div className="flex items-center gap-x-3 mb-2">
                <Trophy className="h-7 w-7 text-indigo-600" />
                <h3 className="text-base font-semibold leading-7 text-gray-900 font-['Poppins']">Quiz Battles</h3>
              </div>
              <p className="text-sm text-gray-600 font-['Poppins']">
                Compete with peers in real-time quiz battles.
              </p>
            </div>
            
            <div className="rounded-xl bg-indigo-600/10 p-4">
              <div className="flex items-center gap-x-3 mb-2">
                <Users className="h-7 w-7 text-indigo-600" />
                <h3 className="text-base font-semibold leading-7 text-gray-900 font-['Poppins']">Community</h3>
              </div>
              <p className="text-sm text-gray-600 font-['Poppins']">
                Join a community of learners and share knowledge.
              </p>
            </div>
            
            <div className="rounded-xl bg-indigo-600/10 p-4">
              <div className="flex items-center gap-x-3 mb-2">
                <Clock className="h-7 w-7 text-indigo-600" />
                <h3 className="text-base font-semibold leading-7 text-gray-900 font-['Poppins']">24/7 Access</h3>
              </div>
              <p className="text-sm text-gray-600 font-['Poppins']">
                Study anytime, anywhere with our platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 