
/*
 * GET home page.
 */

exports.index = function(req, res){
	if(req.user){
		res.render('index',{ render_body: 'main', userName: req.user.name});
	}else{
		res.render('index',{ render_body: 'main', userName: undefined});
	}
  
};