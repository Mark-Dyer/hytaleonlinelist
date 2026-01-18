'use client';

import { useState } from 'react';
import { Mail, MessageSquare, Clock, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const contactReasons = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Technical Support' },
  { value: 'server', label: 'Server Listing Issue' },
  { value: 'report', label: 'Report a Problem' },
  { value: 'feedback', label: 'Feedback & Suggestions' },
  { value: 'business', label: 'Business Inquiry' },
];

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: 'general',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission - replace with actual API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        reason: 'general',
        subject: '',
        message: '',
      });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
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
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitStatus === 'success' ? (
                  <div className="py-8 text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <h3 className="mt-4 text-lg font-semibold">Message Sent!</h3>
                    <p className="mt-2 text-muted-foreground">
                      Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
                    </p>
                    <Button
                      className="mt-4"
                      variant="outline"
                      onClick={() => setSubmitStatus('idle')}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitStatus === 'error' && (
                      <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <p className="text-sm">
                          Something went wrong. Please try again or email us directly.
                        </p>
                      </div>
                    )}

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="mb-2 block text-sm font-medium">
                          Your Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="reason" className="mb-2 block text-sm font-medium">
                          Reason for Contact
                        </label>
                        <select
                          id="reason"
                          name="reason"
                          value={formData.reason}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          {contactReasons.map((reason) => (
                            <option key={reason.value} value={reason.value}>
                              {reason.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Brief description of your inquiry"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="mb-2 block text-sm font-medium">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please provide as much detail as possible..."
                        rows={6}
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        By submitting, you agree to our{' '}
                        <a href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </p>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
