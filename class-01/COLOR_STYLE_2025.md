> Original lecture palettes retained in the 10 October 2026 editorial refactor. See [EDITORIAL_DESIGN.md](EDITORIAL_DESIGN.md) for the shared typography, layout and neutral foundation.

# Fall 2025 lecture colors

`assets/2025-theme.css` defines the original palette and topic identities. Each 2025 page identifies its year and lecture with data attributes. The 2025 briefing layout loads `assets/briefing-2025.css` after the color styles, and `assets/editorial.css` loads last to apply the shared design while preserving each topic palette. The 2026 pages do not load the archive's theme or briefing styles.

| 2025 lecture | Topic | Primary | Deep | Soft | Accent |
| --- | --- | --- | --- | --- | --- |
| 01 | Digital transformation | #4338CA | #1E1B4B | #EEF2FF | #06B6D4 |
| 02 | Transportation | #1D4ED8 | #172554 | #EFF6FF | #F97316 |
| 03 | Warehousing | #B45309 | #451A03 | #FFFBEB | #475569 |
| 04 | Urban drone logistics | #0E7490 | #164E63 | #ECFEFF | #38BDF8 |
| 05 | Positioning | #047857 | #064E3B | #ECFDF5 | #84CC16 |
| 06 | Autonomous driving | #52525B | #27272A | #F4F4F5 | #A1A1AA |
| 07 | Global trade and growth · Henry Ko | #1E3A8A | #0F172A | #F1F5F9 | #E85D3F |
| Visit | SF Express Shenzhen | #B91C1C | #7F1D1D | #FEF2F2 | #F97316 |

The supplied direction describes 2026. Colors follow the actual 2025 topics: cyan belongs to Lecture 04. The supplied graphite palette is used for Lecture 06 because no autonomous-driving palette was specified. Lecture 07 retains its navy/coral identity for Henry Ko's guest lecture, which replaced the scheduled container-terminals session on 3 November 2025.

The closing industry visit's red tokens are defined in `assets/briefing-2025.css` for `data-lecture="visit"`, including its register row and navigation link. They provide small accents, selected states and the code-native parcel illustration. The neutral editorial foundation and new layout remain shared across both years.

The shared editorial foundation uses an ivory #F7F6F2 canvas, optional white #FFFFFF surfaces, #242723 body text, #62675F secondary text and #DEDFD8 dividers. Layout, typography and spacing match the 2026 course. The original 2025 topic palette supplies accents across the page, including scoped shared color aliases for selected and hover states. Rebind aliases on each `data-lecture` element so register rows and navigation entries keep their own identity.

Primary colors identify hero takeaways, lecture numbers, selected navigation, controls, progress and chart series. Deep colors support small labels and links. Soft colors are limited to selected/hover states and supporting diagram surfaces. Accent colors mark diagram signals and movement. White-text buttons use primary colors, all exceeding 4.5:1 contrast; bright accents are not button fills. Quiz success/error feedback keeps its semantic colors. Ordinary body copy, surfaces, borders, course-year navigation and footer text remain neutral. The floating Zoybug mascot keeps its mint/coral brand colors; its fact-card accents follow the current lecture.

SVG variants live in `assets/2025-theme/`. After changing palette tokens, run `python class-01/tools/build-2025-theme-art.py` from the repository root. This rebuilds only the 2025 variants from the shared originals. The positioning lab uses the same tokens directly in its inline SVG. No website build is needed.
