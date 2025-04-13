export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('https://cdnjs.cloudflare.com/ajax/libs/ionicons/4.5.6/collection/build/svg/grid.svg')] opacity-10"></div>
      <div className="absolute top-40 -left-24 w-96 h-96 rounded-full bg-indigo-200 blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 -right-24 w-96 h-96 rounded-full bg-purple-200 blur-3xl opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 sm:text-6xl font-['Montserrat']">
            About InvertisPrep
          </h1>
          <p className="mt-8 text-xl leading-8 text-gray-700 max-w-3xl mx-auto font-['Poppins']">
            InvertisPrep is a comprehensive academic platform designed specifically for Invertis University students. Our mission is to make quality education accessible to all students.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-lg border border-indigo-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-200 opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <h3 className="text-xl font-bold leading-7 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 font-['Montserrat'] relative z-10">
              Our Vision
            </h3>
            <p className="mt-4 text-base leading-7 text-gray-700 font-['Poppins'] relative z-10">
              To create a platform where every student has access to quality educational resources and can learn in an engaging, interactive environment.
            </p>
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-indigo-600 to-blue-600 group-hover:w-full transition-all duration-500"></div>
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-lg border border-purple-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-200 opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <h3 className="text-xl font-bold leading-7 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-['Montserrat'] relative z-10">
              Our Mission
            </h3>
            <p className="mt-4 text-base leading-7 text-gray-700 font-['Poppins'] relative z-10">
              To provide comprehensive academic resources and create an engaging learning environment through innovative features like real-time quizzes and community-driven content.
            </p>
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-500"></div>
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-lg border border-teal-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-teal-200 opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <h3 className="text-xl font-bold leading-7 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 font-['Montserrat'] relative z-10">
              Our Values
            </h3>
            <p className="mt-4 text-base leading-7 text-gray-700 font-['Poppins'] relative z-10">
              We believe in accessibility, quality, and community. Every feature we build is designed with these core values in mind.
            </p>
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-teal-600 to-emerald-600 group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1 font-['Poppins']">
            Join Our Community
          </button>
        </div>
      </div>
    </div>
  );
}