/* Fall 2025: anonymous aggregate and editorial teaching content. */
const stages = [{"name": "OBSERVE", "short": "Know the operating state", "description": "Capture orders, location, traffic, cargo and battery state. Check freshness and coverage before asking a model to plan.", "connection": "Maps, ITS and telematics"}, {"name": "MODEL", "short": "Represent needs and limits", "description": "Forecast travel or demand; model payload-dependent energy and infrastructure. Predictions and simulations require validation.", "connection": "Load-dependent drone energy; EV range"}, {"name": "CHOOSE", "short": "Define a feasible action", "description": "Choose route sequence, task assignment, charging duration or facility location under the service requirements. These are different decisions.", "connection": "VRP, charging and network design"}, {"name": "COORDINATE", "short": "Synchronize the handoffs", "description": "A truck must meet its drone before the battery is exhausted; a crane must be ready for the arriving AGV. Include queues, transfers and waiting.", "connection": "Truck–drone rendezvous; crane–AGV work"}, {"name": "EXECUTE", "short": "Dispatch with an owner", "description": "Apply the plan within its known operating scope. Communicate with drivers/customers and define override, fallback and exception handling.", "connection": "Fleet operations; oversight around autonomy"}, {"name": "REVIEW", "short": "Measure the whole service", "description": "Compare service, energy, waiting, access and cost with a baseline. Include infrastructure and lifecycle impacts where relevant, then revise the plan.", "connection": "Outcome measures are teaching suggestions"}];

let activeStage = 0;
const stageGrid = document.querySelector("#stage-grid");
function renderStage() {
  stageGrid.innerHTML = stages.map((stage, index) => `
    <button class="stage-button ${index === activeStage ? "active" : ""}" type="button" data-stage="${index}" aria-pressed="${index === activeStage}">
      <span class="num">[0${index + 1}]</span><span class="name">${stage.name}</span><span class="short">${stage.short}</span>
    </button>`).join("");
  const selected = stages[activeStage];
  document.querySelector("#stage-serial").textContent = `0${activeStage + 1}`;
  document.querySelector("#stage-title").textContent = `${selected.name} / ${selected.short}`;
  document.querySelector("#stage-description").textContent = selected.description;
  document.querySelector("#stage-connection").textContent = selected.connection;
}
stageGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-stage]");
  if (!button) return;
  activeStage = Number(button.dataset.stage);
  renderStage();
});
renderStage();

const themes = [["Passenger mobility", 7], ["Drone logistics", 6], ["Integrated surveys / concepts", 7], ["Platforms", 5], ["Energy and charging", 4], ["Port automation", 1]];

document.querySelector('#theme-bars').innerHTML = themes.map(([name,count]) => `<div class="bar-row"><span>${name}</span><span class="bar-track" role="img" aria-label="${name}: ${count} of 30"><i style="width:${count/30*100}%"></i></span><b>${count}/30</b></div>`).join('');
const insights = ["Payload-dependent energy can invalidate a plan that passes a fixed-range check.", "Handoff timing, transfer equipment and packing can dominate the benefit of a fast vehicle.", "Map databases, cloud systems, security and APIs sustain the interface people see.", "A long road investment must consider the risk that charging technology changes.", "Autonomy still involves supervision, exception ownership, liability and public trust.", "A collaborative van–bike–locker service needs shared commitments and clear data permissions.", "A recovered reflection connects difficult drone-served destinations with an efficient ground-service handoff.", "A recovered companion reflection connects data, hardware and algorithms; its author is counted once alongside the original platform report."];

