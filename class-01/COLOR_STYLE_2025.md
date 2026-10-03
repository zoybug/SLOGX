# Fall 2025 lecture colors

`assets/2025-theme.css` is the palette and component source. Each 2025 page loads it last and identifies its year and lecture with data attributes. The layout, typography and spacing remain shared. The 2026 pages do not load this file.

| 2025 lecture | Topic | Primary | Deep | Soft | Accent |
| --- | --- | --- | --- | --- | --- |
| 01 | Digital transformation | #4338CA | #1E1B4B | #EEF2FF | #06B6D4 |
| 02 | Transportation | #1D4ED8 | #172554 | #EFF6FF | #F97316 |
| 03 | Warehousing | #B45309 | #451A03 | #FFFBEB | #475569 |
| 04 | Urban drone logistics | #0E7490 | #164E63 | #ECFEFF | #38BDF8 |
| 05 | Positioning | #047857 | #064E3B | #ECFDF5 | #84CC16 |
| 06 | Autonomous driving | #52525B | #27272A | #F4F4F5 | #A1A1AA |
| 07 | Container terminals | #1E3A8A | #0F172A | #F1F5F9 | #E85D3F |

The supplied direction describes 2026. Colors follow the actual 2025 topics: cyan belongs to Lecture 04. The supplied graphite palette is used for Lecture 06 because no autonomous-driving palette was specified. Lecture 07 has a register/selector identity but remains unavailable until its learning materials exist.

The canvas is #F7F7F4, text #111827, white surfaces #FFFFFF and borders #DDE1E7. Secondary text uses #64748B on white; #5F6F85 on the canvas provides sufficient contrast for small text (4.77:1 versus 4.43:1 with the original gray).

Primary colors identify hero emphasis, lecture numbers, selected navigation, controls, progress and chart series. Deep colors support small labels and links. Soft colors are limited to hero art, resource headings, callouts and selected/hover states. Accent colors mark diagram signals and movement. White-text buttons use primary colors, all exceeding 4.5:1 contrast; bright accents are not button fills. Quiz success/error feedback keeps its semantic colors. Ordinary body copy, card surfaces, borders, course-year navigation and footer text remain neutral. The shared Zoybug mascot keeps its brand colors; its progress ring and fact-card accents follow the current lecture.

SVG variants live in `assets/2025-theme/`. After changing palette tokens, run `python class-01/tools/build-2025-theme-art.py` from the repository root. This rebuilds only the 2025 variants from the shared originals. The positioning lab uses the same tokens directly in its inline SVG. No website build is needed.
