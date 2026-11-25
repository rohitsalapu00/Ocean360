/**
 * normalizeCase.js
 *
 * Centralized data normalization layer between raw backend case JSON and the frontend UI.
 * Single source of truth for handling various backend schema versions, property aliases,
 * coordinate formats, and unit conversions.
 *
 * Exports:
 *   - normalizeCase(raw)
 *   - normalizeDetection(rawDet)
 *   - normalizeHindcast(rawHindcast, rawDetection)
 *   - normalizeSuspect(rawSuspect, idx)
 *   - normalizeTrack(rawTrack)
 *   - mapShipTypeToCategory(rawType)
 */

// Helper: Safely parse a coordinate into [lat, lon]
export function parseCoord(pt) {
  if (!pt) return null;
  if (Array.isArray(pt) && pt.length >= 2) {
    const lat = Number(pt[0]);
    const lon = Number(pt[1]);
    if (!isNaN(lat) && !isNaN(lon)) return [lat, lon];
  }
  if (typeof pt === 'object') {
    const lat = Number(pt.lat ?? pt.latitude ?? pt.centroid_lat);
    const lon = Number(pt.lon ?? pt.lng ?? pt.longitude ?? pt.centroid_lon);
    if (!isNaN(lat) && !isNaN(lon)) return [lat, lon];
  }
  return null;
}

/**
 * Normalizes ship type string into one of the 4 canonical UI categories:
 * - 'Oil Tanker'
 * - 'Product Tanker'
 * - 'Cargo'
 * - 'Other'
 */
export function mapShipTypeToCategory(rawType) {
  if (!rawType) return 'Other';
  const t = rawType.toString().trim().toLowerCase();

  // 1. Oil / Chemical Tanker, Crude Tanker -> 'Oil Tanker'
  if (t.includes('oil') || t.includes('crude') || (t.includes('tanker') && !t.includes('product'))) {
    return 'Oil Tanker';
  }
  // 2. Product Tanker / Chemical Tanker (without oil) -> 'Product Tanker'
  if (t.includes('product') || t.includes('chemical')) {
    return 'Product Tanker';
  }
  // 3. Cargo / Bulk Carrier / Container / General Cargo -> 'Cargo'
  if (
    t.includes('bulk') ||
    t.includes('carrier') ||
    t.includes('container') ||
    t.includes('cargo') ||
    t.includes('freighter')
  ) {
    return 'Cargo';
  }
  return 'Other';
}

/**
 * Resolves human-readable maritime region, zone and geographical location descriptor
 */
