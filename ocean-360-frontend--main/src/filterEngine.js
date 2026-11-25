/**
 * filterEngine.js
 *
 * Centralized filtering and multi-criteria scoring engine for Ocean 360.
 * All components (Map, Suspect Panel, Analytics, Rankings) consume the results
 * of this pipeline to guarantee a single source of truth.
 */

export const DEFAULT_STAGE7_FILTERS = {
  maxDistanceKm: 100, // Permissive default to avoid hiding vessels in custom cases
  minDwellMins: 0,
  maxSpeedKnots: 50, // Permissive default
  shipTypes: [], // empty = all categories; ['Oil Tanker', 'Product Tanker', 'Cargo', 'Other']
  timeWindow: 'all', // 'all' | '1h' | '3h' | '6h' | '12h' | '24h'
  topN: 50, // 5 | 10 | 20 | 50 | 999
  sortBy: 'score_desc' // 'score_desc' | 'score_asc' | 'dist_asc' | 'dist_desc' | 'dwell_desc' | 'dwell_asc' | 'speed_desc' | 'speed_asc' | 'time_asc' | 'time_desc'
};

export const DEFAULT_STAGE7_WEIGHTS = {
  pipelineScore: 30, // Trajectory / Pipeline Score
  distance: 25,      // Proximity / Distance
  dwell: 20,         // Dwell Duration
  speed: 15,         // Vessel Speed
  timeMatch: 10      // Time Compatibility
};

/**
 * Calculates dynamic multi-criteria attribution score for a candidate
 */
export function calculateAttributionScore(candidate, weights, maxRefDistance = 30) {
  const w = weights || DEFAULT_STAGE7_WEIGHTS;
  const totalWeight =
    (Number(w.pipelineScore) || 0) +
    (Number(w.distance) || 0) +
    (Number(w.dwell) || 0) +
    (Number(w.speed) || 0) +
    (Number(w.timeMatch) || 0) || 100;

  const wPipeline = (Number(w.pipelineScore) || 0) / totalWeight;
  const wDist = (Number(w.distance) || 0) / totalWeight;
  const wDwell = (Number(w.dwell) || 0) / totalWeight;
  const wSpeed = (Number(w.speed) || 0) / totalWeight;
  const wTime = (Number(w.timeMatch) || 0) / totalWeight;

  // 1. Pipeline / Trajectory Factor (0..100)
  const pipelineFactor = candidate.backend_score ?? candidate.pipeline_score ?? 50;

  // 2. Distance Factor: Closer distance to spill origin receives higher score
  let distanceFactor = 50;
  if (candidate.distance_km != null) {
    const refDist = Math.max(Number(maxRefDistance) || 30, 5);
    distanceFactor = Math.max(0, 100 - (candidate.distance_km / refDist) * 100);
  }

  // 3. Dwell Factor: Longer dwell time near origin receives higher score (up to 60 mins)
  let dwellFactor = 50;
  if (candidate.dwell_time_mins != null) {
    dwellFactor = Math.min(100, (candidate.dwell_time_mins / 60) * 100);
  }

  // 4. Speed Factor: Slowdown or optimal discharge speed (~8-12 kn) near slick
  let speedFactor = 50;
  if (candidate.avg_speed_knots != null) {
    speedFactor = Math.max(0, 100 - Math.abs(candidate.avg_speed_knots - 10) * 8);
  }

  // 5. Time Match Factor: Smaller absolute time offset receives higher score
  let timeMatchFactor = 50;
  if (candidate.time_offset_hours != null) {
    timeMatchFactor = Math.max(0, 100 - Math.abs(candidate.time_offset_hours) * 15);
  }

  const score =
    pipelineFactor * wPipeline +
    distanceFactor * wDist +
    dwellFactor * wDwell +
    speedFactor * wSpeed +
    timeMatchFactor * wTime;

  return Number(Math.min(100, Math.max(0, score)).toFixed(1));
}

/**
 * Executes the full Stage 7 Filter & Scoring Pipeline:
 * Raw candidates
 *   → Distance filter
 *   → Dwell filter
 *   → Speed filter
 *   → Ship type filter
 *   → Time window filter
 *   → Score calculation
 *   → Sorting
 *   → Top N
 *   → Final candidates
 *
 * Returns:
 * {
 *   filteredCandidates: [...],
 *   allCandidates: [...], // scored and sorted for "All Candidates" analytics
 *   filterImpact: { raw, afterDistance, afterDwell, afterSpeed, afterType, afterTime, final }
 * }
 */
