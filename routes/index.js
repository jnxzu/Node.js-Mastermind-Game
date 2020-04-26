"use strict";

// Sugestia – funkcję oceniającą ruchy najlepiej
// umieścić w osobnym module, a poniżej jedynie z niej
// skorzystać.

const express = require("express");
const router = express.Router();
const uuid = require("uuidv4").uuid;
const rM = require("./rateMove");

router
  .route("/")
  .post((req, res) => {
    let params = req.body;
    req.session.id = uuid();
    let answer = "";
    let rated = [];
    for (let i = 0; i < params.size; i++) {
      answer += getRandomInt(params.dim).toString();
      rated[i] = false;
    }
    console.log(answer);
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
    res.json({ black: values[1], white: values[2] });
  });

module.exports = router;

function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}