export function resolveMaritimeRegion(lat, lon, caseData = {}) {
  // 1. Check explicit region / location fields
  if (caseData?.region && typeof caseData.region === 'string' && caseData.region.trim().length > 0) {
    return caseData.region.trim();
  }
  if (caseData?.location && typeof caseData.location === 'string' && caseData.location.trim().length > 0) {
    return caseData.location.trim();
  }
  if (caseData?.detection?.region && typeof caseData.detection.region === 'string') {
    return caseData.detection.region.trim();
  }
  if (caseData?.detection?.location && typeof caseData.detection.location === 'string') {
    return caseData.detection.location.trim();
  }
  if (caseData?.geographic_region && typeof caseData.geographic_region === 'string') {
    return caseData.geographic_region.trim();
  }
  if (caseData?.maritime_zone && typeof caseData.maritime_zone === 'string') {
    return caseData.maritime_zone.trim();
  }

  // 2. Check textual hints in title, notes, or case_id
  const textHint = `${caseData?.title || ''} ${caseData?.case_id || ''} ${caseData?.detection?.notes || ''}`.toLowerCase();
  if (textHint.includes('mumbai') || textHint.includes('jnpt')) {
    return 'Mumbai Offshore / JNPT Approach, Eastern Arabian Sea';
  }
  if (textHint.includes('lakshadweep') || textHint.includes('minicoy')) {
    return 'Lakshadweep Waters / Minicoy Channel, South Arabian Sea';
  }
  if (textHint.includes('khambhat') || textHint.includes('gujarat')) {
    return 'Gulf of Khambhat / Gujarat Maritime Zone';
  }
  if (textHint.includes('kandla') || textHint.includes('kutch')) {
    return 'Gulf of Kutch / Kandla Outer Roads';
  }
  if (textHint.includes('goa') || textHint.includes('mormugao')) {
    return 'Mormugao Deepwater / Goa Offshore';
  }
  if (textHint.includes('ratnagiri') || textHint.includes('konkan')) {
    return 'Konkan Continental Shelf / Ratnagiri Transit Corridor';
  }
  if (textHint.includes('cochin') || textHint.includes('kochi') || textHint.includes('malabar')) {
    return 'Malabar Coast / Cochin Shipping Channel';
  }
  if (textHint.includes('chennai') || textHint.includes('coromandel')) {
    return 'Coromandel Coast / Chennai Offshore, Bay of Bengal';
  }
  if (textHint.includes('visakhapatnam') || textHint.includes('vizag')) {
    return 'Andhra Coast / Visakhapatnam Approach, Bay of Bengal';
  }
  if (textHint.includes('andaman') || textHint.includes('nicobar')) {
    return 'Andaman & Nicobar Waters, Andaman Sea';
  }

  // 3. Fallback based on coordinate geospatial bounding boxes (India EEZ / Arabian Sea / Bay of Bengal)
  const numLat = Number(lat);
  const numLon = Number(lon);

  if (!isNaN(numLat) && !isNaN(numLon)) {
    // Mumbai Offshore / Maharashtra Coast (18.0 - 19.8 N, 71.5 - 73.5 E)
    if (numLat >= 18.0 && numLat <= 19.8 && numLon >= 71.5 && numLon <= 73.5) {
      return 'Mumbai Offshore / JNPT Approach, Eastern Arabian Sea';
    }
    // Gulf of Khambhat (20.2 - 22.3 N, 70.5 - 73.2 E)
    if (numLat >= 20.2 && numLat <= 22.3 && numLon >= 70.5 && numLon <= 73.2) {
      return 'Gulf of Khambhat / Gujarat Maritime Zone';
    }
    // Gulf of Kutch / Kandla (22.0 - 23.5 N, 68.0 - 70.8 E)
    if (numLat >= 22.0 && numLat <= 23.5 && numLon >= 68.0 && numLon <= 70.8) {
      return 'Gulf of Kutch / Kandla Outer Roads';
    }
    // Konkan Shelf / Ratnagiri (16.0 - 18.0 N, 71.8 - 73.8 E)
    if (numLat >= 16.0 && numLat < 18.0 && numLon >= 71.8 && numLon <= 73.8) {
      return 'Konkan Continental Shelf / Maharashtra South';
    }
    // Goa Offshore (14.8 - 16.0 N, 72.5 - 74.5 E)
    if (numLat >= 14.8 && numLat < 16.0 && numLon >= 72.5 && numLon <= 74.5) {
      return 'Goa Offshore / Central West Coast of India';
    }
    // Malabar / Kerala Coast / Cochin (9.0 - 14.8 N, 74.0 - 77.0 E)
    if (numLat >= 9.0 && numLat < 14.8 && numLon >= 74.0 && numLon <= 77.0) {
      return 'Malabar Coast / Cochin Shipping Lane, Arabian Sea';
    }
    // Lakshadweep / Minicoy / Eight Degree Channel (7.0 - 12.5 N, 71.0 - 74.5 E)
    if (numLat >= 7.0 && numLat <= 12.5 && numLon >= 71.0 && numLon <= 74.5) {
      return 'Lakshadweep Sea / Minicoy & Eight Degree Channel';
    }
    // Coromandel / Chennai (11.5 - 14.5 N, 79.5 - 82.5 E)
    if (numLat >= 11.5 && numLat <= 14.5 && numLon >= 79.5 && numLon <= 82.5) {
      return 'Coromandel Coast / Chennai Approach, Bay of Bengal';
    }
    // Andhra Coast / Visakhapatnam (14.5 - 18.5 N, 81.5 - 85.5 E)
    if (numLat > 14.5 && numLat <= 18.5 && numLon >= 81.5 && numLon <= 85.5) {
      return 'Andhra Coast / Visakhapatnam Channel, Bay of Bengal';
    }
    // Odisha / Northern Bengal Basin (18.5 - 22.5 N, 85.0 - 90.0 E)
    if (numLat > 18.5 && numLat <= 22.5 && numLon >= 85.0 && numLon <= 90.0) {
      return 'Northern Bay of Bengal / Bengal Basin';
    }
    // Andaman Sea (6.0 - 14.5 N, 91.5 - 94.5 E)
    if (numLat >= 6.0 && numLat <= 14.5 && numLon >= 91.5 && numLon <= 94.5) {
      return 'Andaman & Nicobar Waters, Andaman Sea';
    }
    // General Arabian Sea
    if (numLon < 77.5 && numLat >= 5 && numLat <= 26) {
      return `${numLat >= 15 ? 'North' : 'South'} Arabian Sea (Indian EEZ)`;
    }
    // General Bay of Bengal
    if (numLon >= 77.5 && numLat >= 5 && numLat <= 26) {
      return `${numLat >= 15 ? 'North' : 'South'} Bay of Bengal (Indian EEZ)`;
    }
  }

  return 'Arabian Sea / Indian Ocean EEZ';
}

