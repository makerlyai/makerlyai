// ─────────────────────────────────────────────────────────────────
//  MakerlyAI Autonomous Sales Engine - Website Enricher & Email Finder
// ─────────────────────────────────────────────────────────────────

import * as cheerio from 'cheerio';
import dns from 'dns/promises';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

// Common placeholder / invalid domains to ignore
const JUNK_EMAIL_DOMAINS = [
  'example.com', 'yourdomain.com', 'email.com', 'sentry.io',
  'wixpress.com', 'shopify.com', 'wordpress.com', 'github.com',
  'gravatar.com', 'cloudflare.com', 'google.com'
];

/**
 * Validates domain has active MX records
 */
export async function verifyDomainHasMx(domain) {
  try {
    const mxRecords = await dns.resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch {
    return false;
  }
}

/**
 * Normalizes URL
 */
function cleanUrl(rawUrl) {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return url;
  }
}

/**
 * Extracts emails from HTML text and attributes
 */
function extractEmails(html) {
  if (!html) return [];
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
  const matches = html.match(emailRegex) || [];
  
  const cleanList = matches
    .map(e => e.toLowerCase().trim())
    .filter(email => {
      const parts = email.split('@');
      if (parts.length !== 2) return false;
      const domain = parts[1];
      // Filter image extensions or assets wrongly matched as emails
      if (domain.endsWith('.png') || domain.endsWith('.jpg') || domain.endsWith('.svg') || domain.endsWith('.webp')) return false;
      if (JUNK_EMAIL_DOMAINS.includes(domain)) return false;
      // Filter out overly generic / minified code tokens
      if (email.length > 50 || email.startsWith('wix-') || email.includes('node_modules')) return false;
      return true;
    });

  return Array.from(new Set(cleanList));
}

/**
 * Detects tech stack signatures
 */
function detectTechStack(html, headers) {
  const stack = [];
  const lower = html.toLowerCase();

  if (lower.includes('cdn.shopify.com') || lower.includes('shopify-buy') || lower.includes('myshopify')) {
    stack.push('Shopify');
  }
  if (lower.includes('wp-content') || lower.includes('woocommerce') || lower.includes('wp-json')) {
    stack.push('WooCommerce / WordPress');
  }
  if (lower.includes('__next') || lower.includes('_next/static')) {
    stack.push('Next.js');
  }
  if (lower.includes('react') || lower.includes('react-dom')) {
    stack.push('React');
  }
  if (lower.includes('webflow.com') || lower.includes('data-wf-page')) {
    stack.push('Webflow');
  }
  if (lower.includes('wix.com') || lower.includes('wix-image')) {
    stack.push('Wix');
  }
  if (lower.includes('api.razorpay.com') || lower.includes('checkout.razorpay.com')) {
    stack.push('Razorpay Payment Gateway');
  }
  if (lower.includes('js.stripe.com')) {
    stack.push('Stripe');
  }
  if (lower.includes('whatsapp') || lower.includes('api.whatsapp.com') || lower.includes('wa.me')) {
    stack.push('WhatsApp Floating Widget');
  }

  return stack;
}

/**
 * Fetches page with timeout
 */
async function fetchWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
      redirect: 'follow'
    });
    clearTimeout(id);
    if (!res.ok) return { ok: false, status: res.status, html: '' };
    const html = await res.text();
    return { ok: true, html, url: res.url };
  } catch (err) {
    clearTimeout(id);
    return { ok: false, error: err.message, html: '' };
  }
}

/**
 * Crawls and enriches a website domain:
 * 1. Checks homepage
 * 2. Finds /contact, /about, /team links
 * 3. Extracts emails, phones, social links, meta descriptions, tech stack
 * 4. Verifies domain MX
 */
