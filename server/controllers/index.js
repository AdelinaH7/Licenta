const user = require("./user");
const movie = require("./movie");
const show = require("./show");
const juncMovie = require("./juncMovie");
const juncShow = require("./juncShow");
const reset = require("./reset");
const upload = require("./upload");

const controllers = {
  user,
  movie,
  show,
  juncMovie,
  juncShow,
  reset,
  upload,
};

module.exports = controllers;
