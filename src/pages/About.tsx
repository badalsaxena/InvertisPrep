
export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-indigo-700 sm:text-5xl">
            About InvertisPrep
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            InvertisPrep is a comprehensive academic platform designed specifically for Invertis University students. Our mission is to make quality education accessible to all students.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-indigo-100 p-8 shadow-md">
            <h3 className="text-lg font-semibold leading-7 text-indigo-700">Our Vision</h3>
            <p className="mt-4 text-base leading-7 text-gray-600">
              To create a platform where every student has access to quality educational resources and can learn in an engaging, interactive environment.
            </p>
          </div>

          <div className="rounded-2xl bg-indigo-100 p-8 shadow-md">
            <h3 className="text-lg font-semibold leading-7 text-indigo-700">Our Mission</h3>
            <p className="mt-4 text-base leading-7 text-gray-600">
              To provide comprehensive academic resources and create an engaging learning environment through innovative features like real-time quizzes and community-driven content.
            </p>
          </div>

          <div className="rounded-2xl bg-indigo-100 p-8 shadow-md">
            <h3 className="text-lg font-semibold leading-7 text-indigo-700">Our Values</h3>
            <p className="mt-4 text-base leading-7 text-gray-600">
              We believe in accessibility, quality, and community. Every feature we build is designed with these core values in mind.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 