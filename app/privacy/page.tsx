"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: March 15, 2025</p>
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <p>
          VidioX AI, Inc. ("us", "we", or "our") operates the VidioX AI website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
        </p>
        
        <p>
          We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
        </p>
        
        <h2>1. Information Collection and Use</h2>
        <p>
          We collect several different types of information for various purposes to provide and improve our Service to you.
        </p>
        
        <h3>Types of Data Collected</h3>
        
        <h4>Personal Data</h4>
        <p>
          While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
        </p>
        <ul>
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Cookies and Usage Data</li>
        </ul>
        
        <h4>Usage Data</h4>
        <p>
          We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
        </p>
        
        <h4>Video Content</h4>
        <p>
          When you upload videos to our Service for enhancement, we process and temporarily store this content to provide our video enhancement services. We do not claim ownership of your video content, and we do not use your videos for any purpose other than providing the Service to you, unless we have your explicit permission.
        </p>
        
        <h2>2. Use of Data</h2>
        <p>
          VidioX AI uses the collected data for various purposes:
        </p>
        <ul>
          <li>To provide and maintain our Service</li>
          <li>To notify you about changes to our Service</li>
          <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
          <li>To provide customer support</li>
          <li>To gather analysis or valuable information so that we can improve our Service</li>
          <li>To monitor the usage of our Service</li>
          <li>To detect, prevent and address technical issues</li>
        </ul>
        
        <h2>3. Data Retention</h2>
        <p>
          We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
        </p>
        
        <p>
          For video content, we retain your original and enhanced videos for 7 days after processing, unless you choose to save them to your account. After this period, the videos are automatically deleted from our servers.
        </p>
        
        <h2>4. Transfer of Data</h2>
        <p>
          Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.
        </p>
        
        <p>
          If you are located outside the United States and choose to provide information to us, please note that we transfer the data, including Personal Data, to the United States and process it there.
        </p>
        
        <p>
          Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
        </p>
        
        <h2>5. Security of Data</h2>
        <p>
          The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
        </p>
        
        <h2>6. Your Data Protection Rights</h2>
        <p>
          We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
        </p>
        
        <p>
          If you wish to be informed about what Personal Data we hold about you and if you want it to be removed from our systems, please contact us.
        </p>
        
        <p>
          In certain circumstances, you have the following data protection rights:
        </p>
        <ul>
          <li>The right to access, update or delete the information we have on you</li>
          <li>The right of rectification - the right to have your information corrected if it is inaccurate or incomplete</li>
          <li>The right to object - the right to object to our processing of your Personal Data</li>
          <li>The right of restriction - the right to request that we restrict the processing of your personal information</li>
          <li>The right to data portability - the right to be provided with a copy of the information we have on you in a structured, machine-readable and commonly used format</li>
          <li>The right to withdraw consent - the right to withdraw your consent at any time where we relied on your consent to process your personal information</li>
        </ul>
        
        <h2>7. Cookies</h2>
        <p>
          We use cookies and similar tracking technologies to track the activity on our Service and we hold certain information.
        </p>
        
        <p>
          Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Other tracking technologies are also used such as beacons, tags and scripts to collect and track information and to improve and analyze our Service.
        </p>
        
        <p>
          You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
        </p>
        
        <h2>8. Service Providers</h2>
        <p>
          We may employ third party companies and individuals to facilitate our Service ("Service Providers"), provide the Service on our behalf, perform Service-related services or assist us in analyzing how our Service is used.
        </p>
        
        <p>
          These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
        </p>
        
        <h2>9. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>
        
        <p>
          We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.
        </p>
        
        <p>
          You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
        </p>
        
        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <ul>
          <li>By email: privacy@vidiox.ai</li>
          <li>By visiting the contact page on our website: <Link href="/contact" className="text-primary hover:underline">Contact Us</Link></li>
        </ul>
      </div>
    </div>
  );
}