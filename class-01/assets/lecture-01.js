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
  { question: "Fresh-food demand is forecast for tomorrow. What turns that forecast into a practical purchase plan?", choices: ["A feasible procurement optimization", "Another demand chart", "A warehouse robot"], correct: 0, explanation: "Prediction estimates demand. Optimization chooses quantities under cost, capacity and perishability constraints." },
  { question: "Shipment updates sit in separate emails and spreadsheets. Which stage should be strengthened first?", choices: ["ACT", "CONNECT", "LEARN"], correct: 1, explanation: "The information has to be made usable across participants before it can support coordinated decisions." },
  { question: "A digital twin tests a new sorting plan against actual results. Which stage gains the clearest feedback?", choices: ["LEARN", "Only SENSE", "Only ACT"], correct: 0, explanation: "Simulation and observed outcomes inform the next planning cycle." },
  { question: "An AI model predicts a delay, but the proposed reroute exceeds vehicle capacity. What is missing?", choices: ["A brighter dashboard", "Constraint-aware optimization", "More prediction alone"], correct: 1, explanation: "A useful action must satisfy operational constraints. The forecast does not select a feasible route by itself." },
  { question: "An automated decision meets an unusual safety exception. What matches the class model?", choices: ["Keep clear human review and accountability", "Ignore the exception", "Let the forecast decide responsibility"], correct: 0, explanation: "Human judgement, safety and accountability sit around the whole decision loop." }
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
  status.textContent = `[Q-${String(questionIndex + 1).padStart(2, "0")}] / [STATUS: UNANSWERED] / SCORE ${score}`;
  document.querySelector("#quiz-progress").style.width = `${questionIndex / questions.length * 100}%`;
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
  status.textContent = `[Q-${String(questionIndex + 1).padStart(2, "0")}] / [STATUS: ${correct ? "CORRECT" : "REVIEW"}] / SCORE ${score}`;
  feedback.className = `feedback ${correct ? "good" : "bad"}`;
  feedback.textContent = `${correct ? "Correct. " : "Review this. "}${current.explanation}`;
  nextButton.disabled = false;
});
nextButton.addEventListener("click", () => {
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    renderQuestion();
  } else {
    status.textContent = `[COMPLETE] / SCORE ${score} OF ${questions.length}`;
    document.querySelector("#quiz-progress").style.width = "100%";
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
