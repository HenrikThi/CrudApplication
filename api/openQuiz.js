const axios = require("axios");
var shuffle = require("shuffle-array");

async function getQuiz() {
  const reqUrl = `https://opentdb.com/api.php?amount=10&type=multiple`;
  const res = await axios.get(reqUrl);

  const questions = res.data.results;
  const correctAnswers = questions.map((q) => q.correct_answer);

  questions.forEach((q) => {
    q.answers = shuffle([...q.incorrect_answers, q.correct_answer]);
    delete q.incorrect_answers;
    delete q.correct_answer;
  });

  return questions;
}

getQuiz().then((q) => console.log(q[0]));

// console.log(shuffle([1,2,3,4]))
