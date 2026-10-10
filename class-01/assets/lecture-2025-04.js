/* Fall 2025: anonymous reflections and constructed teaching examples. */
const stages = [{"name": "Order", "short": "Eligibility", "description": "The app connects the customer to participating merchants and receiving points. Service availability and order suitability come before aircraft dispatch.", "connection": "Check destination, service availability and promised pickup time."}, {"name": "Prepare", "short": "Ground pickup", "description": "A merchant prepares the item and a ground rider carries it to the dispatch station in the lecture’s hybrid example.", "connection": "Link the correct order to the package; record preparation and rider handoff."}, {"name": "Load", "short": "Station release", "description": "Station staff and systems package, load and check the order. The station supports charging and vehicle readiness as well as goods handling.", "connection": "Confirm package, aircraft readiness and feasible release before dispatch."}, {"name": "Fly", "short": "Fleet oversight", "description": "Onboard positioning and perception support the flight. The management platform coordinates routes, time slots and fleet state, with remote oversight and exception support.", "connection": "Monitor deviations, environmental conditions and escalation responsibility."}, {"name": "Receive", "short": "Customer pickup", "description": "The aircraft reaches the designated receiving point; the customer is notified and collects the order. Landing and pickup access are part of service design.", "connection": "Confirm delivery and collection; include the customer’s walk and waiting time."}, {"name": "Recover", "short": "Next trip + fallback", "description": "The aircraft returns for charging or battery support, checks and maintenance. A failed or suspended delivery requires a service recovery plan.", "connection": "Close the order, log exceptions and coordinate a feasible ground fallback."}];
const cases = [{"name": "Positioning", "kicker": "01 / SENSING", "title": "Check positioning around buildings", "summary": "The reflections connect GNSS/RTK, inertial sensing, cameras, radar and visual positioning. Their usefulness depends on conditions, integration and response delay.", "facts": {"Constraint": "Buildings, power lines, changing obstacles and signal degradation.", "Design question": "How is uncertainty recognized when one input degrades?", "Evidence to seek": "Localization errors and end-to-end perception delay across representative conditions."}, "url": "https://wing.com/news/do-delivery-drones-have-cameras", "label": "Operator example of perception", "referenceUrl": "#reference-04-5"}, {"name": "Shared airspace", "kicker": "02 / COORDINATION", "title": "Coordinate routes in shared airspace", "summary": "The lecture describes four-dimensional plans, conflict management and cloud–edge coordination. Students ask for interoperable multi-operator systems.", "facts": {"Constraint": "Intersecting traffic, unexpected deviations and priority missions.", "Design question": "Who coordinates plans and resolves conflicts across organizations?", "Evidence to seek": "Data freshness, interoperability tests and contingency outcomes."}, "url": "https://www.nasa.gov/directorates/armd/past-armd-projects/utm-project/", "label": "NASA UTM research context", "referenceUrl": "#reference-04-6"}, {"name": "Weather + energy", "kicker": "03 / AVAILABILITY", "title": "Plan for demand during poor weather", "summary": "Battery endurance, payload and adverse weather limit availability. Students propose improved batteries and charging; solar and future battery designs remain proposals here.", "facts": {"Constraint": "Wind, rain, battery state and service interruptions.", "Design question": "What happens to accepted orders when availability changes?", "Evidence to seek": "Weather suspension, fallback completion, energy use and full cost per order."}, "url": "https://www.nature.com/articles/s41467-017-02411-5", "label": "Life-cycle energy research", "referenceUrl": "#reference-04-7"}, {"name": "Receiving points", "kicker": "04 / GROUND SYSTEM", "title": "Include the customer’s pickup", "summary": "Pickup stations need space, access and ground support. Tether services use a different receiving arrangement; neither architecture is universal.", "facts": {"Constraint": "Apartments, accessible pickup, loading space, noise and privacy.", "Design question": "Does a shorter flight offset added walking, queues or restricted choices?", "Evidence to seek": "Order-to-pickup time, complaint patterns and receiving-site access."}, "url": "https://www.meituan.com/news/NN231219070003592", "label": "Historical campus pickup case", "referenceUrl": "#reference-04-3"}];
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

