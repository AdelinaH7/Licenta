module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "movie",
    {
      movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      releaseDate: {
        type: DataTypes.DATEONLY,
        validate: {
          notEmpty: true,
          isDate: true,
        },
      },
      duration: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      synopsis: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      picture: {
        type: DataTypes.BLOB,
        allowNull: true,
      },
    },
    {
      tableName: "movie",
    }
  );
};
