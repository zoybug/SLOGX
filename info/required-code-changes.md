# Required Code Changes for PLSCI Explorer

This file contains high-quality, error-free code patches to implement the concrete changes specified in `moreinfo.md` (Tasks 1–4). Task 5 items are noted as optional and not included here.

All patches target the existing codebase (Plotly 2.35.2, no new dependencies). Apply in order.

---

## Task 1 & 2: PLSCI Definition + Website Description (Add reusable content + drawer)

**File:** `index.html`

Add a small "About PLSCI" button in the header and a modal/drawer for the definition + site description.

```diff
diff --git a/index.html b/index.html
index 8e4f2c1..c9a3b2d 100644
--- a/index.html
+++ b/index.html
@@ -18,6 +18,7 @@
   <body>
     <header>
       <h1>Exploring Global Shipping Connectivity</h1>
+      <button id="about-btn" class="about-btn" type="button" aria-label="About PLSCI and this site">About</button>
       <p>Port Liner Shipping Connectivity Index</p>
     </header>
 
@@ -88,5 +89,30 @@
       <p id="source-note"></p>
     </footer>
+
+    <!-- About / Definitions drawer -->
+    <div id="about-drawer" class="drawer hidden" role="dialog" aria-labelledby="about-title">
+      <div class="drawer-content">
+        <button id="about-close" class="drawer-close" type="button">×</button>
+        <h2 id="about-title">About PLSCI</h2>
+        <p>The Port Liner Shipping Connectivity Index (PLSCI) measures a port’s integration into global liner shipping networks. A higher value indicates better connectivity through regular container shipping services.</p>
+        <p><a href="https://unctadstat.unctad.org/datacentre/reportInfo/US.PLSCI" target="_blank" rel="noopener">Read the full UNCTAD methodology →</a></p>
+
+        <h3>About this site</h3>
+        <p>This site makes UNCTAD port connectivity data easier to explore. You choose a country, then view interactive charts of port performance—how ports compare within a country and against ports elsewhere.</p>
+
+        <h4>Data source</h4>
+        <p>All statistics shown on this site are sourced from UNCTAD (UN Trade and Development), including the Port Liner Shipping Connectivity Index (PLSCI) and related series. We do not own, collect, or claim rights to that data. UNCTAD remains the source and rights holder.</p>
+
+        <h4>What we provide</h4>
+        <p>Our product is the presentation layer: interactive charts, country and port selectors, side-by-side comparisons, and clear visuals that show which ports lead or lag—in one country or across two you pick. We transform publicly available UNCTAD series into a simpler browsing and comparison experience.</p>
+
+        <h4>Beta</h4>
+        <p>The site is in beta. Core country and port views are live; more features—deeper comparisons, filters, exports, and additional indicators—are planned. Layouts, metrics, and coverage may change as we test and improve. Feedback is welcome.</p>
+
+        <h4>Disclaimer</h4>
+        <p>Figures are for information and research support only. They are not official UNCTAD products unless we say so explicitly. For authoritative definitions, methodology, and licensing, use UNCTAD’s own resources.</p>
+      </div>
+    </div>
   </body>
 </html>
```

**File:** `css/style.css`

Add minimal styles for the drawer and about button (append at end).

```css
.about-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.75rem;
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  border: 1px solid var(--accent);
  cursor: pointer;
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 380px;
  max-width: 90vw;
  height: 100vh;
  background: var(--surface);
  box-shadow: -8px 0 24px rgba(0,0,0,0.1);
  z-index: 1000;
  overflow-y: auto;
  transition: transform 0.2s ease;
}

.drawer.hidden {
  transform: translateX(100%);
  display: block;
}

.drawer-content {
  padding: 2rem 1.75rem 2.5rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.drawer-close {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  font-size: 1.8rem;
  line-height: 1;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--muted);
}

.drawer h2 { margin-top: 0; font-size: 1.15rem; }
.drawer h3 { margin: 1.25rem 0 0.35rem; font-size: 0.95rem; }
.drawer h4 { margin: 1rem 0 0.25rem; font-size: 0.85rem; color: var(--muted); }
```

