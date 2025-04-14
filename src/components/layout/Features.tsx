import { BookOpen, Trophy, Users, FileText, Brain, Laptop } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: BookOpen,
      title: "Previous Year Papers",
      description:
        "Access a comprehensive collection of previous year question papers from all semesters and departments.",
    },
    {
      icon: FileText,
      title: "Study Notes",
      description:
        "Get access to detailed study notes created by top students and faculty members.",
    },
    {
      icon: Trophy,
      title: "Quizzo Battles",
      description:
        "Compete with peers in real-time 1v1 quiz battles with 10-second timer per question.",
    },
    {
      icon: Users,
      title: "Community Uploads",
      description:
        "Share your notes and resources with the community and get recognition for your contributions.",
    },
    {
      icon: Brain,
      title: "Personalized Learning",
      description:
        "Track your progress, identify weak areas, and get personalized recommendations.",
    },
    {
      icon: Laptop,
      title: "Anywhere, Anytime",
      description:
        "Access all resources on any device, anytime, anywhere. Study on your schedule.",
    },
  ];

  const iconColors = [
    "text-purple-600",
    "text-pink-500",
    "text-amber-500",
    "text-emerald-500",
    "text-blue-500",
    "text-indigo-500",
  ];

  const bgGradients = [
    "bg-gradient-to-br from-purple-50 to-purple-100",
    "bg-gradient-to-br from-pink-50 to-pink-100",
    "bg-gradient-to-br from-amber-50 to-amber-100",
    "bg-gradient-to-br from-emerald-50 to-emerald-100",
    "bg-gradient-to-br from-blue-50 to-blue-100",
    "bg-gradient-to-br from-indigo-50 to-indigo-100",
  ];

  const borderColors = [
    "border-purple-200",
    "border-pink-200",
    "border-amber-200",
    "border-emerald-200",
    "border-blue-200",
    "border-indigo-200",
  ];

  return (
    <section
      id="features"
      className="pt-16 pb-20 bg-gradient-to-b from-indigo-100 via-purple-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold px-5 py-1.5 rounded-full mb-3 shadow">
            KEY FEATURES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 font-['Montserrat']">
            Everything You Need to Excel
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-700 font-['Poppins']">
            InvertisPrep combines academic resources with interactive learning to create
            the ultimate platform for Invertis University students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border ${borderColors[index % borderColors.length]} ${bgGradients[index % bgGradients.length]} backdrop-blur-sm`}
            >
              <div
                className={`inline-flex items-center justify-center p-3 rounded-lg mb-3 transition-transform transform group-hover:scale-105 bg-white/80 shadow`}
              >
                <feature.icon className={`h-6 w-6 ${iconColors[index % iconColors.length]}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 font-['Montserrat'] ${iconColors[index % iconColors.length]}`}>
                {feature.title}
              </h3>
              <p className="text-gray-700 font-['Poppins'] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-base font-bold rounded-full hover:from-indigo-700 hover:to-purple-700 transition duration-300 shadow hover:shadow-indigo-400/30 transform hover:-translate-y-1 font-['Poppins']">
            Start Learning Now
          </button>
        </div>
      </div>
    </section>
  );
}
