const MovieDb = require("../models").Movie;

const controller = {
  getAllMovies: async (req, res) => {
    try {
      let movies = await MovieDb.findAll();
      if (!movies.length) throw new Error("Empty!");

      res.status(200).send(movies);
    } catch (err) {
      if (err.message === "Empty!")
        res.status(404).send({ message: "Movies don't exist!" });
      else {
        res.status(500).send({ message: "Server error!" });
      }
    }
  },

  getMovieById: async (req, res) => {
    const id = req.params.id;

    try {
      let movie = await MovieDb.findByPk(id);
      if (!movie) throw new Error("Empty!");

      res.status(200).send(movie);
    } catch (err) {
      if (err.message === "Empty!")
        res
          .status(404)
          .send({ message: `Movie with id: ${id} does not exist!` });
      else {
        res.status(500).send({ message: "Server error!" });
      }
    }
  },

  createMovie: async (req, res) => {
    try {
      const movie = {
        name: req.body.name,
        genre: req.body.genre,
        releaseDate: req.body.releaseDate,
        duration: req.body.duration,
        synopsis: req.body.synopsis,
        picture: req.body.pictureName,
      };
      for (let camp in movie) {
        if (movie[camp] === undefined) {
          throw new Error("undefined");
        }
      }
      let new_movie = await MovieDb.create(movie);
      res.status(200).send(new_movie);
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

  deleteMovie: async (req, res) => {
    const id = req.params.id;

    try {
      if (!id) throw new Error("undefined");

      let movie = await MovieDb.findByPk(id);
      if (!movie) throw new Error("Don't exist!");

      let old_movie = await movie.destroy();
      res.status(205).send(old_movie);
    } catch (err) {
      if (err.message === "undefined")
        res.status(404).send({ message: "Put an id" });
      else if (err.message === "Don't exist!") {
        res.status(404).send({ message: `Movie with id:${id} don't exist` });
      } else {
        res.status(500).send({ message: "Server error!" });
      }
    }
  },
};

module.exports = controller;