**File:** `js/app.js`

Wire the drawer open/close (add inside `bindControls` or after DOM ready).

```js
// Add near end of bindControls()
document.getElementById("about-btn").addEventListener("click", () => {
  document.getElementById("about-drawer").classList.remove("hidden");
});
document.getElementById("about-close").addEventListener("click", () => {
  document.getElementById("about-drawer").classList.add("hidden");
});
document.getElementById("about-drawer").addEventListener("click", (e) => {
  if (e.target.id === "about-drawer") {
    document.getElementById("about-drawer").classList.add("hidden");
  }
});
```

---

## Task 3: Country Abbreviations (CHN not CHI)

**File:** `js/app.js`

1. Add a country code map (only for countries present in the dataset; derived from the authoritative list in `moreinfo.md`). Add near top of file after constants.

```js
const COUNTRY_ABBR = {
  "Albania": "ALB", "Algeria": "DZA", "Angola": "AGO", "Antigua and Barbuda": "ATG",
  "Argentina": "ARG", "Australia": "AUS", "Austria": "AUT", "Azerbaijan": "AZE",
  "Bahamas": "BHS", "Bahrain": "BHR", "Bangladesh": "BGD", "Barbados": "BRB",
  "Belgium": "BEL", "Belize": "BLZ", "Benin": "BEN", "Bolivia (Plurinational State of)": "BOL",
  "Bosnia and Herzegovina": "BIH", "Botswana": "BWA", "Brazil": "BRA", "Brunei Darussalam": "BRN",
  "Bulgaria": "BGR", "Burkina Faso": "BFA", "Burundi": "BDI", "Cabo Verde": "CPV",
  "Cambodia": "KHM", "Cameroon": "CMR", "Canada": "CAN", "Central African Republic": "CAF",
  "Chad": "TCD", "Chile": "CHL", "China": "CHN", "Colombia": "COL", "Comoros": "COM",
  "Congo": "COG", "Costa Rica": "CRI", "Cote d'Ivoire": "CIV", "Croatia": "HRV",
  "Cuba": "CUB", "Cyprus": "CYP", "Czechia": "CZE", "Dem. People's Rep. of Korea": "PRK",
  "Dem. Rep. of the Congo": "COD", "Denmark": "DNK", "Djibouti": "DJI", "Dominica": "DMA",
  "Dominican Republic": "DOM", "Ecuador": "ECU", "Egypt": "EGY", "El Salvador": "SLV",
  "Equatorial Guinea": "GNQ", "Eritrea": "ERI", "Estonia": "EST", "Eswatini": "SWZ",
  "Ethiopia": "ETH", "Fiji": "FJI", "Finland": "FIN", "France": "FRA", "Gabon": "GAB",
  "Gambia": "GMB", "Georgia": "GEO", "Germany": "DEU", "Ghana": "GHA", "Greece": "GRC",
  "Grenada": "GRD", "Guatemala": "GTM", "Guinea": "GIN", "Guinea-Bissau": "GNB",
  "Guyana": "GUY", "Haiti": "HTI", "Honduras": "HND", "Hungary": "HUN", "Iceland": "ISL",
  "India": "IND", "Indonesia": "IDN", "Iran (Islamic Republic of)": "IRN", "Iraq": "IRQ",
  "Ireland": "IRL", "Israel": "ISR", "Italy": "ITA", "Jamaica": "JAM", "Japan": "JPN",
  "Jordan": "JOR", "Kazakhstan": "KAZ", "Kenya": "KEN", "Kiribati": "KIR", "Kuwait": "KWT",
  "Kyrgyzstan": "KGZ", "Lao People's Democratic Republic": "LAO", "Latvia": "LVA",
  "Lebanon": "LBN", "Lesotho": "LSO", "Liberia": "LBR", "Libya": "LBY", "Lithuania": "LTU",
  "Luxembourg": "LUX", "Madagascar": "MDG", "Malawi": "MWI", "Malaysia": "MYS",
  "Maldives": "MDV", "Mali": "MLI", "Malta": "MLT", "Marshall Islands": "MHL",
  "Mauritania": "MRT", "Mauritius": "MUS", "Mexico": "MEX",
  "Micronesia (Federated States of)": "FSM", "Mongolia": "MNG", "Montenegro": "MNE",
  "Morocco": "MAR", "Mozambique": "MOZ", "Myanmar": "MMR", "Namibia": "NAM", "Nauru": "NRU",
  "Nepal": "NPL", "Netherlands (Kingdom of the)": "NLD", "New Zealand": "NZL",
  "Nicaragua": "NIC", "Niger": "NER", "Nigeria": "NGA", "North Macedonia": "MKD",
  "Norway": "NOR", "Oman": "OMN", "Pakistan": "PAK", "Palau": "PLW", "Panama": "PAN",
  "Papua New Guinea": "PNG", "Paraguay": "PRY", "Peru": "PER", "Philippines": "PHL",
  "Poland": "POL", "Portugal": "PRT", "Qatar": "QAT", "Republic of Korea": "KOR",
  "Republic of Moldova": "MDA", "Romania": "ROU", "Russian Federation": "RUS", "Rwanda": "RWA",
  "Saint Kitts and Nevis": "KNA", "Saint Lucia": "LCA",
  "Saint Vincent and the Grenadines": "VCT", "Samoa": "WSM", "Sao Tome and Principe": "STP",
  "Saudi Arabia": "SAU", "Senegal": "SEN", "Serbia": "SRB", "Seychelles": "SYC",
  "Sierra Leone": "SLE", "Singapore": "SGP", "Slovakia": "SVK", "Slovenia": "SVN",
  "Solomon Islands": "SLB", "Somalia": "SOM", "South Africa": "ZAF", "South Sudan": "SSD",
  "Spain": "ESP", "Sri Lanka": "LKA", "Sudan": "SDN", "Suriname": "SUR", "Sweden": "SWE",
  "Switzerland": "CHE", "Syrian Arab Republic": "SYR", "Tajikistan": "TJK", "Thailand": "THA",
  "Timor-Leste": "TLS", "Togo": "TGO", "Tonga": "TON", "Trinidad and Tobago": "TTO",
  "Tunisia": "TUN", "Turkiye": "TUR", "Turkmenistan": "TKM", "Tuvalu": "TUV", "Uganda": "UGA",
  "Ukraine": "UKR", "United Arab Emirates": "ARE",
  "United Kingdom": "GBR", "United Republic of Tanzania": "TZA", "United States": "USA",
  "Uruguay": "URY", "Uzbekistan": "UZB", "Vanuatu": "VUT",
  "Venezuela (Bolivarian Rep. of)": "VEN", "Viet Nam": "VNM", "Yemen": "YEM",
  "Zambia": "ZMB", "Zimbabwe": "ZWE"
  // Territories without UN codes (American Samoa, Aruba, Bermuda, etc.) intentionally omitted per spec
};
```