let activeCase = 0;
function renderCase() {
  document.querySelector('#case-selector').innerHTML = cases.map((item,index) => `<button type="button" class="filter-button ${index===activeCase?'active':''}" data-case="${index}" aria-pressed="${index===activeCase}">${item.name}</button>`).join('');
  const item = cases[activeCase];
  document.querySelector('#case-kicker').textContent = item.kicker;
  document.querySelector('#case-title').textContent = item.title;
  document.querySelector('#case-summary').textContent = item.summary;
  document.querySelector('#case-facts').innerHTML = Object.entries(item.facts).map(([label,text]) => `<div><dt>${label}</dt><dd>${text}</dd></div>`).join('');
  const link = document.querySelector('#case-reading');
  link.href = item.referenceUrl; link.removeAttribute("target"); link.removeAttribute("rel"); link.textContent = `Source: ${item.label}`;
}
document.querySelector('#case-selector').addEventListener('click',event => { const button=event.target.closest('[data-case]'); if(button){ activeCase=Number(button.dataset.case); renderCase(); } });
renderCase();


let labPreset = 'full';
let linkDelay = 100, actuationDelay = 100;
const speedInput = document.querySelector('#lab-speed');
const frequencyInput = document.querySelector('#lab-frequency');
const processingInput = document.querySelector('#lab-processing');
function renderLatency() {
  const speed = Number(speedInput.value), frequency = Number(frequencyInput.value), processing = Number(processingInput.value);
  const sampling = 1000 / frequency, total = sampling + processing + linkDelay + actuationDelay;
  document.querySelector('#speed-value').textContent = `${speed} m/s`;
  document.querySelector('#frequency-value').textContent = `${frequency} Hz`;
  document.querySelector('#processing-value').textContent = `${processing} ms`;
  document.querySelector('#latency-chain').textContent = `${sampling.toFixed(0)} ms worst-case sampling wait + ${processing} ms processing + ${linkDelay} ms communication + ${actuationDelay} ms actuation`;
  document.querySelector('#lab-delay').textContent = `${(total/1000).toFixed(2)} s`;
  document.querySelector('#lab-distance').textContent = `${(speed*total/1000).toFixed(2)} m`;
  document.querySelector('#lab-observation').textContent = `The worst-case sampling wait accounts for ${(speed/frequency).toFixed(2)} m. The rest of the chain adds ${(speed*(processing+linkDelay+actuationDelay)/1000).toFixed(2)} m in this example. Braking distance is not included.`;
  document.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preset===labPreset)));
}
document.querySelector('.lab-presets').addEventListener('click',event=>{
  const button = event.target.closest('[data-preset]'); if(!button) return;
  labPreset = button.dataset.preset;
  speedInput.value = 10; frequencyInput.value = labPreset==='fast'?20:10;
  processingInput.value = labPreset==='sample'?0:200;
  linkDelay = actuationDelay = labPreset==='sample'?0:100;
  renderLatency();
});
[speedInput,frequencyInput,processingInput].forEach(input=>input.addEventListener('input',()=>{labPreset='custom';renderLatency();}));
renderLatency();

