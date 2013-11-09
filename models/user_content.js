module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserContent',
      { userID: {
            type: DataTypes.STRING,
        },
        contentName: {
            type: DataTypes.STRING,
        },
        content: {
            type: DataTypes.BIGINT,
        }
    });
}