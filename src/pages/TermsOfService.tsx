import React from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Separator } from "@/components/ui/separator";
import { ScrollText, FileWarning, ShieldAlert, Ban, Mail, ThumbsUp, AlarmClock } from "lucide-react";

export default function TermsOfService() {
  // Last updated date
  const lastUpdated = "August 15, 2023";

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <ScrollText className="mr-2 h-8 w-8 text-primary" />
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-center">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="prose max-w-none">
          <p className="lead">
            Welcome to InvertisPrep. Please read these Terms of Service ("Terms") carefully as they contain important information about your legal rights, remedies, and obligations. By accessing or using InvertisPrep, you agree to comply with and be bound by these Terms.
          </p>

          <div className="my-8">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <ThumbsUp className="mr-2 h-5 w-5 text-primary" />
              Acceptance of Terms
            </h2>
            <Separator className="mb-4" />

            <p>
              By accessing or using InvertisPrep, you agree to be bound by these Terms and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform. The materials contained in this platform are protected by applicable copyright and trademark law.
            </p>
          </div>

          <div className="my-8">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <FileWarning className="mr-2 h-5 w-5 text-primary" />
              Use License
            </h2>
            <Separator className="mb-4" />

            <p>
              Permission is granted to temporarily access the materials (information or software) on InvertisPrep for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on InvertisPrep</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
            <p>
              This license shall automatically terminate if you violate any of these restrictions and may be terminated by InvertisPrep at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
            </p>
          </div>

          <div className="my-8">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <ShieldAlert className="mr-2 h-5 w-5 text-primary" />
              Disclaimer
            </h2>
            <Separator className="mb-4" />

            <p>
              The materials on InvertisPrep are provided on an 'as is' basis. InvertisPrep makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            <p>
              Further, InvertisPrep does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its platform or otherwise relating to such materials or on any sites linked to this platform.
            </p>
          </div>

          <div className="my-8">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <Ban className="mr-2 h-5 w-5 text-primary" />
              Limitations
            </h2>
            <Separator className="mb-4" />

            <p>
              In no event shall InvertisPrep or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on InvertisPrep, even if InvertisPrep or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
            <p>
              Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
            </p>
          </div>

          <div className="my-8">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <Mail className="mr-2 h-5 w-5 text-primary" />
              User Accounts and Communication
            </h2>
            <Separator className="mb-4" />

            <p>
              When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our platform.
            </p>
            <p>
              You are responsible for safeguarding the password you use to access the platform and for any activities or actions under your password. We encourage you to use "strong" passwords (passwords that use a combination of upper and lower case letters, numbers, and symbols) with your account.
            </p>
            <p>
              You agree to receive communications from us electronically, such as emails, texts, mobile push notices, or notices and messages on the platform. You agree that all agreements, notices, disclosures, and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.
            </p>
          </div>

          <div className="my-8">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <AlarmClock className="mr-2 h-5 w-5 text-primary" />
              Modifications and Termination
            </h2>
            <Separator className="mb-4" />

            <p>
              InvertisPrep may revise these Terms at any time without notice. By using this platform, you are agreeing to be bound by the current version of these Terms.
            </p>
            <p>
              InvertisPrep reserves the right to:
            </p>
            <ul>
              <li>Change, suspend, or terminate any service offered through our platform</li>
              <li>Restrict, suspend, or terminate your access to our platform if we believe you are in breach of our terms or law</li>
              <li>Take technical and legal steps to prevent harmful or illegal activity</li>
            </ul>
          </div>

          <div className="my-8">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <Mail className="mr-2 h-5 w-5 text-primary" />
              Governing Law
            </h2>
            <Separator className="mb-4" />

            <p>
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
            <p>
              If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our platform and supersede any prior agreements we might have had regarding the platform.
            </p>
          </div>

          <div className="mt-8 mb-4">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <Separator className="mb-4" />

            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="font-medium mt-2">
              Email: terms@invertisprep.com
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