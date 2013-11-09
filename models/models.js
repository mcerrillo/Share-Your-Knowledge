var path = require('path');
var Sequelize = require('sequelize-sqlite').sequelize;
var sqlite = require('sequelize-sqlite').sqlite;

var sequelize = new Sequelize('users', 'username', 'password', {
  dialect: 'sqlite',
  storage: 'users.sqlite'
})

var User = sequelize.import(path.join(__dirname,'user'));

exports.User = User;
sequelize.sync();