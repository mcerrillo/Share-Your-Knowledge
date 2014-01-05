var path = require('path');
var Sequelize = require('sequelize');

var sequelize = new Sequelize(process.env.DATABASE_NAME, 
                              process.env.DATABASE_USER, 
                              process.env.DATABASE_PASSWORD, 
					            { dialect: process.env.DATABASE_DIALECT, 
					              protocol: process.env.DATABASE_PROTOCOL, 
					              port: process.env.DATABASE_PORT,
					              host: process.env.DATABASE_HOST,
					              storage: process.env.DATABASE_STORAGE,
					              omitNull: true
					          	});

var User        = sequelize.import(path.join(__dirname,'user'));
var UserContent = sequelize.import(path.join(__dirname,'user_content'));
var Authorized = sequelize.import(path.join(__dirname,'authorized'));

//Relations
User.hasMany(UserContent,{foreignKey: 'userID'});
UserContent.belongsTo(User, {foreignKey: 'userID'});
UserContent.hasMany(Authorized,{as: 'content', foreignKey: 'contentID'});
Authorized.belongsTo(UserContent, {as: 'content', foreignKey: 'contentID'});

exports.User = User;
exports.UserContent = UserContent;
exports.Authorized = Authorized;
exports.Sequelize = sequelize;
sequelize.sync();