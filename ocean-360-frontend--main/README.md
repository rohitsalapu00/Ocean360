# SIH26143 · Oil Spill Forensic Briefing Frontend

A modern, clean SaaS forensic dashboard (Grok / ChatGPT style) built with **React + Vite + Tailwind CSS + Leaflet**. The application is 100% serverless: users upload a single `case_full.json` file in the browser, and the interface instantly reconstructs the spill trajectory, plots the geographic hindcast origin, and runs dynamic **Stage-7 candidate vessel scoring & re-ranking**.

> **Notice:** Prototype case file — candidate scoring, not legal proof. No live satellite/AIS feed.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
Upon initial launch, the **Home empty state** is displayed. You can click **"Load sample (/sample_case_full.json)"** or click **"Upload case JSON"** to load your own forensic file.

---

## How to Upload `case_full.json` From Python Merge Output

Our backend merge pipeline generates JSON files representing satellite SAR detections, backward hydrodynamic drift hindcasts, and AIS candidate vessel tracks.

### Supported Python Output Shapes

The built-in client-side `normalizeCase(raw)` function automatically parses and maps the following field variations into the internal model:

1. **Detection Centroid Coordinates**:
   - `detection.centroid`: `[lat, lon]` or `{lat, lon}`
   - `detection.centroid_lat` and `detection.centroid_lon`
   - `detection.lat` and `detection.lon`

2. **Hindcast Release Origin & Trajectory**:
   - `hindcast.origin`: `[lat, lon]`
   - `hindcast.best_estimate.origin`: `[lat, lon]` or `{lat, lon}`
   - `hindcast.origin_lat` and `hindcast.origin_lon`
   - `hindcast.trajectory` or `hindcast.best_estimate.trajectory` or `hindcast.simulations[0].trajectory`
   - `hindcast.release_time` or `hindcast.estimated_release_time`, or automatically derived from `detection_time - duration_hours`

3. **Candidate Vessel Metrics**:
   - Distance: `distance_km`, `closest_distance_km`, or `min_distance_km`
   - Dwell: `dwell_time_mins`, `dwell_minutes`, `min_dwell_min`, or `time_near_origin_min`
   - Speed: `avg_speed_knots`, `speed_kn`, `vessel_speed_kn`, or `avg_speed_near`
   - Justification: `reason`, `justification`, or `notes`
   - Scoring: `score`, `pipeline_score`, `final_score`, or `confidence_score`
   - Track Coordinates: Array of `{"lat": ..., "lon": ...}` or `[lat, lon, timestamp, speed]`

---

## Home Layout & Components

1. **Top Bar**:
   - Title: `SIH26143 · Oil Spill Forensic Briefing`
   - Status Chips: `DEMO`, `CANDIDATE`
   - Action Buttons: `Upload case JSON`, `Reset`, `Export`, `Clear`, and Theme Switcher
   - Neutral info bar: *“Prototype case file — candidate scoring, not legal proof. No live satellite/AIS feed.”*

2. **Empty State (Before Upload)**:
   - Clean centered card with drag-and-drop zone and one-click sample loader.

3. **Loaded State (3-Column Desktop Layout)**:
   - **Left (~25%)**: Case ID, status, slick area (km²), SAR detection time, estimated release time, slick centroid coordinates, release origin coordinates, drift points, sensor, and analyst notes.
   - **Center (~45%)**: Leaflet map in white card frame with centroid marker (teal), origin marker (amber), reverse drift trajectory polyline, suspect vessel tracks, and legend (`Centroid · Origin · Trajectory · Vessel`).
   - **Right (~30%)**: Stage-7 filters (max distance, min dwell, max speed, ship type multi-select, time window, top N limit, sort criteria, and dynamic weights for proximity 0.30, dwell 0.25, speed 0.20, path 0.15, ship type 0.10) + Ranked Suspect Table & Vessel Detail Strip.

4. **Bottom Bar**:
   - Slim status footer: `Pipeline: Detect (SAR) → Trace (Hindcast) → Attribute (Stage 7)`.
