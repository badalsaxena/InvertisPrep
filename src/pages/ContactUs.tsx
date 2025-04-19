import React, { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, ValidationError } from '@formspree/react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Building, 
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  // Integrate Formspree form handling
  const [formState, handleFormspreeSubmit] = useForm("myzerwoj");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Combined form handling with proper type
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleFormspreeSubmit(e);
  };
  
  // Form status based on Formspree state
  const formStatus = formState.submitting ? 'submitting' : 
                     formState.succeeded ? 'success' : 
                     formState.errors ? 'error' : 'idle';
  
  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help. Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          {[
            {
              title: "Email Us",
              description: "Our friendly team is here to help.",
              icon: <Mail className="h-6 w-6 text-blue-500" />,
              contact: "invertisprep@gmail.com",
              action: "mailto:invertisprep@gmail.com",
              color: "bg-blue-50"
            },
            {
              title: "Visit Us",
              description: "Come say hello at our campus.",
              icon: <MapPin className="h-6 w-6 text-emerald-500" />,
              contact: "Invertis University, Bareilly, Uttar Pradesh, India",
              action: "https://maps.google.com/?q=Invertis+University+Bareilly",
              color: "bg-emerald-50"
            },
            {
              title: "Call Us",
              description: "Mon-Fri from 8am to 5pm.",
              icon: <Phone className="h-6 w-6 text-purple-500" />,
              contact: "+91 (123) 456-7890",
              action: "tel:+911234567890",
              color: "bg-purple-50"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <a 
                href={item.action} 
                target={item.title === "Visit Us" ? "_blank" : undefined}
                rel={item.title === "Visit Us" ? "noopener noreferrer" : undefined}
                className="block h-full"
              >
                <Card className={`h-full border hover:border-primary/50 hover:shadow-md transition-all ${item.color}`}>
                  <CardContent className="pt-6 flex flex-col items-center text-center h-full">
                    <div className="p-3 rounded-full bg-white shadow-sm mb-4">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                    <p className="font-medium">{item.contact}</p>
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          {/* Form Section */}
          <Card className="lg:col-span-3 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formState.succeeded ? (
                <div className="p-6 bg-green-50 text-green-700 rounded-md flex flex-col items-center text-center">
                  <div className="bg-green-100 p-3 rounded-full mb-4">
                    <AlertCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
                  <p className="mb-4">Thank you for reaching out. We've received your message and will get back to you soon.</p>
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="mt-2"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Your name" 
                        required 
                        value={formData.name}
                        onChange={handleChange}
                        disabled={formStatus === 'submitting'}
                      />
                      <ValidationError prefix="Name" field="name" errors={formState.errors} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="your.email@example.com" 
                        required 
                        value={formData.email}
                        onChange={handleChange}
                        disabled={formStatus === 'submitting'}
                      />
                      <ValidationError prefix="Email" field="email" errors={formState.errors} className="text-sm text-red-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input 
                      id="subject" 
                      name="subject" 
                      placeholder="How can we help you?" 
                      required 
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={formStatus === 'submitting'}
                    />
                    <ValidationError prefix="Subject" field="subject" errors={formState.errors} className="text-sm text-red-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="Your message..." 
                      rows={5} 
                      required 
                      value={formData.message}
                      onChange={handleChange}
                      disabled={formStatus === 'submitting'}
                    />
                    <ValidationError prefix="Message" field="message" errors={formState.errors} className="text-sm text-red-500" />
                  </div>
                  
                  <div>
                    <Button 
                      type="submit" 
                      className="w-full sm:w-auto" 
                      disabled={formStatus === 'submitting'}
                    >
                      {formStatus === 'idle' && (
                        <>
                          <Send className="mr-2 h-4 w-4" /> 
                          Send Message
                        </>
                      )}
                      {formStatus === 'submitting' && 'Sending...'}
                      {formStatus === 'success' && 'Message Sent!'}
                      {formStatus === 'error' && 'Try Again'}
                    </Button>
                    
                    {formStatus === 'error' && !formState.errors && (
                      <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        There was an error sending your message. Please try again.
                      </div>
                    )}
                    
                    <ValidationError errors={formState.errors} className="mt-4 p-3 bg-red-50 text-red-700 rounded-md" />
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
          
          {/* Info Section */}
          <div className="lg:col-span-2">
            <Card className="h-full shadow-md">
              <CardHeader>
                <CardTitle>InvertisPrep</CardTitle>
                <CardDescription>
                  Your gateway to academic excellence at Invertis University
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Visit Our Office</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Invertis University</p>
                        <p className="text-sm text-muted-foreground">
                          Bareilly - Lucknow National Highway-24,<br/>
                          Bareilly, Uttar Pradesh 243123
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Opening Hours:</span><br/>
                          Monday - Friday: 9:00 AM - 5:00 PM<br/>
                          Saturday: 9:00 AM - 1:00 PM<br/>
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    {[
                      { icon: Facebook, href: "#", label: "Facebook" },
                      { icon: Twitter, href: "#", label: "Twitter" },
                      { icon: Instagram, href: "#", label: "Instagram" },
                      { icon: Linkedin, href: "#", label: "LinkedIn" }
                    ].map((social, i) => (
                      <a
                        key={i}
                        href={social.href}
                        className="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Map Section */}
        <Card className="mb-12 shadow-md overflow-hidden">
          <div className="h-[400px] w-full">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.446818335468!2d79.43902567474383!3d28.67442398229981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a0035543ae5741%3A0xc7db3d842d4dc288!2sInvertis%20University!5e0!3m2!1sen!2sin!4v1714210118933!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Invertis University Map"
            ></iframe>
          </div>
        </Card>
        
        {/* FAQ Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "How do I report a technical issue?",
                a: "You can report technical issues through this contact form or by directly emailing us at support@invertisprep.com with details of the problem you're experiencing."
              },
              {
                q: "What are your support hours?",
                a: "Our support team is available Monday through Friday from 9:00 AM to 5:00 PM IST. Email support is available 24/7, and we aim to respond within 24 hours."
              },
              {
                q: "How can I provide feedback about the platform?",
                a: "We welcome your feedback! You can use this contact form or email us at feedback@invertisprep.com with your suggestions, comments, or ideas for improvement."
              },
              {
                q: "How do I request new features or study materials?",
                a: "You can submit feature requests or study material suggestions through our contact form. Select 'Feature Request' as the subject and provide details about what you'd like to see."
              },
            ].map((faq, i) => (
              <Card key={i} className="bg-gray-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 