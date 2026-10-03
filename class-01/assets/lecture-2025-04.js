/* Fall 2025: anonymous reflections and constructed teaching examples. */
const stages = [{"name": "Order", "short": "Eligibility", "description": "The app connects the customer to participating merchants and receiving points. Service availability and order suitability come before aircraft dispatch.", "connection": "Check destination, service availability and promised pickup time."}, {"name": "Prepare", "short": "Ground pickup", "description": "A merchant prepares the item and a ground rider carries it to the dispatch station in the lecture’s hybrid example.", "connection": "Link the correct order to the package; record preparation and rider handoff."}, {"name": "Load", "short": "Station release", "description": "Station staff and systems package, load and check the order. The station supports charging and vehicle readiness as well as goods handling.", "connection": "Confirm package, aircraft readiness and feasible release before dispatch."}, {"name": "Fly", "short": "Fleet oversight", "description": "Onboard positioning and perception support the flight. The management platform coordinates routes, time slots and fleet state, with remote oversight and exception support.", "connection": "Monitor deviations, environmental conditions and escalation responsibility."}, {"name": "Receive", "short": "Customer pickup", "description": "The aircraft reaches the designated receiving point; the customer is notified and collects the order. Landing and pickup access are part of service design.", "connection": "Confirm delivery and collection; include the customer’s walk and waiting time."}, {"name": "Recover", "short": "Next trip + fallback", "description": "The aircraft returns for charging or battery support, checks and maintenance. A failed or suspended delivery requires a service recovery plan.", "connection": "Close the order, log exceptions and coordinate a feasible ground fallback."}];
const cases = [{"name": "Positioning", "kicker": "01 / SENSING", "title": "Check positioning around buildings", "summary": "The reflections connect GNSS/RTK, inertial sensing, cameras, radar and visual positioning. Their usefulness depends on conditions, integration and response delay.", "facts": {"Constraint": "Buildings, power lines, changing obstacles and signal degradation.", "Design question": "How is uncertainty recognized when one input degrades?", "Evidence to seek": "Localization errors and end-to-end perception delay across representative conditions."}, "url": "https://wing.com/news/do-delivery-drones-have-cameras", "label": "Operator example of perception"}, {"name": "Shared airspace", "kicker": "02 / COORDINATION", "title": "Coordinate routes in shared airspace", "summary": "The lecture describes four-dimensional plans, conflict management and cloud–edge coordination. Students ask for interoperable multi-operator systems.", "facts": {"Constraint": "Intersecting traffic, unexpected deviations and priority missions.", "Design question": "Who coordinates plans and resolves conflicts across organizations?", "Evidence to seek": "Data freshness, interoperability tests and contingency outcomes."}, "url": "https://www.nasa.gov/directorates/armd/past-armd-projects/utm-project/", "label": "NASA UTM research context"}, {"name": "Weather + energy", "kicker": "03 / AVAILABILITY", "title": "Plan for demand during poor weather", "summary": "Battery endurance, payload and adverse weather limit availability. Students propose improved batteries and charging; solar and future battery designs remain proposals here.", "facts": {"Constraint": "Wind, rain, battery state and service interruptions.", "Design question": "What happens to accepted orders when availability changes?", "Evidence to seek": "Weather suspension, fallback completion, energy use and full cost per order."}, "url": "https://www.nature.com/articles/s41467-017-02411-5", "label": "Life-cycle energy research"}, {"name": "Receiving points", "kicker": "04 / GROUND SYSTEM", "title": "Include the customer’s pickup", "summary": "Pickup stations need space, access and ground support. Tether services use a different receiving arrangement; neither architecture is universal.", "facts": {"Constraint": "Apartments, accessible pickup, loading space, noise and privacy.", "Design question": "Does a shorter flight offset added walking, queues or restricted choices?", "Evidence to seek": "Order-to-pickup time, complaint patterns and receiving-site access."}, "url": "https://www.meituan.com/news/NN231219070003592", "label": "Historical campus pickup case"}];
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
  link.href = item.url; link.textContent = `${item.label} ↗`;
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
  document.querySelector('#latency-chain').textContent = `${sampling.toFixed(0)} ms sampling + ${processing} ms processing + ${linkDelay} ms communication + ${actuationDelay} ms actuation`;
  document.querySelector('#lab-delay').textContent = `${(total/1000).toFixed(2)} s`;
  document.querySelector('#lab-distance').textContent = `${(speed*total/1000).toFixed(2)} m`;
  document.querySelector('#lab-observation').textContent = `Sampling alone accounts for ${(speed/frequency).toFixed(2)} m. The rest of the chain adds ${(speed*(processing+linkDelay+actuationDelay)/1000).toFixed(2)} m in this example. Braking distance is not included.`;
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

