import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hytaleonlinelist.com';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface Server {
  id: string;
  slug: string;
  updatedAt: string | null;
}

interface PaginatedResponse {
  data: Server[];
  total: number;
}

function isValidDate(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/servers`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Category pages
  const categories = ['survival', 'pvp', 'creative', 'rpg', 'minigames', 'adventure', 'modded'];
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/servers/${category}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Server pages - fetch all servers from API
  let serverPages: MetadataRoute.Sitemap = [];

  try {
    const response = await fetch(`${API_BASE_URL}/api/servers?limit=1000`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (response.ok) {
      const data: PaginatedResponse = await response.json();
      if (data.data && Array.isArray(data.data)) {
        serverPages = data.data
          .filter((server) => server && server.slug)
          .map((server) => ({
            url: `${BASE_URL}/server/${server.slug}`,
            lastModified: isValidDate(server.updatedAt) ? new Date(server.updatedAt!) : now,
            changeFrequency: 'daily' as const,
            priority: 0.7,
          }));
      }
    }
  } catch (error) {
    // During build time, the API may not be available - this is expected
    console.log('Sitemap: Could not fetch servers from API (this is expected during build)');
  }

  return [...staticPages, ...categoryPages, ...serverPages];
}