/**
 * Normalizes satellite detection metadata
 */
export function normalizeDetection(rawDet = {}) {
  const det = typeof rawDet === 'object' && rawDet !== null ? rawDet : {};

  // Centroid resolution
  let centroid = parseCoord(det.centroid);
  if (!centroid) {
    const lat = det.centroid_lat ?? det.lat ?? det.latitude;
    const lon = det.centroid_lon ?? det.lon ?? det.lng ?? det.longitude;
    if (lat != null && lon != null) {
      centroid = [Number(lat), Number(lon)];
    }
  }

  const area_km2 = det.area_km2 != null ? Number(det.area_km2) : (det.area != null ? Number(det.area) : null);
  const perimeter_km = det.perimeter_km != null ? Number(det.perimeter_km) : (det.perimeter != null ? Number(det.perimeter) : null);
  const major_axis_km = det.major_axis_km != null ? Number(det.major_axis_km) : (det.major_axis != null ? Number(det.major_axis) : null);
  const minor_axis_km = det.minor_axis_km != null ? Number(det.minor_axis_km) : (det.minor_axis != null ? Number(det.minor_axis) : null);
  const orientation_deg = det.orientation_deg != null ? Number(det.orientation_deg) : (det.orientation != null ? Number(det.orientation) : null);

  let aspect_ratio = null;
  if (major_axis_km && minor_axis_km && minor_axis_km > 0) {
    aspect_ratio = Number((major_axis_km / minor_axis_km).toFixed(2));
  }

  return {
    centroid: centroid || [18.9182, 72.7845],
    lat: centroid ? centroid[0] : (Number(det.lat) || 18.9182),
    lon: centroid ? centroid[1] : (Number(det.lon) || 72.7845),
    centroid_lat: centroid ? centroid[0] : (Number(det.lat) || 18.9182),
    centroid_lon: centroid ? centroid[1] : (Number(det.lon) || 72.7845),
    area_km2: area_km2 != null ? area_km2 : 18.45,
    perimeter_km: perimeter_km,
    major_axis_km: major_axis_km,
    minor_axis_km: minor_axis_km,
    aspect_ratio: aspect_ratio,
    orientation_deg: orientation_deg,
    detection_time: det.detection_time || det.time || det.timestamp || null,
    satellite: det.satellite || det.sensor || det.platform || 'Sentinel-1 SAR C-Band',
    crs: det.crs || 'EPSG:4326',
    notes: det.notes || det.analyst_notes || det.description || '',
    region: det.region || null,
    location: det.location || null
  };
}

/**
 * Normalizes hindcast drift simulation data
 */
