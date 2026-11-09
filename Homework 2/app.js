const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

const program = document.querySelector('#program');
const showProgram = document.querySelector('#show-program');
const serviceForm = document.querySelector('#service-form');
const guideCheckbox = document.querySelector('#guide');
const audioCheckbox = document.querySelector('#audio');
const catalogCheckbox = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const result = document.querySelector('#result');
const reportJson = document.querySelector('#report-json');

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const flags = [guideChecked, audioChecked, catalogChecked];

  const items = services
    .filter((service, index) => flags[index])
    .map(({ title, price }) => ({ title: title.trim(), price }));

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return {
    count: items.length,
    total: total,
    items: items,
  };
}

let data = null;

try {
  data = JSON.parse(sourceJson);
} catch (error) {
  dataError.hidden = false;
  serviceForm.hidden = true;
}

if (data) {
  serviceForm.hidden = false;
}

showProgram.addEventListener('click', () => {
  if (!data) {
    return;
  }
  program.innerHTML = data.event.meeting;
  program.hidden = false;
});

serviceForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!data) {
    return;
  }

  const report = buildReport(
    data.services,
    guideCheckbox.checked,
    audioCheckbox.checked,
    catalogCheckbox.checked
  );

  if (report.count === 0) {
    choiceError.hidden = false;
    result.hidden = true;
    reportJson.hidden = true;
    return;
  }

  choiceError.hidden = true;

  let html = `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.`;
  report.items.forEach((item) => {
    html += `<br>${item.title}`;
  });
  result.innerHTML = html;

  const jsonString = JSON.stringify(report);
  JSON.parse(jsonString);
  reportJson.textContent = jsonString;

  result.hidden = false;
  reportJson.hidden = false;
});
