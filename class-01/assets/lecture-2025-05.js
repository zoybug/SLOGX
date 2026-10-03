/* Anonymous Fall 2025 content and constructed educational models. */
const stages = [{"name": "Acquire", "short": "Measurements", "description": "GNSS contributes position-related observations. IMUs measure acceleration and angular rate; odometers and other vehicle signals add motion information.", "connection": "Check timestamps, units, reference frames and available inputs."}, {"name": "Model", "short": "Errors + maps", "description": "Characterize bias, scale factors, mounting alignment and noise. Prepare a road network with relevant geometry and connectivity.", "connection": "Calibration and map quality are inputs to reliability, not cosmetic cleanup."}, {"name": "Predict", "short": "Motion state", "description": "Propagate the current state using a motion or inertial model. Carry uncertainty forward rather than reporting only a location.", "connection": "What happens to drift and covariance when external fixes are missing?"}, {"name": "Update", "short": "New evidence", "description": "A state estimator compares new measurements with the prediction and applies a correction weighted by the assumed uncertainty.", "connection": "Check innovation, modeled noise and biased or inconsistent observations."}, {"name": "Match", "short": "Road candidates", "description": "Use estimated positions and map data to assess candidate road links. Distance, direction, connectivity and a sequence of samples can inform the match.", "connection": "Retain ambiguity when several plausible paths remain."}, {"name": "Use", "short": "Service decision", "description": "Supply position, road context, time and uncertainty to navigation, fleet tracking or another ITS service. The application decides what information quality it needs.", "connection": "Validate the decision against the task’s tolerance and deadline."}];
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


