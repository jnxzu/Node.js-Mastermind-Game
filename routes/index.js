const express = require("express");
const router = new express.Router();

const uuid = require("uuidv4").uuid;
const rM = require("./rateMove");

const User = require("../model");

// Passport.js i narzędzie do szyfrowania haseł
const passport = require("../passport");

// „wyłapywanie”  odwołań nieobsługiwanymi metodami HTTP
const rejectMethod = (_req, res, _next) => {
  // Method Not Allowed
  res.sendStatus(405);
};

router
  .route("/")
  .get((req, res) => {
    res.render("index", {
      isAuthenticated: req.isAuthenticated(),
      user: req.user,
    });
  })
  .all(rejectMethod);

router
  .route("/login")
  .get((req, res) => {
    if (req.isAuthenticated()) res.redirect("/");
    else res.render("login");
  })
  .post(passport.authenticate("local-login"), async (req, res) => {
    await res.redirect("/");
  })
  .all(rejectMethod);

router
  .route("/logout")
  .get((req, res) => {
    req.logout();
    res.redirect("/");
  })
  .all(rejectMethod);

router
  .route("/register")
  .get((req, res) => {
    if (req.isAuthenticated()) res.redirect("/");
    else res.render("register");
  })
  .post(passport.authenticate("local-signup"), async (req, res) => {
    await res.redirect("/");
  })
  .all(rejectMethod);

router
  .route("/game")
  .get((req, res) => {
    if (!req.isAuthenticated()) res.redirect("/");
    else res.render("game");
  })
  .post((req, res) => {
    let params = req.body;
    req.session.id = uuid();
    let answer = "";
    let rated = [];
    for (let i = 0; i < params.size; i++) {
      answer += getRandomInt(params.dim).toString();
      rated[i] = false;
    }
    req.session.answer = answer;
    req.session.rated = rated;
    res.json({
      msg: "nowa gra",
      params,
    });
  })
  .patch((req, res) => {
    let values = rM.rateMove(
      req.body.guess,
      req.session.rated,
      req.session.answer
    );
    req.session.rated = values[0];
    let win = values[0].every((x) => x === true);
    if (req.body.movesleft - 1 === 0 || win) {
      let thisgame = {
        win: win,
        black: req.body.black + values[1],
        white: req.body.white + values[2],
      };
      User.findOneAndUpdate(
        { username: req.user.username },
        { $push: { gamehistory: thisgame } },
        () => {}
      );
    }
    res.json({ black: values[1], white: values[2] });
  });

function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

module.exports = router;
