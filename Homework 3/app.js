function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function selectAttempts(filter) {
  const attempts = window.reportData.attempts;
  if (filter === 'passed') return attempts.filter(a => a.passed === true);
  if (filter === 'failed') return attempts.filter(a => a.passed === false);
  return attempts;
}

function renderAttempts(attempts) {
  const listElement = document.querySelector('#result-list');
  const countElement = document.querySelector('#result-count');
  
  let htmlString = '';
  
  attempts.forEach(attempt => {
    const safeName = escapeHtml(attempt.name);
    htmlString += `<div class="attempt-row">${safeName} — ${attempt.score} из ${window.reportData.questionCount} (${attempt.percentage}%)</div>`;
  });

  listElement.innerHTML = htmlString;
  
  const total = window.reportData.attempts.length;
  countElement.textContent = `Показано: ${attempts.length} из ${total}`;
}

function startFilter() {
  const form = document.querySelector('form');
  const select = document.querySelector('select');
  const countElement = document.querySelector('#result-count');
  const listElement = document.querySelector('#result-list');

  renderAttempts(selectAttempts('all'));

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const filterValue = select.value;
      const filtered = selectAttempts(filterValue);
      renderAttempts(filtered);
    });
  }
}

startFilter();