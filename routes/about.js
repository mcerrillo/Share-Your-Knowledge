/*
 * GET about page.
 */
 
exports.show = function(req, res, next) {
    res.render('index',{ render_body: 'about' });
};