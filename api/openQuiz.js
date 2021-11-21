const axios = require("axios");
const shuffle = require("shuffle-array");
const { decode } = require("html-entities");

async function getQuiz(number, difficulty) {
  const reqUrl = `https://opentdb.com/api.php?amount=${number}&difficulty=${difficulty}&type=multiple&category=18`;
  const res = await axios.get(reqUrl);

  const questions = res.data.results;

  questions.forEach((q) => {
    q.question = decode(q.question);
    q.correct_answer = decode(q.correct_answer);
    q.incorrect_answers = q.incorrect_answers.map((ia) => decode(ia));
  });

  const answers = questions.map((q) => q.correct_answer);

  questions.forEach((q) => {
    q.options = shuffle([...q.incorrect_answers, q.correct_answer]);
    delete q.incorrect_answers;
    delete q.correct_answer;
  });

  return { questions, answers };
}

// getQuiz(2, "easy").then((q) => console.log(q));

module.exports = { getQuiz };
