import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, BookText, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function About() {
  const features = [
    {
      icon: <BrainCircuit className="h-10 w-10 text-primary" />,
      title: "Quizzo",
      description: "Interactive quizzes designed to test your knowledge and help you prepare for exams in a fun and engaging way.",
      link: "/quizzo",
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: <BookText className="h-10 w-10 text-primary" />,
      title: "Notes",
      description: "Comprehensive study materials and lecture notes covering all subjects and topics in your curriculum.",
      link: "/notes",
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "PYQs",
      description: "Previous years' question papers with solutions to help you understand exam patterns and prepare effectively.",
      link: "/pyqs",
      color: "from-teal-600 to-emerald-600"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('https://cdnjs.cloudflare.com/ajax/libs/ionicons/4.5.6/collection/build/svg/grid.svg')] opacity-10"></div>
      <div className="absolute top-40 -left-24 w-96 h-96 rounded-full bg-indigo-200 blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 -right-24 w-96 h-96 rounded-full bg-purple-200 blur-3xl opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 sm:text-6xl">
            About InvertisPrep
          </h1>
          <p className="mt-8 text-xl text-gray-700 max-w-3xl mx-auto">
            InvertisPrep is your one-stop platform for academic excellence at Invertis University. We provide everything you need to succeed in your studies.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className={`text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r ${feature.color}`}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-700 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex justify-center pt-2 pb-6">
                  <Button asChild className={`bg-gradient-to-r ${feature.color} text-white hover:opacity-90`}>
                    <Link to={feature.link}>Explore {feature.title}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Ready to get started?</h2>
          <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90">
            <Link to="/register">Join InvertisPrep Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}