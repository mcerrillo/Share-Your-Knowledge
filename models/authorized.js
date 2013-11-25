module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Authorized',
      { contentID: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: { msg: "Field contentID cannot be empty" }
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