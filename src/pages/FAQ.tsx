import React, { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { 
  Search, 
  BookOpen, 
  Users, 
  LucideIcon, 
  Trophy,
  CreditCard,
  HelpCircle,
  FileQuestion,
  Laptop,
  Lock,
  MessageSquare,
  UserCircle,
  Mail
} from "lucide-react";

// Define FAQ category type
type FAQCategory = {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  questions: {
    q: string;
    a: React.ReactNode;
  }[];
};

export default function FAQ() {
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Define all FAQ categories with their questions
  const faqCategories: FAQCategory[] = [
    {
      id: "general",
      title: "General Questions",
      icon: HelpCircle,
      color: "text-blue-500 bg-blue-50",
      questions: [
        {
          q: "What is InvertisPrep?",
          a: "InvertisPrep is an academic resource platform designed specifically for Invertis University students. It provides access to previous year question papers, study materials, quiz competitions, and a community-driven learning environment."
        },
        {
          q: "Do I need to register to use InvertisPrep?",
          a: "Yes, you need to create an account to access most features of InvertisPrep. Registration is free and only requires a valid email address. Some basic information like your academic details helps us personalize your experience."
        },
        {
          q: "Is InvertisPrep available on mobile devices?",
          a: "Yes! InvertisPrep is fully responsive and works on all devices including smartphones, tablets, and desktop computers. You can access all features from any device with an internet connection."
        },
        {
          q: "Is my data safe on InvertisPrep?",
          a: (
            <div>
              <p className="mb-2">We take data security very seriously. All your personal information is encrypted and stored securely. We never share your information with third parties without your consent.</p>
              <p>For more information, please review our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
            </div>
          )
        }
      ]
    },
    {
      id: "resources",
      title: "Study Resources",
      icon: BookOpen,
      color: "text-emerald-500 bg-emerald-50",
      questions: [
        {
          q: "What kinds of study materials are available?",
          a: "InvertisPrep offers a comprehensive collection of resources including previous year question papers, course notes, syllabus documents, important questions, and study guides created by faculty and top students."
        },
        {
          q: "How often are new resources added?",
          a: "New resources are added regularly, especially after exams when new question papers become available. We also update materials when syllabi change or when valuable new resources are contributed by community members."
        },
        {
          q: "Can I download the study materials for offline use?",
          a: "Yes, most study materials on InvertisPrep can be downloaded for offline access. Look for the download button on resource pages to save materials to your device."
        },
        {
          q: "Are the resources department-specific?",
          a: "Yes, all resources are organized by department, program, semester, and subject to make it easy to find exactly what you need for your specific courses."
        }
      ]
    },
    {
      id: "quiz",
      title: "Quizzo & Practice",
      icon: Trophy,
      color: "text-amber-500 bg-amber-50",
      questions: [
        {
          q: "What is Quizzo?",
          a: "Quizzo is our interactive quiz platform that allows you to test your knowledge through fun, competitive quizzes. You can play solo against the clock or challenge other students to multiplayer battles."
        },
        {
          q: "How do multiplayer quiz battles work?",
          a: "In multiplayer mode, you're matched with another student for a head-to-head competition. Both players answer the same questions within a 10-second time limit per question. The player with the highest score at the end wins."
        },
        {
          q: "What subjects are covered in the quizzes?",
          a: "Quizzo covers all major subjects taught at Invertis University. The questions are designed to help you practice important concepts and prepare for exams in an engaging way."
        },
        {
          q: "Do I earn rewards for participating in quizzes?",
          a: "Yes! You earn QCoins for completing quizzes, winning battles, and maintaining daily streaks. These coins can be used to unlock premium resources and features on the platform."
        }
      ]
    },
    {
      id: "community",
      title: "Community & Contributions",
      icon: Users,
      color: "text-purple-500 bg-purple-50",
      questions: [
        {
          q: "Can I contribute my own notes or materials?",
          a: "Absolutely! InvertisPrep encourages community contributions. You can upload your notes, solutions, study guides, or other resources to share with fellow students. Your contributions help make the platform more valuable for everyone."
        },
        {
          q: "How are user contributions moderated?",
          a: "All user-submitted content goes through a moderation process to ensure quality and accuracy. Our team reviews submissions to verify they meet our community guidelines before publishing them."
        },
        {
          q: "Is there a way to connect with other students?",
          a: "While we don't currently have a direct messaging system, we're developing community features to help students connect for study groups and collaborative learning. Stay tuned for updates!"
        },
        {
          q: "Do I get recognition for my contributions?",
          a: "Yes! Contributors are credited for their uploaded materials, and top contributors are featured on our leaderboards. You also earn QCoins for approved submissions, which enhances your reputation in the community."
        }
      ]
    },
    {
      id: "account",
      title: "Account Management",
      icon: UserCircle,
      color: "text-indigo-500 bg-indigo-50",
      questions: [
        {
          q: "How do I update my profile information?",
          a: "You can update your profile by logging in, clicking on your profile icon in the top right corner, and selecting 'Profile' from the dropdown menu. From there, you can edit your personal information, academic details, and preferences."
        },
        {
          q: "I forgot my password. How do I reset it?",
          a: "On the login page, click the 'Forgot Password' link. Enter your registered email address, and we'll send you instructions to reset your password. If you don't receive the email, check your spam folder or contact support."
        },
        {
          q: "Can I change my email address?",
          a: "Yes, you can change your email address in your profile settings. However, you'll need to verify the new email address before the change takes effect for security reasons."
        },
        {
          q: "How do I delete my account?",
          a: "If you wish to delete your account, please go to Settings > Account > Delete Account. Please note that account deletion is permanent and will remove all your data, including contributions and earned rewards."
        }
      ]
    },
    {
      id: "technical",
      title: "Technical Support",
      icon: Laptop,
      color: "text-red-500 bg-red-50",
      questions: [
        {
          q: "The website is loading slowly. What can I do?",
          a: "Slow loading can be caused by various factors. Try clearing your browser cache, ensure you have a stable internet connection, or try accessing the platform at a different time. If the problem persists, please report it through our bug report form."
        },
        {
          q: "I found a bug or error. How do I report it?",
          a: (
            <div>
              <p>You can report bugs or errors through our <Link to="/bug-report" className="text-primary hover:underline">Bug Report</Link> page. Please include as much detail as possible, including what you were doing when the error occurred, what device and browser you were using, and any error messages you saw.</p>
            </div>
          )
        },
        {
          q: "Are there any known issues with the platform?",
          a: "We maintain transparency about any ongoing issues. Check our homepage for announcements about scheduled maintenance or known issues. We work quickly to resolve any problems that affect the user experience."
        },
        {
          q: "Which browsers are supported?",
          a: "InvertisPrep works best on modern browsers like Google Chrome, Mozilla Firefox, Safari, and Microsoft Edge. We recommend keeping your browser updated to the latest version for optimal performance and security."
        }
      ]
    },
    {
      id: "payment",
      title: "QCoins & Premium",
      icon: CreditCard,
      color: "text-green-500 bg-green-50",
      questions: [
        {
          q: "What are QCoins and how do I earn them?",
          a: "QCoins are InvertisPrep's virtual currency. You can earn them by participating in quizzes, winning competitions, contributing quality content, maintaining daily streaks, and completing various activities on the platform."
        },
        {
          q: "What can I do with QCoins?",
          a: "QCoins can be used to unlock premium resources, access special features, enter exclusive competitions, and redeem rewards. The more active you are on the platform, the more QCoins you'll earn."
        },
        {
          q: "Is there a premium subscription plan?",
          a: "We're currently developing a premium plan that will offer additional benefits such as ad-free experience, priority access to new features, and exclusive content. Stay tuned for the official launch announcement."
        },
        {
          q: "Can I transfer QCoins to another user?",
          a: "Currently, QCoins cannot be transferred between users. They are tied to your individual account and reflect your personal activity and contributions on the platform."
        }
      ]
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: Lock,
      color: "text-gray-500 bg-gray-50",
      questions: [
        {
          q: "How is my personal information used?",
          a: (
            <div>
              <p className="mb-2">We collect only the information necessary to provide you with the best possible experience. This includes basic details like your name, email, and academic information.</p>
              <p>For a comprehensive explanation, please read our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
            </div>
          )
        },
        {
          q: "Are my contributions private or public?",
          a: "When you contribute materials to InvertisPrep, they become available to all users on the platform. You are credited as the contributor, but remember that you're sharing with the entire community."
        },
        {
          q: "How secure is my data on InvertisPrep?",
          a: "We implement industry-standard security measures to protect your data. This includes encryption of sensitive information, secure authentication processes, and regular security audits."
        },
        {
          q: "Does InvertisPrep use cookies?",
          a: "Yes, we use cookies to enhance your browsing experience, remember your preferences, and provide certain functionality. You can manage cookie preferences through your browser settings."
        }
      ]
    }
  ];
  
  // Filter questions based on search query
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (typeof q.a === 'string' && q.a.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.questions.length > 0);
  
  // Calculate total questions
  const totalQuestions = faqCategories.reduce((total, category) => total + category.questions.length, 0);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Create FAQ structured data
  const generateFAQStructuredData = () => {
    // Flatten all questions across categories
    const allQuestions = faqCategories.flatMap(category => 
      category.questions.map(question => ({
        "@type": "Question",
        "name": question.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": typeof question.a === 'string' ? question.a : 'Please visit our website for a detailed answer.'
        }
      }))
    );
    
    return {
      "@type": "FAQPage",
      "mainEntity": allQuestions
    };
  };
  
  const faqStructuredData = generateFAQStructuredData();
  
  return (
    <>
      {/* SEO Components */}
      <SEO 
        title="Frequently Asked Questions | InvertisPrep"
        description="Find answers to common questions about InvertisPrep's platform, study resources, Quizzo, and academic offerings for Invertis University students."
        keywords="InvertisPrep FAQ, Invertis University, academic resources, frequently asked questions, study materials, Quizzo"
        url="https://invertisprep.vercel.app/faq"
      />
      
      <StructuredData type="FAQPage" data={faqStructuredData} />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about InvertisPrep. Can't find what you're looking for? Contact our support team.
          </p>
          
          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search questions..."
                className="pl-10 py-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  ×
                </Button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-2">
                Found {filteredCategories.reduce((total, category) => total + category.questions.length, 0)} results out of {totalQuestions} questions
              </p>
            )}
          </div>
        </div>
        
        {/* Category Buttons for desktop */}
        {!searchQuery && (
          <div className="hidden md:grid grid-cols-4 gap-4 mb-10">
            {faqCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`justify-start h-auto py-3 px-4 ${activeCategory === category.id ? "" : "border-dashed"}`}
                onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
              >
                <category.icon className={`mr-2 h-5 w-5 ${category.color.split(" ")[0]}`} />
                <span>{category.title}</span>
              </Button>
            ))}
          </div>
        )}
        
        {/* Category Cards for mobile */}
        {!searchQuery && (
          <div className="md:hidden grid grid-cols-2 gap-3 mb-10">
            {faqCategories.map((category) => (
              <Card 
                key={category.id} 
                className={`cursor-pointer transition-all ${activeCategory === category.id ? "border-primary shadow-md" : "border-dashed"}`}
                onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-full ${category.color.split(" ")[1]}`}>
                    <category.icon className={`h-5 w-5 ${category.color.split(" ")[0]}`} />
                  </div>
                  <span className="text-sm font-medium">{category.title}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* FAQ Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {searchQuery ? (
            // Show search results
            filteredCategories.map((category) => (
              <motion.div key={category.id} className="mb-10" variants={itemVariants}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-full ${category.color.split(" ")[1]}`}>
                    <category.icon className={`h-5 w-5 ${category.color.split(" ")[0]}`} />
                  </div>
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                </div>
                
                <Accordion type="single" collapsible className="mb-6">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.id}-${index}`} className="border-b border-gray-100">
                      <AccordionTrigger className="text-base font-medium text-left hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))
          ) : (
            // Show all categories or selected category
            (activeCategory ? 
              faqCategories.filter(c => c.id === activeCategory) : 
              faqCategories
            ).map((category) => (
              <motion.div key={category.id} className="mb-10" variants={itemVariants}>
                <div className="flex items-center gap-3 mb-4" id={category.id}>
                  <div className={`p-2 rounded-full ${category.color.split(" ")[1]}`}>
                    <category.icon className={`h-5 w-5 ${category.color.split(" ")[0]}`} />
                  </div>
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                </div>
                
                <Accordion type="single" collapsible className="mb-6">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.id}-${index}`} className="border-b border-gray-100">
                      <AccordionTrigger className="text-base font-medium text-left hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))
          )}
        </motion.div>
        
        {/* Contact Section */}
        <div className="mt-16 mb-8">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="pt-6 pb-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  If you couldn't find the answer to your question, please don't hesitate to reach out to our support team.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/contact">
                    <Button className="w-full sm:w-auto">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Support
                    </Button>
                  </Link>
                  <a href="mailto:invertisprep@gmail.com">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Mail className="mr-2 h-4 w-4" />
                      Email Us
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
} 