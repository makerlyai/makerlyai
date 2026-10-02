const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const logoSvg = fs.readFileSync(path.join(__dirname, 'public', 'logoM.svg'), 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>E-commerce Website Proposal - Lajwanti Uniform | MakerlyAI</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      line-height: 1.55;
      font-size: 13px;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      height: 297mm;
      padding: 24mm 22mm 20mm 22mm;
      position: relative;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      background: #ffffff;
      overflow: hidden;
    }

    /* Header & Footer on Inner Pages */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 20px;
    }
    .header-logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .header-logo svg {
      width: 26px;
      height: 26px;
    }
    .header-brand-name {
      font-weight: 800;
      font-size: 15px;
      color: #002166;
      letter-spacing: -0.02em;
    }
    .header-tag {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .page-footer {
      position: absolute;
      bottom: 12mm;
      left: 22mm;
      right: 22mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      font-size: 10px;
      color: #94a3b8;
      font-weight: 500;
    }
    .footer-highlight {
      color: #0065fb;
      font-weight: 700;
    }

    /* COVER PAGE */
    .cover-page {
      background: linear-gradient(135deg, #020b1e 0%, #061738 50%, #011232 100%);
      color: #ffffff;
      padding: 30mm 24mm 24mm 24mm;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .cover-bg-glow {
      position: absolute;
      top: -100px;
      right: -100px;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(0, 101, 251, 0.25) 0%, rgba(2, 11, 30, 0) 70%);
      pointer-events: none;
    }
    .cover-bg-glow-bottom {
      position: absolute;
      bottom: -150px;
      left: -100px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(1, 54, 148, 0.3) 0%, rgba(2, 11, 30, 0) 70%);
      pointer-events: none;
    }
    .cover-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 2;
    }
    .cover-logo-wrap {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .cover-logo-wrap svg {
      width: 48px;
      height: 48px;
      filter: drop-shadow(0 6px 16px rgba(0, 101, 251, 0.4));
    }
    .cover-brand-title {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.03em;
      color: #ffffff;
    }
    .cover-meta-badge {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      color: #38bdf8;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .cover-body {
      z-index: 2;
      margin-top: auto;
      margin-bottom: auto;
      padding-top: 30px;
      padding-bottom: 20px;
    }
    .cover-label {
      display: inline-block;
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: #0065fb;
      background: rgba(0, 101, 251, 0.15);
      padding: 6px 14px;
      border-radius: 8px;
      border: 1px solid rgba(0, 101, 251, 0.3);
      margin-bottom: 18px;
    }
    .cover-title {
      font-size: 38px;
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -0.03em;
      color: #ffffff;
      margin-bottom: 14px;
    }
    .cover-title span {
      background: linear-gradient(90deg, #38bdf8, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .cover-subtitle {
      font-size: 19px;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 24px;
    }
    .cover-subtitle strong {
      color: #f8fafc;
    }
    .cover-tagline-box {
      border-left: 3px solid #0065fb;
      padding: 14px 18px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 0 12px 12px 0;
      max-width: 580px;
    }
    .cover-tagline-text {
      font-size: 15px;
      font-weight: 600;
      color: #e2e8f0;
      font-style: italic;
      line-height: 1.5;
    }
    .cover-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      z-index: 2;
    }
    .cover-client-info p, .cover-author-info p {
      font-size: 11px;
      color: #94a3b8;
      margin-bottom: 3px;
    }
    .cover-client-info h4, .cover-author-info h4 {
      font-size: 15px;
      font-weight: 800;
      color: #ffffff;
    }

    /* TYPOGRAPHY & HEADINGS */
    .section-eyebrow {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #0065fb;
      margin-bottom: 4px;
    }
    .section-heading {
      font-size: 22px;
      font-weight: 900;
      color: #002166;
      letter-spacing: -0.03em;
      margin-bottom: 14px;
      line-height: 1.25;
    }
    .lead-paragraph {
      font-size: 13px;
      color: #475569;
      line-height: 1.65;
      margin-bottom: 18px;
    }

    /* CARDS & GRIDS */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
    }
    .card-accent {
      background: #ffffff;
      border: 1.5px solid #dbeafe;
      box-shadow: 0 4px 12px -2px rgba(0, 101, 251, 0.06);
    }
    .card-dark {
      background: #002166;
      color: #ffffff;
      border-radius: 14px;
      padding: 18px 20px;
    }

    .icon-box {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eff6ff;
      color: #0065fb;
      font-size: 17px;
      margin-bottom: 10px;
      font-weight: bold;
    }

    .feature-title {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 5px;
    }
    .feature-desc {
      font-size: 11.5px;
      color: #64748b;
      line-height: 1.5;
    }

    /* BADGES */
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 9px;
      border-radius: 6px;
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .badge-blue {
      background: #e0f2fe;
      color: #0369a1;
    }
    .badge-green {
      background: #dcfce7;
      color: #15803d;
    }
    .badge-amber {
      background: #fef3c7;
      color: #b45309;
    }

    /* TIMELINE STEPS */
    .steps-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 14px;
    }
    .step-num {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #002166;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      flex-shrink: 0;
    }
    .step-content h4 {
      font-size: 12.5px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .step-content p {
      font-size: 11.5px;
      color: #64748b;
      line-height: 1.45;
    }

    /* PRICING TABLE */
    .pricing-table-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 10px;
      margin-bottom: 16px;
    }
    .price-box {
      border-radius: 14px;
      padding: 20px;
      position: relative;
    }
    .price-box-primary {
      background: linear-gradient(180deg, #002166 0%, #01194e 100%);
      color: #ffffff;
      border: 1px solid #1e3a8a;
      box-shadow: 0 10px 25px -5px rgba(0, 33, 102, 0.3);
    }
    .price-box-secondary {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      color: #0f172a;
    }
    .price-tag-badge {
      position: absolute;
      top: -10px;
      right: 18px;
      background: #0065fb;
      color: #ffffff;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 4px 10px;
      border-radius: 9999px;
    }
    .price-amount {
      font-size: 30px;
      font-weight: 900;
      letter-spacing: -0.03em;
      margin: 8px 0 4px 0;
    }
    .price-period {
      font-size: 12px;
      font-weight: 600;
      opacity: 0.8;
    }
    .price-list {
      list-style: none;
      margin-top: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .price-list li {
      font-size: 11.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .price-list-primary li {
      color: #e2e8f0;
    }
    .price-list-secondary li {
      color: #475569;
    }
    .check-icon {
      color: #22c55e;
      font-weight: 900;
      font-size: 13px;
    }

    /* VALUE METRICS BANNER */
    .impact-banner {
      background: linear-gradient(90deg, #f0fdf4 0%, #dcfce7 100%);
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 14px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 14px;
    }
    .impact-item {
      text-align: center;
      flex: 1;
    }
    .impact-num {
      font-size: 18px;
      font-weight: 900;
      color: #166534;
      letter-spacing: -0.02em;
    }
    .impact-label {
      font-size: 10.5px;
      font-weight: 700;
      color: #15803d;
      text-transform: uppercase;
      margin-top: 2px;
    }

    /* NEXT STEPS LIST */
    .next-steps-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      margin-top: 10px;
    }
    .next-step-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 14px;
      text-align: center;
    }
    .next-step-number {
      width: 24px;
      height: 24px;
      background: #0065fb;
      color: #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      margin: 0 auto 8px auto;
    }

    /* FOUNDER CONTACT CARD */
    .contact-card {
      background: #ffffff;
      border: 2px solid #002166;
      border-radius: 14px;
      padding: 20px;
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 8px 24px -4px rgba(0, 33, 102, 0.08);
    }
    .contact-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #334155;
    }
    .contact-item strong {
      color: #0f172a;
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1: COVER PAGE ==================== -->
  <div class="page cover-page">
    <div class="cover-bg-glow"></div>
    <div class="cover-bg-glow-bottom"></div>

    <div class="cover-header">
      <div class="cover-logo-wrap">
        ${logoSvg}
        <div class="cover-brand-title">MakerlyAI</div>
      </div>
      <div class="cover-meta-badge">Commercial Quotation &bull; 2026</div>
    </div>

    <div class="cover-body">
      <div class="cover-label">Official Project Proposal</div>
      <h1 class="cover-title">
        E-commerce Website<br>
        <span>Proposal &amp; Strategy</span>
      </h1>
      <p class="cover-subtitle">
        Prepared exclusively for <strong>Lajwanti Uniform</strong>
      </p>

      <div class="cover-tagline-box">
        <p class="cover-tagline-text">
          &ldquo;We don’t just build websites, we build systems that generate sales.&rdquo;
        </p>
      </div>
    </div>

    <div class="cover-footer">
      <div class="cover-client-info">
        <p>PREPARED FOR</p>
        <h4>Lajwanti Uniform</h4>
        <p style="margin-top: 4px; color: #cbd5e1;">Target: School &amp; Workwear Digital Store</p>
      </div>
      <div class="cover-author-info" style="text-align: right;">
        <p>SUBMITTED BY</p>
        <h4>Tousif Raza</h4>
        <p style="margin-top: 4px; color: #cbd5e1;">Founder &amp; Technical Architect, MakerlyAI</p>
        <p style="color: #38bdf8; font-weight: 700;">MakerlyAI.in</p>
      </div>
    </div>
  </div>

  <!-- ==================== PAGE 2: ABOUT US & UNDERSTANDING BUSINESS ==================== -->
  <div class="page">
    <div class="page-header">
      <div class="header-logo">
        ${logoSvg}
        <span class="header-brand-name">MakerlyAI</span>
      </div>
      <span class="header-tag">Section 1 &bull; About Us &amp; Business Context</span>
    </div>

    <div>
      <div class="section-eyebrow">About MakerlyAI</div>
      <h2 class="section-heading">High-Conversion Digital Engineering &amp; Automation</h2>
      <p class="lead-paragraph">
        <strong>MakerlyAI</strong> is a premier software development studio founded by <strong>Tousif Raza</strong>. We specialize in building robust e-commerce platforms, customer automation, and business-first web engines. We believe a website shouldn't just be an online brochure—it must function as an automated 24/7 sales engine that saves time, simplifies order management, and directly increases commercial revenue.
      </p>

      <div class="grid-3" style="margin-bottom: 22px;">
        <div class="card card-accent">
          <div class="icon-box">⚡</div>
          <div class="feature-title">Fast Execution</div>
          <div class="feature-desc">Working prototypes within 7 to 10 days so your business starts receiving customer traction quickly without months of delay.</div>
        </div>
        <div class="card card-accent">
          <div class="icon-box">🎨</div>
          <div class="feature-title">Modern, Clean UI</div>
          <div class="feature-desc">Premium, clutter-free aesthetics tailored for Indian parents and institutional clients shopping on smartphones.</div>
        </div>
        <div class="card card-accent">
          <div class="icon-box">📈</div>
          <div class="feature-title">Sales-Driven Approach</div>
          <div class="feature-desc">Every button, product card, and 1-click WhatsApp order trigger is engineered to convert casual visitors into paying customers.</div>
        </div>
      </div>

      <div class="section-eyebrow" style="margin-top: 24px;">Understanding Your Business</div>
      <h2 class="section-heading">Lajwanti Uniform: Unlocking Modern Retail &amp; Bulk Orders</h2>
      <p class="lead-paragraph">
        <strong>Lajwanti Uniform</strong> is an established supplier of school uniforms, institutional attire, and workwear. Currently, uniform procurement often relies on manual inquiries, seasonal in-store crowding, phone calls, and localized word-of-mouth. Having a dedicated, modern e-commerce storefront transforms this experience for parents, schools, and corporate buyers.
      </p>

      <div class="grid-2">
        <div class="card" style="border-left: 4px solid #0065fb;">
          <div style="font-weight: 800; font-size: 13px; color: #002166; margin-bottom: 6px;">
            🛍️ Seamless Customer Browsing
          </div>
          <p class="feature-desc">
            Parents and school administrators can effortlessly filter uniforms by institution, grade, gender, and size from their phones without standing in long shop lines.
          </p>
        </div>

        <div class="card" style="border-left: 4px solid #22c55e;">
          <div style="font-weight: 800; font-size: 13px; color: #002166; margin-bottom: 6px;">
            🌐 Reach Beyond Local Physical Limits
          </div>
          <p class="feature-desc">
            Expand your market across town, neighboring cities, and regional institutions. Anyone searching for your school uniform sets will find you instantly on Google.
          </p>
        </div>

        <div class="card" style="border-left: 4px solid #f59e0b;">
          <div style="font-weight: 800; font-size: 13px; color: #002166; margin-bottom: 6px;">
            📲 24/7 Order &amp; Inquiry Intake
          </div>
          <p class="feature-desc">
            Collect orders day and night. Customers can pay online or initiate instant WhatsApp orders with full SKU details pre-filled directly into your chat.
          </p>
        </div>

        <div class="card" style="border-left: 4px solid #8b5cf6;">
          <div style="font-weight: 800; font-size: 13px; color: #002166; margin-bottom: 6px;">
            🛡️ Unmatched Brand Trust &amp; Authority
          </div>
          <p class="feature-desc">
            A fast, beautifully branded website instantly signals reliability and high quality when pitching to new schools, colleges, and corporate accounts.
          </p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>E-commerce Proposal &bull; Lajwanti Uniform</span>
      <span class="footer-highlight">MakerlyAI &bull; Confidential</span>
      <span>Page 2 of 5</span>
    </div>
  </div>

  <!-- ==================== PAGE 3: WHAT WE WILL BUILD (SCOPE) ==================== -->
  <div class="page">
    <div class="page-header">
      <div class="header-logo">
        ${logoSvg}
        <span class="header-brand-name">MakerlyAI</span>
      </div>
      <span class="header-tag">Section 2 &bull; Comprehensive Scope of Work</span>
    </div>

    <div>
      <div class="section-eyebrow">What We Will Build</div>
      <h2 class="section-heading">Complete E-commerce Engine (Built for Simplicity)</h2>
      <p class="lead-paragraph">
        We handle the complete technical architecture from start to finish. Everything is designed in non-technical, simple terms so your staff can run the store with zero coding experience.
      </p>

      <div class="grid-2" style="gap: 12px; margin-bottom: 16px;">
        
        <div class="card card-accent" style="padding: 14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
            <div class="feature-title" style="margin:0; font-size:13px; color:#002166;">1. High-Impact Homepage</div>
            <span class="badge badge-blue">Brand Showcase</span>
          </div>
          <p class="feature-desc">
            A modern, welcoming storefront showcasing school partners, trending uniforms, featured collections, quality assurances, and trust badges.
          </p>
        </div>

        <div class="card card-accent" style="padding: 14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
            <div class="feature-title" style="margin:0; font-size:13px; color:#002166;">2. Organized Product Catalog</div>
            <span class="badge badge-blue">Categorized</span>
          </div>
          <p class="feature-desc">
            Clean category trees: School Uniforms, Sports Wear, Accessories (Belts/Ties/Socks), Winter wear, and Corporate gear with instant filter and search.
          </p>
        </div>

        <div class="card card-accent" style="padding: 14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
            <div class="feature-title" style="margin:0; font-size:13px; color:#002166;">3. Product Detail &amp; Sizing Pages</div>
            <span class="badge badge-blue">Clarity</span>
          </div>
          <p class="feature-desc">
            Rich photo galleries, fabric specifications, interactive size selector chart (helps parents pick the exact fit), and stock availability indicators.
          </p>
        </div>

        <div class="card card-accent" style="padding: 14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
            <div class="feature-title" style="margin:0; font-size:13px; color:#002166;">4. Add-to-Cart &amp; Express Checkout</div>
            <span class="badge badge-blue">Frictionless</span>
          </div>
          <p class="feature-desc">
            Clean shopping bag summary where parents can buy multiple items (e.g. 2 shirts + 1 skirt + 1 tie) in one streamlined single-page order form.
          </p>
        </div>

        <div class="card card-accent" style="padding: 14px; border: 1.5px solid #bbf7d0; background: #f0fdf4;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
            <div class="feature-title" style="margin:0; font-size:13px; color:#166534;">5. WhatsApp 1-Click Order Intake</div>
            <span class="badge badge-green">High Conversion</span>
          </div>
          <p class="feature-desc" style="color: #14532d;">
            Direct WhatsApp checkout. Customers click one button, and an automated message with their selected items, sizes, and address is sent straight to your phone!
          </p>
        </div>

        <div class="card card-accent" style="padding: 14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
            <div class="feature-title" style="margin:0; font-size:13px; color:#002166;">6. Online Payment Gateway (Optional)</div>
            <span class="badge badge-amber">Secure</span>
          </div>
          <p class="feature-desc">
            Support for UPI, Google Pay, PhonePe, Paytm, Debit/Credit Cards, or Cash-on-Delivery (COD), depositing funds directly into your bank account.
          </p>
        </div>

        <div class="card card-accent" style="padding: 14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
            <div class="feature-title" style="margin:0; font-size:13px; color:#002166;">7. 100% Mobile-First Responsive</div>
            <span class="badge badge-blue">Smartphone Optimized</span>
          </div>
          <p class="feature-desc">
            Over 85% of shoppers use smartphones. Your store will load in under 2 seconds on 4G/5G networks across iPhone and Android devices.
          </p>
        </div>

        <div class="card card-accent" style="padding: 14px; border: 1.5px solid #e0e7ff; background: #f5f7ff;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
            <div class="feature-title" style="margin:0; font-size:13px; color:#3730a3;">8. Simple Business Admin Dashboard</div>
            <span class="badge badge-blue">Zero Code</span>
          </div>
          <p class="feature-desc" style="color: #312e81;">
            A user-friendly control panel where you or your staff can add new products, update prices, upload photos, and track incoming orders in 2 clicks.
          </p>
        </div>

      </div>

      <div class="card-dark" style="margin-top: 10px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:22px;">💡</span>
          <div>
            <div style="font-size:12.5px; font-weight:800; color:#38bdf8; margin-bottom:2px;">Special Advantage: The WhatsApp Hybrid Ordering System</div>
            <p style="font-size:11px; color:#cbd5e1; line-height:1.5;">
              In India, many parents prefer ordering or confirming questions on WhatsApp before paying. Our hybrid architecture gives them both: direct online checkout OR immediate 1-click WhatsApp order confirmation.
            </p>
          </div>
        </div>
      </div>

    </div>

    <div class="page-footer">
      <span>E-commerce Proposal &bull; Lajwanti Uniform</span>
      <span class="footer-highlight">MakerlyAI &bull; Confidential</span>
      <span>Page 3 of 5</span>
    </div>
  </div>

  <!-- ==================== PAGE 4: PROCESS & TIMELINE ==================== -->
  <div class="page">
    <div class="page-header">
      <div class="header-logo">
        ${logoSvg}
        <span class="header-brand-name">MakerlyAI</span>
      </div>
      <span class="header-tag">Section 3 &bull; Execution Roadmap &amp; Schedule</span>
    </div>

    <div>
      <div class="section-eyebrow">Our Proven 6-Step Workflow</div>
      <h2 class="section-heading">How Everything Will Work (Step-by-Step)</h2>
      <p class="lead-paragraph">
        We make the entire journey effortless for you. You don't need any technical knowledge—we guide you through every step with total transparency.
      </p>

      <div class="steps-container">
        
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-content">
            <h4>Requirement &amp; Catalog Discussion</h4>
            <p>We review your product list, uniform categories (which schools/workplaces), pricing structure, size variations, and brand color preferences.</p>
          </div>
        </div>

        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-content">
            <h4>Design &amp; Storefront Layout Setup</h4>
            <p>We construct a polished, modern visual layout tailored specifically for Lajwanti Uniform, ensuring your logo, banners, and categories look clean and attractive.</p>
          </div>
        </div>

        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-content">
            <h4>Development &amp; Product Integration</h4>
            <p>We program the e-commerce functionality, upload your initial products, connect the shopping cart, and configure the automated WhatsApp order bridge.</p>
          </div>
        </div>

        <div class="step-item">
          <div class="step-num">4</div>
          <div class="step-content">
            <h4>Rigorous Quality &amp; Device Testing</h4>
            <p>We test every page across multiple Android and Apple devices, simulate test orders, check loading speed, and ensure size selectors work without glitch.</p>
          </div>
        </div>

        <div class="step-item">
          <div class="step-num">5</div>
          <div class="step-content">
            <h4>Official Deployment &amp; Going Live</h4>
            <p>We link your custom domain (e.g. lajwantiuniform.com), connect security SSL certificates, submit your store to Google Search, and launch live.</p>
          </div>
        </div>

        <div class="step-item">
          <div class="step-num">6</div>
          <div class="step-content">
            <h4>Continuous Support &amp; Maintenance</h4>
            <p>Our commitment doesn't stop at launch. We provide ongoing maintenance, price edits, technical monitoring, and phone/WhatsApp support.</p>
          </div>
        </div>

      </div>

      <div class="section-eyebrow" style="margin-top: 22px;">Timeline &amp; Delivery Milestones</div>
      <h2 class="section-heading" style="margin-bottom: 10px;">Clear, Predictable Delivery Schedule</h2>

      <div class="grid-2">
        <div class="card card-accent" style="border-left: 4px solid #0065fb;">
          <div style="font-size: 11px; font-weight: 800; color: #0065fb; text-transform: uppercase;">Milestone 1 &bull; 7 to 10 Days</div>
          <h4 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 4px 0;">Initial Working Website Ready</h4>
          <p class="feature-desc">You receive a private interactive preview link to review your homepage, catalog structure, and sample products directly on your mobile.</p>
        </div>

        <div class="card card-accent" style="border-left: 4px solid #22c55e;">
          <div style="font-size: 11px; font-weight: 800; color: #16a34a; text-transform: uppercase;">Milestone 2 &bull; Within 3 Weeks</div>
          <h4 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 4px 0;">Full Optimization &amp; Live Launch</h4>
          <p class="feature-desc">Complete product catalog populated, order notifications verified, payment gateway activated (if desired), and live public launch.</p>
        </div>
      </div>

    </div>

    <div class="page-footer">
      <span>E-commerce Proposal &bull; Lajwanti Uniform</span>
      <span class="footer-highlight">MakerlyAI &bull; Confidential</span>
      <span>Page 4 of 5</span>
    </div>
  </div>

  <!-- ==================== PAGE 5: PRICING, VALUE & SIGN-OFF ==================== -->
  <div class="page">
    <div class="page-header">
      <div class="header-logo">
        ${logoSvg}
        <span class="header-brand-name">MakerlyAI</span>
      </div>
      <span class="header-tag">Section 4 &bull; Investment, ROI &amp; Next Steps</span>
    </div>

    <div>
      <div class="section-eyebrow">Clear &amp; Transparent Investment</div>
      <h2 class="section-heading">Affordable, High-Value Commercial Pricing</h2>
      <p class="lead-paragraph" style="margin-bottom: 12px;">
        Zero hidden charges. Transparent upfront terms designed specifically for growing retail and manufacturing businesses.
      </p>

      <div class="pricing-table-container">
        
        <!-- SETUP BOX -->
        <div class="price-box price-box-primary">
          <div class="price-tag-badge">One-Time Setup</div>
          <div style="font-size: 13px; font-weight: 700; color: #93c5fd;">Initial Store Build &amp; Launch</div>
          <div class="price-amount">₹25,000</div>
          <div class="price-period">One-time complete investment</div>

          <ul class="price-list price-list-primary">
            <li><span class="check-icon">&#10003;</span> Complete custom e-commerce website</li>
            <li><span class="check-icon">&#10003;</span> Initial product catalog &amp; size charts setup</li>
            <li><span class="check-icon">&#10003;</span> WhatsApp 1-click ordering integration</li>
            <li><span class="check-icon">&#10003;</span> Payment gateway integration (if required)</li>
            <li><span class="check-icon">&#10003;</span> Mobile-first responsive optimization</li>
            <li><span class="check-icon">&#10003;</span> Basic SEO setup for Google search discovery</li>
            <li><span class="check-icon">&#10003;</span> Easy-to-use admin product dashboard</li>
          </ul>
        </div>

        <!-- MAINTENANCE BOX -->
        <div class="price-box price-box-secondary">
          <div style="font-size: 13px; font-weight: 700; color: #002166;">Ongoing Support &amp; Care</div>
          <div class="price-amount" style="color: #002166;">₹3,000<span style="font-size:15px; font-weight:600; color:#64748b;">/month</span></div>
          <div class="price-period" style="color: #64748b;">Ensures zero downtime &amp; smooth operation</div>

          <ul class="price-list price-list-secondary">
            <li><span class="check-icon">&#10003;</span> Bug fixes &amp; technical health monitoring</li>
            <li><span class="check-icon">&#10003;</span> Minor content edits (prices, images, banners)</li>
            <li><span class="check-icon">&#10003;</span> Website speed and uptime monitoring</li>
            <li><span class="check-icon">&#10003;</span> Security updates &amp; SSL renewals</li>
            <li><span class="check-icon">&#10003;</span> Priority WhatsApp &amp; Phone support</li>
            <li><span class="check-icon">&#10003;</span> Monthly performance overview</li>
          </ul>
          <p style="margin-top:14px; font-size:10px; color:#94a3b8; line-height:1.4;">
            *Note: Major custom modules or complex brand-new features requested later are estimated separately based on requirements.
          </p>
        </div>

      </div>

      <!-- EXPECTED BUSINESS IMPACT -->
      <div class="impact-banner">
        <div class="impact-item">
          <div class="impact-num">100%</div>
          <div class="impact-label">Mobile Friendly</div>
        </div>
        <div style="width:1px; height:24px; background:#86efac;"></div>
        <div class="impact-item">
          <div class="impact-num">&lt; 2s</div>
          <div class="impact-label">Fast Page Load</div>
        </div>
        <div style="width:1px; height:24px; background:#86efac;"></div>
        <div class="impact-item">
          <div class="impact-num">24 / 7</div>
          <div class="impact-label">Order Intake</div>
        </div>
        <div style="width:1px; height:24px; background:#86efac;"></div>
        <div class="impact-item">
          <div class="impact-num">Direct</div>
          <div class="impact-label">WhatsApp Channel</div>
        </div>
      </div>

      <!-- NEXT STEPS -->
      <div style="margin-top: 18px;">
        <div class="section-eyebrow">Ready to Launch?</div>
        <div class="feature-title" style="font-size:13px; margin-bottom:8px;">Simple 3-Step Project Kickoff:</div>
        
        <div class="next-steps-grid">
          <div class="next-step-card">
            <div class="next-step-number">1</div>
            <div style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:2px;">Confirm Project</div>
            <div style="font-size:11px; color:#64748b;">Sign/confirm proposal &amp; approve milestone kickoff.</div>
          </div>
          <div class="next-step-card">
            <div class="next-step-number">2</div>
            <div style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:2px;">Share Catalog</div>
            <div style="font-size:11px; color:#64748b;">Send product photos, sizes, and pricing list.</div>
          </div>
          <div class="next-step-card">
            <div class="next-step-number">3</div>
            <div style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:2px;">We Build &amp; Deliver</div>
            <div style="font-size:11px; color:#64748b;">Initial preview ready in 7–10 days!</div>
          </div>
        </div>
      </div>

      <!-- FOUNDER CONTACT CARD -->
      <div class="contact-card">
        <div>
          <div style="font-size:11px; font-weight:800; color:#0065fb; text-transform:uppercase; margin-bottom:2px;">Direct Point of Contact</div>
          <div style="font-size:17px; font-weight:900; color:#002166;">Tousif Raza</div>
          <div style="font-size:11.5px; font-weight:600; color:#64748b;">Founder &amp; Technical Architect &bull; MakerlyAI</div>
        </div>
        <div class="contact-details">
          <div class="contact-item">
            <span>📞</span> <span><strong>Phone / WhatsApp:</strong> +91 81023 08736</span>
          </div>
          <div class="contact-item">
            <span>✉️</span> <span><strong>Email:</strong> tousif@makerlyai.in &bull; hello@makerlyai.in</span>
          </div>
          <div class="contact-item">
            <span>🌐</span> <span><strong>Website:</strong> MakerlyAI.in</span>
          </div>
        </div>
      </div>

    </div>

    <div class="page-footer">
      <span>E-commerce Proposal &bull; Lajwanti Uniform</span>
      <span class="footer-highlight">MakerlyAI &bull; Confidential</span>
      <span>Page 5 of 5</span>
    </div>
  </div>

</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'proposal_template.html'), htmlContent);

async function generatePDF() {
  console.log('Launching browser to render PDF...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfPath = path.join(__dirname, 'MakerlyAI_Proposal_Lajwanti_Uniform.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });

  await browser.close();
  console.log('PDF Generated Successfully at:', pdfPath);
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
