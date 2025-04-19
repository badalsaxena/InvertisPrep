import React, { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    setIsSubmitting(true);
    setError(null);

    try {
      // In a real application, you would send this data to your backend
      console.log("Bug report submitted:", formData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        bugType: "",
        severity: "",
        description: "",
        stepsToReproduce: "",
        deviceInfo: "",
      });
    } catch (err) {
      setError("Failed to submit your report. Please try again later.");
      console.error("Error submitting bug report:", err);
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <>
      <Navbar />
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

        {submitted ? (
          <Alert className="max-w-2xl mx-auto mb-8 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Thank you for your report!</AlertTitle>
            <AlertDescription className="text-green-700">
              We've received your bug report and our team will investigate the issue.
              We appreciate your help in improving InvertisPrep!
            </AlertDescription>
            <Button 
              className="mt-4 w-full" 
              onClick={() => setSubmitted(false)}
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
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full" />
                    Submitting...
                  </>
                ) : (
                  "Submit Bug Report"
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
      <Footer />
    </>
  );
} 