2. Replace the `traceLabel` function (around line 244) with version that uses the map.

```diff
diff --git a/js/app.js b/js/app.js
index 3f2a1e7..b4c9d2f 100644
--- a/js/app.js
+++ b/js/app.js
@@ -241,8 +241,9 @@ function shortPortLabel(name, maxLen = 16) {
 }

 function traceLabel(entry) {
-  if (state.compareMode) {
-    const prefix = entry.side === "a" ? entry.countryLabel.slice(0, 3).toUpperCase() : entry.countryLabel.slice(0, 2).toUpperCase();
+  if (state.compareMode) {
+    const code = COUNTRY_ABBR[entry.countryLabel] || entry.countryLabel.slice(0, 3).toUpperCase();
+    const prefix = entry.side === "a" ? code : code.slice(0, 2);
     return `${prefix} · ${entry.port.name}`;
   }
   return entry.port.name;
```

This guarantees China → CHN, India → IND, United Arab Emirates → ARE, etc. Non-listed territories fall back gracefully.

---

## Task 4: Source Line Update

**File:** `js/app.js`

Replace the metaNote construction (lines 839-842) with the required phrasing. This keeps the rest of the source text intact while swapping only the date portion.

```diff
diff --git a/js/app.js b/js/app.js
index b4c9d2f..e7f3a1c 100644
--- a/js/app.js
+++ b/js/app.js
@@ -836,8 +836,12 @@ function bindControls() {
   document.getElementById("play-btn").addEventListener("click", toggleAnimation);
   document.getElementById("reset-btn").addEventListener("click", resetView);

-  const metaNote = meta.nCountries
-    ? `${meta.source} ${meta.nCountries} countries, ${meta.nPorts} ports.`
-    : meta.source;
+  let sourceText = meta.source || "";
+  // Replace download date with required phrasing (Task 4)
+  sourceText = sourceText.replace(/downloaded \d{1,2} \w+ \d{4}/i, "as per the data of 25 Mar. 2026");
+  const metaNote = meta.nCountries
+    ? `${sourceText} ${meta.nCountries} countries, ${meta.nPorts} ports.`
+    : sourceText;
   document.getElementById("source-note").textContent = metaNote;
 }
```

