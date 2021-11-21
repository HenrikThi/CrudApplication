const router = require("express").Router();
const openSea = require("../api/opensea");
const openQuiz = require("../api/openQuiz");
const User = require("../models/User.model");
const Nft = require("../models/Nft.model");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const loginCheck = () => {
  return (req, res, next) => {
    // with basic-auth: req.session.user
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/login");
    }
  };
};

router.get("/quiz", loginCheck(), async (req, res, next) => {
  const nft = await openSea.getRandomNft();
  const quiz = await openQuiz.getQuiz(2, "easy");
  console.log(quiz.answers);

  req.session.nft = nft;
  req.session.quiz = quiz;

  const lastAnswerWasCorrect = req.session.wasCorrect === true;
  const lastAnswerWasWrong = req.session.wasCorrect === false;
  req.session.wasCorrect = null;

  res.render("quiz", {
    nft,
    questions: quiz.questions,
    lastAnswerWasCorrect,
    lastAnswerWasWrong,
  });
});

router.get("/profile", loginCheck(), async (req, res, next) => {
  const loggedInUser = await User.findById(req.user._id).populate("nfts");

  // res.send("profile");
  res.render("profile", { user: loggedInUser });
});

router.post("/quiz", loginCheck(), async (req, res, next) => {
  const answers = Object.values(req.body);
  const quiz = req.session.quiz;
  const nft = req.session.nft;
  req.session.quiz = null;
  req.session.nft = null;

  let correct = true;
  if (answers.length !== quiz.questions.length) {
    correct = false;
    console.log("wrong length");
  }

  for (let answer of answers) {
    if (!quiz.answers.includes(answer)) {
      correct = false;
      console.log("wrong answer", answer);
    }
  }

  if (correct) {
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { nfts: nft._id } },
      { new: true }
    );
  }

  req.session.wasCorrect = correct;
  // res.send({ quiz, answers, correct, user: req.user });
  res.redirect("/quiz");
});

router.post("/nfts/:id/delete", async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { nfts: req.params.id } },
    { new: true }
  );
  res.redirect(`/collections/${req.user.id}`);
});

router.post("/users/:id", async (req, res, next) => {
  const { collectionName } = req.body;
  await User.findByIdAndUpdate(
    req.params.id,
    { collectionName },
    { new: true }
  );
  res.redirect("/profile");
});

module.exports = router;