const kfMeasurement = document.querySelector('#kf-measurement');
const kfPrior = document.querySelector('#kf-prior-sigma');
const kfNoise = document.querySelector('#kf-measure-sigma');
const kfOutage = document.querySelector('#kf-outage');
function renderFusion() {
  const z=Number(kfMeasurement.value), priorSigma=Number(kfPrior.value), noiseSigma=Number(kfNoise.value);
  const P=priorSigma**2, R=noiseSigma**2, unavailable=kfOutage.checked;
  const K=unavailable?0:P/(P+R), estimate=8+K*(z-8), variance=(1-K)*P;
  document.querySelector('#kf-measurement-value').textContent=`${z} m`;
  document.querySelector('#kf-prior-value').textContent=`${priorSigma} m`;
  document.querySelector('#kf-noise-value').textContent=`${noiseSigma} m`;
  document.querySelector('#kf-gain').textContent=unavailable?'No update':K.toFixed(2);
  document.querySelector('#kf-position').textContent=`${estimate.toFixed(2)} m`;
  document.querySelector('#kf-sigma').textContent=`${Math.sqrt(variance).toFixed(2)} m`;
  document.querySelector('#kf-weight').style.width=`${K*100}%`;
  document.querySelector('#kf-explanation').textContent=unavailable?'No GNSS measurement is used. The predicted position and its uncertainty remain unchanged by this update. Drift may grow during subsequent prediction steps.':`The model assigns ${(K*100).toFixed(1)}% of the correction to the measurement. A larger assumed measurement variance reduces this weight; an unmodeled bias can still mislead the estimate.`;
}
[kfMeasurement,kfPrior,kfNoise].forEach(x=>x.addEventListener('input',renderFusion));
kfOutage.addEventListener('change',renderFusion);
document.querySelector('#kf-reset').addEventListener('click',()=>{kfMeasurement.value=12;kfPrior.value=2;kfNoise.value=3;kfOutage.checked=false;renderFusion();});
renderFusion();
let mapPreset='ambiguous';
const mapSigma=document.querySelector('#map-sigma'),mapConnected=document.querySelector('#map-connected');
function inferPath(observations,sigma,connected) {
  const levels=[0,10],emit=(z,state)=>-0.5*((z-levels[state])/sigma)**2;
  const transition=(a,b)=>connected?(a===b?0.9:0.1):(a===b?1:0);
  let scores=levels.map((_,i)=>Math.log(0.5)+emit(observations[0],i));
  const pointers=[];
  for(let t=1;t<observations.length;t++){
    const next=[],back=[];
    for(let b=0;b<2;b++){
      const values=scores.map((score,a)=>score+Math.log(transition(a,b)));
      const best=values[0]>=values[1]?0:1;
      next[b]=values[best]+emit(observations[t],b);back[b]=best;
    }
    scores=next;pointers.push(back);
  }
  let state=scores[0]>=scores[1]?0:1;const path=[state];
  for(let t=pointers.length-1;t>=0;t--){state=pointers[t][state];path.unshift(state);}
  return path;
}
function renderMap() {
  const observations=mapPreset==='ambiguous'?[1,6,1]:[1,9,9];
  const sigma=Number(mapSigma.value),connected=mapConnected.checked;
  const nearest=observations.map(y=>y<=5?0:1),path=inferPath(observations,sigma,connected);
  const letters=xs=>xs.map(i=>i===0?'A':'B').join(' → ');
  document.querySelector('#map-sigma-value').textContent=`${sigma} m`;
  document.querySelector('#map-nearest').textContent=letters(nearest);
  document.querySelector('#map-sequence').textContent=letters(path);
  document.querySelector('#map-observation').textContent=`Observed y values: ${observations.join(', ')} m at x = 0, 100, 200 m. No reference truth is supplied.`;
  const switches=nearest.slice(1).filter((value,i)=>value!==nearest[i]).length;
  document.querySelector('#map-reason').textContent=!connected&&switches?'Nearest snapping changes roads without a mapped connector. The HMM must stay on one road; it uses all three fixes to choose the sequence.':'The HMM balances observation fit with the specified transition probabilities. Adding a connector or changing assumed noise can change the preferred sequence.';
  const xs=[50,170,290],py=y=>155-y*10;
  const points=observations.map((y,i)=>`<circle cx="${xs[i]}" cy="${py(y)}" r="6" fill="var(--lecture-accent)" stroke="var(--lecture-deep)" stroke-width="1.5"/><text x="${xs[i]+9}" y="${py(y)-7}">${i+1}</text>`).join('');
  const connectors=connected?'<path d="M110 55V155M230 55V155" stroke="#64748B" stroke-width="3" stroke-dasharray="5 4"/>':'';
  const selected=path.map((s,i)=>`<circle cx="${xs[i]}" cy="${py(s*10)}" r="9" fill="none" stroke="var(--lecture-primary)" stroke-width="3"/>`).join('');
  document.querySelector('#map-plot').innerHTML=`<g font-family="monospace" font-size="11" fill="var(--ink)"><text x="16" y="21">CONSTRUCTED ROAD NETWORK</text><path d="M30 55H325M30 155H325" fill="none" stroke="#475569" stroke-width="3"/>${connectors}<text x="12" y="59">B</text><text x="12" y="159">A</text><text x="35" y="193">0 m</text><text x="150" y="193">100 m</text><text x="272" y="193">200 m</text><polyline points="${observations.map((y,i)=>`${xs[i]},${py(y)}`).join(' ')}" fill="none" stroke="var(--lecture-primary)" stroke-dasharray="4 4"/>${points}${selected}</g>`;
  document.querySelector('#map-plot').setAttribute('aria-label',`Roads A and B, ${connected?'with':'without'} connectors. Noisy y observations ${observations.join(', ')} metres. Viterbi sequence ${letters(path)}. Green rings show selected candidates.`);
  document.querySelectorAll('[data-map-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mapPreset===mapPreset)));
}
document.querySelector('.map-presets').addEventListener('click',event=>{const b=event.target.closest('[data-map-preset]');if(b){mapPreset=b.dataset.mapPreset;renderMap();}});
mapSigma.addEventListener('input',renderMap);mapConnected.addEventListener('change',renderMap);renderMap();

const questions = [{"topic": "Sensor roles", "question": "GNSS fixes are missing in a tunnel. What does INS provide?", "choices": ["A guaranteed permanent absolute position", "Motion propagation from the prior state, with accumulating error", "A replacement digital road map"], "correct": 1, "explanation": "INS can bridge missing external observations, but its errors can grow.", "readingUrl": "#slide-responses", "readingLabel": "Sensor complementarity"}, {"topic": "Multipath", "question": "What causes the multipath mechanism discussed in the lecture?", "choices": ["Signals arrive through reflections as well as the direct path", "Satellite signals are temporarily blocked without any reflections", "Inertial errors grow between external position updates"], "correct": 0, "explanation": "Reflected satellite signals can distort observations; this differs from a simple map-display issue.", "readingUrl": "https://gssc.esa.int/navipedia/index.php/Multipath", "readingLabel": "ESA multipath reference"}, {"topic": "Kalman gain", "question": "In the scalar lab, predicted σ = 2 m and measurement σ = 3 m. Which is the correct gain?", "choices": ["2/5", "9/13", "4/13"], "correct": 2, "explanation": "The gain uses variances: P = 4, R = 9, K = P/(P + R).", "readingUrl": "#slide-model", "readingLabel": "Fusion model equations"}, {"topic": "Uncertainty", "question": "The reported measurement variance increases while predicted variance stays fixed. What happens in the model?", "choices": ["The measurement always receives more weight", "The measurement receives less weight", "The gain must become negative"], "correct": 1, "explanation": "Larger R reduces P/(P + R), so the update moves less toward the measurement.", "readingUrl": "#slide-model", "readingLabel": "Uncertainty explorer"}, {"topic": "Model limits", "question": "A biased GNSS fix is reported with very small variance. What follows?", "choices": ["The filter can become overconfident if the error model is wrong", "The filter always recognizes and removes the bias automatically", "A small variance proves the physical position is correct"], "correct": 0, "explanation": "The update relies on the assumed measurement model; declared uncertainty is not independent validation.", "readingUrl": "#slide-world", "readingLabel": "Validation and uncertainty"}, {"topic": "Map matching", "question": "Why can nearest-road snapping fail on parallel roads?", "choices": ["Matching road names is sufficient even when the coordinates are noisy", "The closest road at each sample must be the correct traveled route", "Separate fixes may imply impossible changes between disconnected roads"], "correct": 2, "explanation": "A sequence model can consider network connectivity as well as each observation.", "readingUrl": "#slide-evidence", "readingLabel": "Two-road example"}, {"topic": "HMM states", "question": "In the lecture’s HMM map-matching interpretation, what is hidden?", "choices": ["The noise-free coordinate recorded directly by the receiver", "The road/candidate sequence that produced the noisy fixes", "Every observed GNSS coordinate"], "correct": 1, "explanation": "Road candidates are states; the measured positions are observations.", "readingUrl": "https://www.microsoft.com/en-us/research/publication/hidden-markov-map-matching-noise-sparseness/", "readingLabel": "HMM map-matching paper"}, {"topic": "Viterbi", "question": "What does Viterbi select in the constructed HMM?", "choices": ["The candidate sequence with the highest score under the model", "The shortest future delivery tour", "The nearest candidate independently at every sample"], "correct": 0, "explanation": "It uses transitions and observation likelihoods to optimize the full candidate sequence.", "readingUrl": "#slide-evidence", "readingLabel": "Sequence inference"}, {"topic": "Fréchet", "question": "What does standard Fréchet distance preserve in its allowed traversals?", "choices": ["Identical original speeds", "Identical sample timestamps", "Forward traversal order, while allowing different speeds"], "correct": 2, "explanation": "The leash interpretation compares curves under forward reparameterization, not fixed-time synchronization.", "readingUrl": "https://www.kr.tuwien.ac.at/staff/eiter/et-archive/files/cdtr9464.pdf", "readingLabel": "Fréchet variants"}, {"topic": "Architecture", "question": "Which distinction describes loosely versus tightly coupled GNSS/INS?", "choices": ["Physical distance between the sensors", "Whether GNSS solutions or lower-level GNSS observables enter the fusion estimator", "Whether GNSS positions are corrected before displaying them on a map"], "correct": 1, "explanation": "The distinction concerns the fusion interface; greater complexity is not a universal guarantee of better results.", "readingUrl": "#slide-model", "readingLabel": "Integration interfaces"}, {"topic": "Road pricing", "question": "A system has GNSS-based distance-charging capability. What can be concluded?", "choices": ["The technology can support that option; policy adoption needs separate evidence", "Every journey is already charged by distance", "Position error cannot affect charging"], "correct": 0, "explanation": "LTA’s 2023 announcement separated the capability from changes to the charging framework.", "readingUrl": "https://www.lta.gov.sg/content/ltagov/en/newsroom/2023/10/news-releases/erp-2-0-on-board-unit-installation-starting-in-november-with-fle.html", "readingLabel": "ERP 2.0 announcement"}, {"topic": "Task + evidence", "question": "A trace is matched to the correct road link. What additional claim still needs validation?", "choices": ["That a road network was used", "That an estimate was produced", "That the result is accurate enough for lane-level autonomous control"], "correct": 2, "explanation": "Link correctness, physical accuracy, uncertainty, availability and latency are distinct evaluation questions.", "readingUrl": "#slide-world", "readingLabel": "Evaluate the evidence"}];
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
    feedback.textContent = "Positioning needs an appropriate sensor model, a plausible road match and evidence that the estimate meets the application’s needs. Return to the models to review.";
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
