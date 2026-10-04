# Fall 2025 lecture colors

`assets/2025-theme.css` defines the palette and topic identities. Each 2025 page identifies its year and lecture with data attributes. The 2025 briefing layout loads `assets/briefing-2025.css` after the color styles; see `LAYOUT_STYLE_2025.md` for typography and spacing. The 2026 pages do not load either file.

| 2025 lecture | Topic | Primary | Deep | Soft | Accent |
| --- | --- | --- | --- | --- | --- |
| 01 | Digital transformation | #4338CA | #1E1B4B | #EEF2FF | #06B6D4 |
| 02 | Transportation | #1D4ED8 | #172554 | #EFF6FF | #F97316 |
| 03 | Warehousing | #B45309 | #451A03 | #FFFBEB | #475569 |
| 04 | Urban drone logistics | #0E7490 | #164E63 | #ECFEFF | #38BDF8 |
| 05 | Positioning | #047857 | #064E3B | #ECFDF5 | #84CC16 |
| 06 | Autonomous driving | #52525B | #27272A | #F4F4F5 | #A1A1AA |
| 07 | Container terminals | #1E3A8A | #0F172A | #F1F5F9 | #E85D3F |
| Visit | SF Express Shenzhen | #B91C1C | #7F1D1D | #FEF2F2 | #F97316 |

The supplied direction describes 2026. Colors follow the actual 2025 topics: cyan belongs to Lecture 04. The supplied graphite palette is used for Lecture 06 because no autonomous-driving palette was specified. Lecture 07 has a register/selector identity but remains unavailable until its learning materials exist.

The closing industry visit's red tokens are defined in `assets/briefing-2025.css` for `data-lecture="visit"`, including its register row and navigation link. They provide small accents, selected states and the code-native parcel illustration. The main workspace remains white; no large red backgrounds are used.

The centered workspace overrides the base canvas with #F3F5F8, surrounding a white #FFFFFF application shell. Light supporting surfaces use #F8FAFC and #FAFBFD, with subtle #E4E8EF workspace borders. Text remains #111827. Secondary text uses #64748B on white and #5F6F85 on neutral surfaces. The topic palette stays unchanged and is used primarily for accents inside the shell.

Primary colors identify hero emphasis, lecture numbers, selected navigation, controls, progress and chart series. Deep colors support small labels and links. Soft colors are limited to selected/hover states and supporting diagram surfaces. Accent colors mark diagram signals and movement. White-text buttons use primary colors, all exceeding 4.5:1 contrast; bright accents are not button fills. Quiz success/error feedback keeps its semantic colors. Ordinary body copy, surfaces, borders, course-year navigation and footer text remain neutral. The floating Zoybug mascot keeps its mint/coral brand colors; its fact-card accents follow the current lecture.

SVG variants live in `assets/2025-theme/`. After changing palette tokens, run `python class-01/tools/build-2025-theme-art.py` from the repository root. This rebuilds only the 2025 variants from the shared originals. The positioning lab uses the same tokens directly in its inline SVG. No website build is needed.
