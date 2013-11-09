var path = require('path');
var Sequelize = require('sequelize-sqlite').sequelize;
var sqlite = require('sequelize-sqlite').sqlite;

var sequelize = new Sequelize('users', 'username', 'password', {
  dialect: 'sqlite',
  storage: 'users.sqlite'
})

var User        = sequelize.import(path.join(__dirname,'user'));
var UserContent = sequelize.import(path.join(__dirname,'user_content'));

//Relations
User.hasMany(UserContent,{foreignKey: 'userID'});
UserContent.belongsTo(User, {foreignKey: 'userID'});


exports.User = User;
exports.UserContent = UserContent;
sequelize.sync();