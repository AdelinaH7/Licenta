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
  });
  return juncShow;
};
