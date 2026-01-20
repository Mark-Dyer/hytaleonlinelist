import type { Metadata } from 'next';
import { Info, Users, Server, Target, Heart, Zap, Shield, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JsonLd, createBreadcrumbSchema, SITE_URL } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'About Us - Hytale Server List',
  description: 'Learn about Hytale Online List, the premier destination for discovering and sharing Hytale game servers. Our mission is to connect players with amazing communities.',
  openGraph: {
    title: 'About Us | Hytale Online List',
    description: 'Learn about Hytale Online List, the premier destination for discovering and sharing Hytale game servers.',
    type: 'website',
    url: `${SITE_URL}/about`,
  },
  twitter: {
    card: 'summary',
    title: 'About Hytale Online List',
    description: 'Learn about Hytale Online List, the premier destination for discovering and sharing Hytale game servers.',
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

const stats = [
  { label: 'Active Servers', value: '500+', icon: Server },
  { label: 'Registered Users', value: '10,000+', icon: Users },
  { label: 'Monthly Votes', value: '50,000+', icon: Heart },
  { label: 'Countries', value: '50+', icon: Globe },
];

const values = [
  {
    title: 'Community First',
    description:
      'We believe in putting the community at the heart of everything we do. Our platform is designed to help players find their perfect server and help server owners grow their communities.',
    icon: Users,
  },
  {
    title: 'Fair & Transparent',
    description:
      'Our ranking system is based on genuine community engagement. We actively prevent vote manipulation and ensure every server has a fair chance to be discovered.',
    icon: Shield,
  },
  {
    title: 'Always Improving',
    description:
      'We continuously listen to feedback and improve our platform. New features and enhancements are regularly rolled out based on community needs.',
    icon: Zap,
  },
  {
    title: 'Free Forever',
    description:
      'Core features like server listing, voting, and reviews will always be free. We believe everyone should have equal access to grow their community.',
    icon: Heart,
  },
];

const team = [
  {
    name: 'The Development Team',
    role: 'Building the Platform',
    description:
      'Our dedicated team of developers works tirelessly to create the best server listing experience for the Hytale community.',
  },
  {
    name: 'Community Moderators',
    role: 'Keeping Things Safe',
    description:
      'Volunteer moderators help ensure our platform remains a welcoming and safe space for all players and server owners.',
  },
  {
    name: 'Server Partners',
    role: 'Growing Together',
    description:
      'We work closely with server owners to understand their needs and build features that help communities thrive.',
  },
];

export default function AboutPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'About', url: `${SITE_URL}/about` },
  ]);

  return (
    <div className="min-h-screen">
      <JsonLd data={breadcrumbSchema} />
      {/* Hero Section */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Info className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">About Hytale Online List</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              The premier destination for discovering and sharing Hytale game servers.
              We connect players with amazing communities and help server owners reach
              a global audience.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="mx-auto h-8 w-8 text-primary" />
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Target className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Hytale Online List was created with a simple mission: to be the best place
            for Hytale players to discover servers and for server owners to grow their
            communities. We provide the tools, visibility, and platform needed to connect
            players with their perfect gaming experience.
          </p>
        </div>

        {/* Story */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p className="text-muted-foreground">
              Hytale Online List was born from a passion for gaming communities and a desire
              to create something meaningful for the Hytale ecosystem. As longtime fans of
              multiplayer gaming, we understood the challenges players face when searching
              for the right server - and the struggles server owners face in building an audience.
            </p>
            <p className="mt-4 text-muted-foreground">
              We set out to build a platform that would solve both problems. For players,
              we created an intuitive browsing experience with detailed server information,
              honest reviews, and reliable status monitoring. For server owners, we built
              powerful tools for promotion, analytics, and community engagement.
            </p>
            <p className="mt-4 text-muted-foreground">
              Today, Hytale Online List serves thousands of players and hundreds of servers
              worldwide. But we&apos;re just getting started. As Hytale continues to evolve, so
              will we - always with our community&apos;s best interests at heart.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold">Our Values</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            The principles that guide everything we do
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <value.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{value.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold">The People Behind HOL</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            A dedicated team working to serve the Hytale community
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {team.map((member) => (
              <Card key={member.name}>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="mt-16">
          <CardContent className="py-8 text-center">
            <h2 className="text-xl font-semibold">Join Our Community</h2>
            <p className="mt-2 text-muted-foreground">
              Whether you&apos;re a player looking for servers or a server owner looking to grow,
              we&apos;re here to help.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/servers"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Browse Servers
              </a>
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-2 font-medium transition-colors hover:bg-card"
              >
                Create Account
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
