/* Fall 2025: anonymous content and explicitly constructed teaching examples. */
const stages = [{"name": "Receive", "short": "Register the arrival", "description": "Check goods, quantities and condition against the inbound record. Capture item identity and receipt status before storage.", "connection": "Receiving accuracy and unresolved exceptions"}, {"name": "Put away", "short": "Confirm the storage location", "description": "Assign a compatible location, move the goods and confirm where they actually arrived. Capacity, product conditions and future access all matter.", "connection": "Location accuracy, retrieval travel and replenishment"}, {"name": "Pick", "short": "Release feasible work", "description": "Combine orders where useful, sequence tasks and assign pickers or robots. Include due times, capacity, resource availability and sorting needs.", "connection": "Order turnaround, travel and station queues"}, {"name": "Check + pack", "short": "Check items and package the order", "description": "Verify picked items and quantities, package appropriately and link the packed unit to the order. A fast tour is not enough if it produces the wrong parcel.", "connection": "Pick accuracy, damage and rework"}, {"name": "Ship", "short": "Coordinate dispatch", "description": "Consolidate packed units for departure and record the transport handoff. Match the right parcel, destination and dispatch time.", "connection": "Dispatch reliability and transport readiness"}, {"name": "Review", "short": "Inspect the whole flow", "description": "Review queues, errors, replenishment, energy and downtime across the process. This additional teaching stage compares changes under the same operating conditions.", "connection": "Whole-process service and resource use"}];
const cases = [{"name": "Grid bins", "kicker": "01 / AUTOSTORE", "title": "Include the work of reaching buried bins", "summary": "Top-running robots retrieve stacked bins and deliver them to ports. A request for a buried bin can require moving bins above it.", "facts": {"Operating decision": "Slotting and reshuffling policies influence future access, not just today’s trip.", "Check the constraint": "Bin and product compatibility; port capacity; digging and maintenance.", "Human handoff": "A person or separate picking device takes items from the presented bin.", "Useful comparison": "Measure full order turnaround and queues at the same demand profile."}, "url": "https://www.autostoresystem.com/faq/robots", "label": "AutoStore robot explanation", "referenceUrl": "#reference-03-4"}, {"name": "Rack climbing", "kicker": "02 / EXOTEC SKYPOD", "title": "Coordinate rack access and floor travel", "summary": "Skypod robots move through the warehouse and climb compatible racks to retrieve containers. The layout, access routes and workstation handoffs need to work together.", "facts": {"Operating decision": "Coordinate retrieval and delivery with station availability.", "Check the constraint": "Compatible racks, container/product fit, floor traffic and maintenance access.", "Human handoff": "Container presentation does not itself complete individual item picking.", "Useful comparison": "Include replenishment, peak queues and recovery, not only robot travel."}, "url": "https://www.exotec.com/system/robots/", "label": "Exotec robot explanation", "referenceUrl": "#reference-03-5"}, {"name": "Tote handling", "kicker": "03 / TOTE SYSTEMS", "title": "Coordinate transfers between machines", "summary": "The lecture’s tote-handling examples raise choices about vertical access, transport and delivery to workstations. Designs differ; verify the mechanism for the specific product configuration.", "facts": {"Operating decision": "Synchronize retrieval, transport, temporary buffers and station work.", "Check the constraint": "Transfer capacity and blocking can limit a fast robot fleet.", "Human handoff": "Keep tote identity, inventory location and task completion consistent.", "Useful comparison": "Test combined capacity and queues across the complete handoff."}, "url": "https://www.hairobotics.com/", "label": "Hai Robotics system examples", "referenceUrl": "#reference-03-6"}, {"name": "Manual / hybrid", "kicker": "04 / OPERATING BASELINE", "title": "Improve the current process before choosing equipment", "summary": "The reflections do not imply every warehouse needs the same machinery. Slotting, batch rules, pick-line organization and reliable scans also matter in manual or hybrid settings.", "facts": {"Operating decision": "Match single, batch, zone or bucket-brigade picking to the work profile.", "Check the constraint": "Product handling, aisle access, staffing and due times.", "Human handoff": "Training, workload, ergonomics and exception handling belong in the design.", "Useful comparison": "Pilot against the current process; include full transition and operating cost."}, "url": "https://www.warehouse-science.com/book/index.html", "label": "Warehouse Science learning materials", "referenceUrl": "#reference-03-1"}];
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