export function normalizeHindcast(rawHindcast = {}, rawDetection = {}) {
  const hc = typeof rawHindcast === 'object' && rawHindcast !== null ? rawHindcast : {};
  const best = hc.best_estimate || {};

  // Origin resolution
  let origin = parseCoord(hc.origin);
  if (!origin && best.origin) {
    origin = parseCoord(best.origin);
  }
  if (!origin) {
    const lat = hc.origin_lat ?? best.origin_lat;
    const lon = hc.origin_lon ?? hc.origin_lng ?? best.origin_lon;
    if (lat != null && lon != null) {
      origin = [Number(lat), Number(lon)];
    }
  }

  // Detection point
  let detection_point = parseCoord(hc.detection_point) || parseCoord(rawDetection.centroid);

  // Simulations normalization
  let simulations = [];
  if (Array.isArray(hc.simulations) && hc.simulations.length > 0) {
    simulations = hc.simulations.map((sim, idx) => {
      const simOrigin = parseCoord(sim.origin) || origin;
      const simTraj = Array.isArray(sim.trajectory)
        ? sim.trajectory.map(pt => {
            const coord = parseCoord(pt);
            if (!coord) return null;
            return {
              lat: coord[0],
              lon: coord[1],
              hours_back: pt.hours_back ?? null
            };
          }).filter(Boolean)
        : [];

      return {
        id: sim.id || `sim-${idx + 1}`,
        name: sim.name || `Simulation #${idx + 1} (${sim.duration_hours || 24}h)`,
        duration_hours: Number(sim.duration_hours || best.duration_hours || 24),
        origin: simOrigin,
        confidence: sim.confidence != null ? Number(sim.confidence) : 0.95,
        trajectory: simTraj
      };
    });
  }

  // Best estimate fallback
  const bestOrigin = origin || (simulations.length > 0 ? simulations[0].origin : [18.8350, 72.6920]);
  const bestDuration = Number(best.duration_hours || (simulations.length > 0 ? simulations[0].duration_hours : 24));
  const bestConfidence = best.confidence != null ? Number(best.confidence) : (simulations.length > 0 ? simulations[0].confidence : 0.985);

  // Trajectory points
  let trajectory = [];
  if (Array.isArray(best.trajectory) && best.trajectory.length > 0) {
    trajectory = best.trajectory.map(pt => {
      const coord = parseCoord(pt);
      if (!coord) return null;
      return { lat: coord[0], lon: coord[1], hours_back: pt.hours_back ?? null };
    }).filter(Boolean);
  } else if (simulations.length > 0 && simulations[0].trajectory.length > 0) {
    trajectory = simulations[0].trajectory;
  } else if (Array.isArray(hc.trajectory) && hc.trajectory.length > 0) {
    trajectory = hc.trajectory.map(pt => {
      const coord = parseCoord(pt);
      if (!coord) return null;
      return { lat: coord[0], lon: coord[1], hours_back: pt.hours_back ?? null };
    }).filter(Boolean);
  }

  // Release time derivation
  let release_time = hc.release_time || hc.estimated_release_time || best.estimated_release_time;
  if (!release_time && rawDetection.detection_time && bestDuration) {
    try {
      const detMs = new Date(rawDetection.detection_time).getTime();
      if (!isNaN(detMs)) {
        release_time = new Date(detMs - bestDuration * 3600000).toISOString();
      }
    } catch {
      // ignore
    }
  }

  return {
    origin: bestOrigin || [18.8350, 72.6920],
    detection_point: detection_point || [18.9182, 72.7845],
    duration_hours: bestDuration,
    confidence: bestConfidence,
    release_time: release_time || null,
    simulations: simulations,
    best_estimate: {
      duration_hours: bestDuration,
      origin: bestOrigin,
      confidence: bestConfidence,
      trajectory: trajectory
    },
    trajectory: trajectory
  };
}

/**
 * Normalizes an individual AIS track point
 */
export function normalizeTrack(rawTrack) {
  if (!Array.isArray(rawTrack)) return [];
  return rawTrack.map(pt => {
    if (Array.isArray(pt) && pt.length >= 2) {
      return {
        lat: Number(pt[0]),
        lon: Number(pt[1]),
        timestamp: pt[2] || null,
        speed: pt[3] != null ? Number(pt[3]) : null
      };
    }
    if (pt && typeof pt === 'object') {
      const coord = parseCoord(pt);
      if (!coord) return null;
      return {
        lat: coord[0],
        lon: coord[1],
        timestamp: pt.timestamp || pt.time || null,
        speed: pt.speed != null ? Number(pt.speed) : null
      };
    }
    return null;
  }).filter(Boolean);
}

/**
 * Normalizes suspect vessel candidate record
 */
