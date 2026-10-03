# Introduction to Smart Logistics / Class Atlas

This folder is a self-contained course site. `index.html` opens the eight-lecture register. Lectures 01 and 02 each have four main parts: lecture intro, a horizontally scrollable student-content slideshow, resources, and a decision quiz. Lecture 02 identifies Prof. Mingyao Qi and the September 22 session, follows the official scenarios–technologies–algorithms outline, and presents anonymous findings from 33 Assignment 02 reports. It includes 18 readings and a 12-question review. Student-level grading material and the private evidence matrix remain outside this repository. The slideshow has one horizontal scrollbar and separate side controls while slide content scrolls within the frame. The unified top navigation links the four main parts and lists the eight lectures. The `interactive/` address redirects to Lecture 01 so existing links still work. Lecture 01's PDFs, high-resolution PNG, editable SVG poster, and editable HTML brief are included. No build step is required.

## GitHub Pages

The public version lives at `/SLOGX/class-01/`. GitHub Pages publishes the repository root from the `prod` branch; preserve the `class-01` directory and its relative paths. No build step is required.

## Course years

The default register and existing lecture URLs remain Fall 2026. Visible year links lead to the Fall 2025 archive at `2025/`. The archive lists the seven sessions in the supplied 2025 syllabus; Lectures 01–06 have published learning pages.

`2025/lecture-01/` follows the same four-part lecture structure. It includes the professor, lecture title/date and shared lecture outline; five slides covering Q1–Q4; an interactive six-stage decision loop; a comparison of three lecture cases; eight companion readings; a 12-question scenario quiz; and anonymous webpage learning content. The synthesis covers 30 Lecture 01 reflections from the two supplied batches, with a report about another lecture excluded. Counts describe the submitted corpus, not a verified enrollment roster. Q3 counts group explicit keyword headings by synonyms, once per reflection per family; only the after-lecture list is used where both are supplied. Student identities and the private audit remain outside this repository.

The shared professor/deck context enriches the 2026 Lecture 01 introduction. Student evidence is kept separate by year. Companion links were checked in October 2026, and historical case evidence is distinguished from living product pages. The S.F. Holding 2024 report link points to the issuer's filing hosted by the Shenzhen Stock Exchange.

## Fall 2025 Lecture 02

`2025/lecture-02/` publishes anonymous learning content from 31 distinct submissions representing 30 students, a six-family application map, coordination loop, case comparisons, twelve scenario questions and primary companion readings. Two misplaced Lecture 02 texts are included: one adds a missing student and one supplements an existing student. The topic map counts one primary focus per student. One unattributed repeated CityFlow block is excluded. Private identities and source evidence remain outside the repository in `2025/L2_grading`. Pages uses the `prod` branch, root `/`.

## Fall 2025 Lecture 03 and resource policy

`2025/lecture-03/` presents warehousing operations, four system comparisons, a constructed batching/deadline lab, different student perspectives, measurement boundaries and twelve review questions. The two supplied files contain 30 identified records: 29 warehousing reflections and one transportation reflection routed to Lecture 02. An additional unattributed warehousing text has unresolved authorship and is outside the identified denominator. Private identity/source evidence stays outside this repository.

The 2025 pages publish learning content directly in HTML. Standalone synthesis exports, raw lecture TXT files and assignment-outline downloads were removed from Lectures 01 and 02 and are not generated for later lectures. Original sources and private audits are retained outside the website. The main Fall 2026 pages retain their existing resources.

## Fall 2025 Lecture 04

`2025/lecture-04/` includes the lecture introduction, five learning panels, a six-stage relay explorer, four urban constraint comparisons, a constructed latency model, eight companion resources and twelve review questions. The supplied corpus contains 29 distinct identified reflections from 29 students after merging one repeated block. Name-only and ID-only records are retained. A separate unattributed essay remains outside that count. Identity evidence and verification artifacts stay in the private `2025/L4_grading` folder, outside this repository.

## Fall 2025 Lecture 05

`2025/lecture-05/` includes the lecture introduction, five learning panels, a six-stage positioning explorer, a scalar Kalman-update model, a two-road HMM/Viterbi model, eight primary companion readings and twelve review questions. The corpus contains 30 distinct identified reflections from 30 students, including one name-only record, plus a separate unattributed companion outside that count. Private evidence and checks stay in `2025/L5_grading`, outside this repository. No reports or raw course-text downloads are generated.


## Fall 2025 Lecture 06

`2025/lecture-06/` adds Prof. Bokui Chen’s dated lecture context, six learning views, a responsibility explorer, five-step cognition loop, separate constructed headway and shuttle-capacity calculations, ten primary/syllabus companion links and twelve review questions. The corpus contains 30 identified student submissions including one name-only record, plus a separately titled unattributed companion outside the identified denominator. Three repeated page headers across two continuing reports are merged. Student concepts, personal experience and historical industry claims retain their evidence boundaries. Private source/identity audits remain in `2025/L6_grading` outside this repository. No synthesis exports or raw lecture/assignment downloads are generated.

## Fall 2025 editorial source

The 2025 pages share the section names **Overview**, **Student synthesis**, **Resources** and **Quiz**. Copy conventions are documented in `EDITORIAL_STYLE.md`. The served HTML and `assets/lecture-2025-*.js` files are the authoritative editorial source and need no build step. Historical intake/generation scripts outside this repository are not the current copy source. Panel links resolve stable IDs against the actual panel order, including the revised Lecture 01 and Lecture 02 sequences.

## Fall 2025 color identities

The 2025 register and Lectures 01–06 load `assets/2025-theme.css` after the shared styles. Four tokens give each lecture a topic color while body text, cards, borders and course-year navigation stay neutral. The supplied 2026 direction is mapped to the actual 2025 subjects: Lecture 04 is cyan for drones, and Lecture 06 uses graphite for autonomous driving. Lecture 07 has a navy/coral register identity and remains unavailable. Component and contrast conventions are documented in `COLOR_STYLE_2025.md`. SVG variants are generated with `python class-01/tools/build-2025-theme-art.py`; shared originals and 2026 colors remain unchanged.


## Fall 2025 briefing layout

The 2025 register and Lectures 01–06 load `assets/briefing-2025.css` after the topic colors and `assets/briefing-2025.js` after the interactive scripts. The archive leads with the lecture register. Each lecture has a compact overview, a lecture rail, one active synthesis view, grouped resources and a single-question quiz. Detailed source notes and original explanations are available through disclosures. Desktop content stays in ordinary document flow with no nested deck scrolling; mobile uses a single column. Lecture 06 separates traffic headway from shuttle capacity. Zoybug floats beside the page with a discovery counter and reveals a sourced fact only when activated.

`LAYOUT_STYLE_2025.md` documents the grid, navigation, disclosure and maintenance conventions. Fonts are served locally from `assets/fonts/` with their license. The 2026 layout and URLs remain unchanged. No build step is required.
