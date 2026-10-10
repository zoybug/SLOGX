/* Visit observations come from the organizer's November 2025 summary. */
(() => {
  const stages = [
    ['Identify the parcel', 'Barcode scanners on the conveyor lines connect each parcel with the information needed for its next movement.', 'Course connection: a physical parcel and its digital record must stay aligned.'],
    ['Measure the parcel', 'Volumetric sensors and dimensional thresholds help separate large, medium and small parcels for suitable handling.', 'Course connection: equipment choices depend on the load being handled.'],
    ['Route to a sorting lane', 'Automatic diverters, cross-belt sorters and tilt-tray systems direct parcels onward. The visit also showed specialized processing lanes.', 'Course connection: a destination decision must become a physical movement.'],
    ['Prepare the outbound handoff', 'Staff described nighttime peaks around inter-city departures. The tour also showed blue nets for fragile items and orange nets for general parcels.', 'Course connection: sorting completion and transport departures must work together.'],
  ];
  document.querySelectorAll('[data-visit-stage]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.visitStage);
    document.querySelectorAll('[data-visit-stage]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('#visit-stage-number').textContent = String(index + 1).padStart(2, '0');
    document.querySelector('#visit-stage-title').textContent = stages[index][0];
    document.querySelector('#visit-stage-text').textContent = stages[index][1];
    document.querySelector('#visit-stage-question').textContent = stages[index][2];
  }));

  document.querySelectorAll('[data-visit-service]').forEach(button => button.addEventListener('click', () => {
    const perishable = button.dataset.visitService === 'perishable';
    document.querySelectorAll('[data-visit-service]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    const time = document.querySelector('#visit-service-time');
    time.replaceChildren(document.createTextNode(perishable ? 'Under 5 ' : '30–40 '));
    const unit = document.createElement('span');
    unit.textContent = 'minutes';
    time.append(unit);
    document.querySelector('#visit-service-title').textContent = perishable ? 'A fast-tracked service' : 'A complete hub cycle';
    document.querySelector('#visit-service-text').textContent = perishable
      ? 'The branch manager described fast-tracked processing for perishable goods such as fruit, reflecting their time-sensitive handling needs.'
      : 'Arrival, sorting, repackaging and outbound dispatch formed the cycle described by the branch manager.';
  }));

  const questions = [
    ['How is staff performance measured?', 'The manager described accuracy and productivity alongside safety practices and the handling of exception parcels.', 'A useful measure captures both the volume of work and the quality of the handoff.'],
    ['Which technologies support the operation?', 'The discussion covered SF’s in-house automation, real-time parcel tracking, AI-supported sorting and continued technology development.', 'Follow how information, machinery and operating decisions connect; a technology label alone does not explain the result.'],
    ['What did students ask about internships?', 'International students asked about internship possibilities. The manager discussed technical background, analytical ability, communication and an interest in logistics technology.', 'This is a summary of the November 2025 conversation, rather than a current recruitment announcement.'],
    ['How does SF work with partners?', 'The manager described an operation centered on SF’s own network, with selective partnerships to support cost, coverage and service efficiency.', 'A logistics network still needs clear responsibilities at every handoff.'],
  ];
  document.querySelectorAll('[data-visit-qa]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.visitQa);
    document.querySelectorAll('[data-visit-qa]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('#visit-qa-question').textContent = questions[index][0];
    document.querySelector('#visit-qa-answer').textContent = questions[index][1];
    document.querySelector('#visit-qa-connection').textContent = questions[index][2];
  }));

  // Historical company facts, separate from the class's visit observations.
  const facts = [
    { date: '1993', title: 'Foundation in Shunde', text: 'SF was founded in Shunde, Guangdong, in 1993. Its headquarters moved to Shenzhen in 2002.', source: 'SF Express · company history', url: 'https://www.sf-express.com/chn/en/about' },
    { date: '2005', title: 'Scanner and handheld terminal', text: 'SF dates its independently developed infrared scanner and first-generation handheld terminal to 2005.', source: 'SF Express · technology milestones', url: 'https://www.sf-express.com/chn/en/about' },
    { date: '2009', title: 'Establishment of SF Airlines', text: 'SF Airlines was established in 2009. The cargo airline is a subsidiary of SF Express.', source: 'SF Airlines · company profile', url: 'https://www.sf-airlines.com/en/about/index.html' },
    { date: '1 APRIL 2023', title: 'Ezhou–Liège cargo route', text: 'Ezhou Huahu Airport’s first international cargo route linked Ezhou with Liège, Belgium, on 1 April 2023.', source: 'SF Airlines · Ezhou–Liège announcement', url: 'https://www.sf-airlines.com/en/news/2137.html' },
    { date: 'FEBRUARY 2023', title: 'Xiangxiang’s Tokyo–Chengdu transport', text: 'SF Airlines transported giant panda Xiangxiang from Tokyo to Chengdu in February 2023.', source: 'SF Airlines · 2023 operations review', url: 'https://www.sf-airlines.com/en/news/2145.html' },
  ];
  let currentFact = 0;
  function showFact(index) {
    currentFact = (index + facts.length) % facts.length;
    const fact = facts[currentFact];
    document.querySelector('#sf-fact-date').textContent = fact.date;
    document.querySelector('#sf-fact-position').textContent = `${String(currentFact + 1).padStart(2, '0')} / ${String(facts.length).padStart(2, '0')}`;
    document.querySelector('#sf-fact-title').textContent = fact.title;
    document.querySelector('#sf-fact-text').textContent = fact.text;
    const source = document.querySelector('#sf-fact-source');
    source.textContent = fact.source + ' ↗';
    source.href = fact.url;
  }
  document.querySelector('#sf-fact-prev').addEventListener('click', () => showFact(currentFact - 1));
  document.querySelector('#sf-fact-next').addEventListener('click', () => showFact(currentFact + 1));
  const factCard = document.querySelector('.visit-fact-card');
  factCard.addEventListener('keydown', event => {
    if (event.target !== factCard) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); showFact(currentFact - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showFact(currentFact + 1); }
  });
})();
