import React from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, Database, Lock, UserCheck, RefreshCw, Clock } from "lucide-react";

export default function PrivacyPolicy() {
  // Last updated date
  const lastUpdated = "August 15, 2023";

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <Shield className="mr-2 h-8 w-8 text-primary" />
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-center">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="prose max-w-none">
          <p className="lead">
            At InvertisPrep, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>

          <div className="my-8">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <Eye className="mr-2 h-5 w-5 text-primary" />
              Information We Collect
            </h2>
            <Separator className="mb-4" />

            <h3 className="font-medium">Personal Information</h3>
            <p>
              We may collect personal information that you voluntarily provide when using InvertisPrep, including:
            </p>
            <ul>
              <li>Name and contact information (email address, phone number)</li>
              <li>Account credentials (username, password)</li>
              <li>Profile information (profile picture, educational background)</li>
              <li>Information provided in user-generated content</li>
            </ul>

            <h3 className="font-medium mt-4">Usage Information</h3>
            <p>
              We automatically collect certain information about your device and how you interact with InvertisPrep:
            </p>
            <ul>
              <li>Device information (browser type, operating system, device type)</li>
              <li>IP address and geolocation data</li>
              <li>Log data (pages visited, time spent, referring URLs)</li>
              <li>Performance and error data</li>
            </ul>
          </div>

          <div className="my-8">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <Database className="mr-2 h-5 w-5 text-primary" />
              How We Use Your Information
            </h2>
            <Separator className="mb-4" />

            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li>Provide, maintain, and improve InvertisPrep services</li>
              <li>Process transactions and manage your account</li>
              <li>Personalize your experience and deliver content relevant to your interests</li>
              <li>Communicate with you about your account, updates, and promotional offers</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues or fraudulent activities</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div className="my-8">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <Lock className="mr-2 h-5 w-5 text-primary" />
              Data Security
            </h2>
            <Separator className="mb-4" />

            <p>
              We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no internet or electronic storage system is 100% secure, and we cannot guarantee absolute security.
            </p>
            <p>
              Our security measures include:
            </p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Secure user authentication</li>
              <li>Regular security assessments</li>
              <li>Access controls and permission restrictions</li>
              <li>Continuous monitoring for suspicious activities</li>
            </ul>
          </div>

          <div className="my-8">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <UserCheck className="mr-2 h-5 w-5 text-primary" />
              Your Privacy Rights
            </h2>
            <Separator className="mb-4" />

            <p>
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul>
              <li>Right to access the personal information we hold about you</li>
              <li>Right to correct inaccurate or incomplete information</li>
              <li>Right to request deletion of your personal information</li>
              <li>Right to restrict or object to processing of your information</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent at any time</li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@invertisprep.com.
            </p>
          </div>

          <div className="my-8">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <RefreshCw className="mr-2 h-5 w-5 text-primary" />
              Updates to This Privacy Policy
            </h2>
            <Separator className="mb-4" />

            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. The updated version will be effective as of the date stated at the top of this document. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
            </p>
            <p>
              If we make material changes to this policy, we will provide notice through our website or by other means.
            </p>
          </div>

          <div className="my-8">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Data Retention
            </h2>
            <Separator className="mb-4" />

            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When determining how long to keep your information, we consider:
            </p>
            <ul>
              <li>The amount, nature, and sensitivity of the information</li>
              <li>The potential risk of harm from unauthorized use or disclosure</li>
              <li>The purposes for which we process the information</li>
              <li>Applicable legal requirements</li>
            </ul>
            <p>
              When we no longer need your personal information, we will securely delete or anonymize it.
            </p>
          </div>

          <div className="mt-8 mb-4">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <Separator className="mb-4" />

            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p className="font-medium mt-2">
              Email: privacy@invertisprep.com
            </p>
            <p className="font-medium">
              Address: Invertis University, Bareilly, Uttar Pradesh, India
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 