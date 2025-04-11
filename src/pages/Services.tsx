import { BookOpen, Trophy, Upload, Search } from "lucide-react";

const services = [
  {
    name: "Academic Resources",
    description: "Access previous year question papers, notes, and syllabus details all in one place.",
    icon: BookOpen,
  },
  {
    name: "Quizzo Battles",
    description: "Compete in real-time 1v1 quiz battles with your peers. Test your knowledge and climb the leaderboard.",
    icon: Trophy,
  },
  {
    name: "Community Uploads",
    description: "Contribute to the community by uploading your own notes and solutions. Help others learn and grow.",
    icon: Upload,
  },
  {
    name: "Smart Search",
    description: "Find exactly what you need with our powerful search functionality. Filter by branch, semester, and more.",
    icon: Search,
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Our Services
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Discover all the features that make InvertisPrep the perfect platform for your academic success.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.name}
              className="relative rounded-2xl bg-gray-50 p-8 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center gap-x-4">
                <service.icon className="h-12 w-12 text-indigo-600" />
                <h3 className="text-lg font-semibold leading-7 text-gray-900">
                  {service.name}
                </h3>
              </div>
              <p className="mt-4 text-base leading-7 text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 