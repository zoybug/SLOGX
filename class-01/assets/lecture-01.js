const stages = [
  { name: "SENSE", short: "Capture reality", description: "IoT, tracking and live observations show what is happening across vehicles, warehouses, ports and networks.", connection: "IoT / live visibility" },
  { name: "CONNECT", short: "Make data usable", description: "Information must cross teams, systems and firms. If partners cannot exchange usable data, even strong models struggle to coordinate the network.", connection: "Interoperability" },
  { name: "PREDICT", short: "Estimate what may happen", description: "AI and analytics estimate demand, delay, arrival time and risk. A forecast informs a decision; it is not the decision itself.", connection: "AI / analytics" },
  { name: "OPTIMIZE", short: "Choose feasible action", description: "Operations research weighs capacity, cost, service and uncertainty to choose routes, schedules, procurement and resource plans.", connection: "OR / routing" },
  { name: "ACT", short: "Execute the plan", description: "People, digital workflows and physical equipment carry out decisions. Automation matters when it reaches a real operation.", connection: "Robotics / workflows" },
  { name: "LEARN", short: "Improve the next cycle", description: "Actual outcomes feed back into planning. Digital twins, monitoring and re-optimization help test and revise the next decision.", connection: "Feedback / digital twins" }
];

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

const themes = [["AI", 24], ["Optimization", 22], ["IoT", 20], ["Automation", 19], ["Digital Twin", 17], ["Big Data", 15], ["Real-time Data", 7], ["Connectivity", 7], ["LLM", 5], ["Prediction", 5]];
document.querySelector("#theme-bars").innerHTML = themes.map(([name, count]) => `
  <div class="bar-row"><span>${name}</span><span class="bar-track" role="img" aria-label="${name}: ${count} of 30"><i style="width:${count / 30 * 100}%"></i></span><b>${count}/30</b></div>`).join("");

const cases = [
  { geography: "Vietnam", name: "Viettel Post sorting", topic: "Warehouse automation", group: "Operations" },
  { geography: "China", name: "JD Logistics delivery", topic: "Autonomous delivery", group: "Operations" },
  { geography: "Indonesia", name: "Cikarang 5G warehouse", topic: "Connectivity and AGVs", group: "Infrastructure" },
  { geography: "Morocco", name: "Tanger Med assistants", topic: "Port and AI services", group: "Ports" },
  { geography: "Chile", name: "San Antonio port", topic: "Terminal and rail links", group: "Ports" },
  { geography: "Brazil", name: "APM Suape terminal", topic: "Port electrification", group: "Ports" },
  { geography: "Russia", name: "Yandex delivery robots", topic: "Last-mile robotics", group: "Operations" },
  { geography: "Austria", name: "Post Vienna-Inzersdorf", topic: "Sorting operations", group: "Operations" },
  { geography: "Bangladesh", name: "National Logistics Policy", topic: "Policy and infrastructure", group: "Infrastructure" }
];
const filterNames = ["All", "Operations", "Ports", "Infrastructure"];
let activeFilter = "All";
function renderCases() {
  document.querySelector("#case-filters").innerHTML = filterNames.map(name => `
    <button class="filter-button ${activeFilter === name ? "active" : ""}" type="button" data-filter="${name}" aria-pressed="${activeFilter === name}">${name}</button>`).join("");
  document.querySelector("#case-rows").innerHTML = cases.filter(item => activeFilter === "All" || item.group === activeFilter).map(item => `
    <tr><td>${item.geography}</td><td>${item.name}</td><td>${item.topic}</td></tr>`).join("");
}
document.querySelector("#case-filters").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  renderCases();
});
renderCases();

const insights = [
  "Start with data, not tools.",
  "AI predicts; Operations Research decides.",
  "Automate the plan, but keep a human on the button.",
  "Prediction creates value only when joined to optimization and operational execution.",
  "The real transition is from rigid logistics to adaptive logistics.",
  "Even advanced AI cannot coordinate logistics if partners use incompatible data."
];
document.querySelector("#insight-grid").innerHTML = insights.map((idea, index) => `
  <div class="insight"><span class="mark">[I-${String(index + 1).padStart(2, "0")}]</span><p>${idea}</p></div>`).join("");

