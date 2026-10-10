/* Fall 2025: anonymous aggregate and editorial teaching content. */
const stages = [{"name": "Sense", "short": "Capture physical conditions", "description": "Orders, scans and sensors reveal demand, stock and movement. First check whether observations are timely, complete and reliable.", "connection": "Fresh-food order records; S.F. Holding network events"}, {"name": "Connect", "short": "Connect partners and records", "description": "Agree on shared identifiers and who handles each transfer. Connect records for goods, information and payments so partners can act on the same situation.", "connection": "Flexport shipment parties; three-flow reflections"}, {"name": "Predict", "short": "Forecast demand or disruption", "description": "Use data to estimate demand or disruption, including the uncertainty. The forecast informs a decision; procurement and routing still need their own plans.", "connection": "Fresh-food demand and SKU correlations"}, {"name": "Optimize", "short": "Compare feasible plans", "description": "Compare feasible procurement, sorting or resource plans. Make service, cost and sustainability objectives explicit; test the effect of different weights.", "connection": "Fresh-food procurement model; S.F. Holding resource allocation"}, {"name": "Act", "short": "Carry out the plan", "description": "Define who carries out each action and when it needs review. Plan the response if capacity, safety or other assumptions stop holding.", "connection": "S.F. Holding routes and exceptions; student views on oversight"}, {"name": "Learn", "short": "Review and test alternatives", "description": "Compare actual service, waste and costs with a baseline. A digital twin can test candidate strategies before deployment, and observed results inform the next plan.", "connection": "S.F. Holding digital-twin tests; student requests for performance measures"}];
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