let policy = 'immediate';
function renderBatch() {
  const urgent = document.querySelector('#urgent-order').checked;
  const due = [urgent ? 2 : 3, 4, 4], arrival = [0,1,3];
  const tours = policy === 'immediate' ? [{orders:[0],start:0,distance:80},{orders:[1],start:1,distance:160},{orders:[2],start:3,distance:80}]
    : policy === 'bounded' ? [{orders:[0,1],start:1,distance:160},{orders:[2],start:3,distance:80}]
    : [{orders:[0,1,2],start:3,distance:160}];
  const completion = [0, 0, 0];
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

const questions = [
  {
    "topic": "Process",
    "question": "A tote was put away at L17, but the inventory record still says L12. Before releasing its next pick, which action best addresses the failure?",
    "choices": [
      "Update the record from the planned put-away job and continue picking.",
      "Verify the tote and actual location, then reconcile the inventory record.",
      "Pick substitute stock first and resolve the location during cycle counting."
    ],
    "correct": 1,
    "explanation": "The planned location is not proof of the physical location. Confirming item identity and where it actually arrived repairs the information needed for the next pick; deferring the discrepancy can propagate an error.",
    "readingUrl": "https://www.warehouse-science.com/book/index.html",
    "readingLabel": "Warehouse & Distribution Science"
  },
  {
    "topic": "Process",
    "question": "A trial reduces picking time by 20%, while completed orders wait longer for packing. Which comparison most directly tests whether customer orders improved?",
    "choices": [
      "Compare release-to-dispatch time and queues under a matched workload.",
      "Compare picks per labour-hour and picker utilization during the trial.",
      "Compare picking travel per order and the cost of the new equipment."
    ],
    "correct": 0,
    "explanation": "The first comparison includes the stage where work is now waiting. Picking productivity and travel remain useful measures, but neither alone establishes a shorter complete fulfilment process.",
    "readingUrl": "https://www.warehouse-science.com/book/index.html",
    "readingLabel": "Warehouse & Distribution Science"
  },
  {
    "topic": "System fit",
    "question": "A retrieval robot presents a mixed-SKU tote at a workstation. Which operation must still occur before its products can be treated as a correctly picked order?",
    "choices": [
      "Confirm that the tote came from the storage location assigned by the WMS.",
      "Allocate the next retrieval task so the workstation remains supplied.",
      "Select the requested items and quantities, and verify the order contents."
    ],
    "correct": 2,
    "explanation": "Container retrieval does not select the individual products inside it. Location confirmation and station supply support picking, but requested items and quantities still need to be selected and checked.",
    "readingUrl": "https://brightpick.ai/faq/",
    "readingLabel": "Brightpick item-picking explanation"
  },
  {
    "topic": "System fit",
    "question": "A frequently requested product is repeatedly buried beneath other grid bins. Which policy comparison best addresses that retrieval work?",
    "choices": [
      "Compare faster robot travel using the current bin positions and priorities.",
      "Compare storage assignments using expected retrieval and reshuffling work.",
      "Compare port locations using the same retrieval sequence and bin positions."
    ],
    "correct": 1,
    "explanation": "The issue is access to the buried bin. A policy that considers future requests and reshuffling addresses that work directly; changing travel speed or ports may help elsewhere without removing it.",
    "readingUrl": "https://www.autostoresystem.com/faq/robots",
    "readingLabel": "AutoStore bin retrieval"
  },
  {
    "topic": "Methods",
    "question": "In the constructed example, bounded reservation cuts total travel from 320 m to 240 m. Order 1 arrives at minute 0, is due at minute 2 and finishes at minute 3. What does the comparison show?",
    "choices": [
      "80 m is saved, and order 1 has one minute of arrival-to-completion time.",
      "80 m is saved, and order 1 meets its deadline when its batch departs.",
      "80 m is saved, and order 1 misses its completion deadline by one minute."
    ],
    "correct": 2,
    "explanation": "The deadline concerns completion, not release. Order 1 takes three minutes from arrival to completion and is one minute late; the travel saving does not establish service feasibility.",
    "readingUrl": "https://doi.org/10.1109/TASE.2024.3428541",
    "readingLabel": "Predictive order reservation research"
  },
  {
    "topic": "Methods",
    "question": "A forecast suggests a compatible order will arrive soon. Which reservation rule best carries the teaching example into uncertain operation?",
    "choices": [
      "Bound the wait by due times and capacity, and test forecast errors.",
      "Reserve when the forecast’s confidence is high, using the same wait each time.",
      "Minimize expected travel, then handle late orders through a separate priority queue."
    ],
    "correct": 0,
    "explanation": "The teaching example knows arrivals in advance. In operation, a forecast can be wrong; a feasible rule needs limits on waiting, deadlines and available resources as well as a travel objective.",
    "readingUrl": "https://doi.org/10.1109/TASE.2024.3428541",
    "readingLabel": "Predictive order reservation research"
  },
  {
    "topic": "Methods",
    "question": "Orders require work in three fixed picking zones. One zone queues while the other two often idle. What should be investigated first?",
    "choices": [
      "Whether shorter picking routes reduce travel by the same amount in each zone.",
      "Whether more buffer space lets the busy zone accumulate additional orders.",
      "Whether work allocation, zone boundaries and handoffs create the imbalance."
    ],
    "correct": 2,
    "explanation": "The pattern points to unequal workloads or coordination, so examine their cause before choosing equipment or buffers. Faster local routes or larger queues do not necessarily balance the complete order flow.",
    "readingUrl": "https://www.warehouse-science.com/book/supplement/flowlines/index.html",
    "readingLabel": "Pick-line simulations"
  },
  {
    "topic": "Measurement",
    "question": "Within the same stable process boundary, throughput averages 120 orders/hour and time in process averages 30 minutes. What average work in process follows from Little’s Law?",
    "choices": [
      "30 orders",
      "60 orders",
      "120 orders"
    ],
    "correct": 1,
    "explanation": "Convert 30 minutes to 0.5 hour, then L = λW = 120 × 0.5 = 60 orders. The relation includes waiting and does not establish why the observed time is high or low.",
    "readingUrl": "https://www.warehouse-science.com/book/index.html",
    "readingLabel": "Warehouse & Distribution Science"
  },
  {
    "topic": "Measurement",
    "question": "A class exercise records four recent app-order picking intervals. Which conclusion is supported by those observations?",
    "choices": [
      "Those orders had short recorded intervals; a broader benchmark needs comparable data.",
      "The sample estimates average warehouse picking time because every order has timestamps.",
      "The sample estimates delivery lead time because picking occurs after order placement."
    ],
    "correct": 0,
    "explanation": "These are convenience observations of particular timestamps. They do not form a representative warehouse sample, and the measured picking interval is different from complete delivery lead time.",
    "readingUrl": "https://www.warehouse-science.com/book/index.html",
    "readingLabel": "Warehouse measurement concepts"
  },
  {
    "topic": "Adoption",
    "question": "A supplier reports a 30% productivity gain. Which comparison most directly supports an investment decision for a different warehouse?",
    "choices": [
      "Apply the reported gain to local wages and compare it with the purchase price.",
      "Match the supplier’s peak output target and amortize equipment over its service life.",
      "Test comparable local work, including integration, downtime and total operating cost."
    ],
    "correct": 2,
    "explanation": "The gain depends on the supplier’s workload and measurement boundary. A local comparison and pilot can test whether it survives product differences, integration work and ongoing costs.",
    "readingUrl": "https://www.quicktron.com/",
    "readingLabel": "Quicktron system examples"
  },
  {
    "topic": "People",
    "question": "A goods-to-person pilot meets its output target, but workers report reduced autonomy and unfair monitoring. Which evaluation best reflects the differing student views?",
    "choices": [
      "Compare output bonuses and retraining attendance against the old operation.",
      "Review tasks, worker input, training access and the use of performance data.",
      "Compare turnover and labour costs after extending the same monitoring policy."
    ],
    "correct": 1,
    "explanation": "The concerns involve task quality, participation and how data is used, not only output or training attendance. Students expressed both enthusiasm for reduced physical work and worries about deskilling and fairness.",
    "readingUrl": "https://www.sigs.tsinghua.edu.cn/yp_en/main.htm",
    "readingLabel": "Peng Yang’s human–robot warehousing research"
  },
  {
    "topic": "Resilience",
    "question": "A warehouse performs well on normal days, but failure of one transfer device stops all outbound work. Which additional test best evaluates the design’s resilience?",
    "choices": [
      "Measure dependency, repair/recovery time and the usable fallback during a failure.",
      "Measure average robot utilization after adding spare capacity at the picking ports.",
      "Measure normal-shift throughput with a larger buffer before the transfer device."
    ],
    "correct": 0,
    "explanation": "The critical issue is a failed handoff. Resilience requires understanding how work can continue or recover when that dependency is unavailable; spare capacity or buffers elsewhere may leave the same failure path.",
    "readingUrl": "https://www.warehouse-science.com/book/index.html",
    "readingLabel": "Whole-process warehouse evaluation"
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
    status.textContent = `Quiz complete · Score: ${score} of ${questions.length}`;
    document.querySelector("#quiz-progress").style.width = "100%";
    document.querySelector("#quiz-topic").textContent = "Quiz complete";
    document.querySelector("#quiz-question").textContent = score === questions.length ? "You answered all 12 questions correctly." : "Review the explanations and try the quiz again.";
    document.querySelector("#quiz-choices").innerHTML = "";
    feedback.className = "feedback";
    feedback.textContent = "Warehouse performance depends on accurate records, equipment fit, work methods and recovery from disruptions. Return to the examples to review those choices.";
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
