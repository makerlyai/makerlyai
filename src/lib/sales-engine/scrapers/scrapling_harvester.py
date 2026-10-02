#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MakerlyAI Autonomous Lead Engine - Scrapling Stealth Harvester
Uses D4Vinci/Scrapling StealthyFetcher with anti-bot bypass to harvest
high-value B2B targets, brands, and decision makers.
"""

import sys
import json
import re
import argparse
import base64
import urllib.parse
from typing import List, Dict, Any

# Commercial search queries categorized by niche
NICHE_QUERIES = {
    "d2c": [
        'D2C clothing apparel brand India online store',
        'D2C skincare beauty brand Bangalore Mumbai online store',
        'top direct to consumer brands India shopify store',
        'sustainable fashion brand India online store contact'
    ],
    "saas": [
        'B2B SaaS startup Bangalore product website',
        'AI agents startup India platform founder',
        'early stage SaaS company India tech platform',
        'cloud workflow automation software company India'
    ],
    "high-ticket": [
        'uniform manufacturer Bangalore corporate uniforms contact',
        'corporate gifting company Mumbai Delhi website contact',
        'industrial equipment manufacturer Gujarat website contact',
        'private diagnostic healthcare lab chain Bangalore website'
    ],
    "b2b": [
        'B2B consulting firm Bangalore corporate website contact',
        'logistics supply chain enterprise software solutions India contact',
        'corporate B2B service provider India decision maker website',
        'commercial equipment distributor supplier India corporate office',
        'B2B industrial procurement marketplace India contact'
    ]
}

def clean_text(text: str) -> str:
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text).strip()

def extract_domain(url: str) -> str:
    try:
        parsed = urllib.parse.urlparse(url)
        netloc = parsed.netloc.lower()
        if netloc.startswith("www."):
            netloc = netloc[4:]
        return netloc
    except Exception:
        return ""

def unwrap_bing_url(href: str) -> str:
    """
    Decodes Bing redirect URL containing base64 target
    """
    if "u=a1" in href:
        try:
            parsed = urllib.parse.urlparse(href)
            qs = urllib.parse.parse_qs(parsed.query)
            u_val = qs.get("u", [""])[0]
            if u_val.startswith("a1"):
                b64_str = u_val[2:] + "==="
                decoded = base64.urlsafe_b64decode(b64_str).decode("utf-8", errors="ignore")
                return decoded
        except Exception:
            pass
    return href

def search_with_scrapling(query: str, max_results: int = 10) -> List[Dict[str, Any]]:
    """
    Searches using Scrapling's StealthyFetcher
    """
    results = []
    encoded_query = urllib.parse.quote_plus(query)
    search_url = f"https://www.bing.com/search?q={encoded_query}"

    print(f"[*] [Scrapling Stealth] Querying: {query}", file=sys.stderr)

    try:
        from scrapling import StealthyFetcher
        r = StealthyFetcher.fetch(search_url, headless=True)
        if r.status != 200:
            print(f"[!] Bing returned status {r.status}", file=sys.stderr)
            return results

        # In Bing, search results are in li.b_algo
        items = r.css('li.b_algo')
        for item in items:
            if len(results) >= max_results:
                break

            h2_el = item.css('h2 a')
            if not h2_el:
                continue

            raw_href = h2_el[0].attrib.get('href', '')
            title = clean_text(h2_el[0].css('::text').get() or "")

            snippet_el = item.css('.b_caption p') or item.css('p')
            snippet = clean_text(snippet_el[0].css('::text').get() or "") if snippet_el else ""

            final_url = unwrap_bing_url(raw_href)
            domain = extract_domain(final_url)

            # Skip generic portals and directories
            if not domain or any(d in domain for d in [
                "bing.com", "google.com", "wikipedia.org", "dictionary.com",
                "merriam-webster.com", "cambridge.org", "youtube.com", "facebook.com",
                "instagram.com", "linkedin.com/pulse", "quora.com", "reddit.com"
            ]):
                continue

            # Guess business name from domain / title
            biz_name = domain.split('.')[0].capitalize()
            if " - " in title:
                biz_name = title.split(" - ")[0].strip()
            elif " | " in title:
                biz_name = title.split(" | ")[0].strip()
            elif ":" in title:
                biz_name = title.split(":")[0].strip()

            results.append({
                "businessName": biz_name[:60],
                "clientName": "Decision Maker",
                "title": title,
                "snippet": snippet,
                "websiteUrl": final_url,
                "domain": domain,
                "discoveredVia": "scrapling_stealth_bing"
            })

    except Exception as e:
        print(f"[!] Scrapling fetch error: {e}", file=sys.stderr)

    return results

def main():
    parser = argparse.ArgumentParser(description="MakerlyAI Scrapling Lead Harvester")
    parser.add_argument("--niche", type=str, default="d2c", choices=["d2c", "saas", "high-ticket", "b2b"], help="Target niche")
    parser.add_argument("--query", type=str, default=None, help="Custom search query override")
    parser.add_argument("--limit", type=int, default=10, help="Max leads to discover")
    parser.add_argument("--out", type=str, default=None, help="Output JSON path")
    args = parser.parse_args()

    queries = [args.query] if args.query else NICHE_QUERIES.get(args.niche, NICHE_QUERIES["d2c"])
    all_leads = []
    seen_domains = set()

    for q in queries:
        if len(all_leads) >= args.limit:
            break
        leads = search_with_scrapling(q, max_results=args.limit - len(all_leads))
        for lead in leads:
            if lead["domain"] not in seen_domains:
                seen_domains.add(lead["domain"])
                all_leads.append(lead)

    output_data = {
        "niche": args.niche,
        "count": len(all_leads),
        "leads": all_leads
    }

    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        print(f"[+] Successfully harvested {len(all_leads)} leads to {args.out}", file=sys.stderr)
    else:
        print(json.dumps(output_data, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