const questions = [{"topic": "The relay", "question": "A flight is quick, but the customer still waits. Which measure best describes the service?", "choices": ["Flight duration only", "Order-to-pickup time, including ground handoffs and customer access", "Aircraft maximum speed"], "correct": 1, "explanation": "Preparation, station queues and collection remain part of elapsed service time.", "readingUrl": "#slide-responses", "readingLabel": "The delivery process"}, {"topic": "Ground handoff", "question": "What best matches the supplied lecture’s food-delivery example?", "choices": ["App → merchant → rider → dispatch station → flight → designated pickup", "Every drone lands at an apartment door", "The aircraft prepares and packages the meal"], "correct": 0, "explanation": "The lecture describes a hybrid relay supported by ground operations.", "readingUrl": "#slide-responses", "readingLabel": "Delivery stages"}, {"topic": "Architecture", "question": "A reflection describes a tether service. How should it be compared with the lecture case?", "choices": ["Assume every operator uses the same tether", "Treat tether length as a universal legal rule", "Compare its receiving arrangement separately from station pickup"], "correct": 2, "explanation": "Wing explains a tether design; the lecture’s designated pickup example uses a different handoff.", "readingUrl": "https://wing.com/news/how-do-you-get-package-from-drone-to", "readingLabel": "Wing’s tether mechanism"}, {"topic": "Sensing", "question": "A navigation input degrades near buildings. What is the strongest evaluation question?", "choices": ["Does each sensor perform well only in clear conditions?", "Can integrated sensing recognize uncertainty and handle degraded inputs?", "Can the route plan be treated as a substitute for sensing?"], "correct": 1, "explanation": "Sensor fusion needs evaluation under relevant conditions; adding sensors alone proves no universal reliability.", "readingUrl": "#slide-model", "readingLabel": "Operating in the city"}, {"topic": "Sampling", "question": "In the teaching model, speed is 10 m/s and sensor frequency is 10 Hz. What is the distance during the worst-case sampling wait alone?", "choices": ["1 m", "5 m", "10 m"], "correct": 0, "explanation": "Sampling wait is 1/10 second; 10 × 0.1 = 1 m. This excludes the rest of the response chain.", "readingUrl": "#slide-evidence", "readingLabel": "Latency model"}, {"topic": "Total delay", "question": "Add 200 ms processing, 100 ms communication and 100 ms actuation to that sampling wait. What is the modeled distance before response?", "choices": ["1 m", "2 m", "5 m"], "correct": 2, "explanation": "Total delay is 0.1 + 0.2 + 0.1 + 0.1 = 0.5 seconds; distance is 5 m. Braking is excluded.", "readingUrl": "#slide-evidence", "readingLabel": "Latency assumptions"}, {"topic": "Airspace", "question": "Plans schedule drones in space and time. What still needs attention?", "choices": ["The efficiency of planned routes under normal conditions only", "Unexpected deviations, onboard sensing and contingency coordination", "Nothing: a filed plan guarantees no encounter"], "correct": 1, "explanation": "A shared plan and response to deviations address different parts of coordination.", "readingUrl": "https://www.nasa.gov/directorates/armd/past-armd-projects/utm-project/", "readingLabel": "NASA UTM project"}, {"topic": "Availability", "question": "Demand rises during adverse weather. Which service plan addresses the cohort’s concern?", "choices": ["Evaluate ground fallback and communicate changed availability", "Promise all-weather operation for every aircraft", "Ignore accepted orders until the next day"], "correct": 0, "explanation": "Weather-dependent capacity requires service recovery and realistic customer communication.", "readingUrl": "#slide-future", "readingLabel": "Weather and service tension"}, {"topic": "Staffing", "question": "One pilot can monitor several aircraft. Does that establish the total labor cost?", "choices": ["Yes, all ground work disappears", "Yes, flight hours alone cover the supporting work", "No: include loading, maintenance, emergency support and other roles"], "correct": 2, "explanation": "A supervision ratio covers one role and omits much of the supporting system.", "readingUrl": "#slide-responses", "readingLabel": "Automation and work"}, {"topic": "Life cycle", "question": "Which comparison best evaluates an environmental claim?", "choices": ["Count only energy used during the flight", "Include electricity, hubs, batteries and the matched ground alternative", "Treat electric propulsion as zero total emissions"], "correct": 1, "explanation": "The 2018 study makes the deployment and energy boundary central to the comparison.", "readingUrl": "https://www.nature.com/articles/s41467-017-02411-5", "readingLabel": "Life-cycle research"}, {"topic": "Public trust", "question": "A shared hub proposal receives neighborhood objections. What should the review include?", "choices": ["Noise, privacy, access, incident responsibility and funding", "Only the number of registered drones", "A claim that new technology always wins acceptance"], "correct": 0, "explanation": "Shared infrastructure also needs governance and a workable relationship with its community.", "readingUrl": "#slide-future", "readingLabel": "Adoption and public trust"}, {"topic": "Evidence", "question": "A company reports many successful deliveries. What is missing before inferring a safety rate?", "choices": ["The total number of aircraft in the fleet", "A projection of future market size", "Exposure, failures and severity under specified conditions"], "correct": 2, "explanation": "Aggregate volume alone does not establish an incident rate or guarantee zero risk.", "readingUrl": "#slide-world", "readingLabel": "Evaluate the evidence"}];
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
  nextButton.textContent = questionIndex === questions.length - 1 ? "See quiz result →" : "Next question →";
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
    feedback.textContent = "Evaluate the complete delivery: ground handoffs, flight conditions, pickup, staffing and measured results. Return to the panels to review.";
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