export function normalizeSuspect(s = {}, idx = 0) {
  const mmsi = (s.mmsi || s.vessel_mmsi || s.id || `V-${idx + 1}`).toString();
  const name = s.name || s.vessel_name || `Vessel ${mmsi}`;
  const rawType = s.ship_type || s.type || s.vessel_type || s.category || s.vessel_category || 'Unknown';
  const category = mapShipTypeToCategory(rawType);

  // Backend score normalization (0..100)
  let rawScore = s.score ?? s.pipeline_score ?? s.final_score ?? s.confidence_score ?? s.confidence ?? s.attribution_score ?? 0;
  let scoreVal = Number(rawScore) || 0;
  if (scoreVal > 0 && scoreVal <= 1) {
    scoreVal = Number((scoreVal * 100).toFixed(1));
  } else {
    scoreVal = Number(scoreVal.toFixed(1));
  }

  // Distance (support all common property variations)
  const dist = s.distance_km ?? s.distance ?? s.closest_distance_km ?? s.closest_distance ?? s.min_distance_km ?? s.min_distance ?? s.dist ?? s.min_dist ?? null;
  const distance_km = dist != null && !isNaN(dist) ? Number(Number(dist).toFixed(2)) : null;

  // Dwell (support all common property variations)
  const dwell = s.dwell_minutes ?? s.dwell_time_mins ?? s.dwell_time ?? s.dwell ?? s.dwell_mins ?? s.min_dwell_min ?? s.time_near_origin_min ?? s.duration_mins ?? s.duration ?? null;
  const dwell_time_mins = dwell != null && !isNaN(dwell) ? Number(Number(dwell).toFixed(1)) : null;

  // Speed (support all common property variations)
  const speed = s.speed_kn ?? s.avg_speed_knots ?? s.avg_speed ?? s.speed_knots ?? s.vessel_speed_kn ?? s.avg_speed_near ?? s.speed ?? s.velocity ?? null;
  const avg_speed_knots = speed != null && !isNaN(speed) ? Number(Number(speed).toFixed(1)) : null;

  // Time offset in hours (support all common property variations)
  const timeOffset = s.time_offset_hours ?? s.time_offset ?? s.time_offset_hrs ?? s.offset_hours ?? s.time_diff_hours ?? s.hours_offset ?? null;
  const time_offset_hours = timeOffset != null && !isNaN(timeOffset) ? Number(Number(timeOffset).toFixed(1)) : null;

  // Justification / Reason
  const justification = s.justification || s.reason || s.notes || s.description || '';

  // Coordinates / Position extraction
  let lat = s.lat ?? s.latitude ?? s.closest_lat;
  let lon = s.lon ?? s.lng ?? s.longitude ?? s.closest_lon;
  if (lat == null && Array.isArray(s.position) && s.position.length >= 2) {
    lat = s.position[0];
    lon = s.position[1];
  }
  if (lat == null && Array.isArray(s.coordinates) && s.coordinates.length >= 2) {
    lat = s.coordinates[0];
    lon = s.coordinates[1];
  }

  // Track (support all track / trajectory property variations)
  const rawTrack = s.track || s.trajectory || s.route || s.points || s.waypoints || s.positions;
  let track = normalizeTrack(rawTrack);

  // Fallback: If track is empty but candidate has coordinates, create a 1-point track
  if (track.length === 0 && lat != null && lon != null && !isNaN(lat) && !isNaN(lon)) {
    track = [{
      lat: Number(lat),
      lon: Number(lon),
      timestamp: s.closest_time || s.timestamp || null,
      speed: avg_speed_knots
    }];
  }

  // Fallback: If lat/lon were not directly on object, extract from track
  if ((lat == null || lon == null) && track.length > 0) {
    lat = track[track.length - 1].lat;
    lon = track[track.length - 1].lon;
  }

  return {
    mmsi: mmsi,
    name: name,
    type: rawType,
    category: category,
    flag: s.flag || '',
    length_m: s.length_m != null ? Number(s.length_m) : null,
    width_m: s.width_m != null ? Number(s.width_m) : null,
    draft_m: s.draft_m != null ? Number(s.draft_m) : null,
    backend_score: scoreVal,
    pipeline_score: scoreVal,
    score: scoreVal, // will be updated dynamically by scoring engine
    calculated_score: scoreVal,
    distance_km: distance_km,
    dwell_time_mins: dwell_time_mins,
    avg_speed_knots: avg_speed_knots,
    time_offset_hours: time_offset_hours,
    justification: justification,
    reason: justification,
    closest_time: s.closest_time || s.timestamp || null,
    rank: s.rank != null ? Number(s.rank) : idx + 1,
    lat: lat != null ? Number(lat) : null,
    lon: lon != null ? Number(lon) : null,
    track: track
  };
}

