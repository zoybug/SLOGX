# SLOGX shared editorial design

The 2025 archive and 2026 course share a centered academic reading experience. This is the active presentation specification, implementing the approved 10 October 2026 directive.

## Tokens and stylesheet order

`assets/site.css` imports `design-tokens.css`; that file imports local font faces. Existing lecture CSS owns the teaching component structure. Every course page loads `editorial.css` last for the shared presentation. `2025-theme.css` preserves the original lecture palettes; `editorial.css` maps them to shared component states at each lecture scope. The visit's original red/orange tokens remain in `briefing-2025.css`. Ornamental backgrounds remain retired.

- Warm ivory `#F7F6F2`, white surfaces when needed, ink `#242723`, muted `#62675F`, pine accent `#356052`, quiet dividers `#DEDFD8`.
- The 2026 course uses pine. The 2025 archive keeps its original indigo, blue, amber, cyan, emerald, graphite, navy/coral and visit red/orange identities. Each register row and lecture-navigation entry has its own palette. See `COLOR_STYLE_2025.md` for exact values. Body copy stays neutral; takeaways, controls, progress and diagrams use the lecture palette.
- `--color-control-line` is a stronger boundary for interactive controls. Quiet dividers are for passive groups, not control identification.
- Source Serif 4 for page/major headings and occasional takeaways; Source Sans 3 for body, synthesis, navigation, captions and controls. Use 400/500/600; tabular numerals for progress and results. Code keeps a monospace stack.
- Local variable WOFF2 subsets, `font-display: swap`, preload only the two normal Latin faces. CJK and unsupported scripts fall back to local Noto/system fonts. No remote font requests are required.
- App width 1040 px, main content 960 px, reading column at most 760 px. Mobile has 20 px side margins. Spacing follows 8/12/16/24/32/48/64 px; interactive radii 6/8 px.

## Components and interaction

Registers are vertical indexes separated by fine rules. Resources are a single readable list with complete descriptions and underlined titles. Passive explanations use typography and rules; stage selectors, models, quiz choices, menus and popups retain functional boundaries.

Both years show one complete synthesis view at a time in ordinary document flow. All views are accessible from contents and previous/next controls. Inactive views are hidden and inert, and keyboard arrows work when the sequence region is focused. The 2026 sequence also preserves touch swipe navigation. Stable section IDs and fragment links remain unchanged. The archive's full-note disclosures and methodology notes remain available.

`editorial.js` makes the skip link focus the main content, observes header height for fragment offsets, restores focus after the 2026 teaching scripts replace their controls, and presents the existing 2026 quiz instructions through a native disclosure. Restart stays beside the question controls. The archive retains its existing focus/disclosure logic. Companion positioning avoids visible controls. The sourced fact companion, discoveries and persistence remain; its decorative motion and aura are removed. Reduced-motion mode disables animations and transitions globally.

## Maintenance

Edit shared tokens for fonts, widths, spacing and the 2026 palette. Edit the scoped lecture tokens for 2025 colors. Add component presentation rules to `editorial.css`, with responsive rules beside the existing breakpoints. Leave lecture data, citations, source scope, calculations, quiz explanations and diagram distinctions in their authoritative HTML/JavaScript/SVG files. Keep relative paths under `/SLOGX/class-01/`; this remains a buildless GitHub Pages site from `prod`.

Original assets and downloadable teaching artifacts remain intact. Printed/exported briefs and posters keep their original document styling. The separate PLSCI application at the repository root is outside this course-atlas directive.
