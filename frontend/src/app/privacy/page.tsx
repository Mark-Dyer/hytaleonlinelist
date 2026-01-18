import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
  const lastUpdated = 'January 15, 2026';

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="mt-2 text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="prose prose-invert max-w-none py-8">
            <p className="lead text-muted-foreground">
              At Hytale Online List, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when
              you use our website and services.
            </p>

            <h2 className="mt-8 text-xl font-semibold">1. Information We Collect</h2>

            <h3 className="mt-6 text-lg font-medium">Personal Information</h3>
            <p className="text-muted-foreground">
              When you create an account, we collect:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Email address</li>
              <li>Username</li>
              <li>Password (securely hashed, never stored in plain text)</li>
              <li>Profile information you choose to provide (avatar, bio)</li>
            </ul>

            <h3 className="mt-6 text-lg font-medium">OAuth Information</h3>
            <p className="text-muted-foreground">
              If you sign in with Discord or Google, we receive:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Your OAuth provider user ID</li>
              <li>Email address</li>
              <li>Display name</li>
              <li>Profile picture URL</li>
            </ul>

            <h3 className="mt-6 text-lg font-medium">Server Information</h3>
            <p className="text-muted-foreground">
              When you list a server, we collect:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Server name and description</li>
              <li>Server IP address and port</li>
              <li>Server banner/logo images</li>
              <li>Website and Discord links</li>
            </ul>

            <h3 className="mt-6 text-lg font-medium">Automatically Collected Information</h3>
            <p className="text-muted-foreground">
              When you use our Service, we automatically collect:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">We use collected information to:</p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Provide and maintain our Service</li>
              <li>Create and manage your account</li>
              <li>Process votes and display reviews</li>
              <li>Send verification and notification emails</li>
              <li>Prevent fraud and abuse</li>
              <li>Analyze usage to improve our Service</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">3. Information Sharing</h2>
            <p className="text-muted-foreground">
              We do <strong>not</strong> sell your personal information. We may share
              information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>
                <strong>Public Content:</strong> Usernames, reviews, and server listings are
                publicly visible
              </li>
              <li>
                <strong>Service Providers:</strong> We use trusted third-party services for
                email delivery, hosting, and analytics
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our
                rights
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger or acquisition
              </li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">4. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Passwords are hashed using industry-standard algorithms</li>
              <li>Data is transmitted over HTTPS encryption</li>
              <li>Access to personal data is restricted to authorized personnel</li>
              <li>Regular security audits and updates</li>
            </ul>
            <p className="text-muted-foreground">
              However, no method of transmission over the Internet is 100% secure. We cannot
              guarantee absolute security.
            </p>

            <h2 className="mt-8 text-xl font-semibold">5. Cookies and Tracking</h2>
            <p className="text-muted-foreground">We use cookies for:</p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>
                <strong>Essential Cookies:</strong> Required for authentication and basic
                functionality
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your settings and preferences
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how users interact with
                our Service
              </li>
            </ul>
            <p className="text-muted-foreground">
              You can control cookies through your browser settings. Disabling cookies may
              affect functionality.
            </p>

            <h2 className="mt-8 text-xl font-semibold">6. Your Rights</h2>
            <p className="text-muted-foreground">You have the right to:</p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Update inaccurate information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and data
              </li>
              <li>
                <strong>Portability:</strong> Receive your data in a portable format
              </li>
              <li>
                <strong>Objection:</strong> Object to certain processing activities
              </li>
            </ul>
            <p className="text-muted-foreground">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@hytaleonlinelist.com" className="text-primary hover:underline">
                privacy@hytaleonlinelist.com
              </a>
            </p>

            <h2 className="mt-8 text-xl font-semibold">7. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal information for as long as your account is active or as
              needed to provide services. After account deletion:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Personal data is deleted within 30 days</li>
              <li>Anonymized analytics data may be retained</li>
              <li>Some data may be retained for legal compliance</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">8. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground">
              Our Service is not intended for children under 13 years of age. We do not
              knowingly collect personal information from children under 13. If you believe a
              child has provided us with personal information, please contact us.
            </p>

            <h2 className="mt-8 text-xl font-semibold">9. Third-Party Services</h2>
            <p className="text-muted-foreground">
              Our Service may contain links to third-party websites and integrate with
              external services:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Discord and Google for authentication</li>
              <li>Cloudflare for content delivery and security</li>
              <li>Analytics services for usage statistics</li>
            </ul>
            <p className="text-muted-foreground">
              These services have their own privacy policies. We are not responsible for their
              practices.
            </p>

            <h2 className="mt-8 text-xl font-semibold">10. International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than
              your own. We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2 className="mt-8 text-xl font-semibold">11. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of
              significant changes via email or website notice. Your continued use of the
              Service after changes constitutes acceptance.
            </p>

            <h2 className="mt-8 text-xl font-semibold">12. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>
                Email:{' '}
                <a href="mailto:privacy@hytaleonlinelist.com" className="text-primary hover:underline">
                  privacy@hytaleonlinelist.com
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
                <strong>Summary:</strong> We collect only what we need to provide our Service.
                We never sell your data. You can access, update, or delete your information at
                any time. We use industry-standard security measures to protect your data.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/terms"
            className="text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            Terms of Service
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
