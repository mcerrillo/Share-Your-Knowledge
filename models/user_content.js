module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserContent',
      { userID: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.STRING,
        },
        path: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
        }
    });
}