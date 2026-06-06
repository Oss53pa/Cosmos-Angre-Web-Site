/**
 * Génère public/sitemap.xml + public/feed.xml en fonction du contenu Supabase.
 *
 * - Si VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définis, fetch les
 *   stores/events/blog publiés et les inclut.
 * - Sinon, génère un sitemap "core" avec uniquement les routes statiques.
 *
 * Le sitemap inclut hreflang FR/EN pour chaque URL canonique.
 *
 * Usage:
 *   node scripts/generate-sitemap.mjs
 */
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

const SITE_URL = (process.env.VITE_APP_URL || 'https://www.cosmos-angre.com').replace(/\/$/, '');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY;

// Routes statiques publiques (= ne pas inclure /admin, /auth, /superadmin)
const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/a-propos', priority: 0.7, changefreq: 'monthly' },
  { path: '/nos-espaces', priority: 0.8, changefreq: 'monthly' },
  { path: '/boutiques', priority: 0.9, changefreq: 'daily' },
  { path: '/evenements', priority: 0.9, changefreq: 'daily' },
  { path: '/services', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog', priority: 0.8, changefreq: 'weekly' },
  { path: '/contact', priority: 0.6, changefreq: 'yearly' },
  { path: '/services-premium', priority: 0.7, changefreq: 'monthly' },
  { path: '/plan-interactif', priority: 0.7, changefreq: 'monthly' },
  { path: '/gastronomie', priority: 0.8, changefreq: 'monthly' },
  { path: '/loisirs', priority: 0.8, changefreq: 'monthly' },
  { path: '/hotel', priority: 0.7, changefreq: 'monthly' },
  { path: '/retail-park', priority: 0.7, changefreq: 'monthly' },
  { path: '/preparer-visite', priority: 0.7, changefreq: 'monthly' },
  { path: '/fidelite', priority: 0.7, changefreq: 'monthly' },
  { path: '/navigation-ar', priority: 0.6, changefreq: 'yearly' },
  { path: '/mentions-legales', priority: 0.3, changefreq: 'yearly' },
  { path: '/confidentialite', priority: 0.3, changefreq: 'yearly' },
  { path: '/cgu', priority: 0.3, changefreq: 'yearly' },
  { path: '/professionnels/devenir-enseigne', priority: 0.7, changefreq: 'monthly' },
  { path: '/professionnels/annonceurs', priority: 0.6, changefreq: 'monthly' },
  { path: '/professionnels/investisseurs', priority: 0.6, changefreq: 'monthly' },
  { path: '/professionnels/presse', priority: 0.5, changefreq: 'monthly' },
];

const ISO = (d) => (d ? new Date(d).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));

const xmlEscape = (s) =>
  String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);

async function fetchSupabase(table, query = '') {
  if (!SUPABASE_URL || !SUPABASE_ANON || SUPABASE_URL.includes('your-project') || SUPABASE_URL.includes('placeholder')) {
    return [];
  }
  try {
    const url = `${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ''}`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
      },
    });
    if (!res.ok) {
      console.warn(`  WARN ${table} fetch ${res.status}: ${await res.text()}`);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.warn(`  WARN ${table} fetch error: ${err.message}`);
    return [];
  }
}

function urlEntry(loc, lastmod, priority, changefreq, alternates) {
  const altLinks = (alternates || [])
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}"/>`)
    .join('\n');
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>${altLinks ? '\n' + altLinks : ''}
  </url>`;
}

function withAlternates(path) {
  const fr = `${SITE_URL}${path}`;
  const en = `${SITE_URL}/en${path === '/' ? '' : path}`;
  return [
    { lang: 'fr', href: fr },
    { lang: 'en', href: en },
    { lang: 'x-default', href: fr },
  ];
}

async function generateSitemap() {
  console.log('> Génération sitemap.xml');
  const today = ISO();

  const entries = [];

  // Routes statiques (FR + EN)
  for (const r of STATIC_ROUTES) {
    entries.push(urlEntry(`${SITE_URL}${r.path}`, today, r.priority, r.changefreq, withAlternates(r.path)));
  }

  // Boutiques
  const stores = await fetchSupabase('stores', 'select=slug,updated_at&status=eq.active');
  console.log(`  - ${stores.length} boutiques`);
  for (const s of stores) {
    if (!s.slug) continue;
    entries.push(
      urlEntry(`${SITE_URL}/boutiques/${s.slug}`, ISO(s.updated_at), 0.7, 'weekly', withAlternates(`/boutiques/${s.slug}`))
    );
  }

  // Événements
  const events = await fetchSupabase('events', 'select=slug,updated_at,visibility&visibility=eq.public');
  console.log(`  - ${events.length} événements`);
  for (const e of events) {
    if (!e.slug) continue;
    entries.push(
      urlEntry(`${SITE_URL}/evenements/${e.slug}`, ISO(e.updated_at), 0.7, 'weekly', withAlternates(`/evenements/${e.slug}`))
    );
  }

  // Articles blog publiés
  const posts = await fetchSupabase('blog_posts', 'select=slug,updated_at&status=eq.published');
  console.log(`  - ${posts.length} articles`);
  for (const p of posts) {
    if (!p.slug) continue;
    entries.push(
      urlEntry(`${SITE_URL}/blog/${p.slug}`, ISO(p.updated_at), 0.6, 'weekly', withAlternates(`/blog/${p.slug}`))
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

  await writeFile(join('public', 'sitemap.xml'), xml, 'utf8');
  console.log(`  Done: public/sitemap.xml (${entries.length} URLs)`);

  // RSS feed des articles
  await generateRss(posts);
}

async function generateRss(posts) {
  console.log('> Génération feed.xml (RSS)');

  const items = [];
  // Si aucun post Supabase, on tente de fetcher avec excerpt
  let detailedPosts = posts;
  if (posts.length > 0) {
    detailedPosts = await fetchSupabase(
      'blog_posts',
      'select=title,slug,excerpt,publish_date,author_name,featured_image,updated_at&status=eq.published&order=publish_date.desc&limit=20'
    );
  }

  for (const p of detailedPosts) {
    if (!p.slug || !p.title) continue;
    const link = `${SITE_URL}/blog/${p.slug}`;
    const pubDate = new Date(p.publish_date || p.updated_at || new Date()).toUTCString();
    items.push(`    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      ${p.author_name ? `<author>${xmlEscape(p.author_name)}</author>` : ''}
      <description>${xmlEscape(p.excerpt || '')}</description>
      ${p.featured_image ? `<enclosure url="${xmlEscape(p.featured_image)}" type="image/jpeg"/>` : ''}
    </item>`);
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Cosmos Angré — Magazine</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Articles, interviews, lifestyle et tendances à Cosmos Angré.</description>
    <language>fr-FR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>
`;

  await writeFile(join('public', 'feed.xml'), rss, 'utf8');
  console.log(`  Done: public/feed.xml (${items.length} items)`);
}

generateSitemap().catch((e) => {
  console.error(e);
  process.exit(1);
});
