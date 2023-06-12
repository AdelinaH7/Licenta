const express = require("express");
const router = express.Router();

const resetRouter = require("./reset");
const userRouter = require("./user");
const movieRouter = require("./movie");
const showRouter = require("./show");
const juncMovieRouter = require("./juncMovie");
const juncShowRouter = require("./juncShow");
const uploadRouter = require("./upload");

router.use("/reset", resetRouter);
router.use("/user", userRouter);
router.use("/movie", movieRouter);
router.use("/show", showRouter);
router.use("/juncMovie", juncMovieRouter);
router.use("/juncShow", juncShowRouter);
router.use("/upload", uploadRouter);

module.exports = router;
