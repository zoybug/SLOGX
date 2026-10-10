/* Anonymous class content; constructed teaching models. */
const stages = [{"name": "Sense", "short": "Acquire signals", "description": "Collect synchronized observations from the selected vehicle sensors and, where available, connected sources.", "connection": "Check freshness, calibration, time alignment and sensor health."}, {"name": "Perceive", "short": "Scene + location", "description": "Estimate vehicle location and detect, classify and track road users, signals and road geometry.", "connection": "Check uncertainty, missed objects and conflicting observations."}, {"name": "Abstract", "short": "Predict behavior", "description": "Represent the scene and possible movements of other road users. Predictions are alternatives with uncertainty, not known intentions.", "connection": "Retain plausible pedestrian, cyclist and vehicle actions."}, {"name": "Plan", "short": "Select a maneuver", "description": "Choose a feasible path and speed profile using the scene, predicted interactions, rules, domain and vehicle constraints.", "connection": "Check conflicts, comfort, contingency and changing conditions."}, {"name": "Control", "short": "Execute + monitor", "description": "Translate the selected motion into steering, braking and propulsion commands; monitor tracking, faults and new observations.", "connection": "Feed the observed outcome back into the next sensing and planning cycle."}];
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



const roleLevel=document.querySelector('#role-level'),roleBoundary=document.querySelector('#role-boundary');
function renderRole(){
 const level=roleLevel.value,exit=roleBoundary.value==='exit';
 const text={
  '2':exit?['Driver retains control responsibility','The driver continues supervising and performs the driving task as assistance becomes unavailable. An L2 support feature does not provide L4-style fallback.']:['Driver supervises the feature','The feature assists steering and speed. The driver monitors the road and intervenes as needed.'],
  '3':exit?['Fallback-ready user must respond','The ADS requests intervention as the boundary approaches. The fallback-ready user is expected to resume the required driving or fallback role.']:['ADS drives; user remains receptive','Within the stated domain, the ADS performs the driving task. The fallback-ready user remains able to respond when intervention is required.'],
  '4':exit?['ADS performs fallback','The ADS handles the driving-task fallback, which may bring the vehicle to a minimal risk condition. It does not depend on a passenger taking over.']:['ADS drives within its domain','Within the stated domain, the ADS performs the driving task and handles fallback when necessary; a driver takeover is not required.']
 }[level];
 document.querySelector('#role-label').textContent=`L${level} / ${exit?'APPROACHING DOMAIN EXIT':'WITHIN STATED DOMAIN'}`;
 document.querySelector('#role-title').textContent=text[0];document.querySelector('#role-text').textContent=text[1];
}
roleLevel.addEventListener('change',renderRole);roleBoundary.addEventListener('change',renderRole);renderRole();
const trafficShare=document.querySelector('#traffic-share'),trafficHeadway=document.querySelector('#traffic-headway');
function trafficModel(p,hAV){const mean=(1-p)*2+p*hAV;return {mean,flow:3600/mean,change:(2/mean-1)*100};}
function renderTraffic(){
 const p=Number(trafficShare.value)/100,hAV=Number(trafficHeadway.value),m=trafficModel(p,hAV);
 document.querySelector('#traffic-share-value').textContent=`${trafficShare.value}%`;
 document.querySelector('#traffic-headway-value').textContent=`${hAV.toFixed(1)} s`;
 document.querySelector('#traffic-mean').textContent=`${m.mean.toFixed(2)} s`;
 document.querySelector('#traffic-flow').textContent=`${Math.round(m.flow).toLocaleString('en-US')} veh/h`;
 document.querySelector('#traffic-change').textContent=`${m.change>0?'+':''}${m.change.toFixed(1)}%`;
 document.querySelector('#traffic-explanation').textContent=p===0?'With no automated vehicles, the assumed 2.0-second crossing headway gives 1,800 vehicles/hour.':hAV<2?'The calculation increases flow because the automated crossing headway is assumed shorter. The benefit comes from that assumption, not the automation label.':hAV===2?'Both groups have the same assumed headway, so changing the share does not change the calculated flow.':'The automated crossing headway is assumed longer, so increasing its share reduces the calculated flow.';
}
[trafficShare,trafficHeadway].forEach(x=>x.addEventListener('input',renderTraffic));
document.querySelector('#traffic-reset').addEventListener('click',()=>{trafficShare.value=50;trafficHeadway.value=1.2;renderTraffic();});renderTraffic();
const shuttleCycle=document.querySelector('#shuttle-cycle'),shuttleFleet=document.querySelector('#shuttle-fleet'),shuttleTarget=document.querySelector('#shuttle-target');
function shuttleModel(cycle,fleet,target){return {interval:cycle/fleet,required:Math.ceil(cycle/target),meets:cycle/fleet<=target};}
function renderShuttle(){
 const cycle=Number(shuttleCycle.value),fleet=Number(shuttleFleet.value),target=Number(shuttleTarget.value),m=shuttleModel(cycle,fleet,target);
 document.querySelector('#shuttle-cycle-value').textContent=`${cycle} min`;
 document.querySelector('#shuttle-fleet-value').textContent=`${fleet} vehicles`;
 document.querySelector('#shuttle-target-value').textContent=`${target.toFixed(1)} min`;
 document.querySelector('#shuttle-interval').textContent=`${m.interval.toFixed(2)} min`;
 document.querySelector('#shuttle-required').textContent=`${m.required} vehicles`;
 document.querySelector('#shuttle-status').textContent=m.meets?'Yes, ideally':'No';
 document.querySelector('#shuttle-explanation').textContent=m.meets?`The available fleet meets the ${target.toFixed(1)}-minute interval arithmetic. Check reserves, disruptions and passenger capacity separately.`:`At this cycle time, the ideal model needs ${m.required-fleet} more available vehicle${m.required-fleet===1?'':'s'} to meet the target. A shorter cycle or a wider target interval changes the requirement.`;
}
[shuttleCycle,shuttleFleet,shuttleTarget].forEach(x=>x.addEventListener('input',renderShuttle));
document.querySelector('#shuttle-reset').addEventListener('click',()=>{shuttleCycle.value=30;shuttleFleet.value=8;shuttleTarget.value=3;renderShuttle();});renderShuttle();

