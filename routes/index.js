"use strict";

// Sugestia – funkcję oceniającą ruchy najlepiej
// umieścić w osobnym module, a poniżej jedynie z niej
// skorzystać.

const express = require("express");
const router = express.Router();

router.route("/")
    .post((req, res) => {
        let params = req.body;
        // tworzymy nową grę
        res.json({
            msg: "nowa gra",
            params
        });
    })
    .patch((req, res) => {
        let ruch = req.body;
        // oceniamy ruch
        res.json({
            msg: "ocena ruchu",
            ruch
        });
    });

module.exports = router;
