import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *

Allow: /
Allow: *.js
Allow: *.css

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap.xml', site);
  return new Response(getRobotsTxt(sitemapURL));
};