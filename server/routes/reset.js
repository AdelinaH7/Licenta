const express = require("express");
const router = express.Router();
const resetController = require("../controllers").reset;

router.get("/", resetController.reset);

module.exports = router;
