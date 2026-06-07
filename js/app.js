const COLORS_A = [
  "#0072B2", "#56B4E9", "#009E73", "#332288", "#17BECF",
  "#88CCEE", "#117733", "#44AA99", "#999933", "#CC79A7",
  "#332288", "#0072B2", "#009E73", "#56B4E9", "#17BECF",
];

const COLORS_B = [
  "#D55E00", "#E69F00", "#CC6677", "#8C564B", "#7F7F7F",
  "#DDCC77", "#882255", "#AA4499", "#CC6677", "#D55E00",
  "#E69F00", "#882255", "#8C564B", "#CC6677", "#AA4499",
];

const MS_PER_YEAR = 350;
const CHART_MARGIN = { l: 58, r: 168, t: 36, b: 52 };
const CHART_MARGIN_COMPARE = { l: 58, r: 220, t: 36, b: 52 };

const PLOTLY_CONFIG = {
  responsive: true,
  displayModeBar: true,
  displaylogo: false,
  scrollZoom: true,
  modeBarButtonsToRemove: ["lasso2d", "select2d"],
};

const state = {
  data: null,
  compareMode: false,
  countryA: "India",
  countryB: "China",
  yearStart: 2006,
  yearEnd: 2023,
  currentYear: 2006,
  scrubYear: 2023,
  topN: 10,
  playing: false,
  highlightedPortId: null,
  tracePortIds: [],
  chartInteractionsBound: false,
  ignoreNextAxisClick: false,
  animationFrame: null,
  animationStartTime: null,
  animationElapsed: 0,
};

async function loadData() {
  const response = await fetch("data/plsci.json");
  if (!response.ok) {
    throw new Error(`Failed to load data (${response.status})`);
  }
  state.data = await response.json();
}

function countryLabel(country) {
  return state.data.countries[country]?.label ?? country;
}

function countryPorts(country) {
  return state.data.countries[country]?.ports ?? [];
}

function filteredObservations(port) {
  return port.observations.filter(
    (row) => !row.postRescale && row.year >= state.yearStart && row.year <= state.yearEnd,
  );
}

function meanPlsci(port) {
  const rows = filteredObservations(port);
  if (!rows.length) return 0;
  return rows.reduce((sum, row) => sum + row.plsci, 0) / rows.length;
}

function selectedPorts(country) {
  return [...countryPorts(country)]
    .filter((port) => filteredObservations(port).length > 0)
    .sort((a, b) => meanPlsci(b) - meanPlsci(a))
    .slice(0, state.topN);
}

function portEntriesForCompare() {
  const entriesA = selectedPorts(state.countryA).map((port, index) => ({
    port,
    country: state.countryA,
    countryLabel: countryLabel(state.countryA),
    side: "a",
    color: COLORS_A[index % COLORS_A.length],
  }));
  const entriesB = selectedPorts(state.countryB).map((port, index) => ({
    port,
    country: state.countryB,
    countryLabel: countryLabel(state.countryB),
    side: "b",
    color: COLORS_B[index % COLORS_B.length],
  }));
  return [...entriesA, ...entriesB];
}

