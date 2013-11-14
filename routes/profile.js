var contentController = require('./content_controller.js');

//GET /profile
exports.showProfile = function(req, res){
	contentController.show(req,res);

	//res.render('index',{ render_body: 'profile', userName: req.session.passport.user.displayName });
};

//GET /file_upload
exports.uploadFile = function(req, res){
	
	res.render('index',{ render_body: 'upload', userName: req.session.passport.user.displayName });
};