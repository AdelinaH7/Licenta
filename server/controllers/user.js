UserDb = require("../models").User;

const controller = {
  login: (req, res) => {
    UserDb.findOne({
      where: { email: req.body.email, password: req.body.password },
    })
      .then((user) => {
        if (user !== null) {
          res.status(200).send({
            message: "Successfully login",
            login: true,
            user,
          });
        } else {
          res.status(401).send({
            message: "Wrong Credentials",
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500).send({ message: "Server error!" });
      });
  },

  getAllUsers: async (req, res) => {
    try {
      let users = await UserDb.findAll();
      if (!users.length) throw new Error("Empty");
      res.status(200).send(users);
    } catch (err) {
      if (err.message) res.status(404).send("Users do not exist!");
      else {
        console.log(err.message);
        res.status(500).send({ message: "Server error!" });
      }
    }
  },

  getUserById: async (req, res) => {
    const id = req.params.id;

    try {
      let user = await UserDb.findByPk(id);
      if (!user) throw new Error("Empty");

      res.status(200).send(user);
    } catch (err) {
      if (err.message === "Empty")
        res.status(404).send({ message: `User with id: ${id} no not exist!` });
      else {
        console.log(err.message);
        res.status(500).send({ message: "Server error!" });
      }
    }
  },

  createUser: async (req, res) => {
    try {
      const user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        birthday: req.body.birthday,
        picture: req.body.pictureName,
      };

      for (let camp in user) {
        if (user[camp] === undefined) {
          throw new Error("undefined");
        }
      }

      let new_user = await UserDb.create(user);
      res.status(200).send(new_user);
    } catch (err) {
      if (err.message === "undefined")
        res
          .status(400)
          .send({ message: "One or more fields have not been entered!" });
      else {
        console.log(err.message);
        res.status(500).send({ message: "Server error!" });
      }
    }
  },

  updateUser: async (req, res) => {
    try {
      const user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        birthday: req.body.birthday,
        picture: req.body.picture,
      };
      const userId = req.params.id;

      let current_user = await UserDb.findByPk(userId);
      if (current_user) {
        current_user.set(user);
        await current_user.save();
      } else {
        throw new Error("Don't exist!");
      }
      res.status(200).send(`User updated!`);
    } catch (err) {
      if (err.message === "Don't exist!")
        res.status(404).send({ message: `User don't exist` });
      else res.status(500).send({ message: "Server error!" });
    }
  },

  deleteUser: async (req, res) => {
    const id = req.params.id;
    try {
      if (!id) throw new Error("undefined");
      let user = await UserDb.findByPk(id);
      if (!user) throw new Error("Does not exist!");
      let old_user = await user.destroy();
      res.status(205).send(old_user);
    } catch (err) {
      if (err.message === "undefined")
        res.status(400).send({ message: "Insert an id" });
      else if (err.message === "does not exist") {
        res
          .status(404)
          .send({ message: `User with id: ${id} does not exist!` });
      } else {
        console.log(err.message);
        res.status(500).send({ message: "Server error!" });
      }
    }
  },
};

module.exports = controller;
