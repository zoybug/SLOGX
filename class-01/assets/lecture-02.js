(() => {
  const systems = [
    {
      label: "On-demand delivery",
      example: "Meal or parcel in a dense city",
      flow: ["Order arrives", "Merchant readiness + courier GPS", "Check vehicle and promised window", "Assign courier; sequence stops", "Confirm delivery; compare ETA"],
      constraint: "A nearby courier may be committed elsewhere; the feasible pickup ETA matters more than straight-line distance.",
      measure: "On-time delivery, empty travel, and courier workload."
    },
    {
      label: "Medical drone",
      example: "Urgent clinic request",
      flow: ["Clinic requests supply", "Stock + aircraft + weather", "Check payload, range, airspace", "Assign flight or ground fallback", "Confirm receipt; log time"],
      constraint: "Flight eligibility comes before ranking a route. An unsafe mission should not be made 'optimal' by a short distance.",
      measure: "Time to clinic and successfully completed urgent deliveries."
    },
    {
      label: "Parcel locker",
      example: "Consolidated neighborhood drop",
      flow: ["Parcels reach a depot", "Address + parcel size + free lockers", "Check locker capacity and access", "Assign compartments; plan van stops", "Notify recipient; confirm pickup"],
      constraint: "Van mileage falls only if customers can reasonably reach available compartments.",
      measure: "Successful first placement, van stop time, and customer walking distance."
    },
    {
      label: "Port community",
      example: "Vessel and container arrival",
      flow: ["Arrival notice submitted", "Vessel, berth, gate, and document data", "Check berth and clearance status", "Schedule arrival and hand-offs", "Reconcile actual events"],
      constraint: "One operator's plan depends on timely, accurate data from other firms and authorities.",
      measure: "Waiting time, clearance time, and on-time hand-offs."
    }
  ];

  const tabRoot = document.querySelector("#system-tabs");
  const detail = document.querySelector("#system-detail");
  let activeSystem = 0;
  function renderSystem() {
    tabRoot.innerHTML = systems.map((item, index) =>
      `<button type="button" data-system="${index}" aria-pressed="${index === activeSystem}" class="${index === activeSystem ? "active" : ""}">${item.label}</button>`
    ).join("");
    const selected = systems[activeSystem];
    detail.innerHTML = `<div class="system-heading"><span class="smallcaps">ILLUSTRATIVE FLOW / ${String(activeSystem + 1).padStart(2, "0")}</span><h3>${selected.example}</h3></div>
      <ol>${selected.flow.map(step => `<li>${step}</li>`).join("")}</ol>
      <div class="system-bottom"><p><b>Binding constraint</b>${selected.constraint}</p><p><b>Test the result</b>${selected.measure}</p></div>`;
  }
  tabRoot.addEventListener("click", event => {
    const button = event.target.closest("[data-system]");
    if (!button) return;
    activeSystem = Number(button.dataset.system);
    renderSystem();
    tabRoot.querySelector(".active").focus();
  });
  renderSystem();

  const scenarioButtons = [...document.querySelectorAll("[data-scenario]")];
  const scenarioFeedback = document.querySelector("#scenario-feedback");
  scenarioButtons.forEach(button => button.addEventListener("click", () => {
    const feasible = button.dataset.scenario === "feasible";
    scenarioButtons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    scenarioFeedback.textContent = feasible
      ? "Choose B for this order: B can meet the pickup and delivery window. Then check whether this assignment is fair across the whole courier pool."
      : "Distance alone is insufficient: A's earlier stop risks lateness. Compare both couriers' feasible pickup ETAs before assigning.";
    scenarioFeedback.className = feasible ? "scenario-good" : "scenario-review";
  }));

  const questions = [
    {
      topic: "01 / Design the trip",
      question: "A food order is ready. The closest courier is finishing a delivery that may miss the new order's window. What should dispatch compare first?",
      choices: ["Straight-line distance only", "Feasible pickup ETA and existing commitments", "Which courier has the longest name"],
      correct: 1,
      explanation: "Assignment must account for what the courier can actually do next. A farther available courier can reach pickup and drop-off on time.",
      readingLabel: "Grab on allocation",
      readingUrl: "https://www.grab.com/inside-grab/stories/matching-driver-partners-and-riders-allocation/"
    },
    {
      topic: "01 / Design the trip",
      question: "A clinic needs blood urgently, but wind exceeds the drone's safe operating limit. Which plan is feasible?",
      choices: ["Fly the shortest route anyway", "Delay or use an approved ground alternative", "Ignore the weather because the payload is small"],
      correct: 1,
      explanation: "Safety, airspace, payload, and range are feasibility gates. Optimization selects among permitted options; it cannot waive a safety limit.",
      readingLabel: "FAA on UAS weather and operating limits",
      readingUrl: "https://www.faa.gov/documentlibrary/media/advisory_circular/ac_107-2.pdf"
    },
    {
      topic: "01 / Design the trip",
      question: "A locker assignment saves a van stop but sends a customer far beyond the promised walking distance. What should the planner do?",
      choices: ["Use it because van mileage is the only goal", "Treat walking distance as a constraint and compare another locker or home delivery", "Assume every locker has an empty compartment"],
      correct: 1,
      explanation: "The final hand-off is part of the service. A route is not successful if the compartment is unavailable or customer access is impractical.",
      readingLabel: "Blue Express pickup network",
      readingUrl: "https://www.blue.cl/lockers-puntos/encuentra-tu-punto"
    },
    {
      topic: "01 / Design the trip",
      question: "A parcel driver has 80 stops. Which decision belongs to stop sequencing rather than turn-by-turn navigation?",
      choices: ["Which customer to visit next under pickup deadlines", "Which side of a building has the loading dock", "Where the next road turns left"],
      correct: 0,
      explanation: "The stop sequence chooses visit order; navigation guides the driver along roads to each chosen stop. UPS describes ORION and UPSNav as distinct parts.",
      readingLabel: "UPS on ORION and UPSNav",
      readingUrl: "https://about.ups.com/us/en/newsroom/press-releases/innovation-driven/ups-deploys-purpose-built-navigation-for-ups-service-personnel.html"
    },
    {
      topic: "02 / Test the claim",
      question: "A fleet case reports fewer camera-recorded incidents and better delivery-time productivity. How should a report present these?",
      choices: ["As one combined routing improvement", "As two distinct measures with their own sources and baselines", "As proof that all roads became safer"],
      correct: 1,
      explanation: "Safety and delivery productivity are different outcomes. The Potosinos case has separate safety and last-mile measures; the causal scope must remain clear.",
      readingLabel: "Samsara on Potosinos operations",
      readingUrl: "https://www.samsara.com/mx/customers/potosinos-ultima-milla"
    },
    {
      topic: "02 / Test the claim",
      question: "A drone operator says it has completed more than a million commercial deliveries. What can you conclude without another time series?",
      choices: ["It made a million deliveries in the past year", "It passed a cumulative milestone", "Each partner store made a million deliveries"],
      correct: 1,
      explanation: "A cumulative total is not an annual rate. Wing's June 2026 wording reports completed commercial deliveries to date.",
      readingLabel: "Wing + Walmart expansion",
      readingUrl: "https://wing.com/news/wing-and-walmart-seven-new-markets-drone-delivery"
    },
    {
      topic: "02 / Test the claim",
      question: "A port handles more containers after both software changes and a terminal expansion. What is the justified statement?",
      choices: ["The software caused the entire increase", "Throughput rose; isolate capacity and other changes before claiming software impact", "The expansion could not affect throughput"],
      correct: 1,
      explanation: "The port authority connects 2025 growth partly to an expanded terminal. A software effect needs its own counterfactual or operational measure.",
      readingLabel: "Tanger Med 2025 activity",
      readingUrl: "https://www.tangermed.ma/wp-content/uploads/press-releases/2026/CP-TMPA-PORT-ACTIVITY-REPORT-IN-2025.pdf"
    },
    {
      topic: "02 / Test the claim",
      question: "An EV taxi is near a passenger but lacks enough charge for the trip plus a safe reserve. What should the assignment rule do?",
      choices: ["Assign it because pickup distance is lowest", "Check another vehicle or charging plan before assignment", "Remove battery status from the data"],
      correct: 1,
      explanation: "The nearest vehicle is infeasible if it cannot complete the trip safely. A proposed battery-aware rule should also account for pickup time and charger availability.",
      readingLabel: "Research on EV dispatch and charging",
      readingUrl: "https://arxiv.org/abs/2302.12650"
    },
    {
      topic: "03 / Apply the method",
      question: "A nearest-neighbor route is short but reaches a customer after its promised window. What is the next useful step?",
      choices: ["Keep the route because distance is the only objective", "Rebuild or improve the stop order while enforcing time windows", "Remove the late customer from the data"],
      correct: 1,
      explanation: "Nearest neighbor constructs a starting route. A usable vehicle-routing plan must also satisfy arrival windows and other constraints.",
      readingLabel: "OR-Tools on vehicle routing with time windows",
      readingUrl: "https://developers.google.com/optimization/routing/vrptw"
    },
    {
      topic: "03 / Apply the method",
      question: "A savings heuristic proposes joining two depot routes into one shorter tour. What must be checked before accepting the merge?",
      choices: ["Only whether the road line looks shorter", "Vehicle capacity and service time feasibility", "Whether both customers have the same name"],
      correct: 1,
      explanation: "Clarke-Wright savings estimates a distance gain from joining routes, but the combined load and schedule still have to fit.",
      readingLabel: "SIAM vehicle-routing reference",
      readingUrl: "https://epubs.siam.org/doi/10.1137/1.9781611973594"
    },
    {
      topic: "03 / Apply the method",
      question: "An electric freight truck can reach every stop only if it charges en route. Which variables should be planned together?",
      choices: ["Road distance alone", "Stop order, charging location and duration, and delivery deadlines", "The truck's paint color and fleet logo"],
      correct: 1,
      explanation: "Charging changes both available energy and arrival time. Prof. Qi's cited truck study models travel, charging, and tardiness in one scheduling problem.",
      readingLabel: "Joint routing and charging study",
      readingUrl: "https://arxiv.org/abs/2302.00240"
    },
    {
      topic: "03 / Apply the method",
      question: "A truck carries drones to serve dispersed customers with due times. What makes the combined plan harder than separate shortest paths?",
      choices: ["The truck and drones can ignore each other's schedules", "Launch, service, and reunion timing must fit each vehicle's capacity and customer due times", "Each drone can carry unlimited parcels"],
      correct: 1,
      explanation: "The truck and drones share a schedule. A route is feasible only when the vehicles can coordinate service and hand-offs within their operating limits.",
      readingLabel: "Truck-and-drone cooperative delivery research",
      readingUrl: "https://ira.lib.polyu.edu.hk/handle/10397/107810"
    }
  ];

  let questionIndex = 0;
  let score = 0;
  let answered = false;
  const status = document.querySelector("#quiz-status");
  const choices = document.querySelector("#quiz-choices");
  const feedback = document.querySelector("#quiz-feedback");
  const next = document.querySelector("#quiz-next");
  const restart = document.querySelector("#quiz-restart");
  const progress = document.querySelector("#quiz-progress");
  function renderQuestion() {
    answered = false;
    const question = questions[questionIndex];
    status.textContent = `[Q-${String(questionIndex + 1).padStart(2, "0")}/${questions.length}] / [UNANSWERED] / SCORE ${score}`;
    progress.style.width = `${questionIndex / questions.length * 100}%`;
    document.querySelector("#quiz-topic").textContent = question.topic;
    document.querySelector("#quiz-question").textContent = question.question;
    choices.innerHTML = question.choices.map((label, index) =>
      `<button class="choice" type="button" data-answer="${index}"><span class="letter">[${String.fromCharCode(65 + index)}]</span><span>${label}</span></button>`
    ).join("");
    feedback.className = "feedback";
    feedback.textContent = "";
    next.disabled = true;
    next.textContent = questionIndex === questions.length - 1 ? "See result →" : "Next question →";
  }
  choices.addEventListener("click", event => {
    const button = event.target.closest("[data-answer]");
    if (!button || answered) return;
    answered = true;
    const selected = Number(button.dataset.answer);
    const question = questions[questionIndex];
    const right = selected === question.correct;
    if (right) score++;
    [...choices.querySelectorAll(".choice")].forEach((item, index) => {
      item.disabled = true;
      if (index === question.correct) item.classList.add("correct");
      else if (index === selected) item.classList.add("wrong");
    });
    status.textContent = `[Q-${String(questionIndex + 1).padStart(2, "0")}/${questions.length}] / [${right ? "CORRECT" : "REVIEW"}] / SCORE ${score}`;
    progress.style.width = `${(questionIndex + 1) / questions.length * 100}%`;
    feedback.className = `feedback ${right ? "good" : "bad"}`;
    feedback.textContent = `${right ? "Correct. " : "Review this. "}${question.explanation}`;
    const link = document.createElement("a");
    link.href = question.readingUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `Related reading: ${question.readingLabel} ↗`;
    feedback.append(document.createElement("br"), link);
    next.disabled = false;
  });
  next.addEventListener("click", () => {
    if (questionIndex < questions.length - 1) {
      questionIndex++;
      renderQuestion();
      return;
    }
    status.textContent = `[COMPLETE] / SCORE ${score} OF ${questions.length}`;
    progress.style.width = "100%";
    document.querySelector("#quiz-topic").textContent = "FINAL CHECK";
    document.querySelector("#quiz-question").textContent = "Which evidence would change your next plan?";
    choices.innerHTML = "";
    feedback.className = "feedback";
    feedback.textContent = "A useful system measures the completed trip, explains trade-offs, and uses those results to improve its next assignment.";
    next.hidden = true;
    restart.hidden = false;
  });
  restart.addEventListener("click", () => {
    questionIndex = 0;
    score = 0;
    next.hidden = false;
    restart.hidden = true;
    renderQuestion();
  });
  renderQuestion();
})();
