interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Common schema types for the site
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hytaleonlinelist.com';

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Hytale Online List',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'The best place to discover and share Hytale servers.',
    sameAs: [],
  };
}

export function createWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Hytale Online List',
    url: SITE_URL,
    description: 'Discover and join the best Hytale servers. Browse survival, PvP, RPG, and minigames servers.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/servers?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

interface GameServerSchemaProps {
  name: string;
  slug: string;
  description: string;
  bannerUrl: string | null;
  isOnline: boolean;
  playerCount: number | null;
  maxPlayers: number | null;
  ipAddress: string;
  port: number;
  category: string;
}

export function createGameServerSchema(server: GameServerSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'GameServer',
    name: server.name,
    url: `${SITE_URL}/server/${server.slug}`,
    description: server.description,
    image: server.bannerUrl || undefined,
    serverStatus: server.isOnline ? 'Online' : 'Offline',
    playersOnline: server.playerCount ?? 0,
    numberOfPlayers: server.maxPlayers ?? undefined,
    game: {
      '@type': 'VideoGame',
      name: 'Hytale',
      genre: server.category,
    },
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface ServerListItem {
  name: string;
  slug: string;
}

export function createItemListSchema(servers: ServerListItem[], listName: string = 'Top Hytale Servers') {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: servers.length,
    itemListElement: servers.map((server, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/server/${server.slug}`,
      name: server.name,
    })),
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

export function createFAQSchema(faqItems: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