export function runFilterPipeline(rawCandidates = [], filters = DEFAULT_STAGE7_FILTERS, weights = DEFAULT_STAGE7_WEIGHTS) {
  if (!Array.isArray(rawCandidates) || rawCandidates.length === 0) {
    return {
      filteredCandidates: [],
      allCandidates: [],
      filterImpact: {
        raw: 0,
        afterDistance: 0,
        afterDwell: 0,
        afterSpeed: 0,
        afterType: 0,
        afterTime: 0,
        final: 0
      }
    };
  }

  const rawCount = rawCandidates.length;

  // 1. Distance Filter
  const maxDist = filters.maxDistanceKm != null ? Number(filters.maxDistanceKm) : 100;
  const afterDistance = rawCandidates.filter(c => {
    if (c.distance_km == null || isNaN(Number(c.distance_km))) return true;
    return Number(c.distance_km) <= maxDist;
  });
  const afterDistanceCount = afterDistance.length;

  // 2. Dwell Filter
  const minDwell = filters.minDwellMins != null ? Number(filters.minDwellMins) : 0;
  const afterDwell = afterDistance.filter(c => {
    if (c.dwell_time_mins == null || isNaN(Number(c.dwell_time_mins))) return true;
    return Number(c.dwell_time_mins) >= minDwell;
  });
  const afterDwellCount = afterDwell.length;

  // 3. Speed Filter
  const maxSpd = filters.maxSpeedKnots != null ? Number(filters.maxSpeedKnots) : 50;
  const afterSpeed = afterDwell.filter(c => {
    if (c.avg_speed_knots == null || isNaN(Number(c.avg_speed_knots))) return true;
    return Number(c.avg_speed_knots) <= maxSpd;
  });
  const afterSpeedCount = afterSpeed.length;

  // 4. Ship Type Filter (categories: Oil Tanker, Product Tanker, Cargo, Other)
  const activeTypes = Array.isArray(filters.shipTypes) ? filters.shipTypes : [];
  const afterType = afterSpeed.filter(c => {
    if (activeTypes.length === 0) return true;
    return activeTypes.includes(c.category);
  });
  const afterTypeCount = afterType.length;

  // 5. Time Window Filter
  const afterTime = afterType.filter(c => {
    if (!filters.timeWindow || filters.timeWindow === 'all') return true;
    if (c.time_offset_hours == null) return true;

    let maxHours = 999;
    if (filters.timeWindow === '1h') maxHours = 1;
    else if (filters.timeWindow === '3h') maxHours = 3;
    else if (filters.timeWindow === '6h') maxHours = 6;
    else if (filters.timeWindow === '12h') maxHours = 12;
    else if (filters.timeWindow === '24h') maxHours = 24;

    return Math.abs(c.time_offset_hours) <= maxHours;
  });
  const afterTimeCount = afterTime.length;

  // 6. Score Calculation Function
  const scoreCandidate = (c) => {
    const calcScore = calculateAttributionScore(c, weights, filters.maxDistanceKm);
    return {
      ...c,
      calculated_score: calcScore,
      score: calcScore // Single unified score field for display and sorting
    };
  };

  // Helper for Numerical Sorting
  const sortCandidates = (list) => {
    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (filters.sortBy) {
        case 'score_asc':
          return (a.score ?? 0) - (b.score ?? 0);
        case 'dist_asc':
          return (a.distance_km ?? 9999) - (b.distance_km ?? 9999);
        case 'dist_desc':
          return (b.distance_km ?? -1) - (a.distance_km ?? -1);
        case 'dwell_desc':
          return (b.dwell_time_mins ?? -1) - (a.dwell_time_mins ?? -1);
        case 'dwell_asc':
          return (a.dwell_time_mins ?? 9999) - (b.dwell_time_mins ?? 9999);
        case 'speed_desc':
          return (b.avg_speed_knots ?? -1) - (a.avg_speed_knots ?? -1);
        case 'speed_asc':
          return (a.avg_speed_knots ?? 9999) - (b.avg_speed_knots ?? 9999);
        case 'time_asc':
          return (a.time_offset_hours ?? 9999) - (b.time_offset_hours ?? 9999);
        case 'time_desc':
          return (b.time_offset_hours ?? -9999) - (a.time_offset_hours ?? -9999);
        case 'score_desc':
        default:
          return (b.score ?? 0) - (a.score ?? 0);
      }
    });

    // Re-assign ranks based on current sort order
    return sorted.map((c, idx) => ({
      ...c,
      rank: idx + 1
    }));
  };

  // Score and sort all candidates (for "All Candidates" dataset toggle in Analytics)
  const allCandidatesScored = sortCandidates(rawCandidates.map(scoreCandidate));

  // Score and sort filtered candidates
  const scoredFiltered = sortCandidates(afterTime.map(scoreCandidate));

  // 7. Top N Slicing
  const topLimit = Number(filters.topN) || 999;
  const finalCandidates = topLimit < 999 ? scoredFiltered.slice(0, topLimit) : scoredFiltered;

  return {
    filteredCandidates: finalCandidates,
    allCandidates: allCandidatesScored,
    filterImpact: {
      raw: rawCount,
      afterDistance: afterDistanceCount,
      afterDwell: afterDwellCount,
      afterSpeed: afterSpeedCount,
      afterType: afterTypeCount,
      afterTime: afterTimeCount,
      final: finalCandidates.length
    }
  };
}
