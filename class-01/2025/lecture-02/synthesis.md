# Fall 2025 · Lecture 02

## Smart Transportation and Distribution

**Guest lecturer:** Prof. Mingyao Qi, Institute of Data and Information, Tsinghua Shenzhen International Graduate School. **Date:** 22 September 2025. **Course instructor:** Prof. Wai Kin (Victor) Chan. Course: Introduction to Smart Logistics, 85991591.

The supplied lecture moves from freight scenarios to physical and digital technologies, then to algorithms. Road, rail, air, ship and pipeline services become intermodal systems through transfer, consolidation and storage. Short-haul scenarios include retail replenishment, express and instant delivery, medical/humanitarian logistics and technician services. Vehicle innovations change the feasible decisions: an electric truck needs charging, a truck–drone pair needs rendezvous, and an automated port needs coordinated crane and vehicle work.

**Assignment as supplied:** “Write a 2-page report to introduce a smart transportation application.” The evidence categories in this synthesis are editorial analysis dimensions, not an assigned Q1–Q4 rubric. No new grades or individual feedback were generated.

## Corpus and method

Both submission files were read in full. There are **29 attributed reports with 29 unique normalized student IDs: 13 in the first batch and 16 in the second**. An additional unattributed repetition of the CityFlow Connect text in the second file is excluded. Repeated page headers do not create new reports. The private ledger retains identities, source boundaries, hashes and analysis; the public archive uses anonymous paraphrases.

The denominator is the supplied corpus, not a verified enrollment roster. No attributed report appears visibly cut off in the TXT, but extracted images and original document layouts cannot be assessed. Reports include focused applications, literature summaries, lecture surveys and original concepts. These have different evidence status. Student descriptions of company algorithms, certification, cost savings and future services are not automatically external facts.

## 1. Application landscape

One primary family per report describes its central focus. Categories are mutually exclusive for this display; reports often mention additional technologies.

| Primary application family | Reports | Main operating question |
|---|---:|---|
| Passenger mobility | 7/29 | How do vehicles, stops/vertiports and passenger access work together? Six UAM reports and one smart-bus report. |
| Drone logistics | 6/29 | Which tasks can fly, and how do endurance, payload and truck rendezvous constrain service? |
| Integrated surveys / concepts | 6/29 | How should several modes, facilities and operators be coordinated? Five broad surveys/integrated proposals plus one CityFlow concept. |
| Platforms | 5/29 | How does traffic, map, fleet or shipment data reach an actionable decision? |
| Energy and charging | 4/29 | How should routes, charging times, stations and energy supply be planned together? |
| Port automation | 1/29 | How can cranes and vehicles avoid blocking and waiting across container handoffs? |

This is a map of report topics, not a ranking of technological value or a measure of student agreement. Broad surveys are retained; they are not silently reassigned to whichever device appears most often.

## 2. What connects the reports

Across very different applications, intelligence becomes useful through a chain: **observe → model → choose → coordinate → execute → review**. This is an editorial synthesis of the corpus and lecture, not a quotation from the professor.

- **Observe:** Orders, traffic, GPS, onboard diagnostics, cargo state and battery state reveal the operating situation. The navigation and telematics reports emphasize map maintenance, connectivity, cloud systems and APIs behind a polished interface.
- **Model:** Separate a map, a forecast and a digital twin from the physical process. A prediction of congestion does not select a feasible route; a simulation does not establish deployment safety.
- **Choose:** Define the objective and decision variables. Route sequence, assignment, charge duration, charger location, vehicle pairing and locker placement live at different planning levels.
- **Coordinate:** A fast leg can still create a slow service if another vehicle, crane, courier or passenger connection is not ready. Truck–drone and port reports make these handoffs especially visible.
- **Execute:** Translate a plan into dispatch, charging, customer communication and intervention. Autonomous operation still needs a defined operating scope, an owner and a fallback.
- **Review:** Compare service, waiting, energy, total cost and access with a documented baseline. The metrics below are teaching suggestions, not outcomes measured by this class.

