// src/services/shuffle.js
// Fisher-Yates shuffle, pulled out so both LessonPlayer (question order)
// and MultipleChoice (option order) can vary presentation without ever
// touching the underlying content data.
export function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