const questions = [
  {
    "topic": "The delivery service",
    "question": "A pilot cuts median flight duration, but customers still report long waits. Which matched comparison most directly tests the service they receive?",
    "choices": [
      "Compare flight duration and completed flights per aircraft-hour.",
      "Compare order-to-collection time, including queues and pickup access.",
      "Compare dispatch-to-landing time and station loading productivity."
    ],
    "correct": 1,
    "explanation": "The service includes preparation, ground handoffs and customer collection. The other measures can diagnose individual stages, but omit parts of the wait the customer experiences.",
    "readingUrl": "#slide-responses",
    "readingLabel": "Delivery process and handoffs"
  },
  {
    "topic": "Ground handoff",
    "question": "Which sequence matches the main food-delivery arrangement shown in the supplied lecture?",
    "choices": [
      "App order → merchant → rider → dispatch station → flight → designated pickup.",
      "App order → merchant launch pad → flight → customer doorstep → tether release.",
      "App order → fulfilment warehouse → flight → home landing pad → rider collection."
    ],
    "correct": 0,
    "explanation": "The lecture’s main example uses a rider to connect the merchant with a dispatch station, then a designated receiving point. Other architectures can exist, but are not that depicted relay.",
    "readingUrl": "#slide-responses",
    "readingLabel": "Lecture delivery sequence"
  },
  {
    "topic": "Receiving architecture",
    "question": "A report combines the lecture’s station pickup with Wing’s tether description. How should the two designs be compared?",
    "choices": [
      "Use the same ground-handoff assumptions because both are drone deliveries.",
      "Compare flight speeds first, then apply the faster design’s pickup time to both.",
      "Define each receiving arrangement and its handling/access requirements separately."
    ],
    "correct": 2,
    "explanation": "Wing describes lowering a package while airborne; the lecture chiefly shows designated pickup. The handling and access boundaries differ, so a common label does not make their timings or requirements interchangeable.",
    "readingUrl": "https://wing.com/news/how-do-you-get-package-from-drone-to",
    "readingLabel": "Wing’s tether mechanism"
  },
  {
    "topic": "Sensing",
    "question": "GNSS quality falls near buildings while camera conditions also change. Which test best assesses the integrated navigation system?",
    "choices": [
      "Measure individual sensors in clear conditions and average their reported accuracy.",
      "Measure uncertainty recognition and response when relevant inputs degrade together.",
      "Measure the stored route’s geometric accuracy and compare it with the receiver’s specification."
    ],
    "correct": 1,
    "explanation": "Integrated performance under degraded conditions is the operational question. Independent clear-condition accuracy or a precise stored route does not show that the system recognizes unreliable inputs and handles them appropriately.",
    "readingUrl": "#slide-model",
    "readingLabel": "Urban sensing and operating conditions"
  },
  {
    "topic": "Sampling",
    "question": "At 10 m/s with periodic updates at 10 Hz, an event occurs just after a sample. How far can the drone travel before the next sample, ignoring all other delays?",
    "choices": [
      "2.0 m",
      "0.5 m",
      "1.0 m"
    ],
    "correct": 2,
    "explanation": "The worst-case sampling wait is almost 1/10 s, so 10 m/s × 0.1 s gives 1 m. The 0.5 m value would correspond to the average sampling wait under a uniform timing assumption, not this worst-case event.",
    "readingUrl": "#slide-evidence",
    "readingLabel": "Response-time sampling assumption"
  },
  {
    "topic": "Total delay",
    "question": "Keep 10 m/s and 10 Hz, and add 200 ms processing, 100 ms communication and 100 ms actuation. What distance does the teaching model calculate before response?",
    "choices": [
      "5.0 m",
      "3.0 m",
      "4.0 m"
    ],
    "correct": 0,
    "explanation": "Include 100 ms sampling as well as the other 400 ms: total delay is 0.50 s, so distance is 5 m. Braking is omitted; this is not total stopping distance.",
    "readingUrl": "#slide-evidence",
    "readingLabel": "Response-time calculation"
  },
  {
    "topic": "Airspace",
    "question": "A schedule reserves route segments and time slots for a fleet. One aircraft deviates unexpectedly. What is still required beyond the original schedule?",
    "choices": [
      "Detect the deviation and coordinate timely onboard and fleet contingency responses.",
      "Increase nominal slot spacing while retaining the original plans for each flight.",
      "Recalculate average route utilization when the aircraft returns to its planned path."
    ],
    "correct": 0,
    "explanation": "Planning reduces expected conflicts, but an unexpected deviation needs detection and response. Wider nominal slots and utilization statistics do not themselves manage the event as it happens.",
    "readingUrl": "https://www.nasa.gov/directorates/armd/past-armd-projects/utm-project/",
    "readingLabel": "NASA UTM research context"
  },
  {
    "topic": "Availability",
    "question": "Order demand rises during weather that suspends flights. Which plan most directly addresses the service problem identified in the reports?",
    "choices": [
      "Hold every accepted order for the next flight window using the normal time promise.",
      "Increase battery-swap speed so the aircraft can clear the queue after the storm.",
      "Define suspension thresholds, ground fallback and updates for accepted orders."
    ],
    "correct": 2,
    "explanation": "The problem is service availability while aircraft cannot fly. Faster turnaround later does not resolve accepted orders now; fallback capacity and realistic customer communication need explicit treatment.",
    "readingUrl": "#slide-future",
    "readingLabel": "Benefits, limits and weather-dependent service"
  },
  {
    "topic": "Staffing",
    "question": "A presentation reports more aircraft per remote pilot. What additional information is needed to compare labour cost per completed delivery?",
    "choices": [
      "Pilot hours multiplied by the new supervision ratio and average aircraft speed.",
      "All supporting staff hours and completed deliveries within the same service boundary.",
      "Flight hours and salaries, with ground preparation treated as existing overhead."
    ],
    "correct": 1,
    "explanation": "The ratio covers supervision. Loading, maintenance, ground support, emergency response and other roles may still be needed; a cost comparison needs their work and a consistent completed-delivery denominator.",
    "readingUrl": "#slide-responses",
    "readingLabel": "Supporting work in the delivery process"
  },
  {
    "topic": "Life cycle",
    "question": "Which comparison best matches a life-cycle environmental claim about replacing a ground delivery with a drone service?",
    "choices": [
      "Compare flight electricity per kilometre with the van’s fuel per kilometre.",
      "Compare direct propulsion emissions for a drone and van at their rated payloads.",
      "Compare electricity, batteries and hubs with a matched completed ground service."
    ],
    "correct": 2,
    "explanation": "A life-cycle boundary includes supporting infrastructure and energy production, with the same delivery task on both sides. Per-kilometre or direct-emission measures answer narrower questions and can omit major differences.",
    "readingUrl": "https://www.nature.com/articles/s41467-017-02411-5",
    "readingLabel": "Stolaroff and colleagues’ life-cycle study"
  },
  {
    "topic": "Public trust",
    "question": "Residents object to a proposed shared receiving hub. Which review best addresses the concerns raised in the reports?",
    "choices": [
      "Assess site throughput, customer ratings and the number of participating merchants.",
      "Assess noise, privacy, access and incident responsibilities with affected residents.",
      "Assess aircraft utilization, site permits and loading-staff productivity targets."
    ],
    "correct": 1,
    "explanation": "The objections concern how the service affects its surroundings and who is accountable. Operating and customer measures remain useful, but do not substitute for the perspectives of residents affected by noise, access or sensing.",
    "readingUrl": "#slide-future",
    "readingLabel": "Adoption and community concerns"
  },
  {
    "topic": "Evidence",
    "question": "A company reports a large number of successful deliveries. What is still needed to estimate and compare operational safety rates?",
    "choices": [
      "Incident definitions and severity, exposure and the conditions of operation.",
      "Completed-delivery volume, average speed and the number of approved routes.",
      "Fleet size, licensed-pilot numbers and the total number of receiving locations."
    ],
    "correct": 0,
    "explanation": "A rate requires events and a relevant exposure denominator, such as flights or flight-hours, under specified conditions. Successful volume alone neither supplies the incident count nor explains event severity and comparability.",
    "readingUrl": "#slide-world",
    "readingLabel": "Evidence for dependable operation"
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
  reading.textContent = `Related reading: ${current.readingLabel} ↗`;
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
    feedback.textContent = "Evaluate the complete delivery: ground handoffs, flight conditions, pickup, staffing and measured results. Review the concepts and explanations above.";
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