const themes = [["Automation/autonomy", 26], ["AI/ML", 21], ["IoT", 17], ["Visibility/live data", 14], ["Connectivity/coordination", 13], ["Optimization", 13], ["Sustainability", 13], ["Big data", 12], ["Prediction/forecasting", 12], ["Digital twin", 11], ["Blockchain", 10], ["Resilience", 6]];
document.querySelector('#theme-bars').innerHTML = themes.map(([name,count]) => `<div class="bar-row"><span>${name}</span><span class="bar-track" role="img" aria-label="${name}: ${count} of 30"><i style="width:${count/30*100}%"></i></span><b>${count}/30</b></div>`).join('');
const insights = ["A simpler IT workflow may solve the bottleneck before an AI model is needed.", "Efficiency asks how many resources were used; effectiveness asks whether the service goal was met.", "Agree on decision criteria and their relative importance before automating the choice.", "Modular tools still need shared data and reliable handoffs between partners.", "Include computing resources as well as vehicle resources when evaluating sustainability.", "Build the skills and workflows needed to take on automated decisions gradually."];
document.querySelector('#insight-grid').innerHTML = insights.map((idea,index) => `<div class="insight"><span class="mark">[I-${String(index+1).padStart(2,'0')}]</span><p>${idea}</p></div>`).join('');
const caseData = [
  {
    "name": "Fresh food",
    "kicker": "CASE 01 / FORECAST → PROCUREMENT",
    "title": "Use the forecast to decide what to buy",
    "summary": "The fresh-food case links demand forecasting with a two-stage stochastic procurement model and sorting work. Purchasing choices must account for uncertain demand and spoilage.",
    "facts": {
      "Data": "Past orders, demand for stock-keeping units (SKUs), relationships between products, costs and sorting capacity.",
      "Decision": "What to procure and how to revise choices as more demand information becomes available.",
      "Constraints": "Perishability, uncertainty and resource capacity.",
      "Outcome to examine": "Cost, spoilage and service against a documented baseline."
    },
    "url": "#reference-1",
    "label": "Source reference"
  },
  {
    "name": "Flexport",
    "kicker": "CASE 02 / FRAGMENTATION → COORDINATION",
    "title": "Use shared information to coordinate shipments",
    "summary": "The Flexport case starts with trade information scattered across emails and spreadsheets. A shared platform connects shipment partners; emissions estimates add another factor to planning.",
    "facts": {
      "Data": "Orders, bookings, shipment milestones, documents and emissions estimates.",
      "Decision": "Coordinate handoffs and compare utilization, route and service choices.",
      "Constraints": "Partner data quality, timing, service commitments and trade-offs across objectives.",
      "Outcome to examine": "On-time handoffs, utilization, cost and clearly bounded emissions measures."
    },
    "url": "#reference-2",
    "label": "Source reference"
  },
  {
    "name": "S.F. Holding",
    "kicker": "CASE 03 / NETWORK STATE → RESOURCE PLAN",
    "title": "Test a network plan before using it",
    "summary": "S.F. Holding’s case connects capacity planning, resource allocation, routing and responses to exceptions. A digital twin uses a model of the network to test candidate plans before implementation.",
    "facts": {
      "Data": "Network events, parcel flows, resources and static/live process information.",
      "Decision": "Reserve and allocate capacity, plan routes and adjust exceptions.",
      "Constraints": "Model fidelity, capacity, operational uncertainty and ownership of interventions.",
      "Outcome to examine": "Service stability, resource use and agreement between modeled and actual outcomes."
    },
    "url": "#reference-3",
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
    "topic": "Data + readiness",
    "question": "Three partners record one shipment with different IDs. Their records are individually complete, but an automated exception report treats them as three shipments. Which change most directly addresses the error?",
    "choices": [
      "Refresh the three feeds more frequently before combining their shipment totals.",
      "Create a shared identifier mapping with rules for resolving conflicting records.",
      "Train the dispatch model on a larger sample from the existing feeds."
    ],
    "correct": 1,
    "explanation": "The error arises from record identity, not update speed or sample size. A shared mapping and conflict rules let the partners refer to the same shipment; faster or larger feeds can reproduce the mismatch.",
    "readingLabel": "Flexport Control Tower",
    "readingUrl": "https://www.flexport.com/technology/control-tower/"
  },
  {
    "topic": "Data + readiness",
    "question": "A dispatch model passes validation, and staff have completed training. During a pilot, an unusual order is sent back and forth between teams without a decision. Which readiness change addresses this remaining gap?",
    "choices": [
      "Assign exception ownership, escalation criteria and authority to approve a fallback.",
      "Extend the training course with another session on interpreting model accuracy.",
      "Increase the model’s input history to include a wider range of past orders."
    ],
    "correct": 0,
    "explanation": "The remaining failure is in responsibility and workflow ownership. More training or data may help elsewhere, but neither decides who must resolve this exception or authorize a response.",
    "readingLabel": "NIST AI RMF",
    "readingUrl": "https://www.nist.gov/itl/ai-risk-management-framework"
  },
  {
    "topic": "Data + readiness",
    "question": "A shared order form has already reduced handoff errors. A supplier proposes AI for the same process. Which pilot design best tests whether the added complexity is justified?",
    "choices": [
      "Compare their error rates with the manual process used before the form existed.",
      "Compare their processing speed on the cleanest completed orders in the archive.",
      "Compare both processes under comparable demand using service outcomes and total costs."
    ],
    "correct": 2,
    "explanation": "The relevant baseline is the working form, under comparable conditions. A superseded manual baseline can exaggerate added value, and a clean-order speed test misses current errors, exceptions and total costs.",
    "readingLabel": "Flexport Control Tower",
    "readingUrl": "https://www.flexport.com/technology/control-tower/"
  },
  {
    "topic": "Data + readiness",
    "question": "A manager wants to adopt a historical case’s reported cost saving as a target for a different network. Which evidence would make that transfer most defensible?",
    "choices": [
      "The case’s original publication date and the supplier’s latest product specification.",
      "The case’s comparator and conditions, followed by a matched local trial.",
      "The case’s fleet size and a projection scaled by the local parcel volume."
    ],
    "correct": 1,
    "explanation": "A transferable claim needs its original baseline, scope and conditions, then evidence that the local intervention performs against a suitable comparator. A date or volume adjustment alone does not establish comparability.",
    "readingLabel": "Fresh-food research citation",
    "readingUrl": "https://doi.org/10.1109/IEEM55944.2022.9989610"
  },
  {
    "topic": "Three cases",
    "question": "A fresh-food supplier has tomorrow’s demand forecast. Shortages are costly, surplus spoils, and sorting capacity is limited. What additional step turns the prediction into a purchasing decision?",
    "choices": [
      "Order each product’s predicted mean demand and evaluate forecast accuracy afterward.",
      "Rank products by forecast confidence and purchase the highest-ranked products first.",
      "Choose procurement quantities using demand uncertainty, shortage costs and operating limits."
    ],
    "correct": 2,
    "explanation": "The forecast estimates demand; procurement chooses quantities. The decision must trade off shortages and perishability while satisfying capacity. Mean demand or confidence rankings alone do not represent those costs and constraints.",
    "readingLabel": "Fresh-food research citation",
    "readingUrl": "https://doi.org/10.1109/IEEM55944.2022.9989610"
  },
  {
    "topic": "Three cases",
    "question": "A revised food forecast has lower average error, but the unchanged purchasing rule now produces more spoilage. Which investigation best explains whether the system has improved?",
    "choices": [
      "Trace forecast errors through the purchasing rule, costs and perishability constraints.",
      "Compare model accuracy by product and keep the current purchasing quantities fixed.",
      "Compare computing time and forecast availability before increasing the data sample."
    ],
    "correct": 0,
    "explanation": "A better average forecast can still produce worse decisions. Review how errors affect quantities, surplus and shortages under the objective; accuracy and computing measures alone do not establish operating value.",
    "readingLabel": "Fresh-food research citation",
    "readingUrl": "https://doi.org/10.1109/IEEM55944.2022.9989610"
  },
  {
    "topic": "Three cases",
    "question": "A shared platform identifies a late booking before departure. The shipment still misses its connection because each partner waits for another to respond. What is the most direct process correction?",
    "choices": [
      "Give a named owner feasible response options and agreed handoff authority.",
      "Send the warning earlier and show its predicted delay to every partner.",
      "Improve the dashboard’s ETA model and rank alerts by predicted delay."
    ],
    "correct": 0,
    "explanation": "The platform has already made the problem visible. The failure is the transition from information to action: ownership, feasible alternatives and handoff authority. Earlier or more precise warnings do not settle that responsibility.",
    "readingLabel": "Flexport Control Tower",
    "readingUrl": "https://www.flexport.com/technology/control-tower/"
  },
  {
    "topic": "Three cases",
    "question": "A digital twin predicts that a revised sorting plan will reduce queues. Before recommending a pilot, which test most directly checks whether that result is credible?",
    "choices": [
      "Repeat the same simulated demand with more runs until the average stabilizes.",
      "Compare the revised plan with the current plan using the model’s default settings.",
      "Reproduce held-out operating patterns and test the plan across realistic demand variations."
    ],
    "correct": 2,
    "explanation": "Credibility requires checking how well the model represents observed operations and whether the benefit survives relevant variations. Repetition reduces simulation noise; an internal comparison alone does not validate the model.",
    "readingLabel": "S.F. Holding 2024 report",
    "readingUrl": "https://disc.static.szse.cn/disc/disk03/finalpage/2025-03-29/6ae45a66-923f-472f-bd3a-204455cb9152.PDF"
  },
  {
    "topic": "Purpose + oversight",
    "question": "An optimizer minimizes delivery cost but misses a required medical delivery window. The deadline was recorded for reporting, not enforced in the model. Which revision addresses the modeling problem?",
    "choices": [
      "Add more historical routes while keeping the existing cost objective unchanged.",
      "Enforce the delivery window as a constraint, then optimize cost within it.",
      "Reduce the solver’s running time so dispatch can react to late deliveries sooner."
    ],
    "correct": 1,
    "explanation": "The model omitted the service requirement from the decision. It must enforce the required window as a feasibility constraint; more routes or faster solution time cannot repair a goal that the model was never required to meet.",
    "readingLabel": "NIST AI RMF",
    "readingUrl": "https://www.nist.gov/itl/ai-risk-management-framework"
  },
  {
    "topic": "Purpose + oversight",
    "question": "An AI dispatch system reduces wasted trips but uses additional computing resources. Which comparison best supports a claim of net environmental improvement?",
    "choices": [
      "Compare equivalent service under a defined boundary covering transport and relevant computing impacts.",
      "Compare vehicle energy per trip before and after, keeping the computing use in a separate report.",
      "Compare annual vehicle emissions with the new system’s predicted reduction in travel distance."
    ],
    "correct": 0,
    "explanation": "A net claim requires a consistent baseline, equivalent service and a stated boundary. Excluding relevant computing or comparing unlike measures leaves the overall impact unresolved; a predicted distance change is not itself an emissions measurement.",
    "readingLabel": "IEA Energy and AI",
    "readingUrl": "https://www.iea.org/reports/energy-and-ai"
  },
  {
    "topic": "Purpose + oversight",
    "question": "An automated route meets its planned schedule, but a new safety condition lies outside the system’s validated operating scope. Which response best follows selective delegation?",
    "choices": [
      "Continue the route while increasing monitoring of the system’s confidence score.",
      "Ask the model to generate a lower-cost alternative using its existing inputs.",
      "Use the agreed fallback and refer the decision to the responsible operator."
    ],
    "correct": 2,
    "explanation": "Selective delegation includes limits and an intervention path. Outside the validated scope, follow the agreed fallback and responsibility process; confidence monitoring or another plan from the same inputs does not validate the new condition.",
    "readingLabel": "NIST AI RMF",
    "readingUrl": "https://www.nist.gov/itl/ai-risk-management-framework"
  },
  {
    "topic": "Purpose + oversight",
    "question": "A network has used a new resource plan for a month. Which review best closes the decision loop?",
    "choices": [
      "Compare the new plan’s predicted costs with the previous plan’s recorded costs.",
      "Compare realized service, waste and costs with a matched baseline, then revise assumptions.",
      "Compare the number of recommendations accepted with the number generated each day."
    ],
    "correct": 1,
    "explanation": "Outcome review checks the goals that justified the plan using realized, comparable results. Predictions against past actuals mix evidence types, and recommendation acceptance measures use rather than whether service improved.",
    "readingLabel": "S.F. Holding 2024 report",
    "readingUrl": "https://disc.static.szse.cn/disc/disk03/finalpage/2025-03-29/6ae45a66-923f-472f-bd3a-204455cb9152.PDF"
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
    feedback.textContent = "The cases connect reliable data, clear objectives, feasible plans and a review of actual results. Review the cases and question findings to revisit those decisions.";
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
