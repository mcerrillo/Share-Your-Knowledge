var path = require('path');
var Sequelize = require('sequelize-sqlite').sequelize;
var sqlite = require('sequelize-sqlite').sqlite;

var sequelize = new Sequelize('mainDB', 'username', 'password', {
  dialect: 'sqlite',
  storage: 'mainDB.sqlite'
})

var User        = sequelize.import(path.join(__dirname,'user'));
var UserContent = sequelize.import(path.join(__dirname,'user_content'));
var Authorized = sequelize.import(path.join(__dirname,'authorized'));

//Relations
User.hasMany(UserContent,{foreignKey: 'userID'});
UserContent.belongsTo(User, {foreignKey: 'userID'});
UserContent.hasOne(Authorized,{foreignKey: 'contentID'});
Authorized.belongsTo(UserContent, {foreignKey: 'contentID'});

exports.User = User;
exports.UserContent = UserContent;
exports.Authorized = Authorized;
sequelize.sync();