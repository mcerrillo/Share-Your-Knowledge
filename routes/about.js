/*
 * GET about page.
 */
 
exports.show = function(req, res, next) {
	if(req.session.passport.user){
		res.render('index',{ render_body: 'about', userName: req.session.passport.user.displayName, fl: req.flash()});
	}else{
		res.render('index',{ render_body: 'about', userName: undefined, fl: req.flash()});
	}
    
};