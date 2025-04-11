import React from "react";
import { BookOpen, Trophy, Users, FileText, Brain, Laptop } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: BookOpen,
      title: "Previous Year Papers",
      description:
        "Access a comprehensive collection of previous year question papers from all semesters and departments."
    },
    {
      icon: FileText,
      title: "Study Notes",
      description:
        "Get access to detailed study notes created by top students and faculty members."
    },
    {
      icon: Trophy,
      title: "Quizzo Battles",
      description:
        "Compete with peers in real-time 1v1 quiz battles with 10-second timer per question."
    },
    {
      icon: Users,
      title: "Community Uploads",
      description:
        "Share your notes and resources with the community and get recognition for your contributions."
    },
    {
      icon: Brain,
      title: "Personalized Learning",
      description:
        "Track your progress, identify weak areas, and get personalized recommendations."
    },
    {
      icon: Laptop,
      title: "Anywhere, Anytime",
      description:
        "Access all resources on any device, anytime, anywhere. Study on your schedule."
    }
  ];

  return (
    <section id="features" className="pt-10 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Everything You Need to Excel
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            InvertisPrep combines academic resources with interactive learning to create
            the ultimate platform for Invertis University students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-lg mb-4">
                <feature.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 