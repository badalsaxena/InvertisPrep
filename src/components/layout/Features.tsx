import { BookOpen, Trophy, Users, FileText, Brain, Laptop, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function Features() {
  const features = [
    {
      icon: BookOpen,
      title: "Previous Year Papers",
      description:
        "Access a comprehensive collection of previous year question papers from all semesters and departments.",
      link: "/pyq"
    },
    {
      icon: FileText,
      title: "Study Notes",
      description:
        "Get access to detailed study notes created by top students and faculty members.",
      link: "/resources"
    },
    {
      icon: Trophy,
      title: "Quizzo Battles",
      description:
        "Compete with peers in real-time 1v1 quiz battles with 10-second timer per question.",
      link: "/quizzo"
    },
    {
      icon: Users,
      title: "Community Uploads",
      description:
        "Share your notes and resources with the community and get recognition for your contributions.",
      link: "/resources"
    },
    {
      icon: Brain,
      title: "Personalized Learning",
      description:
        "Track your progress, identify weak areas, and get personalized recommendations.",
      link: "/dashboard"
    },
    {
      icon: Laptop,
      title: "Anywhere, Anytime",
      description:
        "Access all resources on any device, anytime, anywhere. Study on your schedule.",
      link: "/resources"
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <section
      id="features"
      className="pt-10 md:pt-16 pb-12 md:pb-20 bg-gradient-to-b from-indigo-100 via-purple-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
          <Badge variant="secondary" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold mb-4 hover:from-indigo-700 hover:to-purple-700">
            KEY FEATURES
          </Badge>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 font-['Montserrat']">
            Everything You Need to Excel
          </h2>
          
          <p className="mt-3 md:mt-4 text-sm sm:text-base md:text-lg text-gray-700 font-['Poppins'] px-2">
            InvertisPrep combines academic resources with interactive learning to create
            the ultimate platform for Invertis University students.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
            >
              <Card className="h-full border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className={`rounded-lg p-2.5 ${iconColors[index % iconColors.length]} bg-white shadow-sm`}>
                      <feature.icon className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <Badge variant="outline" className={`${iconColors[index % iconColors.length]} border-current bg-transparent`}>
                      Featured
                    </Badge>
                  </div>
                  <CardTitle className="mt-4 text-lg font-semibold font-['Montserrat']">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-gray-600 font-['Poppins'] text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Link to={feature.link} className="w-full">
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start p-0 hover:bg-transparent ${iconColors[index % iconColors.length]} transition-all duration-300 opacity-70 hover:opacity-100 group-hover:translate-x-1`}
                    >
                      Learn more
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10 md:mt-14">
          <Link to="/quizzo">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg px-6 py-5 rounded-full transition-all duration-300 transform hover:-translate-y-1 font-['Poppins']">
              Start Learning Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
