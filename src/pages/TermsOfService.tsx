import React from "react";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ScrollText, 
  FileWarning, 
  ShieldAlert, 
  Ban, 
  Mail, 
  ThumbsUp, 
  AlarmClock,
  Scale,
  Check,
  AlertTriangle,
  Building,
  ExternalLink,
  User,
  Info
} from "lucide-react";
import { motion } from "framer-motion";

export default function TermsOfService() {
  // Last updated date
  const lastUpdated = "April 20, 2025";

  const termsCategories = [
    {
      id: "acceptance",
      title: "Acceptance",
      icon: <ThumbsUp className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: "license",
      title: "Use License",
      icon: <FileWarning className="h-5 w-5" />,
      color: "bg-amber-100 text-amber-700"
    },
    {
      id: "disclaimer",
      title: "Disclaimer",
      icon: <ShieldAlert className="h-5 w-5" />,
      color: "bg-red-100 text-red-700"
    },
    {
      id: "limitations",
      title: "Limitations",
      icon: <Ban className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-700"
    },
    {
      id: "accounts",
      title: "User Accounts",
      icon: <User className="h-5 w-5" />,
      color: "bg-emerald-100 text-emerald-700"
    },
    {
      id: "modifications",
      title: "Modifications",
      icon: <AlarmClock className="h-5 w-5" />,
      color: "bg-pink-100 text-pink-700"
    },
    {
      id: "law",
      title: "Governing Law",
      icon: <Scale className="h-5 w-5" />,
      color: "bg-indigo-100 text-indigo-700"
    }
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-6 md:py-12 max-w-5xl">
        <div className="text-center mb-8 md:mb-12">
          <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20 rounded-full">
            Last updated: {lastUpdated}
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 flex items-center justify-center gap-2 md:gap-3">
            <ScrollText className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            Terms of Service
          </h1>
          
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg px-2">
            Please read these Terms carefully as they contain important information about your legal rights, remedies, and obligations.
          </p>
        </div>

        <Card className="mb-6 md:mb-10 border-primary/10 shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-3 md:pb-4 p-4">
            <CardTitle className="text-lg md:text-xl flex items-center">
              <Info className="mr-2 h-4 w-4 md:h-5 md:w-5 text-primary" />
              Your Agreement with InvertisPrep
            </CardTitle>
            <CardDescription className="text-sm md:text-base text-muted-foreground pt-2">
              By accessing or using our platform, you agree to comply with and be bound by these Terms.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 md:pt-6 p-4">
            <p className="text-xs md:text-sm text-gray-700">
              Welcome to InvertisPrep. These Terms of Service govern your access to and use of our platform, services, and content. 
              If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
            </p>
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2 md:gap-3">
              <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs md:text-sm text-amber-800">
                The materials contained in this platform are protected by applicable copyright and trademark law. Unauthorized use may result in legal action.
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="acceptance" className="w-full mb-8 md:mb-12">
          <TabsList className="w-full grid grid-cols-2 lg:grid-cols-7 md:grid-cols-4 h-auto bg-primary/5 p-1 gap-1 overflow-x-auto">
            {termsCategories.map(category => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col gap-1 py-2 md:py-3 data-[state=active]:bg-white text-xs"
              >
                <span className={`p-1 md:p-1.5 rounded-full ${category.color}`}>{category.icon}</span>
                <span className="text-[10px] md:text-xs">{category.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="bg-white rounded-md mt-2 p-4 md:p-6 border shadow-sm">
            <TabsContent value="acceptance" className="mt-0">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
                <ThumbsUp className="mr-2 h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              Acceptance of Terms
            </h2>
              <Separator className="mb-4 md:mb-6" />

              <Card className="mb-4 md:mb-6">
                <CardContent className="pt-4 md:pt-6 p-4">
                  <p className="text-xs md:text-sm text-gray-700">
                    By accessing or using InvertisPrep, you agree to be bound by these Terms and all applicable laws and regulations. 
                    If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                {[
                  { title: "Legal Agreement", desc: "These terms constitute a legally binding agreement" },
                  { title: "Compliance Required", desc: "Usage of the platform requires compliance with all terms" },
                  { title: "Full Acceptance", desc: "Partial acceptance of terms is not permitted" }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="p-3 md:p-4 border rounded-lg bg-blue-50 border-blue-100"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-xs md:text-sm font-semibold text-blue-800 mb-1 md:mb-2 flex items-center gap-1 md:gap-2">
                      <Check className="h-3 w-3 md:h-4 md:w-4" />
                      {item.title}
                    </h3>
                    <p className="text-[10px] md:text-xs text-blue-700">{item.desc}</p>
                  </motion.div>
                ))}
          </div>
            </TabsContent>

            <TabsContent value="license" className="mt-0">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
                <FileWarning className="mr-2 h-4 w-4 md:h-5 md:w-5 text-amber-600" />
              Use License
            </h2>
              <Separator className="mb-4 md:mb-6" />

              <Card className="mb-4 md:mb-6">
                <CardContent className="pt-4 md:pt-6 p-4">
                  <p className="text-xs md:text-sm text-gray-700">
                    Permission is granted to temporarily access the materials (information or software) on InvertisPrep for personal, non-commercial use only. 
                    This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-2 mb-4 md:mb-6">
                {[
                  "Modify or copy the materials",
                  "Use the materials for any commercial purpose or for any public display",
                  "Attempt to decompile or reverse engineer any software contained on InvertisPrep",
                  "Remove any copyright or other proprietary notations from the materials",
                  "Transfer the materials to another person or 'mirror' the materials on any other server"
                ].map((restriction, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-amber-50 border border-amber-100 rounded-md"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Ban className="h-3 w-3 md:h-4 md:w-4 text-amber-700 flex-shrink-0" />
                    <p className="text-xs md:text-sm text-amber-800">{restriction}</p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-red-50 border border-red-100 p-3 md:p-4 rounded-md">
                <p className="text-xs md:text-sm text-red-800">
                  This license shall automatically terminate if you violate any of these restrictions and may be terminated by InvertisPrep at any time. 
                  Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession.
            </p>
          </div>
            </TabsContent>

            <TabsContent value="disclaimer" className="mt-0">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
                <ShieldAlert className="mr-2 h-4 w-4 md:h-5 md:w-5 text-red-600" />
              Disclaimer
            </h2>
              <Separator className="mb-4 md:mb-6" />

              <Card className="border-red-100 mb-4 md:mb-6">
                <CardHeader className="pb-2 bg-red-50 p-3 md:p-4">
                  <CardTitle className="text-sm md:text-base text-red-800">Important Notice</CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4">
                  <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4">
                    The materials on InvertisPrep are provided on an 'as is' basis. InvertisPrep makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation:
                  </p>
                  
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-xs md:text-sm py-1.5 md:py-2">Implied Warranties</AccordionTrigger>
                      <AccordionContent className="text-xs md:text-sm">
                        <p className="text-xs md:text-sm text-gray-600">
                          InvertisPrep disclaims implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-xs md:text-sm py-1.5 md:py-2">Accuracy Guarantees</AccordionTrigger>
                      <AccordionContent className="text-xs md:text-sm">
                        <p className="text-xs md:text-sm text-gray-600">
                          InvertisPrep does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its platform.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-xs md:text-sm py-1.5 md:py-2">External Links</AccordionTrigger>
                      <AccordionContent className="text-xs md:text-sm">
                        <p className="text-xs md:text-sm text-gray-600">
                          InvertisPrep does not warrant the accuracy or reliability of any information on sites linked to this platform.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="limitations" className="mt-0">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
                <Ban className="mr-2 h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              Limitations
            </h2>
              <Separator className="mb-4 md:mb-6" />

              <div className="bg-purple-50 border border-purple-100 rounded-md p-3 md:p-5 mb-4 md:mb-6">
                <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4">
              In no event shall InvertisPrep or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on InvertisPrep, even if InvertisPrep or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
                <p className="text-xs md:text-sm text-gray-700">
              Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
            </p>
          </div>

              <Card>
                <CardHeader className="pb-2 p-3 md:p-4">
                  <CardTitle className="text-sm md:text-base">Types of Damages Not Covered</CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {[
                      "Loss of data", 
                      "Loss of profit", 
                      "Business interruption", 
                      "Incidental damages",
                      "Consequential damages", 
                      "Special damages"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5 md:gap-2 p-1.5 md:p-2 border border-gray-100 rounded bg-gray-50">
                        <Ban className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />
                        <span className="text-xs md:text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accounts" className="mt-0">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
                <User className="mr-2 h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
              User Accounts and Communication
            </h2>
              <Separator className="mb-4 md:mb-6" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <Card>
                  <CardHeader className="pb-2 p-3 md:p-4">
                    <CardTitle className="text-sm md:text-base font-medium flex items-center gap-1.5 md:gap-2">
                      <User className="h-3 w-3 md:h-4 md:w-4 text-emerald-600" />
                      Account Responsibilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
                    <ul className="space-y-1.5 md:space-y-2">
                      <li className="flex items-start gap-1.5 md:gap-2">
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-emerald-600 mt-0.5" />
                        <span className="text-xs md:text-sm">Provide accurate, complete, and current information</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2">
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-emerald-600 mt-0.5" />
                        <span className="text-xs md:text-sm">Safeguard your password and account</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2">
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-emerald-600 mt-0.5" />
                        <span className="text-xs md:text-sm">Use "strong" passwords for security</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 p-3 md:p-4">
                    <CardTitle className="text-sm md:text-base font-medium flex items-center gap-1.5 md:gap-2">
                      <Mail className="h-3 w-3 md:h-4 md:w-4 text-emerald-600" />
                      Communications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
                    <p className="text-xs md:text-sm text-gray-700 mb-2 md:mb-3">
                      You agree to receive communications from us electronically, such as:
                    </p>
                    <ul className="space-y-1.5 md:space-y-2">
                      <li className="flex items-start gap-1.5 md:gap-2">
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-emerald-600 mt-0.5" />
                        <span className="text-xs md:text-sm">Emails and text messages</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2">
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-emerald-600 mt-0.5" />
                        <span className="text-xs md:text-sm">Mobile push notifications</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2">
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-emerald-600 mt-0.5" />
                        <span className="text-xs md:text-sm">Notices and messages on the platform</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-3 md:p-4 rounded-md">
                <p className="text-xs md:text-sm text-blue-800">
                  <strong>Note:</strong> Failure to provide accurate information or safeguard your account constitutes a breach of the Terms, which may result in immediate termination of your account on our platform.
            </p>
          </div>
            </TabsContent>

            <TabsContent value="modifications" className="mt-0">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
                <AlarmClock className="mr-2 h-4 w-4 md:h-5 md:w-5 text-pink-600" />
              Modifications and Termination
            </h2>
              <Separator className="mb-4 md:mb-6" />

              <p className="text-xs md:text-sm text-gray-700 mb-4 md:mb-6">
              InvertisPrep may revise these Terms at any time without notice. By using this platform, you are agreeing to be bound by the current version of these Terms.
            </p>

              <Card className="mb-4 md:mb-6">
                <CardHeader className="pb-2 bg-pink-50 p-3 md:p-4">
                  <CardTitle className="text-sm md:text-base">Our Rights</CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4">
                  <p className="text-xs md:text-sm text-gray-700 mb-2 md:mb-3">
              InvertisPrep reserves the right to:
            </p>
                  <div className="space-y-2">
                    {[
                      "Change, suspend, or terminate any service offered through our platform",
                      "Restrict, suspend, or terminate your access to our platform if we believe you are in breach of our terms or law",
                      "Take technical and legal steps to prevent harmful or illegal activity"
                    ].map((right, i) => (
                      <motion.div 
                        key={i} 
                        className="flex items-start gap-2 md:gap-3 p-2 md:p-3 border border-pink-100 rounded-md bg-white"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-pink-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs md:text-sm">{right}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="bg-gray-50 p-3 md:p-4 rounded-md border">
                <p className="text-xs md:text-sm text-gray-700">
                  We may modify or update these Terms to reflect changes in our services, our users' needs, or our business priorities. 
                  It is your responsibility to review these Terms periodically.
                </p>
          </div>
            </TabsContent>

            <TabsContent value="law" className="mt-0">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
                <Scale className="mr-2 h-4 w-4 md:h-5 md:w-5 text-indigo-600" />
              Governing Law
            </h2>
              <Separator className="mb-4 md:mb-6" />

              <Card className="mb-4 md:mb-6">
                <CardContent className="pt-4 md:pt-6 p-4">
                  <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4">
                    These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. 
                    Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                  </p>
                  <p className="text-xs md:text-sm text-gray-700">
                    If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. 
                    These Terms constitute the entire agreement between us regarding our platform and supersede any prior agreements we might have had regarding the platform.
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="bg-indigo-50 border border-indigo-100 p-3 md:p-4 rounded-md">
                  <h3 className="text-xs md:text-sm font-semibold text-indigo-800 mb-1 md:mb-2">Jurisdiction</h3>
                  <p className="text-[10px] md:text-xs text-indigo-700">
                    Any disputes arising out of or related to these Terms will be governed by the laws of India and resolved in the courts of Uttar Pradesh, India.
                  </p>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 p-3 md:p-4 rounded-md">
                  <h3 className="text-xs md:text-sm font-semibold text-indigo-800 mb-1 md:mb-2">Severability</h3>
                  <p className="text-[10px] md:text-xs text-indigo-700">
                    If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
                  </p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <Card className="border-primary/10 shadow-md">
          <CardHeader className="bg-primary/5 pb-3 md:pb-4 p-4">
            <CardTitle className="text-lg md:text-xl font-semibold">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 md:pt-6 p-4">
            <p className="text-xs md:text-sm text-gray-700 mb-4 md:mb-6">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="flex items-start gap-2 md:gap-3">
                <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
                  <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-semibold">Email</h3>
                  <a href="mailto:invertisprep@gmail.com" className="text-primary text-xs md:text-sm hover:underline">
                    invertisprep@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-2 md:gap-3">
                <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
                  <Building className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-semibold">Address</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Invertis University, Bareilly, Uttar Pradesh, India
            </p>
          </div>
        </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
} 