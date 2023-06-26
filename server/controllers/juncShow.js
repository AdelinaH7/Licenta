const UserDb = require("../models").User;
const ShowDb = require("../models").Show;
const JuncShowDb = require("../models").JuncShow;

const controller = {
  getAllJuncsShow: async (req, res) => {
    try {
      let shows = await JuncShowDb.findAll();
      if (!shows.length) throw new Error("Empty");

      res.status(200).send(shows);
    } catch (err) {
      if (err.message === "Empty")
        res
          .status(404)
          .send({ message: "No users added any shows to their list" });
      else {
        res.status(500).send({ message: "Server error!" });
      }
    }
  },

  getJuncShowById: async (req, res) => {
    const ids = {
      user_id: req.body.user.user_id,
      show_id: req.params.show_id,
    };

    try {
      if (ids.user_id === undefined || ids.show_id === undefined)
        throw new Error("undefined");

      let show = await JuncShowDb.findOne({
        where: {
          user_id: ids.user_id,
          show_id: ids.show_id,
        },
      });
      if (!show) throw new Error("Empty");

      res.status(200).send(show);
    } catch (err) {
      if (err.message === "undefined")
        res.status(400).send({ message: "One or both IDs are not specified." });
      else if (err.message == "Empty")
        res.status(404).send({
          message: `The user with ID${ids.user_id} has not added the show with ID${ids.show_id} to the list`,
        });
      else res.status(500).send({ message: "Server error!" });
    }
  },

  getAllUsersOfShow: async (req, res) => {
    const show_id = req.params.id;

    try {
      if (!show_id) throw new Error("undefined");

      let show = await ShowDb.findByPk(show_id);
      if (!show) throw new Error("Empty");

      let juncsShow = await JuncShowDb.findAll({
        where: { show_id: show_id },
      });

      if (!juncsShow.length) throw new Error("Zero instances for the juncShow");

      let users_id = juncsShow.map((juncshow) => juncshow.user_id);

      let users = await UserDb.findAll();
      if (!users.length) throw new Error("No users");

      let filtered_users = users.filter((user) =>
        users_id.includes(user.user_id)
      );
      res.status(200).send(filtered_users);
    } catch (err) {
      if (err.message === "undefined")
        res.status(400).send({ message: "The ID for the show is not entered" });
      else if (err.message === "Empty")
        res.status(404).send({ message: `Show ID${show_id} does not exist!` });
      else if (err.message === "Zero instances for the juncShow")
        res.status(404).send({ message: `Show id${show_id} has no users` });
      else if (err.message === "No users")
        res.status(404).send({ message: "No user found" });
      else res.status(500).send({ message: "Server error!" });
    }
  },

  getAllShowsOfUser: async (req, res) => {
    const user_id = req.params.user_id; // Retrieve user ID from route parameters

    try {
      if (!user_id) throw new Error("undefined");
      let user = await UserDb.findByPk(user_id);
      if (!user) throw new Error("Empty");

      let juncsShow = await JuncShowDb.findAll({
        where: { user_id: user_id },
      });
      if (!juncsShow.length) throw new Error("Zero instances for the juncShow");

      let shows_id = juncsShow.map((juncShow) => juncShow.show_id);

      let shows = await ShowDb.findAll();
      if (!shows.length) throw new Error("No shows");

      let filtered_shows = shows.filter((show) =>
        shows_id.includes(show.show_id)
      );
      res.status(200).send(filtered_shows);
    } catch (err) {
      if (err.message === "undefined")
        res.status(404).send({ message: "The ID for the user is not entered" });
      else if (err.message === "Empty")
        res.status(404).send({ message: `User ID${user_id} does not exist!` });
      else if (err.message === "Zero instances for the juncShow")
        res.status(404).send({ message: `User id${user_id} has no shows` });
      else if (err.message === "No shows")
        res.status(404).send({ message: "No show found" });
      else res.status(500).send({ message: "Server error!" });
    }
  },

  createJuncShow: async (req, res) => {
    const juncShow = {
      user_id: req.body.user.user_id,
      show_id: req.params.id,
    };

    try {
      if (juncShow.user_id === undefined || juncShow.show_id === undefined)
        throw new Error(undefined);

      let user = await UserDb.findByPk(juncShow.user_id);
      if (!user) throw new Error("Empty user");

      let show = await ShowDb.findByPk(juncShow.show_id);
      if (!show) throw new Error("Empty show");

      let link = await JuncShowDb.create(juncShow);

      res.status(200).send(link);
    } catch (err) {
      if (err.message === "undefined")
        res
          .status(400)
          .send({ message: "One or both of the IDs has not been entered" });
      else if (err.message === "Empty user")
        res
          .status(404)
          .send({ message: `User ID${juncShow.user_id} does not exist!` });
      else if (err.message === "Empty Show")
        res
          .status(404)
          .send({ message: `Show ID${juncShow.show_id} does not exist!` });
      else if (err.message === "Validation error")
        res.status(400).send({
          message: `User ID${juncShow.user_id} has already added the show ID${juncShow.show_id}`,
        });
      else res.status(500).send({ message: "Server error!" });
    }
  },

  updateJuncShow: async (req, res) => {
    const ids = {
      user_id: req.params.user_id,
      show_id: req.params.show_id,
    };

    try {
      if (ids.user_id === undefined || ids.show_id === undefined)
        throw new Error("undefined");

      const juncShow = await JuncShowDb.findOne({
        where: {
          user_id: ids.user_id,
          show_id: ids.show_id,
        },
      });

      if (!juncShow) throw new Error("Empty");

      juncShow.isFavourite = true;

      await juncShow.save();

      res.status(200).send({
        message: "The show has been marked as favorite.",
        juncShow,
      });
    } catch (err) {
      if (err.message === "undefined") {
        res
          .status(400)
          .send({ message: "One or both of the IDs has not been entered" });
      } else if (err.message === "Empty") {
        res.status(404).send({
          message: `User ${ids.user_id} has no film added with ID ${ids.show_id}`,
        });
      } else {
        res.status(500).send({ message: "Server error!" });
      }
    }
  },

  updateJuncShowScore: async (req, res) => {
    const ids = {
      user_id: req.params.user_id,
      show_id: req.params.show_id,
    };

    try {
      if (ids.user_id === undefined || ids.show_id === undefined)
        throw new Error("undefined");

      const juncShow = await JuncShowDb.findOne({
        where: {
          user_id: ids.user_id,
          show_id: ids.show_id,
        },
      });

      if (!juncShow) throw new Error("Empty");

      // Update the score field based on the user's input
      const { score } = req.body;
      if (score === undefined) throw new Error("Score is not specified");
      juncShow.score = score;

      await juncShow.save(); // Save the changes to the database

      res.status(200).send({
        message: "The score has been updated.",
        juncShow,
      });
    } catch (err) {
      if (err.message === "undefined") {
        res
          .status(400)
          .send({ message: "One or both of the IDs has not been entered" });
      } else if (err.message === "Empty") {
        res.status(404).send({
          message: `User ${ids.user_id} has no film added with ID ${ids.show_id}`,
        });
      } else if (err.message === "Score is not specified") {
        res.status(400).send({ message: "Score is not specified" });
      } else {
        res.status(500).send({ message: "Server error!" });
      }
    }
  },

  updateJuncShowScore: async (req, res) => {
    const ids = {
      user_id: req.params.user_id,
      show_id: req.params.show_id,
    };

    try {
      if (ids.user_id === undefined || ids.show_id === undefined)
        throw new Error("undefined");

      const juncShow = await JuncShowDb.findOne({
        where: {
          user_id: ids.user_id,
          show_id: ids.show_id,
        },
      });

      if (!juncShow) throw new Error("Empty");

      // Update the score field based on the user's input
      const { score } = req.body;
      if (score === undefined) throw new Error("Score is not specified");
      juncShow.score = score;

      await juncShow.save(); // Save the changes to the database

      res.status(200).send({
        message: "The score has been updated.",
        juncShow,
      });
    } catch (err) {
      if (err.message === "undefined") {
        res
          .status(400)
          .send({ message: "One or both of the IDs have not been entered" });
      } else if (err.message === "Empty") {
        res.status(404).send({
          message: `User ${ids.user_id} has no show added with ID ${ids.show_id}`,
        });
      } else if (err.message === "Score is not specified") {
        res.status(400).send({ message: "Score is not specified" });
      } else {
        res.status(500).send({ message: "Server error!" });
      }
    }
  },

  deleteJuncShow: async (req, res) => {
    const ids = {
      user_id: req.params.user_id,
      show_id: req.params.show_id,
    };

    try {
      if (ids.user_id === undefined || ids.show_id === undefined)
        throw new Error("undefined");

      let juncShow = await JuncShowDb.findOne({
        where: {
          user_id: ids.user_id,
          show_id: ids.show_id,
        },
      });
      if (!juncShow) throw new Error("Empty");

      let old_juncShow = await juncShow.destroy();
      res.status(200).send({
        message: "The connection has been successfully deleted!",
        link: old_juncShow,
      });
    } catch (err) {
      if (err.message === "undefined")
        res
          .status(400)
          .send({ message: "One or both of the IDs has not been entered" });
      else if (err.message === "Empty")
        res.status(404).send({
          message: `User ${ids.user_id} has no film added with ID ${ids.show_id}`,
        });
      else res.status(500).send({ message: "Server error!" });
    }
  },
};

module.exports = controller;
