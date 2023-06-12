module.exports = (sequelize, DataTypes) => {
  const juncMovie = sequelize.define("juncMovie", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "user",
        key: "user_id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    },

    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "movie",
        key: "movie_id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    },
  });
  return juncMovie;
};