## 3. Different applications, different feasible plans

**Drone logistics.** Reports connect urgent or remote access with range and payload limits. Some propose a truck as a mobile depot; others distinguish surveillance from delivery. A rendezvous must occur before endurance is exhausted. A distinctive reflection asks for load-dependent energy rather than a fixed distance allowance. That idea changes feasibility before it changes the objective. The lecture’s Nested-VRP reference concerns coordinated surveillance and battery swaps; it is not evidence that every delivery operator runs the same algorithm. [Original research preprint](https://arxiv.org/abs/2103.01528).

**Electric fleets.** The energy reports link conductive charging, wireless charging, swapping, grid demand and infrastructure placement. A route can be short yet infeasible if the remaining battery cannot reach an available charger. Charging duration, queue/capacity and customer timing interact. Joint routing and charging research in the lecture examines this coupling. One reflection adds a longer horizon: a road investment can outlive the technology it was designed around. [Joint routing and charging research](https://arxiv.org/abs/2302.00240).

**Passenger mobility.** UAM reports attend to propulsion, vertiports, air traffic, certification and acceptance; a smart-bus report instead stresses demand, schedules and traveler information. These are distinct services. Airborne time savings should be evaluated with ground access, waiting, transfers and affordability. A demonstration flight does not establish routine passenger service. The FAA’s 2023 concept provides a separate operational framework, with AAM broader than its urban subset. [FAA UAM concept](https://www.faa.gov/air-taxis/uam_blueprint).

**Platforms.** Baidu Maps, Itsumo NAVI, ITS, telematics/ORION and a forum-described visibility platform connect observations with route guidance, maintenance, signals or exception handling. Those functions should not be collapsed into one algorithm. The visibility-platform report explicitly notes the absence of a clear demonstration/commercialization; the archive preserves that uncertainty. UPS’s own description connects ORION stop ordering with UPSNav directions, without adopting the student’s mislabelled per-route aggregate savings. [UPS navigation release](https://about.ups.com/us/en/newsroom/press-releases/innovation-driven/ups-deploys-purpose-built-navigation-for-ups-service-personnel.html).

**Ports.** The focused port report explains horizontal AGV movement and vertical crane work as one scheduling problem. Faster vehicles alone may leave waiting unchanged. Dispatch, crane readiness, charging and downtime matter together. PSA’s 2022 announcement supplies a primary fleet-management example; class numerical saving and throughput claims are not reproduced as verified results. [PSA / A*STAR collaboration](https://www.singaporepsa.com/2022/03/02/psa-and-astar-collaborate-on-smart-scalable-solutions-for-managing-automated-guided-vehicle-agv-fleets-in-preparation-for-tuas-port/).

**Integrated concepts.** The surveys connect modular vehicles, EVs, air mobility, ports, lockers and intermodal handoffs. CityFlow Connect is a student-proposed collaboration platform using vans as micro-hubs, cargo bikes, couriers and mobile lockers. It is presented as a design proposal, not a verified deployed product. Permission to track a moving customer also raises access, retention and security questions that aggregation alone cannot settle. The lecture’s locker paper explicitly compares human-driven and autonomous alternatives. [Mobile-locker research](https://www.sciencedirect.com/science/article/pii/S0968090X22002091).

## 4. Algorithm literacy and claims to examine

Students discuss shortest paths, VRP, mixed-integer models, construction and improvement heuristics, metaheuristics and learning. The useful connection is between the method and the decision it must deliver.

- A shortest path joins locations; a fleet plan also assigns tasks, sequences stops and respects capacity, time, energy and shared resources.
- Exact optimization can prove optimality for its mathematical model when the search completes with a valid bound. Runtime depends on structure, formulation, solver and budget; “about 100 customers” in the supplied slides is not a universal ceiling.
- Construction heuristics produce initial plans; 2-opt/3-opt change route edges. The lecture’s Clarke–Wright example uses savings `c(0,i)+c(0,j)-c(i,j)`: consider larger savings first, merge distinct routes at suitable endpoints, and check feasibility. The TXT’s contradictory “increasing” ordering is not carried into the teaching explanation.
- A metaheuristic can explore infeasible or worse intermediate states; its dispatched plan must satisfy the required operating constraints. Machine learning does not guarantee feasibility or optimality by itself.
- Drone payload figures refer to particular vehicles/scenarios. Passenger eVTOL and parcel UAV envelopes are not interchangeable.
- “Electric” means no tailpipe exhaust at use for the vehicle; a net environmental assessment also considers energy supply, battery production, infrastructure and the chosen comparison boundary. Wireless transfer and energy recovery do not create free energy.
- An airborne fulfillment center in the lecture is a patent/concept. A proposal, numerical study, controlled demonstration and operating service require different evidence.
- No class report establishes a general cost-saving percentage, universal safety advantage, free battery swapping, or driverless status of all platoons.

## 5. Distinctive insights and productive tensions

Anonymous paraphrases preserve ideas beyond the repeated technology vocabulary:

1. **Energy changes with load:** payload-dependent consumption can invalidate a plan that passes a fixed-range check.
2. **The handoff is a decision:** rendezvous, transfer equipment, package arrangement and cross-operator coordination can dominate a fast vehicle’s benefit.
3. **The interface hides work:** map databases, cloud migration, security and usable APIs sustain routing services.
4. **Infrastructure has a different clock:** technology obsolescence belongs in charging-road investment planning.
5. **Autonomy has people around it:** supervision, exception handling, liability and public acceptance remain system questions.
6. **A mixed fleet needs shared rules:** a collaborative van–bike–locker platform depends on access, service commitments and data permissions as well as routing.

The corpus contains both enthusiasm for autonomous/electric transport and attention to limits. Some reports focus on a device’s benefits; others model energy, timing or coordination. Broad integration proposals emphasize possibilities, while focused reports reveal dependencies. This is a difference in analytical scope, not a vote or a grading comparison.

Future discussion should distinguish an improved vehicle from an improved service. Useful research directions include robust energy/route plans, coordinated charging and infrastructure location, multimodal handoffs, service access, model validation and phased deployment. These are synthesis prompts grounded in the reports, not predictions endorsed by the lecturer.

## Review materials

- [Supplied lecture text](lecture-02-notes.txt): source PPT extraction, contact fields omitted; diagrams and tables may be incomplete. Historical content is preserved and should be read alongside the clarifications above.
- [Lecture and assignment guide](assignment-guide.md): public outline derived from the supplied syllabus.
- [Prof. Mingyao Qi’s official profile](https://www.sigs.tsinghua.edu.cn/qmy_en/main.htm).
- [Route4Me prelearning video](https://www.youtube.com/watch?v=CGfLDLc4sA0): the syllabus-provided “How to Plan a Route for 5,000 Addresses with Route4Me,” approximately 14 minutes. Automated playback verification was unavailable; the link is retained as supplied.
- [OR-Tools VRP](https://developers.google.com/optimization/routing/vrp) and [time windows](https://developers.google.com/optimization/routing/vrptw): companion examples for reading a constrained route plan.
- [Multi-truck/drone research record and abstract](https://research.polyu.edu.hk/en/publications/multi-trucks-and-drones-cooperative-pickup-and-delivery-problem/).
- [ORNL wireless charging demonstration, March 2024](https://www.ornl.gov/news/charging-commute): distinguish a controlled technology demonstration from network-wide availability.
- [NIST AI risk guidance](https://www.nist.gov/itl/ai-risk-management-framework): companion questions on responsibility and evaluation.

Companion resources checked 3 October 2026. Research abstracts and metadata support the narrow descriptions here; full publisher text may require library access. Living documentation can change. No instructor observations were supplied or invented.
