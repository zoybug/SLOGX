# Fall 2025 centered learning workspace

The 2025 archive and six lecture pages load `assets/briefing-2025.css` and `assets/briefing-2025.js`. They retain the topic color tokens in `assets/2025-theme.css`. The served HTML is the content source; no website build is required.

## Hierarchy and navigation

The browser canvas surrounds one white application shell: `max-width: 1080px`, centered with substantial space on large monitors. The shell has a subtle border, restrained shadow and rounded corners. Desktop inner gutters are 40 px, reducing to 32 px on compact desktops, 20 px on tablets and 16 px on phones. Reading sections and full notes stay within 700 px. Never widen the workspace to accommodate longer prose.

The archive's primary task is choosing a lecture. Its compact register uses topic-colored numbers, short titles, subject keywords and speaker/date metadata. Official syllabus titles remain in the course-details disclosure and accessible lecture labels.

Lecture pages use a compact sticky course header, a numbered lecture switcher, and the same four section labels: **Overview**, **Student synthesis**, **Resources**, **Quiz**. Full lecture names remain available through accessible labels and link titles. Three outline disclosures offer detail on demand. The measured header offset keeps anchors and direct synthesis links below the navigation.

IBM Plex Sans is used for headings and body text; IBM Plex Mono is limited to numbers and technical labels. Body text remains readable at 16 px. Main statements retain a clear hierarchy without oversized editorial titles. Unmodified fonts are served locally with their IBM license in `assets/fonts/`.

## Synthesis views and full notes

One focused rounded synthesis surface presents a main takeaway and two short supporting points with a chart, comparison or model. Its desktop columns share the same compact workspace; phones stack them. Repeated decorative labels and nested model boxes are removed. Passive evidence uses alignment and small local rules. Controls use subtle rounded states and transitions; topic colors serve as accents.

There is no internal deck scrolling. Desktop views target the available viewport, and content remains in normal document flow rather than clipping when a screen is short or text is enlarged. Mobile uses a single column with natural page scrolling. Navigation supports previous/next, numbered view buttons, a contents view, and left/right keys when the synthesis region is focused. Range sliders keep their own arrow-key behavior.

Full notes and model assumptions open as a regular 700 px reading section below the synthesis. Original explanations, formulas, source qualifications and external references remain available there. Lecture 03's constructed order-input table is included in these notes; the policy controls and results stay in the focused panel. The control reports its expanded state, and returning to the synthesis restores focus. Source counts and reconciliation appear in **About this synthesis**.

Lecture 06 has six views: the traffic-headway and shuttle-fleet calculations are separate questions. The shuttle quiz's related reading targets `#slide-capacity`. Existing panel IDs and legacy hashes continue to open the matching view; deeper note targets open their full notes.

## Resources, quiz and facts

Resources form stacked groups within a 700 px reading column, with descriptions and external-link indications. The quiz uses one calm rounded surface within the same width and retains its twelve questions, answer keys, immediate explanations, related readings and restart behavior. Both remain accessible by keyboard.

Zoybug is a floating logistics familiar on 2025 pages. Its original parcel-creature SVG bobs, blinks and carries a forehead display of the number of discovered facts. Facts remain hidden until click or keyboard activation; close and Escape return focus to the companion. It shifts vertically when it would cover a visible control. Reduced-motion preferences stop decorative animation. Its 100 facts, source links and saved discovery history are preserved.

## Maintenance

Edit the served 2025 HTML for takeaways and full notes; edit the lecture-specific JavaScript for model data or quizzes. Keep DOM IDs unique and retain event targets when moving controls. Add a matching note section, contents entry and numbered control when adding a view. The layout scripts and styles are not loaded by the 2026 pages.