document.querySelector('#insight-grid').innerHTML = insights.map((idea,index) => `<div class="insight"><span class="mark">[I-${String(index+1).padStart(2,'0')}]</span><p>${idea}</p></div>`).join('');
const caseData = [{"name": "Drone logistics", "kicker": "APPLICATION 01 / REPORT SYNTHESIS", "title": "Endurance determines the meeting.", "summary": "The class links remote access and urgent parcels with truck–drone cooperation; delivery and surveillance remain different missions.", "facts": {"Data": "Location, load, battery, weather and service deadlines", "Decision": "Assign tasks and synchronize routes/rendezvous", "Constraints": "Energy/payload, due times, weather, flight permissions", "Outcome to examine": "Mission completion, waiting, failed service and energy"}, "url": "https://arxiv.org/abs/2103.01528", "label": "Read the Nested-VRP research"}, {"name": "Electric fleets", "kicker": "APPLICATION 02 / REPORT SYNTHESIS", "title": "A short route can still run out of energy.", "summary": "Charging decisions and route choices must be made together; investment location also shapes future operations.", "facts": {"Data": "Orders, state of charge, charger location/capacity and energy cost", "Decision": "Sequence stops, select charging sites and durations", "Constraints": "Energy reserve, charger queues, service windows and grid demand", "Outcome to examine": "Service reliability, energy, tardiness and total cost"}, "url": "https://arxiv.org/abs/2302.00240", "label": "Read the joint routing/charging research"}, {"name": "Passenger mobility", "kicker": "APPLICATION 03 / REPORT SYNTHESIS", "title": "Include the trip around the flight.", "summary": "Six students focus on UAM; one focuses on smart buses. Aircraft, vertiports, bus stops and passenger access impose different requirements.", "facts": {"Data": "Demand, timetable, access, infrastructure and vehicle limits", "Decision": "Locate facilities, dispatch and coordinate transfers", "Constraints": "Certification, airspace, weather, safety, affordability and acceptance", "Outcome to examine": "Door-to-door time, access, waiting and service cost"}, "url": "https://www.faa.gov/air-taxis/uam_blueprint", "label": "Read the FAA UAM concept"}, {"name": "Platforms", "kicker": "APPLICATION 04 / REPORT SYNTHESIS", "title": "Make a visible exception actionable.", "summary": "Traffic signals, navigation, telematics and shipment dashboards serve different users. A described forum concept is not independently verified deployment.", "facts": {"Data": "GPS, map/traffic feeds, diagnostics, cargo events and shared IDs", "Decision": "Choose route/stop order, trigger maintenance or assign an exception owner", "Constraints": "Data quality, connectivity, APIs, security and operational ownership", "Outcome to examine": "Reliable ETA, resolved exceptions, service and maintenance outcomes"}, "url": "https://about.ups.com/us/en/newsroom/press-releases/innovation-driven/ups-deploys-purpose-built-navigation-for-ups-service-personnel.html", "label": "Read the UPS navigation release"}, {"name": "Port automation", "kicker": "APPLICATION 05 / REPORT SYNTHESIS", "title": "The next machine must be ready.", "summary": "The focused port report connects AGV horizontal movement with crane stacking and retrieval. Fleet size alone does not resolve blocking.", "facts": {"Data": "Vessel tasks, yard state, crane readiness and vehicle/battery state", "Decision": "Dispatch containers, synchronize cranes/AGVs and schedule charging", "Constraints": "Resource conflicts, waiting, space, energy and safe movement", "Outcome to examine": "Turnaround, waiting, throughput and energy against a baseline"}, "url": "https://www.singaporepsa.com/2022/03/02/psa-and-astar-collaborate-on-smart-scalable-solutions-for-managing-automated-guided-vehicle-agv-fleets-in-preparation-for-tuas-port/", "label": "Read PSA’s fleet-management example"}, {"name": "Integrated concepts", "kicker": "APPLICATION 06 / REPORT SYNTHESIS", "title": "A mixed fleet needs shared rules.", "summary": "Surveys connect modes and facilities; the student CityFlow concept proposes van micro-hubs, bikes, couriers and lockers. It is a design proposal.", "facts": {"Data": "Orders, demand hotspots, access, partner capacity and consent", "Decision": "Allocate modes, position lockers/hubs and coordinate handoffs", "Constraints": "Service windows, transfer capacity, operator agreements and privacy", "Outcome to examine": "Successful handoffs, access, failed deliveries and total cost"}, "url": "https://www.sciencedirect.com/science/article/pii/S0968090X22002091", "label": "Read the mobile-locker comparison"}];

