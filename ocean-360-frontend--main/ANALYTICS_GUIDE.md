# Ocean 360 SIH26143 — Comprehensive Analytics & Forensics Guide

This document provides a detailed explanation of every section, chart, metric, and visualization on the **Ocean 360 Analytics Dashboard**. Use this guide for system understanding, analyst briefings, and Smart India Hackathon (SIH) jury presentations.

---

## Table of Contents
1. [Dataset Scope Selector (Filtered vs All)](#dataset-scope-selector)
2. [Section A: Case Overview & Observation Parameters](#section-a-case-overview--observation-parameters)
3. [Section B: Slick Geometric Characteristics](#section-b-slick-geometric-characteristics)
4. [Section C: Hindcast Drift Analysis & Timeline](#section-c-hindcast-drift-analysis--timeline)
5. [Section D: Candidate Evidence Summary](#section-d-candidate-evidence-summary)
6. [Section E: Attribution Ranking (Horizontal Bar Chart)](#section-e-attribution-ranking)
7. [Section F: Distance vs Attribution Score (Scatter Plot)](#section-f-distance-vs-attribution-score)
8. [Section G: Dwell Time vs Score (Scatter Plot)](#section-g-dwell-time-vs-score)
9. [Section H: Vessel Speed vs Score (Scatter Plot)](#section-h-vessel-speed-vs-score)
10. [Section I: Ship Type Breakdown](#section-i-ship-type-breakdown)
11. [Section J: Distance Distribution Histogram](#section-j-distance-distribution-histogram)
12. [Section K: Time Offset Analysis (Before vs After Release)](#section-k-time-offset-analysis)
13. [Section L: Vessel Speed Statistics](#section-l-vessel-speed-statistics)
14. [Section M: Search Space Reduction Pipeline (Funnel)](#section-m-search-space-reduction-pipeline-funnel)

---

## Dataset Scope Selector

Located at the top right of the Analytics page:
- **`Filtered Candidates`**: Analyzes only the vessels that satisfy the currently active Stage 7 filters (distance, dwell, speed, ship type, time window). Use this for focused investigation of your shortlisted culprits.
- **`All Candidates`**: Analyzes every vessel present in the uploaded case JSON. Use this to understand the broader maritime traffic environment before filtering.

---

## Section A: Case Overview & Observation Parameters

Ten parameter cards providing an immediate operational snapshot of the satellite detection:

| Card | Description | Forensic Importance |
| :--- | :--- | :--- |
| **Case ID** | Unique case reference code (e.g. `CASE a1`). | Used for official chain of custody and case filing. |
| **Case Status** | State of analysis (e.g. `CANDIDATE IDENTIFIED`). | Informs coast guard officers whether culprits are shortlisted. |
| **Detection Time** | Timestamp when satellite acquired the image (UTC). | The anchor timestamp from which hindcast drift models run backwards. |
| **Latitude / Longitude**| Geographic coordinates of the slick center of mass. | Pinpoints the spill location for navigational warnings. |
| **Spill Area** | Total surface area covered by oil in $\text{km}^2$. | Determines the spill severity tier and environmental impact. |
| **Perimeter** | Total outer boundary length of the slick in $\text{km}$. | Helps evaluate slick weathering, fragmentation, and spreading. |
| **Major Axis** | Longest dimension of the slick ellipse ($\text{km}$). | Indicates the primary direction of wind/current elongation. |
| **Minor Axis** | Shortest cross-width dimension ($\text{km}$). | Evaluates the lateral spread and dispersion rate of the oil. |
| **Orientation** | Angle of slick alignment in degrees ($0^\circ - 360^\circ$). | Correlates directly with ocean surface current and wind vectors. |

---

## Section B: Slick Geometric Characteristics

Combines detailed geometric metrics with an interactive SVG visualization:

1. **Aspect Ratio ($\text{Major Axis} / \text{Minor Axis}$)**:
   - *Calculation*: $\text{Aspect Ratio} = \frac{\text{Major Axis (km)}}{\text{Minor Axis (km)}}$
   - *Interpretation*: A high aspect ratio (e.g. $> 2.5:1$) indicates an elongated, streaky slick typically formed by a vessel discharging oil while underway (moving ship discharge). A circular aspect ratio ($\approx 1:1$) suggests a stationary discharge or underwater pipeline leak.
2. **Visual Ellipse Representation**:
   - Displays the slick's elliptical shape rotated precisely to its real `orientation_deg`.
   - Shows the major axis (length line), minor axis (width line), and the central red detection marker.

---

## Section C: Hindcast Drift Analysis & Timeline

Presents the hydrodynamic reverse drift modeling (Lagrangian trajectory):

1. **Drift Duration**: Number of hours backtraced (e.g. `24 Hours`).
2. **Probable Spill Origin**: Coordinates $[Lat, Lon]$ where the oil was estimated to have been released into the ocean.
3. **Drift Confidence**: Hydrodynamic model confidence score (e.g. `98.5%`) taking into account ECMWF winds and Copernicus ocean current data.
4. **Trajectory Waypoints**: Number of discrete time steps computed in the simulation.
5. **Reverse Drift Timeline**:
   - Visual sequential timeline tracking the oil backward:
     $$\text{Detection (0h)} \rightarrow -6\text{h} \rightarrow -12\text{h} \rightarrow -18\text{h} \rightarrow -24\text{h (Probable Release Origin)}$$

---

## Section D: Candidate Evidence Summary

Eight instant analytical summary cards:
- **Total Uploaded**: Count of all vessels in the case file.
- **Passing Filters**: Number of suspect vessels currently surviving your filter criteria.
- **Top Candidate**: Name of the vessel with the highest Calculated Attribution Score.
- **Highest Score**: The top score percentage (e.g. `91.4%`).
- **Nearest Vessel**: Vessel closest to the probable release origin (e.g. `0.38 km`).
- **Longest Dwell**: Vessel that remained near the origin the longest (e.g. `42 min`).
- **Fastest Vessel**: Candidate with the highest transit speed (e.g. `14.1 kn`).
- **Average Candidate Speed**: Mean speed across all active candidates.

---

## Section E: Attribution Ranking

A horizontal bar chart ranking every candidate by their **Calculated Attribution Score**:
- **X-axis**: Score percentage ($0\%$ to $100\%$).
- **Y-axis**: Vessel name, rank badge, and ship type.
- **Visual Highlight**: The #1 suspect vessel is highlighted with an amber/gold gradient bar.
- **Interactive**: Clicking any bar centers and highlights that vessel on the tactical map and suspect list.

---

## Section F: Distance vs Attribution Score

An interactive scatter plot illustrating the spatial correlation:
- **X-axis**: Closest Distance from Hindcast Origin ($\text{km}$).
- **Y-axis**: Calculated Attribution Score ($\%$)
- **Forensic Principle**: Vessels closer to the origin (left side) are far more likely to have released the oil than vessels miles away.
- **Interactivity**: Hovering over any point reveals a floating tooltip showing the vessel name, exact distance, score, and ship type. Clicking selects the ship across the platform.

---

## Section G: Dwell Time vs Score

An interactive scatter plot examining loitering behavior:
- **X-axis**: Dwell Time near Origin ($\text{minutes}$).
- **Y-axis**: Calculated Attribution Score ($\%$)
- **Forensic Principle**: Tankers performing illegal tank cleaning or oily bilge water disposal often reduce speed or loiter for 30–60+ minutes. High dwell time (right side) strongly reinforces attribution confidence.

---

## Section H: Vessel Speed vs Score

An interactive scatter plot examining vessel velocity profile:
- **X-axis**: Average Speed ($\text{knots}$).
- **Y-axis**: Calculated Attribution Score ($\%$)
- **Forensic Principle**: Marine discharge regulations and pump flow limitations dictate that illegal operational discharge typically occurs at transit speeds between $8 - 12\text{ knots}$. High-speed vessels (e.g. container ships at $>20\text{ kn}$) rarely match heavy oil slick signatures.

---

## Section I: Ship Type Breakdown

A distribution chart breaking down candidates across 4 canonical maritime categories:
1. **Oil Tanker** (Crude oil tankers, VLCCs, Suezmax) — Highest risk category.
2. **Product Tanker** (Refined petroleum and chemical carriers).
3. **Cargo** (Bulk carriers, container ships, general cargo).
4. **Other** (Tugs, fishing vessels, naval escorts).

Displays both raw vessel count and proportion percentage.

---

## Section J: Distance Distribution Histogram

A binned frequency histogram showing where candidates are situated relative to the spill:
- `< 2 km` (Immediate release cone)
- `2 - 5 km` (Close buffer corridor)
- `5 - 10 km` (Intermediate quadrant)
- `10 - 20 km` (Peripheral perimeter)
- `> 20 km` (Distant shipping lane)

---

## Section K: Time Offset Analysis (Before vs After Release)

A diverging analytical chart showing temporal proximity centered around `0 hours`:
- **Negative Offset ($\le 0\text{h}$, Sky Blue)**: Vessel was present at the origin **before** the estimated spill release time. (Candidate could have discharged the oil).
- **Positive Offset ($> 0\text{h}$, Amber)**: Vessel arrived at the origin **after** the estimated release time. (Lower likelihood unless spill was continuous).

---

## Section L: Vessel Speed Statistics

Four mathematical velocity indicators for the analyzed vessels:
- **Minimum Speed**: Slowest vessel in the group.
- **Maximum Speed**: Fastest vessel in the group.
- **Average Speed**: Mean velocity across all candidates.
- **Median Speed**: Middle velocity value, eliminating skew from anomalous fast vessels.

---

## Section M: Search Space Reduction Pipeline (Funnel)

A sequential funnel chart showing how forensic filters narrowed down the search space:
1. **Raw Candidates**: Total ships in satellite quadrant.
2. **After Distance Filter**: Ships within the maximum distance boundary.
3. **After Dwell Filter**: Ships satisfying the minimum dwell time.
4. **After Speed Filter**: Ships within permissible discharge speeds.
5. **After Type Filter**: Ships matching targeted ship classifications.
6. **Final Candidates**: Final shortlisted suspects presented for forensic briefing.

This shows analysts and judicial authorities that the investigation systematically eliminated non-involved traffic through rigorous empirical criteria.
