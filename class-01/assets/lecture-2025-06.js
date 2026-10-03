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

const questions = [{"topic": "Driver support", "question": "An L2 feature steers and controls speed. Who supervises the road?", "choices": ["The passenger app", "The driver", "Only the cloud platform"], "correct": 1, "explanation": "L2 is driver support; sustained steering and speed assistance do not remove driver supervision.", "readingUrl": "#slide-responses", "readingLabel": "Feature roles"}, {"topic": "Conditional automation", "question": "An L3 feature approaches its operating boundary and requests intervention. Which role matters?", "choices": ["A fallback-ready user who responds when required", "A passenger who may always ignore the request", "A remote support desk that replaces the user’s required role"], "correct": 0, "explanation": "L3 relies on the fallback-ready user when intervention is required.", "readingUrl": "#slide-responses", "readingLabel": "Responsibility explorer"}, {"topic": "Domain + fallback", "question": "What distinguishes L4 within its domain?", "choices": ["It can drive under every imaginable condition", "It requires a driver to monitor every steering command", "The ADS performs driving and fallback without requiring driver takeover"], "correct": 2, "explanation": "A limited operating domain does not erase the L4 system’s fallback responsibility.", "readingUrl": "#slide-responses", "readingLabel": "Domain boundaries"}, {"topic": "Taxonomy", "question": "A service claims SAE L4 because it keeps an incident log. What is the right response?", "choices": ["An incident log is an automatic safety certificate", "Assess the actual feature roles, domain and safety evidence", "All incident logs imply L5"], "correct": 1, "explanation": "SAE levels classify features and responsibility; reporting alone does not establish a level or prove safety.", "readingUrl": "https://saemobilus.sae.org/standards/j3016_202104-taxonomy-definitions-terms-related-driving-automation-systems-road-motor-vehicles", "readingLabel": "SAE terminology"}, {"topic": "Cognition", "question": "Where does choosing a path and speed profile belong in the simplified loop?", "choices": ["Plan", "Sense", "Perceive"], "correct": 0, "explanation": "Planning uses perceptions and predicted interactions to select motion; control executes it.", "readingUrl": "#slide-model", "readingLabel": "Five-step loop"}, {"topic": "Development cycle", "question": "A fleet collects a rare event. What should precede a production model release?", "choices": ["Immediately replace every live controller", "Treat the raw event as proof that all roads are covered", "Check the data, train and validate a candidate, then control the release"], "correct": 2, "explanation": "The development loop includes validation and release controls; experience does not guarantee automatic improvement.", "readingUrl": "#slide-model", "readingLabel": "Data development"}, {"topic": "V2X", "question": "A bus sends a signal-priority request near a busy pedestrian crossing. What does the request establish?", "choices": ["Permission to ignore pedestrian conflicts", "An input to a constrained traffic-control decision", "That the bus is an L5 vehicle"], "correct": 1, "explanation": "Connectivity supports coordination; priority does not remove crossing constraints or establish an automation level.", "readingUrl": "#slide-evidence", "readingLabel": "Connected-city boundaries"}, {"topic": "Transit service", "question": "Two journey options differ in fare, time and transfers. What is a useful comparison?", "choices": ["Compare the traveler’s priorities, departure data and feasible transfers", "Assume every traveler needs the lowest fare only", "Infer the provider’s unpublished AI algorithm"], "correct": 0, "explanation": "A service decision includes traveler constraints and current operating information.", "readingUrl": "#slide-evidence", "readingLabel": "Transit application"}, {"topic": "Headway assumptions", "question": "In the traffic lab, p = 50%, human headway = 2.0 s and AV headway = 1.2 s. What is the idealized flow?", "choices": ["1800 vehicles/hour", "3000 vehicles/hour", "2250 vehicles/hour"], "correct": 2, "explanation": "Mean headway = 0.5×2.0 + 0.5×1.2 = 1.6 s; 3600/1.6 = 2250. This is not validated road capacity.", "readingUrl": "#slide-future", "readingLabel": "Headway model"}, {"topic": "Shuttle capacity", "question": "A 30-minute cycle targets a 3-minute departure interval. How many available vehicles does the ideal model require?", "choices": ["Eight", "Ten", "Six"], "correct": 1, "explanation": "ceil(30/3) = 10 available vehicles, before adding reserves or disruption allowances.", "readingUrl": "#slide-future", "readingLabel": "Shuttle service model"}, {"topic": "Proposal + evidence", "question": "A student concept promises 40% lower costs. How should it appear in the synthesis?", "choices": ["As a proposed benefit to test against a defined baseline", "As a measured citywide outcome", "As proof that no maintenance budget is needed"], "correct": 0, "explanation": "The supplied proposal does not establish operational measurements; costs require an appropriate trial and baseline.", "readingUrl": "#slide-evidence", "readingLabel": "Student proposals"}, {"topic": "Public trust", "question": "An LLM explains a braking event fluently. What still needs checking?", "choices": ["Whether the explanation sounds confident", "Whether it uses the terminology found in the vehicle manual", "Whether it matches event evidence and communicates uncertainty"], "correct": 2, "explanation": "Generated explanations can be inaccurate; readability alone is not causal or safety evidence.", "readingUrl": "#slide-world", "readingLabel": "Trust and evidence"}];
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
    feedback.textContent = "Driving roles, tested vehicle decisions and dependable service operations all matter. Return to the panels to review the responsibilities and assumptions.";
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
