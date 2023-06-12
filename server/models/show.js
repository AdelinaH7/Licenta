module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "show",
    {
      show_id: {
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
      episodes: {
        type: DataTypes.INTEGER,
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
      tableName: "show",
    }
  );
};
