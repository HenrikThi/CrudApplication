const axios = require("axios");
const shuffle = require("shuffle-array");
const { decode } = require("html-entities");

async function getQuiz(number = 2, difficulty = "easy") {
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

function getQuizByPrice(nftPrice) {
  console.log(nftPrice);
  if (nftPrice < 2500) {
    return getQuiz(2, "easy");
  }
  if (nftPrice < 5000) {
    return getQuiz(3, "easy");
  }
  if (nftPrice < 10000) {
    return getQuiz(2, "medium");
  }
  if (nftPrice < 15000) {
    return getQuiz(3, "medium");
  }
  if (nftPrice < 20000) {
    return getQuiz(2, "hard");
  }
  if (nftPrice < 50000) {
    return getQuiz(3, "hard");
  }
  if (nftPrice < 100000) {
    return getQuiz(4, "hard");
  }
  return getQuiz(5, "hard");
}
// getQuiz(2, "easy").then((q) => console.log(q));

module.exports = { getQuiz, getQuizByPrice };
