const router = require("express").Router();
const openSea = require("../api/opensea");
const openQuiz = require("../api/openQuiz");
const User = require("../models/User.model");
const Nft = require("../models/Nft.model");

router.get("/collections", async (req, res, next) => {
  const users = await User.find();

  res.render("collection/overview", { users });
});

router.get("/collections/:id", async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("nfts");
  const isOwner = req.user.id === req.params.id;
  console.log(isOwner)

  user.nfts.forEach(nft => nft.collectionDescription = nft.collectionDescription?.slice(0, 160))

  res.render("collection/collection", { user, isOwner });
});

module.exports = router;
