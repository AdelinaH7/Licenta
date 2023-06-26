module.exports = (sequelize, DataTypes) => {
  const juncShow = sequelize.define("juncShow", {
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

    show_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "show",
        key: "show_id",
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
  return juncShow;
};
