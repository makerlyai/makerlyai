import fs from 'fs';
import { renderCareerEmailHtml } from './career-email-template.mjs';

const sampleText = `Hi Salman,

Thank you for reaching out and sharing your impressive background. We've taken note of your interest in an AI Engineer role and the work you've done on corrective-RAG pipelines, multi-agent systems with LangGraph, and your research experience at Samsung PRISM. Your hands-on experience with PyTorch, FastAPI, and production-grade AI architectures is exactly the kind of talent we value.

At the moment, MakerlyAI is keeping our core engineering team compact and isn't actively onboarding new positions. That said, we genuinely appreciate the initiative you've shown and will retain your profile and portfolio in our active talent pipeline. Should a project or expansion arise that aligns with your skill set, we'll be sure to reach out directly.

Keep pushing forward with FinRAG, SectorLens, and your ongoing research — the AI community needs innovators like you. Wishing you continued success in your studies and projects.

Warm regards,
Team MakerlyAI`;

const html = renderCareerEmailHtml({
  candidateName: 'Salman',
  replyText: sampleText,
});

fs.writeFileSync('preview_career_email.html', html, 'utf8');
console.log('✅ Generated preview_career_email.html successfully!');
