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
    isFavourite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      onDelete: "cascade",
      onUpdate: "cascade", // Assuming the default value is false when a movie is not marked as favorite
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: false,
      onDelete: "cascade",
      onUpdate: "cascade",
    },
  });
  return juncMovie;
};
