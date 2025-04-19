import { Link } from "react-router-dom";
import { BookOpen, Trophy, Users, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Trigger animations on component mount
    setIsVisible(true);
  }, []);

  return (
    <div
      className="relative isolate overflow-hidden min-h-screen flex items-center"
      style={{
        marginTop: '-40px',
        paddingTop: '2rem',
        padding: '4rem 1rem 1rem 1rem',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url('img1.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-indigo-900/40"></div>

      <div className="mx-auto max-w-7xl px-2 sm:px-6 relative z-10 py-6 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          <div className="max-w-xl mx-auto text-center lg:text-left pt-10 sm:pt-0">
            <div className={`mb-4 md:mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <span className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-xs sm:text-sm font-semibold leading-6 text-white shadow-md">
                What's new
              </span>
              <span className="ml-2 inline-flex items-center text-xs sm:text-sm font-medium leading-6 text-indigo-200">
                Just shipped v1.0
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-['Montserrat']">
              <span className={`inline-block transition-all duration-700 delay-100 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
                Your Gateway to
              </span>
              <br className="hidden sm:block" />
              <span className={`inline-block transition-all duration-700 delay-300 transform bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
                Academic Excellence
              </span>
            </h1>

            <p className={`mt-4 md:mt-6 text-sm sm:text-base md:text-lg leading-6 md:leading-7 text-indigo-100 font-['Poppins'] transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'} max-w-lg mx-auto lg:mx-0`}>
              Access previous year papers, study materials, and compete in real-time quizzes. All in one place, designed specifically for Invertis University students.
            </p>

            <div className={`mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start transition-all duration-700 delay-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <Link
                to={user ? "/pyq" : "/login"}
                className="rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 md:px-6 md:py-3 text-center text-sm font-semibold text-white shadow-lg hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 transform hover:-translate-y-1 font-['Poppins']"
              >
                Get Started
              </Link>
              <Link
                to={user ? "/quizzo" : "/login"}
                className="text-sm font-semibold leading-6 text-white flex items-center justify-center font-['Poppins'] bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg px-5 py-2.5 md:px-6 md:py-3 rounded-md"
              >
                Learn more <span aria-hidden="true" className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-6 lg:mt-0">
            {/* Feature Card 1 */}
            <div className={`rounded-xl bg-transparent p-3 md:p-5 shadow-xl backdrop-blur-sm border border-white/50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'} hover:shadow-indigo-500/30 hover:scale-105 hover:-translate-y-1`}>
              <div className="flex items-center gap-x-3 md:gap-x-4 mb-2 md:mb-3">
                <div className="p-1.5 md:p-2 rounded-lg bg-indigo-100 text-indigo-600">
                  <BookOpen className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-base md:text-lg font-semibold leading-7 text-white font-['Montserrat']">Study Materials</h3>
              </div>
              <p className="text-xs md:text-sm text-gray-200 font-['Poppins'] ml-10 md:ml-14">
                Access comprehensive study materials and previous year papers.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className={`rounded-xl bg-transparent p-3 md:p-5 shadow-xl backdrop-blur-sm border border-white/50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'} hover:shadow-indigo-500/30 hover:scale-105 hover:-translate-y-1`}>
              <div className="flex items-center gap-x-3 md:gap-x-4 mb-2 md:mb-3">
                <div className="p-1.5 md:p-2 rounded-lg bg-indigo-100 text-indigo-600">
                  <Trophy className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-base md:text-lg font-semibold leading-7 text-white font-['Montserrat']">Quiz Battles</h3>
              </div>
              <p className="text-xs md:text-sm text-gray-200 font-['Poppins'] ml-10 md:ml-14">
                Compete with peers in real-time quiz battles.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className={`rounded-xl bg-transparent p-3 md:p-5 shadow-xl backdrop-blur-sm border border-white/50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'} hover:shadow-indigo-500/30 hover:scale-105 hover:-translate-y-1`}>
              <div className="flex items-center gap-x-3 md:gap-x-4 mb-2 md:mb-3">
                <div className="p-1.5 md:p-2 rounded-lg bg-indigo-100 text-indigo-600">
                  <Users className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-base md:text-lg font-semibold leading-7 text-white font-['Montserrat']">Community</h3>
              </div>
              <p className="text-xs md:text-sm text-gray-200 font-['Poppins'] ml-10 md:ml-14">
                Join a community of learners and share knowledge.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className={`rounded-xl bg-transparent p-3 md:p-5 shadow-xl backdrop-blur-sm border border-white/50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'} hover:shadow-indigo-500/30 hover:scale-105 hover:-translate-y-1`}>
              <div className="flex items-center gap-x-3 md:gap-x-4 mb-2 md:mb-3">
                <div className="p-1.5 md:p-2 rounded-lg bg-indigo-100 text-indigo-600">
                  <Clock className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-base md:text-lg font-semibold leading-7 text-white font-['Montserrat']">24/7 Access</h3>
              </div>
              <p className="text-xs md:text-sm text-gray-200 font-['Poppins'] ml-10 md:ml-14">
                Study anytime, anywhere with our platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
