/* Fall 2025: anonymous aggregate and editorial teaching content. */
const stages = [{"name": "Observe", "short": "Know the operating state", "description": "Capture orders, location, traffic, cargo and battery state. Check freshness and coverage before asking a model to plan.", "connection": "Maps, ITS and telematics"}, {"name": "Model", "short": "Represent needs and limits", "description": "Forecast travel or demand; model payload-dependent energy and infrastructure. Predictions and simulations require validation.", "connection": "Load-dependent drone energy; EV range"}, {"name": "Choose", "short": "Define a feasible action", "description": "Choose route sequence, task assignment, charging duration or facility location under the service requirements. These are different decisions.", "connection": "VRP, charging and network design"}, {"name": "Coordinate", "short": "Synchronize the handoffs", "description": "A truck must meet its drone before the battery is exhausted; a crane must be ready for the arriving AGV. Include queues, transfers and waiting.", "connection": "Truck–drone rendezvous; crane–AGV work"}, {"name": "Execute", "short": "Dispatch with an owner", "description": "Apply the plan within its known operating scope. Communicate with drivers/customers and define override, fallback and exception handling.", "connection": "Fleet operations; oversight around autonomy"}, {"name": "Review", "short": "Measure the whole service", "description": "Compare service, energy, waiting, access and cost with a baseline. Include infrastructure and lifecycle impacts where relevant, then revise the plan.", "connection": "Outcome measures are teaching suggestions"}];

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
const insights = ["Payload-dependent energy can invalidate a plan that passes a fixed-range check.", "Handoff timing, transfer equipment and packing can dominate the benefit of a fast vehicle.", "Map databases, cloud systems, security and APIs sustain the interface people see.", "A long road investment must consider the risk that charging technology changes.", "Autonomy still involves supervision, exception ownership, liability and public trust.", "A collaborative van–bike–locker service needs shared commitments and clear data permissions.", "A reflection proposes drone delivery to difficult destinations, followed by a coordinated ground-service handoff.", "A companion reflection connects data, hardware and algorithms as parts of one service design."];

