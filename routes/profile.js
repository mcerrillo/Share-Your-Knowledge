var contentController = require('./content_controller.js');

//GET /profile
exports.showProfile = function(req, res){
	
	var userName = req.session.passport.user.displayName;
	var userID = req.session.passport.user.id;

	contentController.show(req,res);
};