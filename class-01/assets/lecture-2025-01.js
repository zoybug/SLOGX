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
const caseData = [{"name": "Fresh food", "kicker": "CASE 01 / FORECAST → PROCUREMENT", "title": "Use the forecast to decide what to buy", "summary": "The fresh-food case links demand forecasting with a two-stage stochastic procurement model and sorting work. Purchasing choices must account for uncertain demand and spoilage.", "facts": {"Data": "Past orders, demand for stock-keeping units (SKUs), relationships between products, costs and sorting capacity.", "Decision": "What to procure and how to revise choices as more demand information becomes available.", "Constraints": "Perishability, uncertainty and resource capacity.", "Outcome to examine": "Cost, spoilage and service against a documented baseline."}, "url": "https://doi.org/10.1109/IEEM55944.2022.9989610", "label": "Read the IEEM 2022 research citation"}, {"name": "Flexport", "kicker": "CASE 02 / FRAGMENTATION → COORDINATION", "title": "Use shared information to coordinate shipments", "summary": "The Flexport case starts with trade information scattered across emails and spreadsheets. A shared platform connects shipment partners; emissions estimates add another factor to planning.", "facts": {"Data": "Orders, bookings, shipment milestones, documents and emissions estimates.", "Decision": "Coordinate handoffs and compare utilization, route and service choices.", "Constraints": "Partner data quality, timing, service commitments and trade-offs across objectives.", "Outcome to examine": "On-time handoffs, utilization, cost and clearly bounded emissions measures."}, "url": "https://www.flexport.com/technology/control-tower/", "label": "Explore the current Control Tower description"}, {"name": "S.F. Holding", "kicker": "CASE 03 / NETWORK STATE → RESOURCE PLAN", "title": "Test a network plan before using it", "summary": "S.F. Holding’s case connects capacity planning, resource allocation, routing and responses to exceptions. A digital twin uses a model of the network to test candidate plans before implementation.", "facts": {"Data": "Network events, parcel flows, resources and static/live process information.", "Decision": "Reserve and allocate capacity, plan routes and adjust exceptions.", "Constraints": "Model fidelity, capacity, operational uncertainty and ownership of interventions.", "Outcome to examine": "Service stability, resource use and agreement between modeled and actual outcomes."}, "url": "https://disc.static.szse.cn/disc/disk03/finalpage/2025-03-29/6ae45a66-923f-472f-bd3a-204455cb9152.PDF", "label": "Read the 2024 company report alongside the lecture"}];
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
const questions = [{"topic": "Data + readiness", "question": "Partners record the same shipment under different IDs. What is the first useful step?", "choices": ["Deploy an autonomous dispatch model", "Agree on identifiers and connect the relevant records", "Treat each dashboard as the same data"], "correct": 1, "explanation": "Coordination needs usable shared information. Resolve identifiers and handoffs before relying on an integrated plan.", "readingLabel": "Flexport Control Tower", "readingUrl": "https://www.flexport.com/technology/control-tower/"}, {"topic": "Data + readiness", "question": "A firm has a capable model but no trained owner for exceptions. Which readiness gap matters?", "choices": ["Only the model size", "Adding more data without assigning an owner", "Skills, responsibility and workflow ownership"], "correct": 2, "explanation": "Technical capability alone does not establish organizational readiness. Assign owners and define escalation before delegating consequential decisions.", "readingLabel": "NIST AI RMF", "readingUrl": "https://www.nist.gov/itl/ai-risk-management-framework"}, {"topic": "Data + readiness", "question": "A simple shared order form fixes a warehouse handoff problem. What should an AI proposal be compared with?", "choices": ["The working simple baseline and its cost/service outcomes", "A promised improvement with no baseline", "Only the number of model parameters"], "correct": 0, "explanation": "Start with the problem the operation needs to solve. Compare the AI proposal’s costs and service results with the simpler process that already works.", "readingLabel": "Flexport Control Tower", "readingUrl": "https://www.flexport.com/technology/control-tower/"}, {"topic": "Data + readiness", "question": "An old slide reports a case cost saving. What is needed before applying it to another operation?", "choices": ["Assume the same gain everywhere", "Check the date, comparator, scope and operating conditions", "Use it as a guaranteed business target"], "correct": 1, "explanation": "Historical case evidence is bounded. A number without its baseline and setting cannot establish a general logistics benefit.", "readingLabel": "Fresh-food research citation", "readingUrl": "https://doi.org/10.1109/IEEM55944.2022.9989610"}, {"topic": "Three cases", "question": "Tomorrow’s fresh-food demand forecast is ready. What turns it into an order?", "choices": ["Another chart of predicted demand", "A point forecast used as the order quantity without further checks", "A procurement choice considering cost, uncertainty and constraints"], "correct": 2, "explanation": "The lecture connects forecasts to a two-stage procurement model. Prediction estimates demand; a plan chooses actions under constraints.", "readingLabel": "Fresh-food research citation", "readingUrl": "https://doi.org/10.1109/IEEM55944.2022.9989610"}, {"topic": "Three cases", "question": "A more accurate food forecast leads to excessive purchases and spoilage. What should be reviewed?", "choices": ["The procurement objective and constraints as well as the forecast", "Only the forecast’s average accuracy", "Whether the forecast is called AI"], "correct": 0, "explanation": "Prediction quality is one part of the system. Purchasing rules, perishability and service objectives determine how predictions become value.", "readingLabel": "Fresh-food research citation", "readingUrl": "https://doi.org/10.1109/IEEM55944.2022.9989610"}, {"topic": "Three cases", "question": "A platform shows a late booking but nobody owns the next handoff. What is still missing?", "choices": ["Another alert without an assigned owner", "A responsible action and coordination process", "More visibility alone"], "correct": 1, "explanation": "Visibility can reveal a problem. A defined owner and a feasible next action are needed to change the shipment outcome.", "readingLabel": "Flexport Control Tower", "readingUrl": "https://www.flexport.com/technology/control-tower/"}, {"topic": "Three cases", "question": "A digital twin suggests a different sorting plan. What should happen before deployment?", "choices": ["Treat the simulation as proof of safety", "Call the twin an autonomous vehicle", "Validate the model and test the plan against operating conditions"], "correct": 2, "explanation": "The S.F. Holding case tests modeled plans before recommending production changes. Check how well the model represents the operation and how its results were validated.", "readingLabel": "S.F. Holding 2024 report", "readingUrl": "https://disc.static.szse.cn/disc/disk03/finalpage/2025-03-29/6ae45a66-923f-472f-bd3a-204455cb9152.PDF"}, {"topic": "Purpose + oversight", "question": "The cheapest plan misses essential delivery commitments. What is the deeper issue?", "choices": ["The objective does not represent the service goal", "Optimization cannot use constraints", "The plan is effective because it is cheap"], "correct": 0, "explanation": "The cohort distinguishes efficiency from effectiveness. Include service requirements and discuss trade-off weights before optimizing.", "readingLabel": "NIST AI RMF", "readingUrl": "https://www.nist.gov/itl/ai-risk-management-framework"}, {"topic": "Purpose + oversight", "question": "Automation cuts wasted trips but adds computing demand. How should sustainability be assessed?", "choices": ["Count only the avoided trips", "Define the system boundary and compare relevant resource impacts", "Assume all AI lowers emissions"], "correct": 1, "explanation": "The cohort asks for a wider boundary. Compare the intervention with a baseline and include relevant computation and operating resources; no net benefit is automatic.", "readingLabel": "IEA Energy and AI", "readingUrl": "https://www.iea.org/reports/energy-and-ai"}, {"topic": "Purpose + oversight", "question": "An automated route encounters a safety condition outside its validated scope. What is appropriate?", "choices": ["Keep executing because the forecast is confident", "Remove responsibility from the operator", "Escalate through a defined review and fallback process"], "correct": 2, "explanation": "Selective delegation requires known limits, owners and intervention paths. Confidence in a model does not settle responsibility for an exceptional condition.", "readingLabel": "NIST AI RMF", "readingUrl": "https://www.nist.gov/itl/ai-risk-management-framework"}, {"topic": "Purpose + oversight", "question": "A new plan is running. What closes the decision loop?", "choices": ["Compare actual service, waste and cost with the baseline and revise the next plan", "Count only the plans generated", "Stop collecting outcomes"], "correct": 0, "explanation": "Learning requires outcome review. Check whether the chosen action improved the goals that justified it, then use that evidence in the next cycle.", "readingLabel": "S.F. Holding 2024 report", "readingUrl": "https://disc.static.szse.cn/disc/disk03/finalpage/2025-03-29/6ae45a66-923f-472f-bd3a-204455cb9152.PDF"}];
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
    feedback.textContent = "The cases connect reliable data, clear objectives, feasible plans and a review of actual results. Return to any panel to revisit those steps.";
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
