//Create session
exports.create = function(req, res) {

    req.session.user = {id:req.user.id, name:req.user.displayName};
}; 


//Destroy session
exports.destroy = function(req, res) {
    delete req.session.user;
    res.redirect("/");     
};