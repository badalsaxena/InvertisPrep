import React, { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { useForm, ValidationError } from '@formspree/react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { BugIcon, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BugReport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bugType: "",
    severity: "",
    description: "",
    stepsToReproduce: "",
    deviceInfo: "",
  });

  // Initialize Formspree with your form ID
  const [formState, handleFormspreeSubmit] = useForm("xpwpvdyk");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Convert our form submit handler to match Formspree's expected types
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Submit the form directly to Formspree
    handleFormspreeSubmit(e);
  };

  const collectDeviceInfo = () => {
    const info = `
Browser: ${navigator.userAgent}
Screen Size: ${window.innerWidth}x${window.innerHeight}
URL: ${window.location.href}
Platform: ${navigator.platform}
`;
    setFormData((prev) => ({
      ...prev,
      deviceInfo: info.trim(),
    }));
  };

  // Helper function to safely check for errors
  const hasFormErrors = () => {
    return formState.errors !== null && typeof formState.errors === 'object';
  };

  // Helper function to get the first error message
  const getFirstErrorMessage = (): string => {
    if (!hasFormErrors()) return "An error occurred with the form submission";
    
    const errorObj = formState.errors as Record<string, any>;
    const firstKey = Object.keys(errorObj)[0];
    
    if (firstKey && Array.isArray(errorObj[firstKey])) {
      return errorObj[firstKey][0] || "Form validation error";
    }
    
    return "Form validation error";
  };

  return (
    <>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <BugIcon className="mr-2 h-8 w-8 text-red-500" />
            Report a Bug
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl">
            Found an issue with InvertisPrep? Help us improve by submitting a bug report.
            Please provide as much detail as possible to help us reproduce and fix the issue.
          </p>
        </div>

        {formState.succeeded ? (
          <Alert className="max-w-2xl mx-auto mb-8 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Thank you for your report!</AlertTitle>
            <AlertDescription className="text-green-700">
              We've received your bug report and our team will investigate the issue.
              We appreciate your help in improving InvertisPrep!
            </AlertDescription>
            <Button 
              className="mt-4 w-full" 
              onClick={() => window.location.reload()}
            >
              Submit Another Report
            </Button>
          </Alert>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Bug Report Form</CardTitle>
              <CardDescription>
                Please fill out the form below with details about the issue you encountered.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6 bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">Error</AlertTitle>
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              
              {hasFormErrors() && (
                <Alert className="mb-6 bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">Form Error</AlertTitle>
                  <AlertDescription className="text-red-700">
                    {getFirstErrorMessage()}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                    <ValidationError prefix="Name" field="name" errors={formState.errors} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                    <ValidationError prefix="Email" field="email" errors={formState.errors} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bugType">Issue Type</Label>
                    <Select
                      value={formData.bugType}
                      onValueChange={(value) => handleSelectChange("bugType", value)}
                      required
                    >
                      <SelectTrigger id="bugType">
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ui">User Interface</SelectItem>
                        <SelectItem value="functionality">Functionality</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="crash">Application Crash</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <ValidationError prefix="Issue Type" field="bugType" errors={formState.errors} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select
                      value={formData.severity}
                      onValueChange={(value) => handleSelectChange("severity", value)}
                      required
                    >
                      <SelectTrigger id="severity">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Minor issue</SelectItem>
                        <SelectItem value="medium">Medium - Affects functionality</SelectItem>
                        <SelectItem value="high">High - Feature unusable</SelectItem>
                        <SelectItem value="critical">Critical - Application unusable</SelectItem>
                      </SelectContent>
                    </Select>
                    <ValidationError prefix="Severity" field="severity" errors={formState.errors} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description of the Issue</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Please describe the issue in detail..."
                    className="min-h-[100px]"
                    required
                  />
                  <ValidationError prefix="Description" field="description" errors={formState.errors} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stepsToReproduce">Steps to Reproduce</Label>
                  <Textarea
                    id="stepsToReproduce"
                    name="stepsToReproduce"
                    value={formData.stepsToReproduce}
                    onChange={handleChange}
                    placeholder="1. Go to page X&#10;2. Click on Y&#10;3. Scroll down to Z&#10;4. Observe the issue"
                    className="min-h-[100px]"
                  />
                  <ValidationError prefix="Steps" field="stepsToReproduce" errors={formState.errors} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="deviceInfo">Device Information</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={collectDeviceInfo}
                      className="text-xs"
                    >
                      Auto-fill Device Info
                    </Button>
                  </div>
                  <Textarea
                    id="deviceInfo"
                    name="deviceInfo"
                    value={formData.deviceInfo}
                    onChange={handleChange}
                    placeholder="Browser, operating system, device type, etc."
                    className="min-h-[80px]"
                  />
                  <ValidationError prefix="Device Info" field="deviceInfo" errors={formState.errors} />
                </div>
                
                <div className="hidden">
                  <input type="text" name="_gotcha" style={{ display: "none" }} />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={formState.submitting}
                >
                  {formState.submitting ? (
                    <>
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Bug Report"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </>
  );
} 