document.querySelector('#insight-grid').innerHTML = insights.map((idea,index) => `<div class="insight"><span class="mark">[I-${String(index+1).padStart(2,'0')}]</span><p>${idea}</p></div>`).join('');
const caseData = [
  {
    "name": "Drone logistics",
    "kicker": "Application comparison · teaching interpretation",
    "title": "Plan a meeting the drone can reach",
    "summary": "The class links remote access and urgent parcels with truck–drone cooperation; delivery and surveillance remain different missions.",
    "facts": {
      "Data": "Location, load, battery, weather and service deadlines",
      "Decision": "Assign tasks and synchronize routes/rendezvous",
      "Constraints": "Energy/payload, due times, weather, flight permissions",
      "Outcome to examine": "Mission completion, waiting, failed service and energy"
    },
    "url": "#reference-5",
    "label": "Source reference"
  },
  {
    "name": "Electric fleets",
    "kicker": "Application comparison · teaching interpretation",
    "title": "A short route can still run out of energy",
    "summary": "Charging decisions and route choices must be made together; investment location also shapes future operations.",
    "facts": {
      "Data": "Orders, state of charge, charger location/capacity and energy cost",
      "Decision": "Sequence stops, select charging sites and durations",
      "Constraints": "Energy reserve, charger queues, service windows and grid demand",
      "Outcome to examine": "Service reliability, energy, tardiness and total cost"
    },
    "url": "#reference-4",
    "label": "Source reference"
  },
  {
    "name": "Passenger mobility",
    "kicker": "Application comparison · teaching interpretation",
    "title": "Include the trip around the flight",
    "summary": "Six students focus on UAM; one focuses on smart buses. Aircraft, vertiports, bus stops and passenger access impose different requirements.",
    "facts": {
      "Data": "Demand, timetable, access, infrastructure and vehicle limits",
      "Decision": "Locate facilities, dispatch and coordinate transfers",
      "Constraints": "Certification, airspace, weather, safety, affordability and acceptance",
      "Outcome to examine": "Door-to-door time, access, waiting and service cost"
    },
    "url": "#reference-8",
    "label": "Source reference"
  },
  {
    "name": "Platforms",
    "kicker": "Application comparison · teaching interpretation",
    "title": "Assign a response to a shipment alert",
    "summary": "Traffic signals, navigation, telematics and shipment dashboards serve different users. A described forum concept is not independently verified deployment.",
    "facts": {
      "Data": "GPS, map/traffic feeds, diagnostics, cargo events and shared IDs",
      "Decision": "Choose route/stop order, trigger maintenance or assign an exception owner",
      "Constraints": "Data quality, connectivity, APIs, security and operational ownership",
      "Outcome to examine": "Reliable ETA, resolved exceptions, service and maintenance outcomes"
    },
    "url": "#reference-11",
    "label": "Source reference"
  },
  {
    "name": "Port automation",
    "kicker": "Application comparison · teaching interpretation",
    "title": "Coordinate vehicles with cranes",
    "summary": "The focused port report connects AGV horizontal movement with crane stacking and retrieval. Fleet size alone does not resolve blocking.",
    "facts": {
      "Data": "Vessel tasks, yard state, crane readiness and vehicle/battery state",
      "Decision": "Dispatch containers, synchronize cranes/AGVs and schedule charging",
      "Constraints": "Resource conflicts, waiting, space, energy and safe movement",
      "Outcome to examine": "Turnaround, waiting, throughput and energy against a baseline"
    },
    "url": "#reference-10",
    "label": "Source reference"
  },
  {
    "name": "Integrated concepts",
    "kicker": "Application comparison · teaching interpretation",
    "title": "Agree how the mixed fleet works together",
    "summary": "Surveys connect modes and facilities; the student CityFlow concept proposes van micro-hubs, bikes, couriers and lockers. It is a design proposal.",
    "facts": {
      "Data": "Orders, demand hotspots, access, partner capacity and consent",
      "Decision": "Allocate modes, position lockers/hubs and coordinate handoffs",
      "Constraints": "Service windows, transfer capacity, operator agreements and privacy",
      "Outcome to examine": "Successful handoffs, access, failed deliveries and total cost"
    },
    "url": "#reference-7",
    "label": "Source reference"
  }
];
let activeCase = 0;
function renderCase() {
  document.querySelector('#case-selector').innerHTML = caseData.map((item,index) => `<button type="button" class="filter-button ${index===activeCase?'active':''}" data-case="${index}" aria-pressed="${index===activeCase}">${item.name}</button>`).join('');
  const item = caseData[activeCase];
  document.querySelector('#case-kicker').textContent = item.kicker;
  document.querySelector('#case-title').textContent = item.title;
  document.querySelector('#case-summary').textContent = item.summary;
  document.querySelector('#case-facts').innerHTML = Object.entries(item.facts).map(([label,text]) => `<div><dt>${label}</dt><dd>${text}</dd></div>`).join('');
  const link = document.querySelector('#case-reading');
  link.href = item.url; link.textContent = item.label;
}
document.querySelector('#case-selector').addEventListener('click',event => { const button=event.target.closest('[data-case]'); if(button){ activeCase=Number(button.dataset.case); renderCase(); } });
renderCase();
const questions = [
  {
    "topic": "Feasible routes",
    "question": "A carrier has shortest paths between every pair of stops. Vehicles have limited capacity and customers have delivery windows. What remains necessary to produce a dispatch plan?",
    "choices": [
      "Select each customer’s fastest path and sum the resulting travel times.",
      "Rank stops by distance from the depot and allocate equal customer counts.",
      "Assign customers and sequence vehicle stops while checking capacity and timing."
    ],
    "correct": 2,
    "explanation": "Pairwise paths describe travel legs, not fleet assignments. Capacity and delivery windows must be checked across complete vehicle routes; fastest-leg selection or equal customer counts can violate those requirements.",
    "readingUrl": "https://developers.google.com/optimization/routing/vrp",
    "readingLabel": "OR-Tools VRP"
  },
  {
    "topic": "Feasible routes",
    "question": "An electric van has two chargers on its route. The nearer charger is busy until after the next delivery window; the farther charger may be reachable. Which plan should be evaluated?",
    "choices": [
      "A minimum-distance route that reserves the nearest charger’s next available slot.",
      "A joint route-and-charge schedule with energy reserve, availability and delivery times.",
      "A schedule using average charging time and the nominal battery range per trip."
    ],
    "correct": 1,
    "explanation": "Charging and route timing are coupled. The plan must establish that a charger is reachable and available without invalidating later commitments; distance, nominal range and average duration cannot establish that feasibility.",
    "readingUrl": "https://arxiv.org/abs/2302.00240",
    "readingLabel": "Joint routing and charging"
  },
  {
    "topic": "Feasible routes",
    "question": "A drone’s previous route was feasible with a light parcel. The new parcel is heavier and increases energy use, while flight distance is unchanged. Which dispatch check addresses the change?",
    "choices": [
      "Estimate energy for the new payload and route, including the required reserve.",
      "Compare flight distance with the distance covered in the previous successful trip.",
      "Confirm the payload fits the cargo bay and the straight-line path is unchanged."
    ],
    "correct": 0,
    "explanation": "The unchanged geometry does not imply unchanged energy feasibility. Check consumption for the new load and reserve as well as payload limits. The related Nested-VRP reading illustrates endurance and rendezvous constraints; it is not the source of a specific load-dependent energy model.",
    "readingUrl": "https://arxiv.org/abs/2103.01528",
    "readingLabel": "Drone–truck endurance research"
  },
  {
    "topic": "Feasible routes",
    "question": "Two routes can be merged for a distance saving, but their combined load exceeds the vehicle capacity. What should a capacity-constrained savings heuristic do?",
    "choices": [
      "Keep the merge provisionally because its saving is larger than the other candidates.",
      "Use the merged route and add the excess load to its reported distance penalty.",
      "Reject this merge and examine another compatible, capacity-feasible route combination."
    ],
    "correct": 2,
    "explanation": "A saving is useful only for a feasible merge. With capacity a hard constraint, this candidate cannot be dispatched as proposed; a provisional search state or a distance penalty does not make it capacity-feasible.",
    "readingUrl": "https://developers.google.com/optimization/routing/vrp",
    "readingLabel": "OR-Tools VRP"
  },
  {
    "topic": "Coordination",
    "question": "A drone completes its observation tasks at minute 18 and has endurance until minute 22. Its truck reaches their only feasible rendezvous at minute 25. Which conclusion follows?",
    "choices": [
      "The paired plan is infeasible and needs a different rendezvous or task schedule.",
      "The paired plan is feasible because the observation tasks finish before endurance ends.",
      "The paired plan is feasible if the truck’s route distance remains within its limit."
    ],
    "correct": 0,
    "explanation": "Task completion at minute 18 does not settle the return and rendezvous requirement. The only meeting occurs after endurance expires, so the paired schedule must change; truck distance does not resolve the timing conflict.",
    "readingUrl": "https://arxiv.org/abs/2103.01528",
    "readingLabel": "Nested-VRP research"
  },
  {
    "topic": "Coordination",
    "question": "A terminal’s faster AGVs spend more time queued at yard cranes, while container completion time stays unchanged. Which change most directly tests the suspected bottleneck?",
    "choices": [
      "Increase AGV assignments to keep the faster vehicles working for a larger share of time.",
      "Coordinate AGV arrivals with crane availability and measure waiting across the handoff.",
      "Reduce AGV travel distances and compare average vehicle speed over the same shifts."
    ],
    "correct": 1,
    "explanation": "The symptoms point to resource synchronization at the crane handoff. Coordinating arrivals tests that cause; greater vehicle activity or faster travel can move work to the queue without improving container completion.",
    "readingUrl": "https://www.singaporepsa.com/2022/03/02/psa-and-astar-collaborate-on-smart-scalable-solutions-for-managing-automated-guided-vehicle-agv-fleets-in-preparation-for-tuas-port/",
    "readingLabel": "PSA AGV fleet management"
  },
  {
    "topic": "Coordination",
    "question": "A dashboard correctly predicts a missed connection, but staff cannot act because no team can authorize a rebooking. Which addition most directly addresses the failure?",
    "choices": [
      "A more detailed prediction display with the likely duration and downstream effects.",
      "A defined exception owner with feasible alternatives and authority to carry out a response.",
      "A lower warning threshold that sends the alert to additional partner teams earlier."
    ],
    "correct": 1,
    "explanation": "The prediction is already correct; the missing step is authorized execution. Ownership, alternatives and authority can connect it to an outcome. Additional detail or wider alerts do not grant the power to rebook.",
    "readingUrl": "https://www.nist.gov/itl/ai-risk-management-framework",
    "readingLabel": "NIST AI risk guidance"
  },
  {
    "topic": "Coordination",
    "question": "An air-taxi trial reduces flight time by 12 minutes but adds 8 minutes of access travel and 10 minutes of terminal waiting. Which primary measure best tests whether the passenger journey is faster?",
    "choices": [
      "Compare total origin-to-destination time, including access, terminal waiting and transfers.",
      "Compare in-vehicle times across air and road services for the same origin and destination.",
      "Compare cruise speeds and departure frequencies after excluding terminal processing time."
    ],
    "correct": 0,
    "explanation": "The claimed benefit concerns the passenger journey. Door-to-door time includes the access and waiting costs that can outweigh the airborne saving; in-vehicle time or cruise speed evaluates a narrower segment.",
    "readingUrl": "https://www.faa.gov/air-taxis/uam_blueprint",
    "readingLabel": "FAA UAM concept"
  },
  {
    "topic": "Claims + deployment",
    "question": "A CityFlow Connect report specifies vans, bikes and lockers but supplies no operational trial or commercial-use record. Which description fits the evidence available to the archive?",
    "choices": [
      "A prototype service whose proposed components establish its operational performance.",
      "A commercial pilot whose integration plan demonstrates successful partner coordination.",
      "A student service-design proposal whose operating assumptions and outcomes need testing."
    ],
    "correct": 2,
    "explanation": "A design specification supports describing a proposal. It does not establish that a prototype or commercial pilot exists, or that the service achieved its intended outcomes.",
    "readingUrl": "#slide-future",
    "readingLabel": "Service claims and their limits"
  },
  {
    "topic": "Claims + deployment",
    "question": "A laboratory demonstrates wireless power transfer to a vehicle under a reported setup. Which conclusion is best supported without additional deployment evidence?",
    "choices": [
      "The setup establishes road-network feasibility at the reported power level.",
      "The setup establishes fleet-wide cost effectiveness for the tested vehicle type.",
      "The setup demonstrates power-transfer capability under the stated conditions."
    ],
    "correct": 2,
    "explanation": "The demonstration supports the reported technical capability. Road-network integration and fleet economics require separate infrastructure, reliability and cost evidence; wireless charging transfers energy from a supplied source.",
    "readingUrl": "https://www.ornl.gov/news/charging-commute",
    "readingLabel": "ORNL wireless charging demonstration"
  },
  {
    "topic": "Claims + deployment",
    "question": "A slide mentions exact routing methods handling about 100 customers. A team now has 140 customers. How should it assess whether an exact approach is practical?",
    "choices": [
      "Scale the slide’s running time by the ratio between the two customer counts.",
      "Test the actual formulation and instance structure against a defined compute budget.",
      "Use a heuristic for every instance above the slide’s stated customer count."
    ],
    "correct": 1,
    "explanation": "Customer count alone does not determine tractability. Structure, constraints, formulation and solution budget matter. Linear scaling is unreliable, and the slide’s illustration is not a universal threshold; an exact-method claim still needs a valid bound or proof.",
    "readingUrl": "https://developers.google.com/optimization/routing/vrp",
    "readingLabel": "OR-Tools routing examples"
  },
  {
    "topic": "Claims + deployment",
    "question": "An electric delivery pilot eliminates tailpipe exhaust but needs new batteries and charging infrastructure. Which comparison can support a net environmental claim?",
    "choices": [
      "Compare equivalent service over a stated period with relevant electricity, battery and infrastructure impacts.",
      "Compare local vehicle exhaust before and after and treat that reduction as the net result.",
      "Compare electricity consumed by the pilot with diesel consumed by the previous fleet."
    ],
    "correct": 0,
    "explanation": "A net claim needs a common service baseline, period and impact boundary. Tailpipe exhaust is one part of the result; fuel quantities alone also need comparable environmental factors and cannot account for batteries or infrastructure.",
    "readingUrl": "#slide-future",
    "readingLabel": "Service claims and their limits"
  }
];
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
  status.textContent = `Question ${questionIndex + 1} of ${questions.length} · Score: ${score}`;
  document.querySelector("#quiz-progress").style.width = `${questionIndex / questions.length * 100}%`;
  document.querySelector("#quiz-topic").textContent = current.topic;
  document.querySelector("#quiz-question").textContent = current.question;
  document.querySelector("#quiz-choices").innerHTML = current.choices.map((choice, index) => `
    <button class="choice" type="button" data-answer="${index}"><span class="letter">[${String.fromCharCode(65 + index)}]</span><span>${choice}</span></button>`).join("");
  feedback.textContent = "";
  feedback.className = "feedback";
  nextButton.disabled = true;
  nextButton.textContent = questionIndex === questions.length - 1 ? "Result" : "Next";
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
  status.textContent = `Question ${questionIndex + 1} of ${questions.length} · ${correct ? "Correct" : "Review the answer"} · Score: ${score}`;
  document.querySelector("#quiz-progress").style.width = `${(questionIndex + 1) / questions.length * 100}%`;
  feedback.className = `feedback ${correct ? "good" : "bad"}`;
  feedback.textContent = `${correct ? "Correct. " : "Not quite. "}${current.explanation}`;
  const reading = document.createElement("a");
  reading.href = current.readingUrl;
  if (!current.readingUrl.startsWith("#")) reading.target = "_blank";
  reading.rel = "noopener noreferrer";
  reading.textContent = `Related reading: ${current.readingLabel}${current.readingUrl.startsWith("#") ? "" : " ↗"}`;
  feedback.append(document.createElement("br"), reading);
  nextButton.disabled = false;
});
nextButton.addEventListener("click", () => {
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    renderQuestion();
  } else {
    status.textContent = `Quiz complete · Score: ${score} of ${questions.length}`;
    document.querySelector("#quiz-progress").style.width = "100%";
    document.querySelector("#quiz-topic").textContent = "Quiz complete";
    document.querySelector("#quiz-question").textContent = score === questions.length ? "You answered all 12 questions correctly." : "Review the explanations and try the quiz again.";
    document.querySelector("#quiz-choices").innerHTML = "";
    feedback.className = "feedback";
    feedback.textContent = "A workable transport plan accounts for routes, energy, transfers and the people responsible for the service. Review the application comparison and explanations to revisit those decisions.";
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
