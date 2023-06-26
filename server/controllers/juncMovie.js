const UserDb = require("../models").User;
const MovieDb = require("../models").Movie;
const JuncMovieDb = require("../models").JuncMovie;

const controller = {
  getAllJuncsMovie: async (req, res) => {
    try {
      let movies = await JuncMovieDb.findAll();
      if (!movies.length) throw new Error("Empty");

      res.status(200).send(movies);
    } catch (err) {
      if (err.message === "Empty")
        res
          .status(404)
          .send({ message: "No users added any movies to their list" });
      else {
        res.status(500).send({ message: "Server error!" });
      }
    }
  },

  getJuncMovieById: async (req, res) => {
    const ids = {
      user_id: req.body.user.user_id,
      movie_id: req.params.movie_id,
    };

    try {
      if (ids.user_id === undefined || ids.movie_id === undefined)
        throw new Error("undefined");

      let movie = await JuncMovieDb.findOne({
        where: {
          user_id: ids.user_id,
          movie_id: ids.movie_id,
        },
      });
      if (!movie) throw new Error("Empty");

      res.status(200).send(movie);
    } catch (err) {
      if (err.message === "undefined")
        res.status(400).send({ message: "One or both IDs are not specified." });
      else if (err.message == "Empty")
        res.status(404).send({
          message: `The user with ID${ids.user_id} has not added the movie with ID${ids.movie_id} to the list`,
        });
      else res.status(500).send({ message: "Server error!" });
    }
  },

  getAllUsersOfMovie: async (req, res) => {
    const movie_id = req.params.id;

    try {
      if (!movie_id) throw new Error("undefined");

      let movie = await MovieDb.findByPk(movie_id);
      if (!movie) throw new Error("Empty");

      let juncsMovie = await JuncMovieDb.findAll({
        where: { movie_id: movie_id },
      });

      if (!juncsMovie.length)
        throw new Error("Zero instances for the juncMovie");

      let users_id = juncsMovie.map((juncmovie) => juncmovie.user_id);

      let users = await UserDb.findAll();
      if (!users.length) throw new Error("No users");

      let filtered_users = users.filter((user) =>
        users_id.includes(user.user_id)
      );
      res.status(200).send(filtered_users);
    } catch (err) {
      if (err.message === "undefined")
        res
          .status(400)
          .send({ message: "The ID for the movie is not entered" });
      else if (err.message === "Empty")
        res
          .status(404)
          .send({ message: `Movie ID${movie_id} does not exist!` });
      else if (err.message === "Zero instances for the juncMovie")
        res.status(404).send({ message: `Movie id${movie_id} has no users` });
      else if (err.message === "No users")
        res.status(404).send({ message: "No user found" });
      else res.status(500).send({ message: "Server error!" });
    }
  },

  getAllMoviesOfUser: async (req, res) => {
    const user_id = req.params.user_id;

    try {
      if (!user_id) throw new Error("undefined");
      let user = await UserDb.findByPk(user_id);
      if (!user) throw new Error("Empty");

      let juncsMovie = await JuncMovieDb.findAll({
        where: { user_id: user_id },
      });
      if (!juncsMovie.length)
        throw new Error("Zero instances for the juncMovie");

      let movies_id = juncsMovie.map((juncMovie) => juncMovie.movie_id);

      let movies = await MovieDb.findAll();
      if (!movies.length) throw new Error("No movies");

      let filtered_movies = movies.filter((movie) =>
        movies_id.includes(movie.movie_id)
      );
      res.status(200).send(filtered_movies);
    } catch (err) {
      if (err.message === "undefined")
        res.status(404).send({ message: "The ID for the user is not entered" });
      else if (err.message === "Empty")
        res.status(404).send({ message: `User ID ${user_id} does not exist!` });
      else if (err.message === "Zero instances for the juncMovie")
        res.status(404).send({ message: `User ID ${user_id} has no movies` });
      else if (err.message === "No movies")
        res.status(404).send({ message: "No movie found" });
      else res.status(500).send({ message: "Server error!" });
    }
  },

  createJuncMovie: async (req, res) => {
    const juncMovie = {
      user_id: req.body.user.user_id,
      movie_id: req.params.id,
      isFavourite: false, // Set isFavourite to false by default
    };

    try {
      if (juncMovie.user_id === undefined || juncMovie.movie_id === undefined)
        throw new Error(undefined);

      let user = await UserDb.findByPk(juncMovie.user_id);
      if (!user) throw new Error("Empty user");

      let movie = await MovieDb.findByPk(juncMovie.movie_id);
      if (!movie) throw new Error("Empty movie");

      let link = await JuncMovieDb.create(juncMovie);

      res.status(200).send(link);
    } catch (err) {
      if (err.message === "undefined")
        res
          .status(400)
          .send({ message: "One or both of the IDs has not been entered" });
      else if (err.message === "Empty user")
        res
          .status(404)
          .send({ message: `User ID${juncMovie.user_id} does not exist!` });
      else if (err.message === "Empty movie")
        res
          .status(404)
          .send({ message: `Movie ID${juncMovie.movie_id} does not exist!` });
      else if (err.message === "Validation error")
        res.status(400).send({
          message: `User ID${juncMovie.user_id} has already added the movie ID${juncMovie.movie_id}`,
        });
      else res.status(500).send({ message: "Server error!" });
    }
  },

  updateJuncMovie: async (req, res) => {
    const ids = {
      user_id: req.params.user_id,
      movie_id: req.params.movie_id,
    };

    try {
      if (ids.user_id === undefined || ids.movie_id === undefined)
        throw new Error("undefined");

      const juncMovie = await JuncMovieDb.findOne({
        where: {
          user_id: ids.user_id,
          movie_id: ids.movie_id,
        },
      });

      if (!juncMovie) throw new Error("Empty");

      // Update the isFavourite field based on the user's input
      const { isFavourite } = req.body;
      if (isFavourite === undefined)
        throw new Error("isFavourite is not specified");
      juncMovie.isFavourite = isFavourite;

      await juncMovie.save(); // Save the changes to the database

      res.status(200).send({
        message: `The movie has been ${
          isFavourite ? "marked as favourite" : "unmarked as favourite"
        }.`,
        juncMovie,
      });
    } catch (err) {
      if (err.message === "undefined") {
        res
          .status(400)
          .send({ message: "One or both of the IDs has not been entered" });
      } else if (err.message === "Empty") {
        res.status(404).send({
          message: `User ${ids.user_id} has no film added with ID ${ids.movie_id}`,
        });
      } else if (err.message === "isFavourite is not specified") {
        res.status(400).send({ message: "isFavourite is not specified" });
      } else {
        res.status(500).send({ message: "Server error!" });
      }
    }
  },

  updateJuncMovieScore: async (req, res) => {
    const ids = {
      user_id: req.params.user_id,
      movie_id: req.params.movie_id,
    };

    try {
      if (ids.user_id === undefined || ids.movie_id === undefined)
        throw new Error("undefined");

      const juncMovie = await JuncMovieDb.findOne({
        where: {
          user_id: ids.user_id,
          movie_id: ids.movie_id,
        },
      });

      if (!juncMovie) throw new Error("Empty");

      // Update the score field based on the user's input
      const { score } = req.body;
      if (score === undefined) throw new Error("Score is not specified");
      juncMovie.score = score;

      await juncMovie.save(); // Save the changes to the database

      res.status(200).send({
        message: "The score has been updated.",
        juncMovie,
      });
    } catch (err) {
      if (err.message === "undefined") {
        res
          .status(400)
          .send({ message: "One or both of the IDs has not been entered" });
      } else if (err.message === "Empty") {
        res.status(404).send({
          message: `User ${ids.user_id} has no film added with ID ${ids.movie_id}`,
        });
      } else if (err.message === "Score is not specified") {
        res.status(400).send({ message: "Score is not specified" });
      } else {
        res.status(500).send({ message: "Server error!" });
      }
    }
  },

  deleteJuncMovie: async (req, res) => {
    const ids = {
      user_id: req.params.user_id,
      movie_id: req.params.movie_id,
    };

    try {
      if (ids.user_id === undefined || ids.movie_id === undefined)
        throw new Error("undefined");

      let juncMovie = await JuncMovieDb.findOne({
        where: {
          user_id: ids.user_id,
          movie_id: ids.movie_id,
        },
      });
      if (!juncMovie) throw new Error("Empty");

      let old_juncMovie = await juncMovie.destroy();
      res.status(200).send({
        message: "The connection has been successfully deleted!",
        link: old_juncMovie,
      });
    } catch (err) {
      if (err.message === "undefined")
        res
          .status(400)
          .send({ message: "One or both of the IDs has not been entered" });
      else if (err.message === "Empty")
        res.status(404).send({
          message: `User ${ids.user_id} has no film added with ID ${ids.movie_id}`,
        });
      else res.status(500).send({ message: "Server error!" });
    }
  },
};

module.exports = controller;
