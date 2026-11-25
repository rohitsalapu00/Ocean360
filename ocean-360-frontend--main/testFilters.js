// testFilters.js
// Script to programmatically test Stage 7 filter logic.

const fs = require('fs');
const path = require('path');

// Import project modules
const normalizeCase = require('./src/normalizeCase');
const { DEFAULT_STAGE7_FILTERS, DEFAULT_STAGE7_WEIGHTS } = require('./src/components/SuspectFilterPanel');

// Load a sample case (case_a1.json) from input folder
const casePath = path.join(__dirname, 'input', 'case_a1.json');
const rawCase = JSON.parse(fs.readFileSync(casePath, 'utf8'));
const caseData = normalizeCase(rawCase);

function applyFilters(caseData, filters = DEFAULT_STAGE7_FILTERS, weights = DEFAULT_STAGE7_WEIGHTS) {
  if (!caseData?.suspects) return [];
  let list = caseData.suspects.filter(s => {
    if (s.distance_km != null && s.distance_km > filters.maxDistanceKm) return false;
    if (s.dwell_time_mins != null && s.dwell_time_mins < filters.minDwellMins) return false;
    if (s.avg_speed_knots != null && s.avg_speed_knots > filters.maxSpeedKnots) return false;
    // Ship type filter
    if (filters.shipTypes && filters.shipTypes.length > 0) {
      const typeLower = (s.type || '').toLowerCase();
      const matched = filters.shipTypes.some(selected => {
        const sel = selected.toLowerCase();
        if (sel.includes('oil')) return typeLower.includes('oil') || (typeLower.includes('tanker') && !typeLower.includes('product'));
        if (sel.includes('product')) return typeLower.includes('product') || typeLower.includes('chemical');
        if (sel.includes('cargo')) return typeLower.includes('cargo') || typeLower.includes('carrier') || typeLower.includes('container') || typeLower.includes('bulk');
        if (sel.includes('other')) return !['tanker','cargo','carrier','container'].some(word => typeLower.includes(word));
        return typeLower.includes(sel);
      });
      if (!matched) return false;
    }
    // Time band filter
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

  // Compute dynamic scores using weights
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

  // Sorting
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

function logTest(name, filters) {
  const result = applyFilters(caseData, filters);
  console.log(`${name}: ${result.length} suspects (IDs: ${result.map(s => s.mmsi).join(', ')})`);
}

// Run a suite of tests
logTest('Default filters', DEFAULT_STAGE7_FILTERS);
logTest('Max Distance 10km', { ...DEFAULT_STAGE7_FILTERS, maxDistanceKm: 10 });
logTest('Min Dwell 20min', { ...DEFAULT_STAGE7_FILTERS, minDwellMins: 20 });
logTest('Max Speed 12kn', { ...DEFAULT_STAGE7_FILTERS, maxSpeedKnots: 12 });
logTest('Ship Type Oil Tanker', { ...DEFAULT_STAGE7_FILTERS, shipTypes: ['Oil Tanker'] });
logTest('Ship Type Cargo', { ...DEFAULT_STAGE7_FILTERS, shipTypes: ['Cargo'] });
logTest('Ship Type cleared (All)', { ...DEFAULT_STAGE7_FILTERS, shipTypes: [] });
logTest('TimeBand around ±2h', { ...DEFAULT_STAGE7_FILTERS, timeBand: 'around' });
logTest('Top 5 candidates', { ...DEFAULT_STAGE7_FILTERS, topN: 5 });
logTest('Sort by Distance', { ...DEFAULT_STAGE7_FILTERS, sortBy: 'dist_asc' });
logTest('Sort by Dwell', { ...DEFAULT_STAGE7_FILTERS, sortBy: 'dwell_desc' });
logTest('Sort by Speed', { ...DEFAULT_STAGE7_FILTERS, sortBy: 'speed_desc' });
logTest('Reset (default)', DEFAULT_STAGE7_FILTERS);