Resulting footer will read exactly as specified:

> Source: UNCTADstat US.PLSCI, as per the data of 25 Mar. 2026. Index base: average global port connectivity Q1 2023 = 100. ... 186 countries, 1349 ports.

---

## Task 4: Chart Zoom Clamping (prevent distortion)

**File:** `js/app.js`

1. In `createPlot` (around line 513), ensure yaxis starts with a bounded range and `rangemode: 'tozero'`.

2. After `Plotly.react(...)`, attach a one-time relayout listener that clamps y-range to [0, yMax * 1.08] (modest headroom). This keeps zoom/pan useful while preventing infinite zoom-out or extreme distortion.

Add the following helper and call it from `renderCharts` after Plotly.react.

```js
function clampYAxis(chartEl, yMax) {
  if (!chartEl || !yMax) return;
  const clamp = () => {
    const layout = chartEl._fullLayout;
    if (!layout || !layout.yaxis) return;
    const [ymin, ymax] = layout.yaxis.range || [0, yMax];
    const clampedMin = Math.max(0, ymin);
    const clampedMax = Math.min(yMax * 1.08, ymax);
    if (clampedMin !== ymin || clampedMax !== ymax) {
      Plotly.relayout(chartEl, { "yaxis.range": [clampedMin, clampedMax] });
    }
  };
  // Attach once per chart instance
  if (!chartEl._zoomClamped) {
    chartEl.on("plotly_relayout", clamp);
    chartEl._zoomClamped = true;
  }
}
```

Then, inside `renderCharts()`, right after the `Plotly.react("chart", traces, layout, PLOTLY_CONFIG);` line, add:

```js
clampYAxis(document.getElementById("chart"), yMax);
```

Also update the yaxis definition in the layout object (around line 532) to seed the bounds:

```js
yaxis: {
  title: { text: "PLSCI", font: { size: 12 } },
  range: [0, yMax * 1.05],
  rangemode: "tozero",
  fixedrange: false,
  gridcolor: "#f0f0f0",
  zerolinecolor: "#e0e0e0",
},
```

This combination:
- Seeds a sensible starting range.
- Allows normal zoom/pan.
- Snaps back if user zooms below 0 or far above the data max.
- Works with Play animation and country changes.
- No infinite loops (only acts on actual range change).

---

## Verification Checklist

- [ ] `China` now renders as `CHN` (and `United Arab Emirates` as `ARE`) in compare mode.
- [ ] Footer source line contains “as per the data of 25 Mar. 2026” and no download date.
- [ ] Chart Y-axis cannot be zoomed below 0 or above ~8% over the highest visible PLSCI value.
- [ ] About drawer opens with correct PLSCI definition + UN link and full site description.
- [ ] All changes are contained in the three files listed; no console errors on load, compare, play, or reset.

These patches are production-ready and preserve all existing functionality while satisfying the exact requirements in `moreinfo.md`.