let activeCase = 0;
function renderCase() {
  document.querySelector('#case-selector').innerHTML = caseData.map((item,index) => `<button type="button" class="filter-button ${index===activeCase?'active':''}" data-case="${index}" aria-pressed="${index===activeCase}">${item.name}</button>`).join('');
  const item = caseData[activeCase];
  document.querySelector('#case-kicker').textContent = item.kicker;
  document.querySelector('#case-title').textContent = item.title;
  document.querySelector('#case-summary').textContent = item.summary;
  document.querySelector('#case-facts').innerHTML = Object.entries(item.facts).map(([label,text]) => `<div><dt>${label}</dt><dd>${text}</dd></div>`).join('');
  const link = document.querySelector('#case-reading');
  link.href = item.url; link.textContent = `${item.label} ↗`;
}
document.querySelector('#case-selector').addEventListener('click',event => { const button=event.target.closest('[data-case]'); if(button){ activeCase=Number(button.dataset.case); renderCase(); } });
renderCase();
const questions = [{"topic": "01 / Feasible routes", "question": "A dispatcher knows the shortest path between two stops. What is still needed for a fleet plan?", "choices": ["Only a faster map", "Task assignment, stop sequence and operating constraints", "The same path for every vehicle"], "correct": 1, "explanation": "A path is one leg. A feasible fleet plan also covers tasks, vehicles and constraints.", "readingUrl": "https://developers.google.com/optimization/routing/vrp", "readingLabel": "OR-Tools VRP"}, {"topic": "01 / Feasible routes", "question": "An electric van can finish its deliveries only if it charges. What should the plan include?", "choices": ["Distance alone", "Ignore charging until the battery warning", "Reachable charging, available capacity and charging time"], "correct": 2, "explanation": "Routes and charging interact. A nearby charger is not sufficient if it is unavailable or makes the service late.", "readingUrl": "https://arxiv.org/abs/2302.00240", "readingLabel": "Joint routing and charging"}, {"topic": "01 / Feasible routes", "question": "A heavier drone parcel consumes more energy. How should route feasibility be checked?", "choices": ["Use an energy model that accounts for payload and reserve", "Assume every payload has the same fixed range", "Choose the straightest line without a battery check"], "correct": 0, "explanation": "A distinctive report points to load-dependent energy. Validate energy assumptions and retain a reserve before dispatch. This is a synthesis prompt, not a measured class result.", "readingUrl": "https://arxiv.org/abs/2103.01528", "readingLabel": "Drone–truck endurance research"}, {"topic": "01 / Feasible routes", "question": "A savings merge reduces distance but overloads the vehicle. What should happen?", "choices": ["Dispatch because distance improved", "Reject or revise the merge to satisfy capacity", "Remove the capacity constraint"], "correct": 1, "explanation": "A positive saving does not make a route feasible. Clarke–Wright merges require compatible endpoints and constraint checks.", "readingUrl": "https://developers.google.com/optimization/routing/vrp", "readingLabel": "OR-Tools VRP"}, {"topic": "02 / Coordination", "question": "A drone finishes early but its truck arrives after the battery would be exhausted. Is the plan feasible?", "choices": ["Yes, because the drone is fast", "Yes, if its path is straight", "No; rendezvous timing and endurance must be coordinated"], "correct": 2, "explanation": "The Nested-VRP research makes the truck–drone meeting part of feasibility. The two routes cannot be judged independently.", "readingUrl": "https://arxiv.org/abs/2103.01528", "readingLabel": "Nested-VRP research"}, {"topic": "02 / Coordination", "question": "Port AGVs become faster but wait longer for cranes. What should be reviewed?", "choices": ["Joint crane–vehicle scheduling and resource conflicts", "Only vehicle top speed", "Only the color of the dispatch screen"], "correct": 0, "explanation": "The class port report connects horizontal and vertical movement. Review synchronization and bottlenecks across the handoff.", "readingUrl": "https://www.singaporepsa.com/2022/03/02/psa-and-astar-collaborate-on-smart-scalable-solutions-for-managing-automated-guided-vehicle-agv-fleets-in-preparation-for-tuas-port/", "readingLabel": "PSA AGV fleet management"}, {"topic": "02 / Coordination", "question": "A dashboard predicts a late shipment. What connects visibility to a changed outcome?", "choices": ["More dashboard charts alone", "A feasible response, responsible owner and execution workflow", "Treating prediction as automatic dispatch"], "correct": 1, "explanation": "Visibility can reveal an exception. Decide who acts, what alternatives exist and how the response is carried out.", "readingUrl": "https://www.nist.gov/itl/ai-risk-management-framework", "readingLabel": "NIST AI risk guidance"}, {"topic": "02 / Coordination", "question": "A flight saves airborne time but passengers face long access and transfer waits. Which measure is useful?", "choices": ["Airborne speed only", "Number of rotors", "Door-to-door time, including access, waiting and transfers"], "correct": 2, "explanation": "Passenger mobility is a service chain. Evaluate the whole trip and who can use it, not one fast segment.", "readingUrl": "https://www.faa.gov/air-taxis/uam_blueprint", "readingLabel": "FAA UAM concept"}, {"topic": "03 / Claims + deployment", "question": "A student describes CityFlow Connect as a new platform concept. How should the archive label it?", "choices": ["A student design proposal that needs validation", "A verified commercial service", "A proven universal cost-saving system"], "correct": 0, "explanation": "The source introduces CityFlow as a concept. Preserve that status rather than adding evidence that was not supplied.", "readingUrl": "#slide-future", "readingLabel": "Evidence and limits"}, {"topic": "03 / Claims + deployment", "question": "A wireless charging demonstration succeeds. What does that establish?", "choices": ["Every road already supports charging", "Capability in the reported setup; deployment needs separate evidence", "Vehicles create energy while moving"], "correct": 1, "explanation": "Wireless charging transfers energy from a supplied source. A controlled demonstration does not establish network-wide infrastructure or free energy.", "readingUrl": "https://www.ornl.gov/news/charging-commute", "readingLabel": "ORNL wireless charging demonstration"}, {"topic": "03 / Claims + deployment", "question": "A slide says exact routing methods solve about 100 customers. How should this be interpreted?", "choices": ["A hard ceiling for every solver", "Proof that larger models cannot be optimized", "An illustrative scale; runtime depends on structure, formulation and budget"], "correct": 2, "explanation": "There is no universal customer cutoff. An exact method establishes optimality for its model only when solved with an appropriate proof/bound.", "readingUrl": "https://developers.google.com/optimization/routing/vrp", "readingLabel": "OR-Tools routing examples"}, {"topic": "03 / Claims + deployment", "question": "An electric service has no tailpipe exhaust. What is needed to judge net environmental improvement?", "choices": ["A defined baseline and boundary including relevant energy, batteries and infrastructure", "Assume all electricity is impact-free", "Count only the new vehicles"], "correct": 0, "explanation": "The energy reflections raise lifecycle and infrastructure concerns. Define the comparison and measure relevant impacts rather than inferring a net gain from propulsion alone.", "readingUrl": "#slide-future", "readingLabel": "Evidence and limits"}];

