// ─────────────────────────────────────────────────────────────────
//  MakerlyAI Autonomous Sales Engine - SERP & B2B Target Discovery
// ─────────────────────────────────────────────────────────────────

import * as cheerio from 'cheerio';
import { SALES_ENGINE_CONFIG } from '../config.mjs';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

const IGNORE_DOMAINS = [
  'duckduckgo.com', 'google.com', 'bing.com', 'yahoo.com',
  'youtube.com', 'facebook.com', 'wikipedia.org', 'instagram.com',
  'twitter.com', 'x.com', 'reddit.com', 'medium.com', 'quora.com'
];

/**
 * Searches DuckDuckGo HTML and extracts prospective B2B targets
 */
export async function discoverTargetsFromWeb(options = {}) {
  const {
    niche = 'd2c',
    query = null,
    limit = 10,
  } = options;

  const nicheConfig = SALES_ENGINE_CONFIG.niches[niche] || SALES_ENGINE_CONFIG.niches.d2c;
  const queriesToRun = query ? [query] : nicheConfig.searchKeywords;

  const discovered = [];
  const seenDomains = new Set();

  for (const q of queriesToRun) {
    if (discovered.length >= limit) break;

    try {
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
      const res = await fetch(searchUrl, {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });

      if (!res.ok) continue;
      const html = await res.text();
      const $ = cheerio.load(html);

      $('.result').each((_, el) => {
        if (discovered.length >= limit) return false;

        const titleEl = $(el).find('.result__title a');
        const snippetEl = $(el).find('.result__snippet');
        const urlEl = $(el).find('.result__url');

        let rawUrl = titleEl.attr('href') || urlEl.text().trim();
        // Unwrap DuckDuckGo redirect uddg parameter
        if (rawUrl && rawUrl.includes('uddg=')) {
          const match = rawUrl.match(/uddg=([^&]+)/);
          if (match) {
            rawUrl = decodeURIComponent(match[1]);
          }
        }

        if (!rawUrl || !rawUrl.startsWith('http')) return;

        let domain = '';
        try {
          domain = new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
        } catch {
          return;
        }

        if (seenDomains.has(domain)) return;
        if (IGNORE_DOMAINS.some(d => domain.includes(d))) return;

        const title = titleEl.text().trim() || $(el).find('h2').text().trim();
        const snippet = snippetEl.text().trim();

        // Infer company name
        let businessName = domain.split('.')[0];
        businessName = businessName.charAt(0).toUpperCase() + businessName.slice(1);
        if (title.includes(' - ')) {
          businessName = title.split(' - ')[0].trim();
        } else if (title.includes(' | ')) {
          businessName = title.split(' | ')[0].trim();
        }

        // Infer contact person if LinkedIn search
        let clientName = 'Decision Maker';
        if (rawUrl.includes('linkedin.com/in/')) {
          const namePart = title.split(' - ')[0].trim();
          if (namePart && namePart.split(' ').length <= 4) {
            clientName = namePart;
          }
        }

        seenDomains.add(domain);
        discovered.push({
          id: `lead-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          businessName,
          clientName,
          websiteUrl: rawUrl,
          domain,
          snippet,
          niche,
          discoveredAt: new Date().toISOString(),
          status: 'Discovered',
        });
      });

      // Small pause between search queries
      await new Promise(r => setTimeout(r, 1200));
    } catch (err) {
      console.warn(`[SERP Discovery] Query failed (${q}):`, err.message);
    }
  }

  return discovered;
}
