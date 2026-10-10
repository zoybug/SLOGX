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

const questions = [
  {
    "topic": "Sensor roles",
    "question": "A delivery vehicle enters a tunnel and loses GNSS fixes. Which approach describes what INS can contribute during the outage?",
    "choices": [
      "Retain the last GNSS coordinate and its uncertainty until reception resumes.",
      "Propagate motion from the prior state and account for growing inertial uncertainty.",
      "Replace the missing GNSS coordinate with the nearest road’s midpoint."
    ],
    "correct": 1,
    "explanation": "INS propagates motion using inertial measurements from a starting state. Sensor and model errors accumulate; keeping an unchanged GNSS fix does not estimate the vehicle’s continuing motion.",
    "readingUrl": "#slide-responses",
    "readingLabel": "Positioning process"
  },
  {
    "topic": "Multipath",
    "question": "Beside tall buildings, a receiver obtains the direct satellite signal and delayed reflected copies. Which mechanism best explains a distorted fix?",
    "choices": [
      "The reflected paths distort the measured signal and its inferred range.",
      "The vehicle’s inertial bias accumulates between external position corrections.",
      "The road network’s geometry projects the coordinate onto a nearby link."
    ],
    "correct": 0,
    "explanation": "Multipath concerns a signal reaching the receiver along several paths. Blockage, inertial drift and map-matching errors are different mechanisms, even when they can occur in the same city environment.",
    "readingUrl": "https://gssc.esa.int/navipedia/index.php/Multipath",
    "readingLabel": "ESA multipath reference"
  },
  {
    "topic": "Kalman gain",
    "question": "The scalar example predicts 8 m with σ = 2 m and receives a 12 m fix with σ = 3 m. Which measurement weight K should it use?",
    "choices": [
      "2/5, using the two standard deviations directly.",
      "9/13, using the measurement variance in the numerator.",
      "4/13, using the predicted variance in the numerator."
    ],
    "correct": 2,
    "explanation": "P = 2² = 4 m² and R = 3² = 9 m². K = P/(P + R) = 4/13, giving 8 + (4/13)×4 ≈ 9.23 m. Standard deviations must first be squared.",
    "readingUrl": "#slide-model",
    "readingLabel": "Scalar update equations"
  },
  {
    "topic": "Uncertainty",
    "question": "For the same prediction and fix, P stays at 4 m² while R rises from 9 to 36 m². What change should the scalar update make?",
    "choices": [
      "Lower K from 4/13 to 4/40 and move less toward the fix.",
      "Raise K from 4/13 to 36/40 and move farther toward the fix.",
      "Keep K at 4/13 because the measured coordinate has not changed."
    ],
    "correct": 0,
    "explanation": "The assumed error variance affects the weight even when the measured coordinate is unchanged. Increasing R lowers P/(P + R), so the prediction changes less.",
    "readingUrl": "#slide-model",
    "readingLabel": "Measurement uncertainty"
  },
  {
    "topic": "Model limits",
    "question": "A multipath-biased fix is assigned a very small R. The filter reports a precise-looking result near that fix. Which follow-up best tests whether it is trustworthy?",
    "choices": [
      "Repeat the same update until the displayed standard deviation stabilizes.",
      "Compare with an independent position reference and inspect the error model.",
      "Compare the result with the nearest road chosen from the same noisy fix."
    ],
    "correct": 1,
    "explanation": "A small modeled variance does not reveal an unmodeled bias. Reusing the same observation or a map match derived from it is not an independent accuracy check.",
    "readingUrl": "#slide-world",
    "readingLabel": "Position validation"
  },
  {
    "topic": "Map matching",
    "question": "Three fixes snap to A → B → A, but the two roads have no connector in the mapped intervals. What should a sequence matcher add to the decision?",
    "choices": [
      "A preference for the nearest candidate, applied separately to each fix.",
      "Allowed road transitions and the fit of the complete observed sequence.",
      "A fixed rule retaining the first road regardless of subsequent observations."
    ],
    "correct": 1,
    "explanation": "Nearest snapping ignores whether the implied road changes are possible. The sequence model uses both observations and connectivity; it can choose either consistent road under its assumptions.",
    "readingUrl": "#slide-evidence",
    "readingLabel": "Parallel-road example"
  },
  {
    "topic": "HMM states",
    "question": "An HMM is given three measured position fixes and candidate locations on nearby road links. Which quantity is inferred as the hidden state sequence?",
    "choices": [
      "The receiver’s three recorded coordinates, treated as unknown observations.",
      "The GNSS measurement variances, estimated only from road connectivity.",
      "The road candidates that could have produced the recorded noisy observations."
    ],
    "correct": 2,
    "explanation": "The fixes are observed. Road candidates are hidden states; emissions describe observation fit and transitions describe movement between those candidates.",
    "readingUrl": "https://www.microsoft.com/en-us/research/publication/hidden-markov-map-matching-noise-sparseness/",
    "readingLabel": "HMM map-matching research"
  },
  {
    "topic": "Viterbi",
    "question": "Later fixes make an earlier road choice less plausible. What result does Viterbi seek in the constructed retrospective model?",
    "choices": [
      "The highest-scoring complete candidate sequence under emissions and transitions.",
      "The candidate with the highest individual emission likelihood at each sample.",
      "The shortest road path connecting the first and final observed coordinates."
    ],
    "correct": 0,
    "explanation": "Viterbi optimizes the joint sequence score, with backpointers to recover it. Independent nearest choices and shortest-path routing optimize different objectives.",
    "readingUrl": "#slide-evidence",
    "readingLabel": "Sequence inference"
  },
  {
    "topic": "Fréchet",
    "question": "Two traces follow similar curves at different speeds, with one vehicle stopping briefly. Which alignment does standard Fréchet distance permit?",
    "choices": [
      "Pair positions only at their original matching timestamps throughout the trip.",
      "Reverse one traversal when doing so reduces the largest paired separation.",
      "Vary forward traversal speeds while retaining the order along both curves."
    ],
    "correct": 2,
    "explanation": "Forward reparameterization allows different speeds and pauses, but no backtracking. Standard Fréchet distance compares curve geometry and order, not fixed clock synchronization.",
    "readingUrl": "https://www.kr.tuwien.ac.at/staff/eiter/et-archive/files/cdtr9464.pdf",
    "readingLabel": "Fréchet distance variants"
  },
  {
    "topic": "Architecture",
    "question": "A designer changes the estimator from using GNSS position/velocity solutions to using pseudoranges and Doppler with inertial states. Which distinction has changed?",
    "choices": [
      "Feed-forward versus feedback, determined by how corrections reach the INS.",
      "Loose versus tight coupling, determined by the GNSS information being fused.",
      "Online versus offline matching, determined by when road results are released."
    ],
    "correct": 1,
    "explanation": "The change concerns the fusion interface. Correction feedback and map-matching timing are separate design choices, and tighter coupling still requires calibration and evaluation.",
    "readingUrl": "#slide-model",
    "readingLabel": "Integration interfaces"
  },
  {
    "topic": "Road pricing",
    "question": "LTA’s October 2023 announcement describes ERP 2.0’s GNSS capability and says there is no immediate plan for distance charging. Which statement follows from that source?",
    "choices": [
      "Distance charging was technically supported, but adoption was a separate policy decision.",
      "Distance charging began when fleet vehicles first received the new onboard units.",
      "The replacement of gantries made position error irrelevant to charging decisions."
    ],
    "correct": 0,
    "explanation": "The historical announcement explicitly separates capability from the retained charging framework. It should not be used to infer a later policy without further evidence.",
    "readingUrl": "https://www.lta.gov.sg/content/ltagov/en/newsroom/2023/10/news-releases/erp-2-0-on-board-unit-installation-starting-in-november-with-fle.html",
    "readingLabel": "ERP 2.0 announcement"
  },
  {
    "topic": "Task and evidence",
    "question": "A test reports few wrong-road matches. Before using the estimator for lane-level control, which additional evaluation is most directly needed?",
    "choices": [
      "Increase the road-link test set while retaining the same link-correctness measure.",
      "Compare the mapped link names with the planned route’s street-name sequence.",
      "Measure physical error, uncertainty, outages and delay against the control requirements."
    ],
    "correct": 2,
    "explanation": "Road-link correctness is useful but does not establish lane-level physical accuracy or timely availability. The additional claim needs a suitable reference and task-specific measures.",
    "readingUrl": "#slide-world",
    "readingLabel": "Task-specific validation"
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
    feedback.textContent = "Positioning needs an appropriate sensor model, a plausible road match and evidence that the estimate meets the application’s needs. Review the model assumptions and application requirements.";
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