let questionIndex = 0;
let score = 0;
let answered = false;
const status = document.querySelector("#quiz-status");
const feedback = document.querySelector("#quiz-feedback");
const nextButton = document.querySelector("#quiz-next");
const restartButton = document.querySelector("#quiz-restart");
function renderQuestion() {
  answered = false;
  const current = questions[questionIndex];
  status.textContent = `[Q-${String(questionIndex + 1).padStart(2, "0")}/${questions.length}] / [UNANSWERED] / SCORE ${score}`;
  document.querySelector("#quiz-progress").style.width = `${questionIndex / questions.length * 100}%`;
  document.querySelector("#quiz-topic").textContent = current.topic;
  document.querySelector("#quiz-question").textContent = current.question;
  document.querySelector("#quiz-choices").innerHTML = current.choices.map((choice, index) => `
    <button class="choice" type="button" data-answer="${index}"><span class="letter">[${String.fromCharCode(65 + index)}]</span><span>${choice}</span></button>`).join("");
  feedback.textContent = "";
  feedback.className = "feedback";
  nextButton.disabled = true;
  nextButton.textContent = questionIndex === questions.length - 1 ? "See result →" : "Next question →";
}
document.querySelector("#quiz-choices").addEventListener("click", event => {
  const choice = event.target.closest("[data-answer]");
  if (!choice || answered) return;
  answered = true;
  const selected = Number(choice.dataset.answer);
  const current = questions[questionIndex];
  const correct = selected === current.correct;
  if (correct) score++;
  document.querySelectorAll(".choice").forEach((button, index) => {
    button.disabled = true;
    if (index === current.correct) button.classList.add("correct");
    else if (index === selected) button.classList.add("wrong");
  });
  status.textContent = `[Q-${String(questionIndex + 1).padStart(2, "0")}/${questions.length}] / [${correct ? "CORRECT" : "REVIEW"}] / SCORE ${score}`;
  document.querySelector("#quiz-progress").style.width = `${(questionIndex + 1) / questions.length * 100}%`;
  feedback.className = `feedback ${correct ? "good" : "bad"}`;
  feedback.textContent = `${correct ? "Correct. " : "Review this. "}${current.explanation}`;
  const reading = document.createElement("a");
  reading.href = current.readingUrl;
  reading.target = "_blank";
  reading.rel = "noopener noreferrer";
  reading.textContent = `Related reading: ${current.readingLabel} ↗`;
  feedback.append(document.createElement("br"), reading);
  nextButton.disabled = false;
});
nextButton.addEventListener("click", () => {
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    renderQuestion();
  } else {
    status.textContent = `[COMPLETE] / SCORE ${score} OF ${questions.length}`;
    document.querySelector("#quiz-progress").style.width = "100%";
    document.querySelector("#quiz-topic").textContent = "THE FINAL DISPATCH";
    document.querySelector("#quiz-question").textContent = score === questions.length ? "A coordinated, feasible service." : "Run the loop again.";
    document.querySelector("#quiz-choices").innerHTML = "";
    feedback.className = "feedback";
    feedback.textContent = "A sound transportation plan connects constraints, handoffs and measured service outcomes.";
    nextButton.hidden = true;
    restartButton.hidden = false;
  }
});
restartButton.addEventListener("click", () => {
  questionIndex = 0;
  score = 0;
  nextButton.hidden = false;
  restartButton.hidden = true;
  renderQuestion();
});
renderQuestion();
