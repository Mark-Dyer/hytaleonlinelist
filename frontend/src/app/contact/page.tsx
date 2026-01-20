import type { Metadata } from 'next';
import { Mail, MessageSquare, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { JsonLd, createBreadcrumbSchema, SITE_URL } from '@/components/seo/JsonLd';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us - Hytale Server List',
  description: 'Get in touch with the Hytale Online List team. We are here to help with questions about server listings, technical support, and feedback.',
  openGraph: {
    title: 'Contact Us | Hytale Online List',
    description: 'Get in touch with the Hytale Online List team. We are here to help with questions about server listings, technical support, and feedback.',
    type: 'website',
    url: `${SITE_URL}/contact`,
  },
  twitter: {
    card: 'summary',
    title: 'Contact Hytale Online List',
    description: 'Get in touch with the Hytale Online List team. We are here to help with questions and feedback.',
  },
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
};

const contactInfo = [
  {
    title: 'Email Us',
    description: 'Send us an email anytime',
    value: 'support@hytaleonlinelist.com',
    icon: Mail,
  },
  {
    title: 'Response Time',
    description: 'We typically respond within',
    value: '24-48 hours',
    icon: Clock,
  },
  {
    title: 'Community',
    description: 'Join our Discord server',
    value: 'discord.gg/hytaleol',
    icon: MessageSquare,
  },
];

export default function ContactPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Contact', url: `${SITE_URL}/contact` },
  ]);

  return (
    <div className="min-h-screen">
      <JsonLd data={breadcrumbSchema} />

      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Contact Us</h1>
            <p className="mt-2 text-muted-foreground">
              Have a question or need help? We&apos;re here for you.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Info Cards */}
          <div className="space-y-6 lg:col-span-1">
            {contactInfo.map((info) => (
              <Card key={info.title}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{info.title}</h3>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                      <p className="mt-1 font-medium text-primary">{info.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* FAQ Link */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold">Check our FAQ</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Many common questions are already answered in our FAQ section.
                </p>
                <a
                  href="/faq"
                  className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  View FAQ
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
