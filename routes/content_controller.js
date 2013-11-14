var models = require('../models/models.js');


exports.show = function(req, res, next) {
	models.Comment
	   .findAll({where: {userID: req.session.passport.user.id},
	             order: 'updatedAt DESC'})
	   .success(function(contents) {

	      console.log(contents);
	   })
	   .error(function(error) {
	       next(error);
	   })
};

exports.find = function(req, res, next) {

};

exports.deleteAll = function(req, res, next) {

};

exports.delete = function(req, res, next) {

};