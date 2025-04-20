import React from "react";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Shield, 
  Eye, 
  Database, 
  Lock, 
  UserCheck, 
  RefreshCw, 
  Clock, 
  BookOpen, 
  Mail, 
  Building, 
  ExternalLink,
  Check
} from "lucide-react";

export default function PrivacyPolicy() {
  // Last updated date
  const lastUpdated = "April 20, 2025";

  const policyCategories = [
    {
      id: "collection",
      title: "Information Collection",
      icon: <Eye className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: "usage",
      title: "Data Usage",
      icon: <Database className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-700"
    },
    {
      id: "security",
      title: "Data Security",
      icon: <Lock className="h-5 w-5" />,
      color: "bg-emerald-100 text-emerald-700"
    },
    {
      id: "rights",
      title: "Your Rights",
      icon: <UserCheck className="h-5 w-5" />,
      color: "bg-amber-100 text-amber-700"
    },
    {
      id: "updates",
      title: "Policy Updates",
      icon: <RefreshCw className="h-5 w-5" />,
      color: "bg-pink-100 text-pink-700"
    },
    {
      id: "retention",
      title: "Data Retention",
      icon: <Clock className="h-5 w-5" />,
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
            <Shield className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            Privacy Policy
          </h1>
          
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg px-2">
            At InvertisPrep, we are committed to protecting your privacy and ensuring the security of your personal information.
          </p>
        </div>

        <Card className="mb-6 md:mb-10 border-primary/10 shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-2">
            <CardTitle className="text-lg md:text-xl flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              What This Policy Covers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 md:pt-6">
            <p className="text-sm md:text-base text-gray-700">
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              We believe in transparency and want to ensure you understand how your data is handled when using InvertisPrep services.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 md:gap-4">
              {['Privacy', 'Security', 'Transparency', 'Control', 'Compliance'].map(value => (
                <div key={value} className="flex items-center gap-1 text-xs md:text-sm text-primary">
                  <Check className="h-3 w-3 md:h-4 md:w-4" />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="collection" className="w-full mb-8 md:mb-12">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto bg-primary/5 p-1 gap-1 overflow-x-auto">
            {policyCategories.map(category => (
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
            <TabsContent value="collection" className="mt-0">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
                <Eye className="mr-2 h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              Information We Collect
            </h2>
              <Separator className="mb-4 md:mb-6" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <Card>
                  <CardHeader className="pb-2 p-3 md:p-4">
                    <CardTitle className="text-sm md:text-base font-medium">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
                    <p className="text-xs md:text-sm text-gray-600 mb-2">
                      We may collect personal information that you voluntarily provide when using InvertisPrep:
                    </p>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xs md:text-sm py-1.5 md:py-2">Contact Information</AccordionTrigger>
                        <AccordionContent className="text-xs md:text-sm">
                          Name, email address, phone number, and other contact details you provide.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger className="text-xs md:text-sm py-1.5 md:py-2">Account Credentials</AccordionTrigger>
                        <AccordionContent className="text-xs md:text-sm">
                          Username, password, and other authentication information.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger className="text-xs md:text-sm py-1.5 md:py-2">Profile Information</AccordionTrigger>
                        <AccordionContent className="text-xs md:text-sm">
                          Profile picture, educational background, and other details you add to your profile.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 p-3 md:p-4">
                    <CardTitle className="text-sm md:text-base font-medium">Usage Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
                    <p className="text-xs md:text-sm text-gray-600 mb-2">
                      We automatically collect certain information about your device and interactions:
                    </p>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xs md:text-sm py-1.5 md:py-2">Device Information</AccordionTrigger>
                        <AccordionContent className="text-xs md:text-sm">
                          Browser type, operating system, device type, and other technical details.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger className="text-xs md:text-sm py-1.5 md:py-2">IP and Location</AccordionTrigger>
                        <AccordionContent className="text-xs md:text-sm">
                          IP address and general location information based on IP.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger className="text-xs md:text-sm py-1.5 md:py-2">Log Data</AccordionTrigger>
                        <AccordionContent className="text-xs md:text-sm">
                          Pages visited, time spent, referring URLs, and interaction patterns.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
          </div>
            </TabsContent>

            <TabsContent value="usage" className="mt-0">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
                <Database className="mr-2 h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              How We Use Your Information
            </h2>
              <Separator className="mb-4 md:mb-6" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {[
                  { title: "Service Provision", desc: "Provide, maintain, and improve InvertisPrep services" },
                  { title: "Account Management", desc: "Process transactions and manage your account" },
                  { title: "Personalization", desc: "Personalize your experience and deliver relevant content" },
                  { title: "Communication", desc: "Send important updates, notifications, and promotional offers" },
                  { title: "Analytics", desc: "Monitor and analyze usage patterns and trends" },
                  { title: "Security", desc: "Detect, prevent, and address technical issues or fraud" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-lg bg-gray-50 border">
                    <div className="bg-purple-100 p-1.5 md:p-2 rounded-full">
                      <Check className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xs md:text-sm font-semibold">{item.title}</h3>
                      <p className="text-[10px] md:text-xs text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
          </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
                <Lock className="mr-2 h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
              Data Security
            </h2>
              <Separator className="mb-4 md:mb-6" />

              <p className="mb-4 md:mb-6 text-xs md:text-sm text-gray-700">
              We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no internet or electronic storage system is 100% secure, and we cannot guarantee absolute security.
            </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4">
                {[
                  { title: "Encryption", desc: "All sensitive data is encrypted in transit and at rest" },
                  { title: "Authentication", desc: "Secure user authentication with modern protocols" },
                  { title: "Access Controls", desc: "Strict permission controls and access limitations" }
                ].map((item, i) => (
                  <Card key={i} className="border-emerald-100">
                    <CardHeader className="pb-1 md:pb-2 p-3 md:p-4">
                      <CardTitle className="text-xs md:text-sm font-medium flex items-center">
                        <Lock className="mr-1.5 md:mr-2 h-3 w-3 md:h-4 md:w-4 text-emerald-600" />
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
                      <p className="text-[10px] md:text-xs text-gray-600">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
          </div>
            </TabsContent>

            <TabsContent value="rights" className="mt-0">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
                <UserCheck className="mr-2 h-4 w-4 md:h-5 md:w-5 text-amber-600" />
              Your Privacy Rights
            </h2>
              <Separator className="mb-4 md:mb-6" />

              <p className="mb-4 md:mb-6 text-xs md:text-sm text-gray-700">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                {[
                  "Right to Access",
                  "Right to Correction",
                  "Right to Deletion",
                  "Right to Restrict Processing",
                  "Right to Data Portability",
                  "Right to Object"
                ].map((right, i) => (
                  <div key={i} className="bg-amber-50 p-2 md:p-3 rounded-lg border border-amber-100 flex items-center gap-1.5 md:gap-2">
                    <Check className="h-3 w-3 md:h-4 md:w-4 text-amber-600 flex-shrink-0" />
                    <span className="text-xs md:text-sm">{right}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 md:mt-6 bg-gray-50 p-3 md:p-4 rounded-lg border">
                <p className="text-xs md:text-sm">
                  To exercise these rights, please contact us at{" "}
                  <a href="mailto:privacy@invertisprep.com" className="text-primary font-medium">
                    privacy@invertisprep.com
                  </a>
            </p>
          </div>
            </TabsContent>

            <TabsContent value="updates" className="mt-0">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
                <RefreshCw className="mr-2 h-4 w-4 md:h-5 md:w-5 text-pink-600" />
              Updates to This Privacy Policy
            </h2>
              <Separator className="mb-4 md:mb-6" />

              <div className="bg-pink-50 p-3 md:p-4 rounded-lg border border-pink-100 mb-4 md:mb-6">
                <p className="text-xs md:text-sm text-gray-700">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. The updated version will be effective as of the date stated at the top of this document.
            </p>
          </div>

              <Card>
                <CardHeader className="pb-2 md:pb-3 p-3 md:p-4">
                  <CardTitle className="text-sm md:text-base">How We Notify You of Changes</CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
                  <ul className="space-y-1.5 md:space-y-2">
                    <li className="flex items-start gap-1.5 md:gap-2">
                      <Check className="h-3 w-3 md:h-4 md:w-4 text-pink-600 mt-0.5" />
                      <span className="text-xs md:text-sm">Email notification for major changes</span>
                    </li>
                    <li className="flex items-start gap-1.5 md:gap-2">
                      <Check className="h-3 w-3 md:h-4 md:w-4 text-pink-600 mt-0.5" />
                      <span className="text-xs md:text-sm">Site banner announcements</span>
                    </li>
                    <li className="flex items-start gap-1.5 md:gap-2">
                      <Check className="h-3 w-3 md:h-4 md:w-4 text-pink-600 mt-0.5" />
                      <span className="text-xs md:text-sm">Version history available upon request</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="retention" className="mt-0">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
                <Clock className="mr-2 h-4 w-4 md:h-5 md:w-5 text-indigo-600" />
              Data Retention
            </h2>
              <Separator className="mb-4 md:mb-6" />

              <p className="mb-4 md:mb-6 text-xs md:text-sm text-gray-700">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2 p-3 md:p-4">
                    <CardTitle className="text-sm md:text-base">Retention Factors</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
                    <ul className="space-y-1.5 md:space-y-2">
                      <li className="flex items-start gap-1.5 md:gap-2">
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-indigo-600 mt-0.5" />
                        <span className="text-xs md:text-sm">Nature and sensitivity of the information</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2">
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-indigo-600 mt-0.5" />
                        <span className="text-xs md:text-sm">Potential risk of unauthorized disclosure</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2">
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-indigo-600 mt-0.5" />
                        <span className="text-xs md:text-sm">Legal and regulatory requirements</span>
                      </li>
            </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 p-3 md:p-4">
                    <CardTitle className="text-sm md:text-base">Data Disposal</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
                    <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">
                      When we no longer need your personal information, we:
                    </p>
                    <ul className="space-y-1.5 md:space-y-2">
                      <li className="flex items-start gap-1.5 md:gap-2">
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-indigo-600 mt-0.5" />
                        <span className="text-xs md:text-sm">Securely delete information</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2">
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-indigo-600 mt-0.5" />
                        <span className="text-xs md:text-sm">Anonymize data when appropriate</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2">
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-indigo-600 mt-0.5" />
                        <span className="text-xs md:text-sm">Follow industry best practices</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
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
              If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
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
      
    </>
  );
} 