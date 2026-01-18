import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function TermsPage() {
  const lastUpdated = 'January 15, 2026';

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Terms of Service</h1>
            <p className="mt-2 text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="prose prose-invert max-w-none py-8">
            <p className="lead text-muted-foreground">
              Welcome to Hytale Online List. By accessing or using our website and services,
              you agree to be bound by these Terms of Service. Please read them carefully.
            </p>

            <h2 className="mt-8 text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Hytale Online List (&quot;the Service&quot;), you accept and agree
              to be bound by these Terms of Service and our Privacy Policy. If you do not agree
              to these terms, you may not use the Service.
            </p>

            <h2 className="mt-8 text-xl font-semibold">2. Description of Service</h2>
            <p className="text-muted-foreground">
              Hytale Online List is a server listing platform that allows users to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Browse and discover Hytale game servers</li>
              <li>List their own Hytale servers</li>
              <li>Vote for servers</li>
              <li>Write and read server reviews</li>
              <li>Access server status and statistics</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">3. User Accounts</h2>
            <p className="text-muted-foreground">
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
            <p className="text-muted-foreground">
              We reserve the right to suspend or terminate accounts that violate these terms.
            </p>

            <h2 className="mt-8 text-xl font-semibold">4. Server Listings</h2>
            <p className="text-muted-foreground">
              When listing a server, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>You have the right to list the server</li>
              <li>All information provided is accurate and not misleading</li>
              <li>The server complies with applicable laws and Hytale&apos;s terms of service</li>
              <li>The server does not contain illegal, harmful, or offensive content</li>
            </ul>
            <p className="text-muted-foreground">
              We reserve the right to remove any server listing at our discretion.
            </p>

            <h2 className="mt-8 text-xl font-semibold">5. Voting and Reviews</h2>
            <p className="text-muted-foreground">Users agree to:</p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Vote honestly and not manipulate the voting system</li>
              <li>Write honest, fair, and constructive reviews</li>
              <li>Not post spam, fake reviews, or misleading content</li>
              <li>Not harass, defame, or personally attack others</li>
            </ul>
            <p className="text-muted-foreground">
              Vote manipulation, including using multiple accounts or automated systems,
              will result in account termination.
            </p>

            <h2 className="mt-8 text-xl font-semibold">6. Prohibited Conduct</h2>
            <p className="text-muted-foreground">You agree not to:</p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Distribute malware or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the Service&apos;s operation</li>
              <li>Scrape or collect data without permission</li>
              <li>Impersonate others or misrepresent your identity</li>
              <li>Post content that is illegal, offensive, or harmful</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">7. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The Service and its original content, features, and functionality are owned by
              Hytale Online List and are protected by international copyright, trademark, and
              other intellectual property laws.
            </p>
            <p className="text-muted-foreground">
              &quot;Hytale&quot; is a trademark of Hypixel Studios. Hytale Online List is not affiliated
              with, endorsed by, or sponsored by Hypixel Studios.
            </p>

            <h2 className="mt-8 text-xl font-semibold">8. User Content</h2>
            <p className="text-muted-foreground">
              By posting content (reviews, server descriptions, etc.), you grant us a
              non-exclusive, worldwide, royalty-free license to use, display, and distribute
              that content in connection with the Service.
            </p>
            <p className="text-muted-foreground">
              You retain ownership of your content but are responsible for ensuring it
              doesn&apos;t violate these terms or any third-party rights.
            </p>

            <h2 className="mt-8 text-xl font-semibold">9. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY
              KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE
              UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
            <p className="text-muted-foreground">
              We are not responsible for the content, safety, or legality of listed servers.
              Users interact with servers at their own risk.
            </p>

            <h2 className="mt-8 text-xl font-semibold">10. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, HYTALE ONLINE LIST SHALL NOT BE LIABLE
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
              INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL.
            </p>

            <h2 className="mt-8 text-xl font-semibold">11. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless Hytale Online List and its affiliates
              from any claims, damages, or expenses arising from your use of the Service or
              violation of these terms.
            </p>

            <h2 className="mt-8 text-xl font-semibold">12. Modifications to Terms</h2>
            <p className="text-muted-foreground">
              We may modify these terms at any time. We will notify users of significant
              changes via email or website notice. Continued use of the Service after changes
              constitutes acceptance of the new terms.
            </p>

            <h2 className="mt-8 text-xl font-semibold">13. Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your account at any time for violations of these
              terms. Upon termination, your right to use the Service will immediately cease.
            </p>

            <h2 className="mt-8 text-xl font-semibold">14. Governing Law</h2>
            <p className="text-muted-foreground">
              These terms shall be governed by and construed in accordance with applicable
              laws, without regard to conflict of law principles.
            </p>

            <h2 className="mt-8 text-xl font-semibold">15. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>
                Email:{' '}
                <a href="mailto:legal@hytaleonlinelist.com" className="text-primary hover:underline">
                  legal@hytaleonlinelist.com
                </a>
              </li>
              <li>
                Contact Page:{' '}
                <a href="/contact" className="text-primary hover:underline">
                  /contact
                </a>
              </li>
            </ul>

            <div className="mt-12 rounded-lg border border-border bg-card/50 p-6">
              <p className="text-sm text-muted-foreground">
                <strong>Summary:</strong> Be respectful, honest, and follow the rules. Don&apos;t
                cheat, spam, or post harmful content. We&apos;re not responsible for third-party
                servers. If you violate these terms, we may terminate your account.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            Privacy Policy
          </a>
          <span className="text-muted-foreground">•</span>
          <a
            href="/contact"
            className="text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            Contact Us
          </a>
          <span className="text-muted-foreground">•</span>
          <a
            href="/faq"
            className="text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            FAQ
          </a>
        </div>
      </div>
    </div>
  );
}
