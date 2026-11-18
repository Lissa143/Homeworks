function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function selectAttempts(filter) {
  const attempts = window.reportData.attempts
  if (filter === 'passed') return attempts.filter((a) => a.passed === true)
  if (filter === 'failed') return attempts.filter((a) => a.passed === false)
  return attempts
}

function renderAttempts(attempts) {
  const listElement = document.querySelector('#result-list')
  const countElement = document.querySelector('#result-count')

  let htmlString = ''

  attempts.forEach((attempt) => {
    const safeName = escapeHtml(attempt.name)
    htmlString += `<li class="result-item"><span class="result-name">${safeName}</span> — ${attempt.score} из ${attempt.questionCount} (${attempt.percentage}%)</li>`
  })

  listElement.innerHTML = htmlString

  const total = window.reportData.attempts.length
  countElement.textContent = `Показано: ${attempts.length} из ${total}`
}

function startFilter() {
  const form = document.querySelector('#filter-form')
  const select = document.querySelector('#filter')

  renderAttempts(selectAttempts('all'))

  if (form && select) {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const filterValue = select.value
      renderAttempts(selectAttempts(filterValue))
    })
  }
}

startFilter()