const questions = [
  {
    "topic": "Driver support",
    "question": "An L2 feature is steering and maintaining speed on a motorway. No takeover alert is active. Who must monitor the road and respond to hazards?",
    "choices": [
      "The driver after the feature issues a request to resume the driving task.",
      "The system within its domain, with the driver receptive to a later request.",
      "The driver continuously, including while both assistance functions are active."
    ],
    "correct": 2,
    "explanation": "L2 combines steering and speed support while the driver supervises the road. Waiting for a request confuses that role with L3 conditional automation.",
    "readingUrl": "#slide-responses",
    "readingLabel": "Driving roles"
  },
  {
    "topic": "Conditional automation",
    "question": "An L3 ADS approaches its stated operating boundary and requests intervention. Which role should the operating plan have prepared for?",
    "choices": [
      "A passenger whose role is limited to reporting the event after the system stops.",
      "A fallback-ready user able to respond and assume the required driving or fallback role.",
      "A remote fleet observer whose presence removes the fallback-ready user’s role."
    ],
    "correct": 1,
    "explanation": "L3 expects a fallback-ready user to respond when required. Remote support can assist operations but does not by itself change the feature’s required role.",
    "readingUrl": "#slide-responses",
    "readingLabel": "Conditional automation"
  },
  {
    "topic": "Domain and fallback",
    "question": "A shuttle is described as L4 on a defined route in specified weather. As a domain boundary approaches, which plan is consistent with L4?",
    "choices": [
      "Have the ADS perform fallback without depending on passenger takeover.",
      "Request passenger takeover as the required means of completing driving-task fallback.",
      "Continue beyond the stated domain because the route’s map remains available onboard."
    ],
    "correct": 0,
    "explanation": "L4 includes the ADS’s driving-task fallback within its domain. A limited domain does not transfer that responsibility to a passenger or permit unrestricted operation.",
    "readingUrl": "#slide-responses",
    "readingLabel": "Domain boundaries"
  },
  {
    "topic": "Taxonomy",
    "question": "Two shuttle vendors provide incident logs and use the same L4 label. Which comparison best establishes what those descriptions mean?",
    "choices": [
      "Compare total logged incidents without adjusting for routes or operating exposure.",
      "Check actual driving/fallback roles and domains, then assess the relevant safety evidence.",
      "Rank the labels by sensor count, using the larger suite as the higher automation level."
    ],
    "correct": 1,
    "explanation": "J3016 classifies feature roles. Logs, sensor counts and matching labels are not safety certification or an exposure-adjusted comparison of performance.",
    "readingUrl": "https://saemobilus.sae.org/standards/j3016_202104-taxonomy-definitions-terms-related-driving-automation-systems-road-motor-vehicles",
    "readingLabel": "SAE taxonomy"
  },
  {
    "topic": "Cognition",
    "question": "A system has identified a cyclist and predicted several possible movements. It now chooses a path and speed profile around that uncertainty. Which function is this?",
    "choices": [
      "Perceive: infer scene objects and their state from the available sensor observations.",
      "Control: track the selected maneuver through steering, braking and propulsion.",
      "Plan: select a feasible maneuver using the scene, predictions and constraints."
    ],
    "correct": 2,
    "explanation": "Selecting motion is planning. Perception supplies the scene and control executes the chosen motion; all are revisited as new information arrives.",
    "readingUrl": "#slide-model",
    "readingLabel": "Vehicle decision loop"
  },
  {
    "topic": "Development cycle",
    "question": "A fleet records a rare pedestrian interaction missing from the training set. Which sequence best supports a defensible software update?",
    "choices": [
      "Check the data, train and validate a candidate, then release it under controls.",
      "Retrain on the event and release directly, relying on live monitoring for validation.",
      "Add the event to simulation and infer that the new case is covered in all weather."
    ],
    "correct": 0,
    "explanation": "A collected event is input to development, not proof of improvement. Candidate validation and controlled release are needed before changing production behavior.",
    "readingUrl": "#slide-model",
    "readingLabel": "Model development"
  },
  {
    "topic": "V2X",
    "question": "A connected bus requests a green extension as pedestrians approach the crossing. How should the controller interpret the request?",
    "choices": [
      "As a scheduled entitlement to priority, subject only to the bus’s current delay.",
      "As confirmation that the bus’s onboard sensors have already cleared the crossing.",
      "As one input to a decision that still checks crossing and traffic constraints."
    ],
    "correct": 2,
    "explanation": "A priority request communicates a service need; it does not establish a conflict-free crossing or remove signal-control constraints. Message freshness and failure handling also matter.",
    "readingUrl": "#slide-evidence",
    "readingLabel": "Connected-service evidence"
  },
  {
    "topic": "Transit service",
    "question": "A route search offers a cheaper trip with two transfers and a faster direct trip. The traveler has limited walking tolerance. Which comparison best fits the application study?",
    "choices": [
      "Compare fare, timing, transfers and walking constraints with current operating information.",
      "Choose the cheapest listed route, treating transfer walking as included in the fare.",
      "Choose the shortest listed time, treating available accessibility as identical across routes."
    ],
    "correct": 0,
    "explanation": "Journey usefulness depends on the traveler’s constraints as well as time and fare. Route-search output does not justify assumptions about accessibility or the provider’s unpublished algorithm.",
    "readingUrl": "#slide-evidence",
    "readingLabel": "Application reports"
  },
  {
    "topic": "Headway assumptions",
    "question": "The traffic example assigns 2.0 s headway to human-driven vehicles and 1.2 s to automated vehicles, with automated share 50%. Which calculation matches the model?",
    "choices": [
      "1,800 veh/h, using the human headway for the complete mixed stream.",
      "2,250 veh/h, dividing 3,600 by the mixed mean headway of 1.6 s.",
      "2,400 veh/h, averaging the two separate flows of 1,800 and 3,000."
    ],
    "correct": 1,
    "explanation": "The model first averages headways: 0.5×2.0 + 0.5×1.2 = 1.6 s. Then q = 3600/1.6 = 2250 veh/h. Averaging flows gives a different result and is not its formula.",
    "readingUrl": "#slide-future",
    "readingLabel": "Headway example"
  },
  {
    "topic": "Shuttle capacity",
    "question": "A shuttle has a 30-minute cycle and a three-minute target departure interval. Eight vehicles are available for service. Which conclusion follows before reserve allowances?",
    "choices": [
      "Eight suffice because 30/8 rounds down to the three-minute target interval.",
      "Ten are needed ideally; eight give a 3.75-minute interval, before disruptions.",
      "Twelve are needed ideally, because every departure requires a separate reserve."
    ],
    "correct": 1,
    "explanation": "Required fleet = ceil(30/3) = 10. Eight vehicles give 30/8 = 3.75 minutes. Reserves and variability are additional planning questions, not included in that minimum.",
    "readingUrl": "#slide-capacity",
    "readingLabel": "Shuttle service example"
  },
  {
    "topic": "Proposal and evidence",
    "question": "A student microhub concept predicts 40% lower cost per parcel. Which evaluation would most directly test that claim?",
    "choices": [
      "Compare full costs per delivered parcel with a matched baseline, including added handling.",
      "Count fewer vans entering the district and treat that change as the cost reduction.",
      "Compare planned vehicle purchase prices and omit sorting, labor and failed deliveries."
    ],
    "correct": 0,
    "explanation": "The prediction needs a baseline and full operational accounting. A van-count reduction or vehicle-price comparison alone does not measure delivered-parcel costs.",
    "readingUrl": "#slide-evidence",
    "readingLabel": "Application evidence"
  },
  {
    "topic": "Public trust",
    "question": "An LLM gives a clear explanation for a shuttle’s abrupt braking. Which review most directly tests whether the explanation is faithful to the event?",
    "choices": [
      "Compare the wording with the vehicle manual and check that the tone is reassuring.",
      "Ask passengers to rate readability and compare the ratings across language versions.",
      "Compare it with sensor and control records, checking uncertainty and contradictions."
    ],
    "correct": 2,
    "explanation": "Readability and familiar terminology matter for communication, but they do not establish why the event occurred. A faithful explanation must agree with the event evidence and its limits.",
    "readingUrl": "#slide-world",
    "readingLabel": "Trust and service evaluation"
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
    feedback.textContent = "Driving roles, tested vehicle decisions and dependable service operations all matter. Review the driving roles and the assumptions behind each service estimate.";
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
