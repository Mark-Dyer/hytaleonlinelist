import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Server, Category, PaginatedResponse } from '@/types';
import { CategoryPageClient } from './CategoryPageClient';
import { JsonLd, createBreadcrumbSchema, createItemListSchema, SITE_URL } from '@/components/seo/JsonLd';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const categoryDescriptions: Record<string, string> = {
  survival: 'Explore the best Survival Hytale servers. Gather resources, build bases, and survive against the elements with other players.',
  pvp: 'Battle on top PvP Hytale servers. Compete in combat, faction wars, and player versus player gameplay.',
  creative: 'Build without limits on Creative Hytale servers. Access unlimited resources and creative tools to construct amazing creations.',
  rpg: 'Adventure awaits on RPG Hytale servers. Level up your character, complete quests, and explore vast fantasy worlds.',
  minigames: 'Play exciting Minigames on Hytale servers. Enjoy bedwars, skywars, parkour, and countless other fun game modes.',
  adventure: 'Embark on epic journeys with Adventure Hytale servers. Experience story-driven gameplay and exploration.',
  modded: 'Experience enhanced gameplay on Modded Hytale servers. Discover custom content, new features, and unique modifications.',
};

// Extended SEO content for each category
const categorySeoContent: Record<string, { intro: string; features: string[]; callToAction: string }> = {
  survival: {
    intro: 'Survival servers offer the classic Hytale experience where you must gather resources, craft tools, build shelters, and survive against hostile creatures and environmental challenges. Whether you prefer playing solo or with friends, survival servers provide endless opportunities for adventure.',
    features: ['Resource gathering and crafting', 'Base building and protection', 'PvE combat against monsters', 'Multiplayer collaboration', 'Economy and trading systems'],
    callToAction: 'Join a survival server today and test your skills against the wilderness!',
  },
  pvp: {
    intro: 'PvP (Player vs Player) servers are designed for competitive combat between players. These servers feature various game modes including faction wars, duels, arena battles, and territory control. Prove your combat skills and rise to the top of the leaderboards.',
    features: ['Competitive combat modes', 'Faction and clan systems', 'Territory control', 'Ranked matchmaking', 'Custom weapons and abilities'],
    callToAction: 'Ready for battle? Join a PvP server and prove your worth!',
  },
  creative: {
    intro: 'Creative servers give players unlimited resources and creative freedom to build anything they can imagine. Perfect for architects, artists, and builders who want to create without restrictions. Many servers feature plot systems and building competitions.',
    features: ['Unlimited resources', 'WorldEdit and building tools', 'Plot protection systems', 'Building competitions', 'Collaborative projects'],
    callToAction: 'Unleash your creativity on a creative server today!',
  },
  rpg: {
    intro: 'RPG (Role-Playing Game) servers offer immersive experiences with custom quests, character progression, and rich storylines. Level up your character, learn new abilities, and explore vast worlds filled with adventure and mystery.',
    features: ['Character classes and progression', 'Custom quests and storylines', 'Skill trees and abilities', 'NPC interactions', 'Dungeons and boss battles'],
    callToAction: 'Begin your adventure on an RPG server and become a legend!',
  },
  minigames: {
    intro: 'Minigame servers offer a variety of fun, quick-play game modes perfect for casual gaming sessions. From classic games like Bedwars and Skywars to unique custom games, there\'s always something new to play.',
    features: ['Multiple game modes', 'Quick matchmaking', 'Leaderboards and rankings', 'Daily challenges', 'Party system for friends'],
    callToAction: 'Jump into the action on a minigames server!',
  },
  adventure: {
    intro: 'Adventure servers feature curated experiences with custom maps, storylines, and exploration-focused gameplay. Discover hidden secrets, solve puzzles, and embark on epic journeys through carefully crafted worlds.',
    features: ['Custom adventure maps', 'Story-driven content', 'Puzzle solving', 'Hidden secrets and Easter eggs', 'Cinematic experiences'],
    callToAction: 'Start your journey on an adventure server today!',
  },
  modded: {
    intro: 'Modded servers enhance the base Hytale experience with custom modifications, new content, and unique gameplay mechanics. Experience the game in entirely new ways with community-created content and features.',
    features: ['Custom mods and plugins', 'New items and blocks', 'Enhanced gameplay mechanics', 'Unique server features', 'Regular content updates'],
    callToAction: 'Experience Hytale like never before on a modded server!',
  },
};

const validCategories = ['survival', 'pvp', 'creative', 'rpg', 'minigames', 'adventure', 'modded'];

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch category');
    }
    return res.json();
  } catch {
    return null;
  }
}

async function getServersByCategory(
  categorySlug: string
): Promise<PaginatedResponse<Server> | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/servers?category=${categorySlug}&sort=votes&page=1&limit=20`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) {
      throw new Error('Failed to fetch servers');
    }
    return res.json();
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return validCategories.map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }

  const categoryName = category.name;
  const year = new Date().getFullYear();
  const title = `${categoryName} Hytale Servers ${year} - Best Server List`;
  const description = categoryDescriptions[categorySlug] ||
    `Browse the best ${categoryName} Hytale servers. Find active communities and join thousands of players.`;

  return {
    title,
    description,
    openGraph: {
      title: `${categoryName} Servers | Hytale Online List`,
      description,
      type: 'website',
      url: `${SITE_URL}/servers/${categorySlug}`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/servers/${categorySlug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  // Validate category
  if (!validCategories.includes(categorySlug)) {
    notFound();
  }

  // Fetch data in parallel
  const [category, serversResponse] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getServersByCategory(categorySlug),
  ]);

  if (!category) {
    notFound();
  }

  // Default empty response if servers fetch fails
  const servers = serversResponse?.data ?? [];
  const meta = serversResponse?.meta ?? { page: 1, size: 20, total: 0, totalPages: 0 };

  // Create schemas
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Servers', url: `${SITE_URL}/servers` },
    { name: category.name, url: `${SITE_URL}/servers/${categorySlug}` },
  ]);

  const itemListSchema = createItemListSchema(
    servers.map((s) => ({ name: s.name, slug: s.slug })),
    `Top ${category.name} Hytale Servers`
  );

  // Get SEO content for this category
  const seoContent = categorySeoContent[categorySlug];

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />
      <CategoryPageClient
        category={category}
        initialServers={servers}
        initialMeta={meta}
        seoContent={seoContent}
      />
    </>
  );
}
