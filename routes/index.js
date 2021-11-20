const router = require("express").Router();
const openSea = require("../api/opensea");

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
  // res.send(nft);
  res.render("quiz", {nft});
});

router.get("/profile", loginCheck(), (req, res, next) => {
  // with basic-auth: req.session.user
  const loggedInUser = req.user;

  res.send("profile");
  // res.render("profile", { user: loggedInUser });
});

module.exports = router;
