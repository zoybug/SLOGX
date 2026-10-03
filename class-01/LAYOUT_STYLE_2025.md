# Fall 2025 briefing layout

The 2025 archive and six lecture pages load `assets/briefing-2025.css` and `assets/briefing-2025.js`. They retain the topic color tokens in `assets/2025-theme.css`. The served HTML is the content source; no website build is required.

## Hierarchy and navigation

The archive's primary task is choosing a lecture. Its register uses thin topic-color cues, a short title, subject keywords and speaker/date metadata. Official syllabus titles remain in the course-details disclosure and accessible lecture labels.

Lecture pages use a 56 px course header, 44 px lecture rail, and the same four section labels: **Overview**, **Student synthesis**, **Resources**, **Quiz**. On narrow screens, the rail shows lecture numbers, with full accessible labels. The header offset is measured so anchors remain visible below the sticky navigation.

The content width is at most 1200 px, with 64 px desktop margins, 32 px tablet margins and 20 px mobile margins. Ordinary reading paragraphs stay within roughly 72 characters. IBM Plex Sans is used for headings and body text; IBM Plex Mono is limited to numbers and technical labels. Unmodified fonts are served locally with their IBM license in `assets/fonts/`.

## Synthesis views and full notes

One active view presents a main takeaway and two short supporting points on the left, with a chart, comparison or model on the right. Noninteractive evidence uses text rows and rules. Borders surround controls and models when they serve a functional purpose.

There is no internal deck scrolling. Desktop views target the available viewport, and content remains in normal document flow rather than clipping when a screen is short or text is enlarged. Mobile uses a single column with natural page scrolling. Navigation supports previous/next, numbered view buttons, a contents view, and left/right keys when the synthesis region is focused. Range sliders keep their own arrow-key behavior.

Full notes and model assumptions open as a regular page section below the synthesis. Original explanations, formulas, source qualifications and external references remain available there. The control reports its expanded state, and returning to the synthesis restores focus. Source counts and reconciliation appear in **About this synthesis**.

Lecture 06 has six views: the traffic-headway and shuttle-fleet calculations are separate questions. The shuttle quiz's related reading targets `#slide-capacity`. Existing panel IDs and legacy hashes continue to open the matching view; deeper note targets open their full notes.

## Resources, quiz and facts

Resources form grouped reading rows, with a visible description and external-link indication. The quiz retains its twelve questions, answer keys, immediate explanations, related readings and restart behavior. It uses one main column with optional instructions. Both remain accessible by keyboard.

Zoybug is a floating logistics familiar on 2025 pages. Its original parcel-creature SVG bobs, blinks and carries a forehead display of the number of discovered facts. Facts remain hidden until click or keyboard activation; close and Escape return focus to the companion. It shifts vertically when it would cover a visible control. Reduced-motion preferences stop decorative animation. Its 100 facts, source links and saved discovery history are preserved.

## Maintenance

Edit the served 2025 HTML for takeaways and full notes; edit the lecture-specific JavaScript for model data or quizzes. Keep DOM IDs unique and retain event targets when moving controls. Add a matching note section, contents entry and numbered control when adding a view. The layout scripts and styles are not loaded by the 2026 pages.
