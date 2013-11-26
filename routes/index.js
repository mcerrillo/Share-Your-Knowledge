
var contentController = require('./content_controller.js');

/*
 * GET home page.
 */

exports.index = function(req, res){
	contentController.showPublic(req,res);
};