/**
 * Main Case Normalization Entrypoint
 */
export default function normalizeCase(raw) {
  if (!raw || typeof raw !== 'object') return null;

  // Clone to prevent mutating input
  const data = JSON.parse(JSON.stringify(raw));

  // Case ID & Status
  data.case_id = data.case_id || data.id || 'SIH26143-CASE';
  const rawStatus = (data.status || 'ANALYZED').toString();
  if (rawStatus.toLowerCase().includes('characteris')) {
    data.status = 'CANDIDATE IDENTIFIED';
  } else if (rawStatus.toLowerCase().includes('high')) {
    data.status = 'HIGH CONFIDENCE';
  } else {
    data.status = rawStatus.toUpperCase();
  }

  // Title
  data.title = data.title || `Oil Spill Forensic Briefing - ${data.case_id}`;

  // Detection
  data.detection = normalizeDetection(data.detection);

  // Region and Location resolution
  const detLat = data.detection.centroid ? data.detection.centroid[0] : (data.detection.lat || 18.9182);
  const detLon = data.detection.centroid ? data.detection.centroid[1] : (data.detection.lon || 72.7845);
  
  data.region = data.region || raw.region || resolveMaritimeRegion(detLat, detLon, data);
  data.location = data.location || raw.location || `${data.region} (${Number(detLat).toFixed(4)}°N, ${Number(detLon).toFixed(4)}°E)`;
  data.detection.region = data.region;
  data.detection.location = data.location;

  // Hindcast
  data.hindcast = normalizeHindcast(data.hindcast, data.detection);
  if (data.hindcast?.origin) {
    const origLat = Array.isArray(data.hindcast.origin) ? data.hindcast.origin[0] : data.hindcast.origin.lat;
    const origLon = Array.isArray(data.hindcast.origin) ? data.hindcast.origin[1] : (data.hindcast.origin.lon ?? data.hindcast.origin.lng);
    data.hindcast.origin_region = resolveMaritimeRegion(origLat, origLon, data);
    data.hindcast.origin_location = `${data.hindcast.origin_region} (${Number(origLat).toFixed(4)}°N, ${Number(origLon).toFixed(4)}°E)`;
  }

  // Suspects / Candidates
  const rawSuspects = data.suspects || data.candidates || data.vessels || data.correlated_vessels || data.suspect_vessels || [];
  if (Array.isArray(rawSuspects)) {
    data.suspects = rawSuspects.map((s, idx) => normalizeSuspect(s, idx));
  } else {
    data.suspects = [];
  }

  // Map settings
  if (!data.map) data.map = {};
  if (!Array.isArray(data.map.center) || data.map.center.length < 2) {
    data.map.center = data.detection.centroid || data.hindcast.origin || [18.9, 72.75];
  }
  if (!data.map.zoom) {
    data.map.zoom = 11;
  }

  // Filter defaults from JSON if provided
  const fd = data.filter_defaults || {};
  data.filter_defaults = {
    max_distance_km: fd.max_distance_km != null ? Number(fd.max_distance_km) : null,
    min_dwell_mins: fd.min_dwell_mins != null ? Number(fd.min_dwell_mins) : null,
    max_speed_knots: fd.max_speed_knots != null ? Number(fd.max_speed_knots) : null,
    ship_types: Array.isArray(fd.ship_types) ? fd.ship_types : [],
    time_window: fd.time_window || fd.time_band || 'all',
    top_n: fd.top_n != null ? Number(fd.top_n) : 10,
    sort_by: fd.sort_by || 'score_desc'
  };

  return data;
}