function colorMap(ports) {
  const map = {};
  ports.forEach((port, index) => {
    map[port.id] = COLORS_A[index % COLORS_A.length];
  });
  return map;
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function interpolateValue(rows, year) {
  if (!rows.length) return null;
  if (year <= rows[0].year) return rows[0].plsci;
  if (year >= rows.at(-1).year) return rows.at(-1).plsci;

  for (let i = 0; i < rows.length - 1; i += 1) {
    const start = rows[i];
    const end = rows[i + 1];
    if (year >= start.year && year <= end.year) {
      const t = (year - start.year) / (end.year - start.year);
      return start.plsci + t * (end.plsci - start.plsci);
    }
  }
  return rows.at(-1).plsci;
}

function buildInterpolatedSeries(port, year) {
  const rows = filteredObservations(port);
  const x = [];
  const y = [];

  for (const row of rows) {
    if (row.year < year - 1e-6) {
      x.push(row.year);
      y.push(row.plsci);
    } else {
      break;
    }
  }

  const value = interpolateValue(rows, year);
  if (value !== null && year >= rows[0].year) {
    const lastX = x.at(-1);
    if (lastX === undefined || lastX < year - 1e-6) {
      x.push(year);
      y.push(value);
    }
  }

  return { x, y };
}

function formatRankingYear(year) {
  return String(Math.round(year));
}

function headMarkerSize(portId) {
  if (state.highlightedPortId === portId) return 22;
  if (state.highlightedPortId === null) return 18;
  return 14;
}

function labelXShift(headSize) {
  return Math.round(headSize * 0.5 + 16);
}

function estimatedPlotHeight() {
  const chartEl = document.getElementById("chart");
  if (!chartEl?.clientHeight) return 480;
  const margin = state.compareMode ? CHART_MARGIN_COMPARE : CHART_MARGIN;
  return chartEl.clientHeight - margin.t - margin.b;
}

function minLabelYGap(yMax) {
  const minPixelGap = 22;
  return (minPixelGap / estimatedPlotHeight()) * yMax;
}

function resolveLabelPositions(entries, year, yMax) {
  const items = entries
    .map((entry) => {
      const series = buildInterpolatedSeries(entry.port, year);
      if (series.x.length === 0) return null;
      return {
        entry,
        headX: series.x.at(-1),
        headY: series.y.at(-1),
        labelY: series.y.at(-1),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.headY - b.headY);

  if (items.length <= 1) return items;

  const gap = minLabelYGap(yMax);
  const maxY = yMax * 1.02;

  for (let pass = 0; pass < 10; pass += 1) {
    items.sort((a, b) => a.labelY - b.labelY);

    for (let i = 1; i < items.length; i += 1) {
      if (items[i].labelY - items[i - 1].labelY < gap) {
        const mid = (items[i].labelY + items[i - 1].labelY) / 2;
        items[i - 1].labelY = mid - gap / 2;
        items[i].labelY = mid + gap / 2;
      }
    }

    items[0].labelY = Math.max(0, items[0].labelY);
    for (let i = 1; i < items.length; i += 1) {
      items[i].labelY = Math.max(items[i - 1].labelY + gap, items[i].labelY);
    }

    items[items.length - 1].labelY = Math.min(maxY, items[items.length - 1].labelY);
    for (let i = items.length - 2; i >= 0; i -= 1) {
      items[i].labelY = Math.min(items[i + 1].labelY - gap, items[i].labelY);
    }
  }

  return items;
}

function lineOpacity(portId) {
  if (state.highlightedPortId === null) return 1;
  return state.highlightedPortId === portId ? 1 : 0.22;
}

function lineWidth(portId) {
  if (state.highlightedPortId === portId) return 4.5;
  return state.highlightedPortId === null ? 2.5 : 1.8;
}

function lineDash(side) {
  return side === "b" ? "dash" : "solid";
}

function shortPortLabel(name, maxLen = 16) {
  if (name.length <= maxLen) return name;
  return `${name.slice(0, maxLen - 1).trim()}…`;
}

function traceLabel(entry) {
  if (state.compareMode) {
    const prefix = entry.side === "a" ? entry.countryLabel.slice(0, 3).toUpperCase() : entry.countryLabel.slice(0, 2).toUpperCase();
    return `${prefix} · ${entry.port.name}`;
  }
  return entry.port.name;
}

function hoverRowTemplate(label) {
  const text = shortPortLabel(label, 22);
  return `${text}  %{y:7.1f}<extra></extra>`;
}

function buildLabelAnnotations(entries, year, yMax) {
  if (state.compareMode) return [];

  return resolveLabelPositions(entries, year, yMax).map((item) => {
    const color = item.entry.color;
    const portId = item.entry.port.id;
    const opacity = lineOpacity(portId);
    const headSize = headMarkerSize(portId);
    const fontSize = state.highlightedPortId === portId ? 18 : 16;
    return {
      x: item.headX,
      y: item.labelY,
      text: shortPortLabel(item.entry.port.name, 20),
      showarrow: false,
      xref: "x",
      yref: "y",
      xanchor: "left",
      yanchor: "middle",
      xshift: labelXShift(headSize),
      font: {
        color,
        size: fontSize,
        family: "IBM Plex Sans, Segoe UI, sans-serif",
      },
      opacity,
    };
  });
}

function buildTraces(entries, year) {
  const traces = [];
  const tracePortIds = [];

  entries.forEach((entry) => {
    const { port, color, side } = entry;
    const series = buildInterpolatedSeries(port, year);
    const opacity = lineOpacity(port.id);
    const traceIndex = traces.length;
    const label = traceLabel(entry);

    traces.push({
      type: "scatter",
      mode: "lines",
      name: label,
      legendgroup: entry.country,
      legendgrouptitle: state.compareMode ? { text: entry.countryLabel } : undefined,
      x: series.x,
      y: series.y,
      line: {
        color,
        width: lineWidth(port.id),
        dash: state.compareMode ? lineDash(side) : "solid",
      },
      marker: { size: 0, color },
      opacity,
      hovertemplate: hoverRowTemplate(label),
    });
    tracePortIds[traceIndex] = port.id;

    if (series.x.length > 0) {
      const headX = series.x.at(-1);
      const headY = series.y.at(-1);
      const headSize = headMarkerSize(port.id);

      traces.push({
        type: "scatter",
        mode: "markers",
        x: [headX],
        y: [headY],
        marker: {
          size: headSize,
          color,
          symbol: side === "b" ? "diamond" : "circle",
          line: { width: 3.5, color: "#FFFFFF" },
          opacity,
        },
        showlegend: false,
        hoverinfo: "skip",
      });
      tracePortIds[traces.length - 1] = port.id;
    }
  });

  state.tracePortIds = tracePortIds;
  return traces;
}

function rankingAtYear(ports, year) {
  return ports
    .map((port) => {
      const rows = filteredObservations(port);
      const value = interpolateValue(rows, year);
      return value === null ? null : { port, value };
    })
    .filter(Boolean)
    .sort((a, b) => b.value - a.value);
}

function renderRankingList(elementId, title, ports, colors, year) {
  const panel = document.getElementById(elementId);
  const rows = rankingAtYear(ports, year);
  const html = [
    `<h3>${title}</h3>`,
    `<div class="year-badge">Year ${formatRankingYear(year)}</div>`,
    ...rows.map((row, index) => {
      const highlighted = row.port.id === state.highlightedPortId;
      return `
      <div class="rank-row${highlighted ? " highlighted" : ""}" data-port-id="${row.port.id}" role="button" tabindex="0">
        <span class="rank">#${index + 1}</span>
        <span>
          <span class="rank-dot" style="background:${colors[row.port.id]}"></span>
          ${row.port.name}
        </span>
        <span class="value">${row.value.toFixed(1)}</span>
      </div>
    `;
    }),
  ];
  panel.innerHTML = html.join("");
}

function yAxisMax(entries) {
  const ports = entries.map((entry) => entry.port);
  const values = ports.flatMap((port) =>
    filteredObservations(port).map((row) => row.plsci),
  );
  const max = values.length ? Math.max(...values) : 100;
  return max * 1.12;
}

function ensureHighlightValid(entries) {
  const portIds = new Set(entries.map((entry) => entry.port.id));
  if (state.highlightedPortId && !portIds.has(state.highlightedPortId)) {
    state.highlightedPortId = null;
  }
}

function setHighlightedPort(portId) {
  state.highlightedPortId = state.highlightedPortId === portId ? null : portId;
  renderCharts();
}

function yearFromClickX(chartEl, clientX) {
  const xaxis = chartEl._fullLayout?.xaxis;
  if (!xaxis?._length) return null;

  const bbox = chartEl.getBoundingClientRect();
  const xPixel = clientX - bbox.left;
  const plotLeft = xaxis._offset;
  const plotRight = plotLeft + xaxis._length;

  if (xPixel < plotLeft || xPixel > plotRight) return null;

  const [rangeMin, rangeMax] = xaxis.range;
  const fraction = (xPixel - plotLeft) / xaxis._length;
  const year = rangeMin + fraction * (rangeMax - rangeMin);
  const snapped = Math.round(year);

  return Math.max(state.yearStart, Math.min(state.yearEnd, snapped));
}

function isInXAxisZone(chartEl, clientY) {
  const layout = chartEl._fullLayout;
  const yaxis = layout?.yaxis;
  if (!yaxis?._length) return false;

  const bbox = chartEl.getBoundingClientRect();
  const y = clientY - bbox.top;
  const plotBottom = yaxis._offset + yaxis._length;

  return y >= plotBottom && y <= plotBottom + layout.margin.b + 20;
}

function lineDrawYear() {
  if (state.playing) return state.currentYear;
  if (state.currentYear < state.yearEnd - 1e-6) return state.currentYear;
  return state.yearEnd;
}

function rankingYear() {
  return state.playing ? state.currentYear : state.scrubYear;
}

function selectYear(year) {
  if (state.playing) pauseAnimation();
  state.scrubYear = Math.max(state.yearStart, Math.min(state.yearEnd, Math.round(year)));
  renderCharts();
}

function handleYearAxisClick(chartEl, clientX, clientY) {
  if (!isInXAxisZone(chartEl, clientY)) return;
  const year = yearFromClickX(chartEl, clientX);
  if (year !== null) selectYear(year);
}

function updatePanelHeader() {
  const titleEl = document.getElementById("panel-title");
  const legendEl = document.getElementById("country-legend");

  if (state.compareMode) {
    titleEl.textContent = `${countryLabel(state.countryA)} vs ${countryLabel(state.countryB)}`;
    legendEl.classList.remove("hidden");
    legendEl.innerHTML = `
      <span class="legend-chip side-a">
        <span class="swatch solid" style="background:${COLORS_A[0]}"></span>
        ${countryLabel(state.countryA)} — solid lines
      </span>
      <span class="legend-chip side-b">
        <span class="swatch dashed" style="border-color:${COLORS_B[0]}"></span>
        ${countryLabel(state.countryB)} — dashed lines
      </span>
    `;
  } else {
    titleEl.textContent = countryLabel(state.countryA);
    legendEl.classList.add("hidden");
    legendEl.innerHTML = "";
  }
}

function syncRankingLayout() {
  const single = document.getElementById("ranking-single");
  const rankingA = document.getElementById("ranking-a");
  const rankingB = document.getElementById("ranking-b");
  const sidebar = document.getElementById("ranking-sidebar");

  if (state.compareMode) {
    single.classList.add("hidden");
    rankingA.classList.remove("hidden");
    rankingB.classList.remove("hidden");
    sidebar.classList.add("compare-rankings");
  } else {
    single.classList.remove("hidden");
    rankingA.classList.add("hidden");
    rankingB.classList.add("hidden");
    sidebar.classList.remove("compare-rankings");
  }
}

function renderCharts() {
  updatePanelHeader();
  syncRankingLayout();

  const entries = state.compareMode
    ? portEntriesForCompare()
    : selectedPorts(state.countryA).map((port, index) => ({
        port,
        country: state.countryA,
        countryLabel: countryLabel(state.countryA),
        side: "a",
        color: COLORS_A[index % COLORS_A.length],
      }));

  ensureHighlightValid(entries);
  const drawYear = lineDrawYear();
  const yMax = yAxisMax(entries);
  const traces = buildTraces(entries, drawYear);
  const margin = state.compareMode ? CHART_MARGIN_COMPARE : CHART_MARGIN;

  const layout = {
    margin: { ...margin },
    uirevision: state.compareMode ? "plsci-compare" : "plsci-single",
    paper_bgcolor: "#FFFFFF",
    plot_bgcolor: "#FFFFFF",
    xaxis: {
      title: "Year",
      range: [state.yearStart - 0.4, state.yearEnd + 0.4],
      dtick: Math.max(1, Math.round((state.yearEnd - state.yearStart) / 8)),
      hoverformat: ".0f",
      gridcolor: "#ECECEC",
      zeroline: false,
      fixedrange: true,
      showspikes: true,
      spikemode: "across",
      spikesnap: "cursor",
      spikecolor: "#BBBBBB",
      spikethickness: 1,
    },
    yaxis: {
      title: "PLSCI",
      range: [0, yMax],
      gridcolor: "#ECECEC",
      zeroline: false,
      fixedrange: false,
    },
    showlegend: state.compareMode,
    legend: state.compareMode
      ? {
          orientation: "v",
          x: 1.02,
          y: 1,
          xanchor: "left",
          yanchor: "top",
          font: { size: 11 },
          tracegroupgap: 4,
          groupclick: "toggleitem",
        }
      : undefined,
    hovermode: "x unified",
    hoverlabel: {
      bgcolor: "#FFFFFF",
      bordercolor: "#E6E6E6",
      font: {
        family: "IBM Plex Mono, Menlo, Consolas, monospace",
        size: 13,
        color: "#242424",
      },
      align: "left",
    },
    font: { family: "IBM Plex Sans, Segoe UI, sans-serif", color: "#242424" },
    annotations: buildLabelAnnotations(entries, drawYear, yMax),
  };

  Plotly.react("chart", traces, layout, PLOTLY_CONFIG);

  const year = rankingYear();
  if (state.compareMode) {
    const portsA = selectedPorts(state.countryA);
    const portsB = selectedPorts(state.countryB);
    const colorsA = colorMap(portsA);
    const colorsB = {};
    portsB.forEach((port, index) => {
      colorsB[port.id] = COLORS_B[index % COLORS_B.length];
    });
    renderRankingList("ranking-a", countryLabel(state.countryA), portsA, colorsA, year);
    renderRankingList("ranking-b", countryLabel(state.countryB), portsB, colorsB, year);
  } else {
    const ports = selectedPorts(state.countryA);
    renderRankingList("ranking-single", "Ranking", ports, colorMap(ports), year);
  }

  if (!state.chartInteractionsBound) {
    bindChartInteractions();
    state.chartInteractionsBound = true;
  }
}

function syncYearInputs() {
  document.getElementById("year-start").value = state.yearStart;
  document.getElementById("year-end").value = state.yearEnd;
  document.getElementById("year-start-value").textContent = state.yearStart;
  document.getElementById("year-end-value").textContent = state.yearEnd;
  const preRescaleMax = state.data.meta.rescaleYear - 1;
  document.getElementById("year-start").max = preRescaleMax;
  document.getElementById("year-end").max = preRescaleMax;
  document.getElementById("year-start").min = state.data.meta.yearMin;
  document.getElementById("year-end").min = state.data.meta.yearMin;
}

function clampYearRange() {
  if (state.yearStart > state.yearEnd) {
    [state.yearStart, state.yearEnd] = [state.yearEnd, state.yearStart];
  }
  if (state.currentYear < state.yearStart) state.currentYear = state.yearStart;
  if (state.currentYear > state.yearEnd) state.currentYear = state.yearEnd;
  if (state.scrubYear < state.yearStart) state.scrubYear = state.yearStart;
  if (state.scrubYear > state.yearEnd) state.scrubYear = state.yearEnd;
}

function animationDurationMs() {
  const span = Math.max(0, state.yearEnd - state.yearStart);
  return Math.max(2500, span * MS_PER_YEAR);
}

function pauseAnimation() {
  state.playing = false;
  if (state.animationFrame) {
    cancelAnimationFrame(state.animationFrame);
    state.animationFrame = null;
  }
  if (state.animationStartTime !== null) {
    state.animationElapsed += performance.now() - state.animationStartTime;
    state.animationStartTime = null;
  }
  if (state.currentYear < state.yearEnd - 1e-6) {
    state.scrubYear = Math.round(state.currentYear);
  }
  document.getElementById("play-btn").textContent = "Play";
}

function startAnimation() {
  if (state.currentYear >= state.yearEnd - 1e-6) {
    state.currentYear = state.yearStart;
    state.animationElapsed = 0;
  }

  state.playing = true;
  document.getElementById("play-btn").textContent = "Pause";
  state.animationStartTime = performance.now();

  const span = state.yearEnd - state.yearStart;
  const duration = animationDurationMs();

  function tick(now) {
    if (!state.playing) return;

    const elapsed = state.animationElapsed + (now - state.animationStartTime);
    const linear = Math.min(1, elapsed / duration);
    const eased = smoothstep(linear);
    state.currentYear = state.yearStart + eased * span;
    renderCharts();

    if (linear >= 1) {
      state.currentYear = state.yearEnd;
      state.scrubYear = state.yearEnd;
      state.animationElapsed = 0;
      pauseAnimation();
      renderCharts();
      return;
    }

    state.animationFrame = requestAnimationFrame(tick);
  }

  state.animationFrame = requestAnimationFrame(tick);
}

function toggleAnimation() {
  if (state.playing) {
    pauseAnimation();
    return;
  }
  startAnimation();
}

function showFullRange() {
  pauseAnimation();
  state.animationElapsed = 0;
  clampYearRange();
  state.currentYear = state.yearEnd;
  state.scrubYear = state.yearEnd;
  renderCharts();
}

function resetView() {
  pauseAnimation();
  state.animationElapsed = 0;
  state.currentYear = state.yearStart;
  state.scrubYear = state.yearStart;
  renderCharts();
}

function bindChartInteractions() {
  const chart = document.getElementById("chart");

  chart.on("plotly_click", (event) => {
    const point = event.points?.[0];
    if (point) {
      const portId = state.tracePortIds[point.curveNumber];
      if (portId) {
        state.ignoreNextAxisClick = true;
        setHighlightedPort(portId);
        return;
      }
    }

    if (event.event) {
      handleYearAxisClick(chart, event.event.clientX, event.event.clientY);
    }
  });

  chart.addEventListener("click", (event) => {
    if (state.ignoreNextAxisClick) {
      state.ignoreNextAxisClick = false;
      return;
    }
    handleYearAxisClick(chart, event.clientX, event.clientY);
  });
}

function bindRankingInteractions() {
  ["ranking-single", "ranking-a", "ranking-b"].forEach((elementId) => {
    const ranking = document.getElementById(elementId);

    ranking.addEventListener("click", (event) => {
      const row = event.target.closest(".rank-row[data-port-id]");
      if (!row) return;
      setHighlightedPort(row.dataset.portId);
    });

    ranking.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const row = event.target.closest(".rank-row[data-port-id]");
      if (!row) return;
      event.preventDefault();
      setHighlightedPort(row.dataset.portId);
    });
  });
}

function populateCountrySelect(selectId, selectedCountry) {
  const select = document.getElementById(selectId);
  select.innerHTML = "";
  Object.keys(state.data.countries)
    .sort((a, b) => state.data.countries[a].label.localeCompare(state.data.countries[b].label))
    .forEach((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = state.data.countries[key].label;
      select.appendChild(option);
    });
  if (state.data.countries[selectedCountry]) {
    select.value = selectedCountry;
  }
}

function syncCompareControls() {
  document.getElementById("country-b-control").classList.toggle("hidden", !state.compareMode);
}

function onCountryChange() {
  state.highlightedPortId = null;
  showFullRange();
}

function bindControls() {
  const meta = state.data.meta;
  state.yearStart = Math.max(meta.yearMin, 2006);
  state.yearEnd = Math.min(meta.yearMax, meta.rescaleYear - 1);
  state.currentYear = state.yearEnd;
  state.scrubYear = state.yearEnd;

  if (!state.data.countries[state.countryA]) {
    state.countryA = Object.keys(state.data.countries)[0];
  }
  if (!state.data.countries[state.countryB]) {
    state.countryB = Object.keys(state.data.countries).find((key) => key !== state.countryA)
      ?? state.countryA;
  }

  populateCountrySelect("country-a", state.countryA);
  populateCountrySelect("country-b", state.countryB);
  syncYearInputs();
  syncCompareControls();

  document.getElementById("country-a").addEventListener("change", (event) => {
    state.countryA = event.target.value;
    if (state.compareMode && state.countryB === state.countryA) {
      const alternatives = Object.keys(state.data.countries).filter((key) => key !== state.countryA);
      state.countryB = alternatives[0] ?? state.countryA;
      document.getElementById("country-b").value = state.countryB;
    }
    onCountryChange();
  });

  document.getElementById("country-b").addEventListener("change", (event) => {
    state.countryB = event.target.value;
    if (state.countryB === state.countryA) {
      const alternatives = Object.keys(state.data.countries).filter((key) => key !== state.countryA);
      state.countryB = alternatives[0] ?? state.countryA;
      event.target.value = state.countryB;
    }
    onCountryChange();
  });

  document.getElementById("compare-mode").addEventListener("change", (event) => {
    state.compareMode = event.target.checked;
    state.highlightedPortId = null;
    syncCompareControls();
    renderCharts();
  });

  document.getElementById("year-start").addEventListener("input", (event) => {
    state.yearStart = Number(event.target.value);
    clampYearRange();
    syncYearInputs();
    showFullRange();
  });

  document.getElementById("year-end").addEventListener("input", (event) => {
    state.yearEnd = Number(event.target.value);
    clampYearRange();
    syncYearInputs();
    showFullRange();
  });

  document.getElementById("top-n").addEventListener("change", (event) => {
    pauseAnimation();
    state.topN = Number(event.target.value);
    renderCharts();
  });

  document.getElementById("play-btn").addEventListener("click", toggleAnimation);
  document.getElementById("reset-btn").addEventListener("click", resetView);

  const metaNote = meta.nCountries
    ? `${meta.source} ${meta.nCountries} countries, ${meta.nPorts} ports.`
    : meta.source;
  document.getElementById("source-note").textContent = metaNote;
}

async function init() {
  await loadData();
  bindControls();
  bindRankingInteractions();
  renderCharts();
}

init().catch((error) => {
  console.error(error);
  document.body.innerHTML = `<p style="padding:2rem;color:#c0392b;">${error.message}</p>`;
});
