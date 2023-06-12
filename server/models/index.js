const Sequelize = require("sequelize");
const db = require("../config/db");

const UserModel = require("./user");
const MovieModel = require("./movie");
const ShowModel = require("./show");
const JuncMovieModel = require("./juncMovie");
const JuncShowModel = require("./juncShow");

const User = UserModel(db, Sequelize);
const Movie = MovieModel(db, Sequelize);
const Show = ShowModel(db, Sequelize);
const JuncMovie = JuncMovieModel(db, Sequelize);
const JuncShow = JuncShowModel(db, Sequelize);

//JUNC MOVIE TABLE

//One-to-many relationship between User and Movie through Junc table.
User.belongsToMany(Movie, {
  as: "UserInMovie",
  through: JuncMovie,
  foreignKey: "user_id",
});

//One-to-many relationship between Movie and User through JuncMovie table.
Movie.belongsToMany(User, {
  as: "MovieToUser",
  through: JuncMovie,
  foreignKey: "movie_id",
});

//Many-to-many relationship link
JuncMovie.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "user_id",
  as: "user",
});
JuncMovie.belongsTo(Movie, {
  foreignKey: "movie_id",
  targetKey: "movie_id",
  as: "movie",
});

//JUNC SHOW TABLE

//One-to-many relationship between User and Show through JuncShow table.
User.belongsToMany(Show, {
  as: "UserInShow",
  through: JuncShow,
  foreignKey: "user_id",
});

//One-to-many relationship between Show and User through JuncShow table.
Show.belongsToMany(User, {
  as: "ShowToUser",
  through: JuncShow,
  foreignKey: "show_id",
});

//Many-to-many relationship link
JuncShow.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "user_id",
  as: "user",
});
JuncShow.belongsTo(Show, {
  foreignKey: "show_id",
  targetKey: "show_id",
  as: "show",
});
module.exports = { User, Movie, Show, JuncMovie, JuncShow, connection: db };
