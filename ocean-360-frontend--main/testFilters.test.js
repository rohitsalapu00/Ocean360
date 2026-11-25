// testFilters.test.js
// Jest test for Stage 7 filters (uses Babel to transpile JSX)

import fs from 'fs';
import path from 'path';
import normalizeCase from './src/normalizeCase.js';
import { DEFAULT_STAGE7_FILTERS, DEFAULT_STAGE7_WEIGHTS } from './src/components/SuspectFilterPanel.jsx';

// Load a sample case (adjust path as needed)
const casePath = path.join(__dirname, 'input', 'case_a1.json');
const rawCase = JSON.parse(fs.readFileSync(casePath, 'utf8'));
const caseData = normalizeCase(rawCase);

function applyFilters(caseData, filters = DEFAULT_STAGE7_FILTERS, weights = DEFAULT_STAGE7_WEIGHTS) {
  if (!caseData?.suspects) return [];
  // filter logic (same as original script)
  let list = caseData.suspects.filter(s => {
    if (s.distance_km != null && s.distance_km > filters.maxDistanceKm) return false;
    if (s.dwell_time_mins != null && s.dwell_time_mins < filters.minDwellMins) return false;
    if (s.avg_speed_knots != null && s.avg_speed_knots > filters.maxSpeedKnots) return false;
    if (filters.shipTypes && filters.shipTypes.length > 0) {
      const typeLower = (s.type || '').toLowerCase();
      const matched = filters.shipTypes.some(selected => {
        const sel = selected.toLowerCase();
        if (sel.includes('oil')) return typeLower.includes('oil') || (typeLower.includes('tanker') && !typeLower.includes('product'));
        if (sel.includes('product')) return typeLower.includes('product') || typeLower.includes('chemical');
        if (sel.includes('cargo')) return typeLower.includes('cargo') || typeLower.includes('carrier') || typeLower.includes('container') || typeLower.includes('bulk');
        if (sel.includes('other')) return !['tanker','cargo','carrier','container'].some(w => typeLower.includes(w));
        return typeLower.includes(sel);
      });
      if (!matched) return false;
    }
    if (filters.timeBand && filters.timeBand !== 'all') {
      const offset = s.time_offset_hours;
      if (offset != null) {
        if (filters.timeBand === 'around' && Math.abs(offset) > 2) return false;
        if (filters.timeBand === 'before' && offset >= 0) return false;
        if (filters.timeBand === 'after' && offset <= 0) return false;
      }
    }
    return true;
  });

  const w = weights;
  const totalWeight = (w.proximity + w.dwell + w.speed + w.path + w.shipType) || 1;
  list = list.map(s => {
    const distScore = Math.max(0, 100 - (s.distance_km || 0) * (100 / Math.max(filters.maxDistanceKm, 1)));
    const dwellScore = Math.min(100, (s.dwell_time_mins || 0) * (100 / 60));
    const speedScore = Math.max(0, 100 - Math.abs((s.avg_speed_knots || 10) - 10) * 8);
    const pathScore = (s.track && s.track.length > 0) ? Math.min(100, s.track.length * 15 + 40) : 50;
    const typeLower = (s.type || '').toLowerCase();
    let typeScore = 40;
    if (typeLower.includes('oil') || typeLower.includes('crude')) typeScore = 100;
    else if (typeLower.includes('tanker') || typeLower.includes('chemical')) typeScore = 85;
    else if (typeLower.includes('cargo') || typeLower.includes('carrier')) typeScore = 65;
    const dynamicScore = (
      distScore * w.proximity +
      dwellScore * w.dwell +
      speedScore * w.speed +
      pathScore * w.path +
      typeScore * w.shipType
    ) / totalWeight;
    const finalScore = s.pipeline_score != null ? (s.pipeline_score * 0.4) + (dynamicScore * 0.6) : dynamicScore;
    return { ...s, score: Math.min(100, Math.max(0, finalScore)) };
  });

  list.sort((a, b) => {
    switch (filters.sortBy) {
      case 'dist_asc': return (a.distance_km ?? 999) - (b.distance_km ?? 999);
      case 'dwell_desc': return (b.dwell_time_mins ?? 0) - (a.dwell_time_mins ?? 0);
      case 'speed_desc': return (b.avg_speed_knots ?? 0) - (a.avg_speed_knots ?? 0);
      case 'score_desc':
      default: return b.score - a.score;
    }
  });

  if (filters.topN && filters.topN < 999) list = list.slice(0, filters.topN);
  return list;
}

describe('Stage 7 filter suite', () => {
  test('Default filters produce a non‑empty list', () => {
    const result = applyFilters(caseData);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test('Max distance 10 km reduces results', () => {
    const result = applyFilters(caseData, { ...DEFAULT_STAGE7_FILTERS, maxDistanceKm: 10 });
    expect(result.length).toBeLessThanOrEqual(applyFilters(caseData).length);
  });

  test('Ship type filter works for Oil Tanker', () => {
    const result = applyFilters(caseData, { ...DEFAULT_STAGE7_FILTERS, shipTypes: ['Oil Tanker'] });
    expect(result.every(s => {
      const t = (s.type || '').toLowerCase();
      return t.includes('oil') || (t.includes('tanker') && !t.includes('product'));
    })).toBe(true);
  });
});
