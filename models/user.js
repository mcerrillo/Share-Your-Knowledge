module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User',
      { userID: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: { msg: "Field userID cannot be empty" }
            }
        },
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: { msg: "Field name cannot be empty" }
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: { msg: "Incorrect email format" }
            }
        }
    });
}