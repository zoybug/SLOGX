/* Fall 2025: anonymous content and explicitly constructed teaching examples. */
const stages = [{"name": "RECEIVE", "short": "Register the arrival", "description": "Check goods, quantities and condition against the inbound record. Capture item identity and receipt status before storage.", "connection": "Receiving accuracy and unresolved exceptions"}, {"name": "PUT AWAY", "short": "Make location reliable", "description": "Assign a compatible location, move the goods and confirm where they actually arrived. Capacity, product conditions and future access all matter.", "connection": "Location accuracy, retrieval travel and replenishment"}, {"name": "PICK", "short": "Release feasible work", "description": "Combine orders where useful, sequence tasks and assign pickers or robots. Include due times, capacity, resource availability and sorting needs.", "connection": "Order turnaround, travel and station queues"}, {"name": "CHECK + PACK", "short": "Close the accuracy loop", "description": "Verify picked items and quantities, package appropriately and link the packed unit to the order. A fast tour is not enough if it produces the wrong parcel.", "connection": "Pick accuracy, damage and rework"}, {"name": "SHIP", "short": "Coordinate dispatch", "description": "Consolidate packed units for departure and record the transport handoff. Match the right parcel, destination and dispatch time.", "connection": "Dispatch reliability and transport readiness"}, {"name": "REVIEW", "short": "Inspect the whole flow", "description": "Editorial extension: inspect queues, errors, replenishment, energy and downtime across all stages. Compare changes under a documented operating profile.", "connection": "Whole-process service and resource use"}];
const cases = [{"name": "Grid bins", "kicker": "01 / AUTOSTORE", "title": "Dense storage still needs access.", "summary": "Top-running robots retrieve stacked bins and deliver them to ports. A request for a buried bin can require moving bins above it.", "facts": {"Operating decision": "Slotting and reshuffling policies influence future access, not just today’s trip.", "Check the constraint": "Bin and product compatibility; port capacity; digging and maintenance.", "Human handoff": "A person or separate picking device takes items from the presented bin.", "Useful comparison": "Measure full order turnaround and queues at the same demand profile."}, "url": "https://www.autostoresystem.com/faq/robots", "label": "AutoStore robot explanation"}, {"name": "Rack climbing", "kicker": "02 / EXOTEC SKYPOD", "title": "Rack access and floor movement are one design.", "summary": "Skypod robots move through the warehouse and climb compatible racks to retrieve containers. The layout, access routes and workstation handoffs need to work together.", "facts": {"Operating decision": "Coordinate retrieval and delivery with station availability.", "Check the constraint": "Compatible racks, container/product fit, floor traffic and maintenance access.", "Human handoff": "Container presentation does not itself complete individual item picking.", "Useful comparison": "Include replenishment, peak queues and recovery, not only robot travel."}, "url": "https://www.exotec.com/system/robots/", "label": "Exotec robot explanation"}, {"name": "Tote handling", "kicker": "03 / TOTE SYSTEMS", "title": "Separate movements need coordinated transfers.", "summary": "The lecture’s tote-handling examples raise choices about vertical access, transport and delivery to workstations. Designs differ; verify the mechanism for the specific product configuration.", "facts": {"Operating decision": "Synchronize retrieval, transport, temporary buffers and station work.", "Check the constraint": "Transfer capacity and blocking can limit a fast robot fleet.", "Human handoff": "Keep tote identity, inventory location and task completion consistent.", "Useful comparison": "Test combined capacity and queues across the complete handoff."}, "url": "https://www.hairobotics.com/", "label": "Hai Robotics system examples"}, {"name": "Manual / hybrid", "kicker": "04 / OPERATING BASELINE", "title": "Methods can improve the existing operation.", "summary": "The reflections do not imply every warehouse needs the same machinery. Slotting, batch rules, pick-line organization and reliable scans also matter in manual or hybrid settings.", "facts": {"Operating decision": "Match single, batch, zone or bucket-brigade picking to the work profile.", "Check the constraint": "Product handling, aisle access, staffing and due times.", "Human handoff": "Training, workload, ergonomics and exception handling belong in the design.", "Useful comparison": "Pilot against the current process; include full transition and operating cost."}, "url": "https://www.warehouse-science.com/book/index.html", "label": "Warehouse Science learning materials"}];
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

