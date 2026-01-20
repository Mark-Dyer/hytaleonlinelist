import type { Metadata } from 'next';
import { HelpCircle, Server, Vote, Star, Shield, UserPlus, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { JsonLd, createFAQSchema, createBreadcrumbSchema, SITE_URL } from '@/components/seo/JsonLd';
import { FAQAccordion } from './FAQAccordion';

const year = new Date().getFullYear();

export const metadata: Metadata = {
  title: `FAQ - Hytale Server List Questions Answered`,
  description: `Find answers to frequently asked questions about Hytale Online List. Learn how to add your server, vote for servers, write reviews, and more.`,
  openGraph: {
    title: `FAQ | Hytale Online List`,
    description: `Find answers to frequently asked questions about Hytale Online List. Learn how to add your server, vote, and more.`,
    type: 'website',
    url: `${SITE_URL}/faq`,
  },
  twitter: {
    card: 'summary',
    title: `FAQ - Hytale Server List ${year}`,
    description: `Find answers to frequently asked questions about Hytale Online List.`,
  },
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
};

const faqCategories = [
  {
    title: 'Getting Started',
    icon: UserPlus,
    questions: [
      {
        question: 'What is Hytale Online List?',
        answer:
          'Hytale Online List is a comprehensive server listing platform for Hytale game servers. We help players discover amazing servers and help server owners promote their communities to a wider audience.',
      },
      {
        question: 'Do I need an account to browse servers?',
        answer:
          'No, you can browse and view all server listings without an account. However, you will need to create a free account to vote for servers, write reviews, or list your own server.',
      },
      {
        question: 'How do I create an account?',
        answer:
          'Click the "Sign Up" button in the navigation bar. You can register using your email address, or sign in quickly with Discord or Google. After registration, you\'ll need to verify your email to access all features.',
      },
      {
        question: 'Is Hytale Online List free to use?',
        answer:
          'Yes! Browsing servers, voting, writing reviews, and listing your server are all completely free. We may offer optional premium features in the future, but core functionality will always remain free.',
      },
    ],
  },
  {
    title: 'Server Listings',
    icon: Server,
    questions: [
      {
        question: 'How do I add my server to the list?',
        answer:
          'First, create an account and verify your email. Then go to your Dashboard and click "Add Server". Fill in your server details including name, IP address, description, and category. Your server will be reviewed and listed within 24 hours.',
      },
      {
        question: 'What information do I need to list my server?',
        answer:
          'You\'ll need your server\'s IP address (and port if not default), a server name, description, category selection, and optionally a banner image. Make sure your server is online and accessible when submitting.',
      },
      {
        question: 'How long does it take for my server to appear?',
        answer:
          'Most servers are approved within 24 hours. If your server meets our guidelines and is accessible, it will be listed promptly. You\'ll receive an email notification when your server is approved.',
      },
      {
        question: 'Can I edit my server listing after submission?',
        answer:
          'Yes, you can edit your server details anytime from your Dashboard. Changes to critical information like IP address may require re-verification.',
      },
      {
        question: 'Why was my server rejected or removed?',
        answer:
          'Servers may be rejected or removed for violating our terms of service, being offline for extended periods, containing inappropriate content, or misleading information. Check your email for specific reasons.',
      },
    ],
  },
  {
    title: 'Voting',
    icon: Vote,
    questions: [
      {
        question: 'How does voting work?',
        answer:
          'Each verified user can vote for any server once every 24 hours. Votes help servers rank higher in our listings, making them more visible to other players.',
      },
      {
        question: 'Why can I only vote once per day?',
        answer:
          'The 24-hour voting limit ensures fair ranking and prevents vote manipulation. It also encourages genuine engagement from active community members.',
      },
      {
        question: 'Do votes expire?',
        answer:
          'Votes contribute to both monthly and all-time rankings. Monthly rankings reset at the beginning of each month, while all-time votes are cumulative.',
      },
      {
        question: 'Can server owners reward players for voting?',
        answer:
          'Yes, many servers offer in-game rewards for voting. Server owners can set up vote reward systems through our API to automatically reward players who vote.',
      },
    ],
  },
  {
    title: 'Reviews',
    icon: Star,
    questions: [
      {
        question: 'How do I write a review?',
        answer:
          'Visit any server\'s page and scroll to the Reviews section. Click "Write a Review", select a star rating, and share your experience. Reviews help other players make informed decisions.',
      },
      {
        question: 'Can I edit or delete my review?',
        answer:
          'Yes, you can edit or delete your reviews from the server page or your profile. Edited reviews will show an "edited" indicator.',
      },
      {
        question: 'What makes a good review?',
        answer:
          'Good reviews are honest, detailed, and helpful. Mention specific features you liked or disliked, the community atmosphere, and your overall experience. Avoid profanity and personal attacks.',
      },
      {
        question: 'Are reviews moderated?',
        answer:
          'Yes, reviews are moderated to ensure they follow our community guidelines. Reviews containing spam, inappropriate content, or false information may be removed.',
      },
    ],
  },
  {
    title: 'Account & Security',
    icon: Shield,
    questions: [
      {
        question: 'How do I reset my password?',
        answer:
          'Click "Forgot Password" on the login page and enter your email address. You\'ll receive a password reset link valid for 1 hour.',
      },
      {
        question: 'Can I change my username?',
        answer:
          'Yes, you can change your username from your profile settings. Note that username changes may be limited to prevent abuse.',
      },
      {
        question: 'How do I delete my account?',
        answer:
          'You can request account deletion from your profile settings. This will permanently remove your account, reviews, and server listings. This action cannot be undone.',
      },
      {
        question: 'Is my personal information secure?',
        answer:
          'Yes, we take security seriously. We use industry-standard encryption, never store plain-text passwords, and never share your personal information with third parties. See our Privacy Policy for details.',
      },
    ],
  },
  {
    title: 'Technical',
    icon: Settings,
    questions: [
      {
        question: 'How does server status monitoring work?',
        answer:
          'We ping servers every 5 minutes using multiple protocols to check online status and player counts. This data is used for uptime statistics and charts on server pages.',
      },
      {
        question: 'What ports does Hytale use?',
        answer:
          'Hytale typically uses UDP port 5520 for game connections. Some servers may use custom ports - make sure to include the port in your server address if it\'s non-standard.',
      },
      {
        question: 'Why is my server showing as offline?',
        answer:
          'Check that your server is running and accessible from the internet. Ensure firewalls allow incoming connections on your game port. If issues persist, contact support.',
      },
      {
        question: 'Do you have an API for server owners?',
        answer:
          'Yes, we offer an API for vote verification and server statistics. Documentation is available in our developer portal. Contact us for API access.',
      },
    ],
  },
];

// Flatten all FAQ items for schema
const allFaqItems = faqCategories.flatMap((category) =>
  category.questions.map((q) => ({
    question: q.question,
    answer: q.answer,
  }))
);

export default function FAQPage() {
  const faqSchema = createFAQSchema(allFaqItems);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'FAQ', url: `${SITE_URL}/faq` },
  ]);

  return (
    <div className="min-h-screen">
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
            <p className="mt-2 text-muted-foreground">
              Find answers to common questions about Hytale Online List
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {faqCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>
                      {category.questions.length} questions
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <FAQAccordion questions={category.questions} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <Card className="mt-12">
          <CardContent className="py-8 text-center">
            <h2 className="text-xl font-semibold">Still have questions?</h2>
            <p className="mt-2 text-muted-foreground">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Contact Support
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