const questions = [
  { topic: "01 / Foundations", question: "Which event in the 1997 computing timeline marks a visible AI milestone?", choices: ["Deep Blue defeating Garry Kasparov", "The invention of container shipping", "The first cold-chain truck"], correct: 0, explanation: "The Computer History Museum records Deep Blue's 1997 win as an AI milestone. Logistics applications came through other advances in data, networks and operations.", readingLabel: "Computer History Museum timeline", readingUrl: "https://www.computerhistory.org/timeline/1997/" },
  { topic: "01 / Foundations", question: "A sensor reports the temperature inside a fresh-food truck. What does that first add to the decision loop?", choices: ["A finished delivery plan", "A live observation of physical conditions", "A guarantee that no food will spoil"], correct: 1, explanation: "Connected devices help sense what is happening. Teams still need to share the data and decide what action follows.", readingLabel: "IoT history review", readingUrl: "https://ieeexplore.ieee.org/abstract/document/7043637/" },
  { topic: "01 / Foundations", question: "Why does a shared web-based update help a multi-company shipment?", choices: ["It removes all operational constraints", "It lets participants work from the same changing information", "It makes every forecast correct"], correct: 1, explanation: "The value of networked information is coordination across separate organizations, systems and handoffs.", readingLabel: "CERN on the birth of the Web", readingUrl: "https://home.cern/science/computing/the-birth-of-the-web/" },
  { topic: "01 / Foundations", question: "A language model reads shipping documents. Which task is still needed before its output can govern a shipment?", choices: ["Check the extracted information against operational rules", "Assume every answer is a feasible plan", "Remove human responsibility"], correct: 0, explanation: "Text processing can help turn documents into data, but the result needs validation against the real shipment and its rules.", readingLabel: "Transformers and language processing", readingUrl: "https://aclanthology.org/2020.emnlp-demos.6/" },
  { topic: "01 / Foundations", question: "Which sequence best captures the lecture's shift toward smart logistics?", choices: ["More dashboards → fewer decisions", "Connected signals → shared information → feasible action", "Automation → no need for data"], correct: 1, explanation: "Digital transformation matters when observations move through a connected decision process and reach execution.", readingLabel: "AWS Supply Chain features", readingUrl: "https://aws.amazon.com/aws-supply-chain/features/" },

  { topic: "02 / Readiness + food", question: "A logistics firm has shipment data spread across incompatible systems. What should come before a new AI model?", choices: ["Unify definitions and connect the relevant data", "Buy more display screens", "Remove all dispatchers"], correct: 0, explanation: "Fragmented data limits any model. Readiness starts with information that can be interpreted and used across processes.", readingLabel: "AWS Supply Chain data integration", readingUrl: "https://aws.amazon.com/aws-supply-chain/features/" },
  { topic: "02 / Readiness + food", question: "Which set is closest to organizational AI readiness?", choices: ["Models alone", "People, processes, platforms and governance", "Only faster computers"], correct: 1, explanation: "AI adoption depends on the organization around the technology, including skills, workflow ownership and safeguards.", readingLabel: "Avanade AI readiness", readingUrl: "https://www.avanade.com/en/insights/generative-ai-readiness-report/organizational-ai-readiness" },
  { topic: "02 / Readiness + food", question: "An automated recommendation meets an unusual safety exception. What is the sound response?", choices: ["Keep human review and clear accountability", "Ignore the exception", "Let the forecast decide responsibility"], correct: 0, explanation: "Human judgement remains essential when conditions carry safety, ethical or other consequences the system cannot settle alone.", readingLabel: "HBR on unsupervised AI decisions", readingUrl: "https://hbr.org/2022/09/ai-isnt-ready-to-make-unsupervised-decisions" },
  { topic: "02 / Readiness + food", question: "Which constraint makes fresh-food distribution different from moving durable goods?", choices: ["Perishability and cold-chain capacity", "The absence of delivery locations", "No need for demand estimates"], correct: 0, explanation: "Fresh produce can lose value quickly, so time, temperature and refrigeration capacity shape distribution choices.", readingLabel: "Fresh produce distribution in China", readingUrl: "https://www.macquarie.com/au/en/insights/digitalising-the-distribution-of-fresh-produce-in-china.html" },
  { topic: "02 / Readiness + food", question: "Fresh-food demand is forecast for tomorrow. What turns that forecast into a purchase plan?", choices: ["A feasible procurement optimization", "Another demand chart", "A warehouse robot"], correct: 0, explanation: "Prediction estimates demand. Planning chooses quantities under cost, capacity and perishability constraints.", readingLabel: "AWS Supply Chain planning", readingUrl: "https://aws.amazon.com/aws-supply-chain/features/" },

  { topic: "03 / Platform cases", question: "What does Flexport seek to connect in one operating platform?", choices: ["Freight, customs and fulfillment", "Only social media feeds", "Only one warehouse's payroll"], correct: 0, explanation: "Flexport describes a platform spanning the freight journey, customs work and fulfillment rather than a single isolated task.", readingLabel: "Flexport company overview", readingUrl: "https://www.flexport.com/company/about-us/" },
  { topic: "03 / Platform cases", question: "A team wants to see orders, bookings and in-transit units together. Which Flexport capability is closest?", choices: ["Control Tower and order management", "A temperature sensor alone", "A battery specification"], correct: 0, explanation: "Flexport's Control Tower connects booking and order information with shipment visibility, including product-level views.", readingLabel: "Flexport Control Tower", readingUrl: "https://www.flexport.com/technology/control-tower/" },
  { topic: "03 / Platform cases", question: "A container is half empty and a slower mode is acceptable. What type of decision can the platform support?", choices: ["Compare consolidation and routing options", "Ignore cost and service trade-offs", "Forecast without acting"], correct: 0, explanation: "Flexport describes recommendations for container utilization and routing, including trade-offs between air and ocean freight.", readingLabel: "Flexport Control Tower", readingUrl: "https://www.flexport.com/technology/control-tower/" },
  { topic: "03 / Platform cases", question: "S.F. Holding's Smart Brain is described as supporting which span of work?", choices: ["Collection, transit and delivery", "Only advertising design", "Only a single parcel label"], correct: 0, explanation: "The company describes digital coordination across the whole collection-to-delivery chain.", readingLabel: "S.F. Holding annual report", readingUrl: "https://ir.sf-express.com/media/v0bnjot2/2024-annual-report-e.pdf" },
  { topic: "03 / Platform cases", question: "If a network monitor warns of a bottleneck, what is the next useful step?", choices: ["Plan routing or resource changes under real constraints", "Treat the warning as the completed action", "Discard all historical data"], correct: 0, explanation: "S.F. Holding links monitoring and early warning to route planning, scheduling and dynamic resource allocation.", readingLabel: "S.F. Holding annual report", readingUrl: "https://ir.sf-express.com/media/v0bnjot2/2024-annual-report-e.pdf" },

  { topic: "04 / Decision systems", question: "Shipment updates sit in separate emails and spreadsheets. Which stage needs work first?", choices: ["ACT", "CONNECT", "LEARN"], correct: 1, explanation: "The information must become usable across participants before it can support coordinated decisions.", readingLabel: "AWS Supply Chain data integration", readingUrl: "https://aws.amazon.com/aws-supply-chain/features/" },
  { topic: "04 / Decision systems", question: "A demand forecast is available. What does supply planning add?", choices: ["Recommendations about what and when to purchase or position", "A guarantee of zero disruption", "A replacement for all supplier communication"], correct: 0, explanation: "Demand planning estimates needs; supply planning combines those estimates with inventory, lead times and costs to recommend actions.", readingLabel: "AWS Supply Chain features", readingUrl: "https://aws.amazon.com/aws-supply-chain/features/" },
  { topic: "04 / Decision systems", question: "An AI model predicts a delay, but its reroute exceeds vehicle capacity. What is missing?", choices: ["A brighter dashboard", "Constraint-aware optimization", "More prediction alone"], correct: 1, explanation: "A proposed action must satisfy operational constraints. A forecast does not choose a feasible route by itself.", readingLabel: "Flexport supply chain optimization", readingUrl: "https://www.flexport.com/technology/control-tower/" },
  { topic: "04 / Decision systems", question: "A digital twin tests a sorting plan against actual outcomes. Which stage gains feedback?", choices: ["LEARN", "Only SENSE", "Only ACT"], correct: 0, explanation: "Testing a plan and observing results informs the next planning cycle.", readingLabel: "AWS on learning from decisions", readingUrl: "https://aws.amazon.com/aws-supply-chain/features/" },
  { topic: "04 / Decision systems", question: "Which future direction best matches the class outlook?", choices: ["Predictive and adaptive planning with human oversight", "Automation without shared data", "Predictions that never reach operations"], correct: 0, explanation: "The class emphasized wider intelligence and automation while keeping data exchange, skills and responsibility in view.", readingLabel: "Avanade AI readiness", readingUrl: "https://www.avanade.com/en/insights/generative-ai-readiness-report/organizational-ai-readiness" }
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
    document.querySelector("#quiz-question").textContent = score === questions.length ? "A sound decision chain." : "Run the loop again.";
    document.querySelector("#quiz-choices").innerHTML = "";
    feedback.className = "feedback";
    feedback.textContent = "Information becomes smart logistics when it informs feasible action and feeds back into learning.";
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
