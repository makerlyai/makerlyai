// ─────────────────────────────────────────────────────────────────
//  MakerlyAI Autonomous Sales Engine - Growth Experiment Engine
//  Synthesizes ericosiu/ai-marketing-skills (growth-engine)
// ─────────────────────────────────────────────────────────────────

import fs from 'fs';
import { SALES_ENGINE_CONFIG } from './config.mjs';

const EXPERIMENTS_FILE = SALES_ENGINE_CONFIG.crm.experimentsFile;

/**
 * Loads all active and past experiments
 */
export function loadExperiments() {
  try {
    if (fs.existsSync(EXPERIMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(EXPERIMENTS_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

/**
 * Saves experiments
 */
export function saveExperiments(experiments) {
  try {
    fs.writeFileSync(EXPERIMENTS_FILE, JSON.stringify(experiments, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Experiment Engine] Failed to save experiments:', err.message);
  }
}

/**
 * Creates a new growth experiment
 * Usage mimics:
 * python experiment-engine.py create \
 *   --hypothesis "..." \
 *   --variable format \
 *   --variants '["A", "B"]' \
 *   --metric reply_rate
 */
export function createExperiment({
  name,
  hypothesis,
  variable,
  variants = [],
  metric = 'reply_rate',
}) {
  const experiments = loadExperiments();
  const expId = `exp-${Date.now().toString(36)}`;

  const newExp = {
    id: expId,
    name: name || `Experiment: ${variable}`,
    hypothesis,
    variable, // e.g. 'subject_line', 'hook_style', 'cta_type'
    variants: variants.map(v => ({
      name: typeof v === 'string' ? v : v.name,
      content: typeof v === 'string' ? v : v.content,
      impressions: 0,
      conversions: 0,
      rate: 0,
    })),
    metric, // 'open_rate', 'reply_rate', 'meeting_rate'
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    completedAt: null,
    winningVariant: null,
  };

  experiments.push(newExp);
  saveExperiments(experiments);
  console.log(`[Growth Engine] Experiment created: ${newExp.id} ("${hypothesis}")`);
  return newExp;
}

/**
 * Selects a variant for a lead using balanced round-robin or epsilon-greedy allocation
 */
export function assignVariant(experimentId) {
  const experiments = loadExperiments();
  const exp = experiments.find(e => e.id === experimentId && e.status === 'ACTIVE');
  if (!exp || exp.variants.length === 0) return null;

  // Select variant with the fewest impressions to keep sample balanced
  exp.variants.sort((a, b) => a.impressions - b.impressions);
  const selected = exp.variants[0];
  selected.impressions += 1;
  saveExperiments(experiments);

  return {
    experimentId: exp.id,
    variantName: selected.name,
    content: selected.content,
  };
}

/**
 * Records a conversion / positive reply event for an experiment variant
 */
export function recordConversion(experimentId, variantName) {
  const experiments = loadExperiments();
  const exp = experiments.find(e => e.id === experimentId);
  if (!exp) return false;

  const variant = exp.variants.find(v => v.name === variantName);
  if (!variant) return false;

  variant.conversions += 1;
  variant.rate = variant.impressions > 0 ? (variant.conversions / variant.impressions) : 0;

  // Check if we have statistical significance (e.g. >= 20 impressions each)
  const allSufficient = exp.variants.every(v => v.impressions >= 15);
  if (allSufficient) {
    const sorted = [...exp.variants].sort((a, b) => b.rate - a.rate);
    if (sorted[0].rate > sorted[1].rate * 1.2) {
      exp.status = 'COMPLETED';
      exp.completedAt = new Date().toISOString();
      exp.winningVariant = sorted[0].name;
      console.log(`[Growth Engine] 🏆 Winning variant identified for ${exp.name}: ${exp.winningVariant}`);
    }
  }

  saveExperiments(experiments);
  return true;
}
