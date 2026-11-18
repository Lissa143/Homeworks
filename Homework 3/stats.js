const PASSING_PERCENTAGE = 67

function isArray(value) {
  return Array.isArray(value)
}

export function validateQuizData(data) {
   if (!data || typeof data !== 'object' || isArray(data)) return false;

   if (typeof data.quizTitle !== 'string' || data.quizTitle.trim() === '') return false;

   if (!isArray(data.correctAnswers) || data.correctAnswers.length === 0) return false;

  if (!isArray(data.attempts) || data.attempts.length === 0) return false;

  for (const attempt of data.attempts) {
    if (!attempt || typeof attempt !== 'object' || isArray(attempt)) return false;
    if (typeof attempt.name !== 'string' || attempt.name.trim() === '') return false;
    if (!isArray(attempt.answers) || attempt.answers.length !== data.correctAnswers.length) return false;
  }

  return true;
}

export function calculateAttempt(attempt, correctAnswers) {
  let score = 0;
  for (let i = 0; i < correctAnswers.length; i++) {
    if (attempt.answers[i] === correctAnswers[i]) {
      score++;
    }
  }
  
  const percentage = Math.round((score / correctAnswers.length) * 100);
  const passed = percentage >= PASSING_PERCENTAGE;

  return {
    name: attempt.name.trim(),
    score: score,
    percentage: percentage,
    passed: passed
  };
}

export function calculateReport(data) {
  const attempts = data.attempts.map(attempt => calculateAttempt(attempt, data.correctAnswers));
  
  let totalPercentage = 0;
  let passedCount = 0;
  let best = attempts[0];

  for (const attempt of attempts) {
    totalPercentage += attempt.percentage;
    if (attempt.passed) passedCount++;
    
    if (attempt.score > best.score) {
      best = attempt;
    }
  }

  const averagePercentage = Math.round(totalPercentage / attempts.length);

  return {
    quizTitle: data.quizTitle.trim(),
    questionCount: data.correctAnswers.length,
    participantCount: data.attempts.length,
    averagePercentage: averagePercentage,
    passedCount: passedCount,
    threshold: PASSING_PERCENTAGE,
    best: best,
    attempts: attempts
  };
}