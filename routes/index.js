
/*
 * GET home page.
 */

exports.index = function(req, res){
	
	if(req.session.passport.user){
		res.render('index',{ render_body: 'main', userName: req.session.passport.user.displayName });
	}else{
		res.render('index',{ render_body: 'main', userName: undefined});
	}
  
};