export async function enrichWebsite(rawWebsiteUrl) {
  const rootUrl = cleanUrl(rawWebsiteUrl);
  if (!rootUrl) {
    return { error: 'Invalid URL provided', url: rawWebsiteUrl };
  }

  const result = {
    websiteUrl: rootUrl,
    domain: new URL(rootUrl).hostname.replace(/^www\./, ''),
    title: '',
    metaDescription: '',
    h1s: [],
    emails: [],
    phones: [],
    techStack: [],
    socialLinks: {
      linkedin: null,
      instagram: null,
      twitter: null,
      facebook: null,
    },
    hasValidMx: false,
    accessible: false,
    painPointsIdentified: [],
  };

  try {
    result.hasValidMx = await verifyDomainHasMx(result.domain);
  } catch {}

  // 1. Fetch Homepage
  const homeRes = await fetchWithTimeout(rootUrl);
  if (!homeRes.ok || !homeRes.html) {
    result.error = homeRes.error || `HTTP ${homeRes.status}`;
    return result;
  }

  result.accessible = true;
  const $ = cheerio.load(homeRes.html);

  result.title = $('title').first().text().trim();
  result.metaDescription = $('meta[name="description"]').attr('content')?.trim() || 
                           $('meta[property="og:description"]').attr('content')?.trim() || '';

  $('h1').each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (text && text.length < 150) result.h1s.push(text);
  });

  result.techStack = detectTechStack(homeRes.html);

  // Extract Social Links
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.includes('linkedin.com/company') || href.includes('linkedin.com/in')) {
      if (!result.socialLinks.linkedin) result.socialLinks.linkedin = href;
    } else if (href.includes('instagram.com/')) {
      if (!result.socialLinks.instagram && !href.includes('instagram.com/p/')) result.socialLinks.instagram = href;
    } else if (href.includes('twitter.com/') || href.includes('x.com/')) {
      if (!result.socialLinks.twitter) result.socialLinks.twitter = href;
    } else if (href.includes('facebook.com/')) {
      if (!result.socialLinks.facebook) result.socialLinks.facebook = href;
    }
  });

  // Extract Emails from Homepage
  let gatheredEmails = extractEmails(homeRes.html);

  // Check for Contact / About subpages
  const secondaryPaths = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (
      href.includes('/contact') || 
      href.includes('/about') || 
      href.includes('/team') || 
      href.includes('/contact-us') ||
      href.includes('/reach-us')
    ) {
      try {
        const full = new URL(href, rootUrl).href;
        if (full.startsWith(rootUrl) && !secondaryPaths.includes(full)) {
          secondaryPaths.push(full);
        }
      } catch {}
    }
  });

  // Crawl up to 2 secondary pages
  for (const pageUrl of secondaryPaths.slice(0, 2)) {
    const subRes = await fetchWithTimeout(pageUrl, 5000);
    if (subRes.ok && subRes.html) {
      const pageEmails = extractEmails(subRes.html);
      gatheredEmails.push(...pageEmails);
    }
  }

  // Deduplicate and filter emails
  result.emails = Array.from(new Set(gatheredEmails));

  // Prioritize emails that match the target domain or contain founder/contact keywords
  result.emails.sort((a, b) => {
    const aMatchesDomain = a.endsWith('@' + result.domain);
    const bMatchesDomain = b.endsWith('@' + result.domain);
    if (aMatchesDomain && !bMatchesDomain) return -1;
    if (!aMatchesDomain && bMatchesDomain) return 1;
    return 0;
  });

  // Identify obvious website conversion & tech gaps
  if (result.techStack.includes('WooCommerce / WordPress')) {
    result.painPointsIdentified.push('WordPress/WooCommerce site - potential checkout speed lag and high bounce rates on mobile');
  }
  if (!result.techStack.includes('Razorpay Payment Gateway') && !result.techStack.includes('Stripe')) {
    result.painPointsIdentified.push('No modern instant payment gateway detected; potential checkout friction');
  }
  if (!result.metaDescription || result.metaDescription.length < 30) {
    result.painPointsIdentified.push('Missing or under-optimized SEO meta description losing organic search traction');
  }
  if (result.emails.length === 0) {
    result.painPointsIdentified.push('No direct contact email publicly visible on home/contact pages');
  }

  return result;
}
