const ShowDb = require("../models").Show;

const controller = {
  getAllShows: async (req, res) => {
    try {
      let shows = await ShowDb.findAll();
      if (!shows.length) throw new Error("Empty!");

      res.status(200).send(shows);
    } catch (err) {
      if (err.message === "Empty!")
        res.status(404).send({ message: "Shows don't exist!" });
      else {
        res.status(500).send({ message: "Server error!" });
      }
    }
  },

  getShowById: async (req, res) => {
    const id = req.params.id;

    try {
      let show = await ShowDb.findByPk(id);
      if (!show) throw new Error("Empty!");

      res.status(200).send(show);
    } catch (err) {
      if (err.message === "Empty!")
        res
          .status(404)
          .send({ message: `Show with id: ${id} does not exist!` });
      else {
        res.status(500).send({ message: "Server error!" });
      }
    }
  },

  createShow: async (req, res) => {
    try {
      const show = {
        name: req.body.name,
        genre: req.body.genre,
        releaseDate: req.body.releaseDate,
        episodes: req.body.episodes,
        synopsis: req.body.synopsis,
        picture: req.body.pictureName,
      };
      for (let camp in show) {
        if (show[camp] === undefined) {
          throw new Error("undefined");
        }
      }
      let new_show = await ShowDb.create(show);
      res.status(200).send(new_show);
    } catch (err) {
      if (err.message === "undefined")
        res
          .status(400)
          .send({ message: "One or more fields have not been entered!" });
      else {
        res.status(500).send({ message: "Server error!" });
      }
    }
  },

  deleteShow: async (req, res) => {
    const id = req.params.id;

    try {
      if (!id) throw new Error("undefined");

      let show = await ShowDb.findByPk(id);
      if (!show) throw new Error("Don't exist!");

      let old_show = await show.destroy();
      res.status(205).send(old_show);
    } catch (err) {
      if (err.message === "undefined")
        res.status(404).send({ message: "Put an id" });
      else if (err.message === "Don't exist!") {
        res.status(404).send({ message: `show with id:${id} don't exist` });
      } else {
        res.status(500).send({ message: "Server error!" });
      }
    }
  },
};

module.exports = controller;