let policy = 'immediate';
function renderBatch() {
  const urgent = document.querySelector('#urgent-order').checked;
  const due = [urgent ? 2 : 3, 4, 4], arrival = [0,1,3];
  const tours = policy === 'immediate' ? [{orders:[0],start:0,distance:80},{orders:[1],start:1,distance:160},{orders:[2],start:3,distance:80}]
    : policy === 'bounded' ? [{orders:[0,1],start:1,distance:160},{orders:[2],start:3,distance:80}]
    : [{orders:[0,1,2],start:3,distance:160}];
  const completion = [0,0,0];
  tours.forEach(t => t.orders.forEach(i => completion[i] = t.start + t.distance / 80));
  const distance = tours.reduce((s,t)=>s+t.distance,0);
  const mean = completion.reduce((s,t,i)=>s+t-arrival[i],0)/3;
  const late = completion.filter((t,i)=>t>due[i]).length;
  document.querySelector('#order-one-due').textContent = `${due[0]} min`;
  document.querySelector('#batch-distance').textContent = `${distance} m`;
  document.querySelector('#batch-turnaround').textContent = `${mean.toFixed(2)} min`;
  document.querySelector('#batch-late').textContent = `${late} / 3`;
  document.querySelector('#batch-routes').textContent = tours.map(t=>`Orders ${t.orders.map(i=>i+1).join(' + ')}: depart ${t.start}, return ${t.start+t.distance/80} min`).join(' · ');
  document.querySelector('#batch-comment').textContent = policy === 'immediate' ? 'Three separate tours meet all deadlines in this example.'
    : policy === 'bounded' ? `One short reservation saves 80 m, but raises mean turnaround.${urgent ? ' Order 1 now misses its urgent deadline.' : ' All three deadlines are still met.'}`
    : 'The shortest travel option makes all three orders late. Waiting dominates the service outcome.';
  document.querySelectorAll('[data-policy]').forEach(b=>{const active=b.dataset.policy===policy;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
}
document.querySelector('#batch-policies').addEventListener('click',event=>{const b=event.target.closest('[data-policy]');if(b){policy=b.dataset.policy;renderBatch();}});
document.querySelector('#urgent-order').addEventListener('change',renderBatch);
renderBatch();

const questions = [{"topic": "Process", "question": "A tote is physically stored, but its location was not confirmed. What is the priority?", "choices": ["Buy a faster robot", "Reconcile the physical location and inventory record", "Release more orders"], "correct": 1, "explanation": "Physical and information flows must agree. A wrong location can propagate into failed picks.", "readingUrl": "https://www.warehouse-science.com/book/index.html", "readingLabel": "Warehouse Science"}, {"topic": "Process", "question": "Picking becomes faster, but packing queues increase. Which measure best tests the change?", "choices": ["Robot speed alone", "Number of shelves", "Whole order turnaround and queues across stages"], "correct": 2, "explanation": "A local improvement may shift the bottleneck. Review the full fulfillment process.", "readingUrl": "https://www.warehouse-science.com/book/index.html", "readingLabel": "Warehouse Science"}, {"topic": "System fit", "question": "A robot delivers a tote to a workstation. What is still needed?", "choices": ["Someone or another device to select and verify individual items", "Assume every product is already picked", "No further handling"], "correct": 0, "explanation": "Moving a tote is distinct from grasping and checking its individual products.", "readingUrl": "https://brightpick.ai/faq/", "readingLabel": "Brightpick FAQ"}, {"topic": "System fit", "question": "A popular item sits in a buried grid bin. Which policy question matters?", "choices": ["Only the building color", "Future access and reshuffling under the demand profile", "Ignore all bins above it"], "correct": 1, "explanation": "Dense stacking can require digging. Storage policies influence the retrieval work.", "readingUrl": "https://www.autostoresystem.com/faq/robots", "readingLabel": "AutoStore robot FAQ"}, {"topic": "Methods", "question": "In the lab, order 1 is due at minute 2. Reserving it until minute 1 finishes its batch at minute 3. What follows?", "choices": ["It meets the deadline because distance fell", "The deadline disappears in a batch", "It is late; travel savings do not establish service feasibility"], "correct": 2, "explanation": "Reservation can reduce travel while worsening waiting or deadline performance.", "readingUrl": "https://doi.org/10.1109/TASE.2024.3428541", "readingLabel": "Predictive reservation research"}, {"topic": "Methods", "question": "A forecast predicts a compatible future order. What should reservation account for?", "choices": ["Forecast error, waiting, due times and resource capacity", "Treat the forecast as a guaranteed arrival", "Wait indefinitely"], "correct": 0, "explanation": "The teaching lab knows arrivals; real predictive reservation does not. Validate policies under uncertainty.", "readingUrl": "https://doi.org/10.1109/TASE.2024.3428541", "readingLabel": "Predictive reservation research"}, {"topic": "Methods", "question": "One fixed picking zone consistently delays all the others. What should be examined?", "choices": ["Only robot purchase price", "Workload balance, boundaries and handoffs", "Ignore the slow zone"], "correct": 1, "explanation": "The class notices uneven zones. Compare work organization as well as equipment.", "readingUrl": "https://www.warehouse-science.com/book/supplement/flowlines/index.html", "readingLabel": "Pick-line simulations"}, {"topic": "Measurement", "question": "A stable flow averages 120 orders/hour and 30 minutes in process. What is its average work in process?", "choices": ["4 orders", "3,600 orders", "60 orders"], "correct": 2, "explanation": "Convert 30 minutes to 0.5 hour: L = 120 × 0.5 = 60 orders, with the same process boundary.", "readingUrl": "https://www.warehouse-science.com/book/index.html", "readingLabel": "Warehouse Science"}, {"topic": "Measurement", "question": "Four app orders arrived quickly. What does that establish?", "choices": ["Those four observations; a broader benchmark needs representative data", "Every order has the same lead time", "All warehouses achieve that speed"], "correct": 0, "explanation": "A convenience sample does not establish general warehouse performance.", "readingUrl": "https://www.warehouse-science.com/book/index.html", "readingLabel": "Warehouse Science"}, {"topic": "Adoption", "question": "A vendor describes a large productivity gain. What supports an investment decision?", "choices": ["Copy the percentage into every warehouse plan", "Evaluate comparable conditions, total cost and an operating pilot", "Ignore integration and downtime"], "correct": 1, "explanation": "A mechanism description is not a universal measured gain. Demand, products and boundaries matter.", "readingUrl": "https://www.quicktron.com/", "readingLabel": "Quicktron system examples"}, {"topic": "People", "question": "Workers worry that automation reduces skills and makes performance monitoring unfair. What belongs in the plan?", "choices": ["Only more bins", "Treat concern as irrelevant", "Worker involvement, training, privacy and meaningful exception roles"], "correct": 2, "explanation": "The corpus preserves different views of automation. Worker experience is part of system evaluation.", "readingUrl": "https://www.sigs.tsinghua.edu.cn/yp_en/main.htm", "readingLabel": "Human–robot warehousing research"}, {"topic": "Resilience", "question": "The normal shift runs well, but one transfer device failure stops fulfillment. What is missing from evaluation?", "choices": ["Failure recovery, dependency and a workable fallback", "A larger normal-speed claim", "Only a shorter aisle"], "correct": 0, "explanation": "Test the difficult day. A tightly coupled design can depend on a single critical handoff.", "readingUrl": "https://www.warehouse-science.com/book/index.html", "readingLabel": "Warehouse Science"}];
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
    document.querySelector("#quiz-topic").textContent = "THE WHOLE WAREHOUSE";
    document.querySelector("#quiz-question").textContent = score === questions.length ? "Accurate, timely fulfillment." : "Run the loop again.";
    document.querySelector("#quiz-choices").innerHTML = "";
    feedback.className = "feedback";
    feedback.textContent = "A sound warehouse plan connects inventory accuracy, feasible work, reliable handoffs and measured service outcomes.";
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
