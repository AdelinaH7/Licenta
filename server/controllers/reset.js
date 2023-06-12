const connection = require("../models").connection;

const controller = {
  reset: (req, res) => {
    connection
      .sync({ force: true })
      .then(() => {
        res
          .status(201)
          .send({ message: "The database has been successfully reset!" });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send({
          message: "The database reset has failed! Check the console!",
        });
      });
  },
};

module.exports = controller;
