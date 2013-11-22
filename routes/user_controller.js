var models = require('../models/models.js');


// After login
exports.login = function(req, res, next) {
    
    var user = models.User.build(
        { userID: req.session.passport.user.id,
          name:  req.session.passport.user.displayName
        });
    
    // El login debe ser unico:
    models.User.find({where: {userID: req.session.passport.user.id}})
        .success(function(existing_user) {
            if (existing_user) {
                res.redirect('/');
                return;
            } else {                
                user.save()
                    .success(function() {
                        res.redirect('/');
                    })
                    .error(function(error) {
                        next(error);
                    });
            }
        })
        .error(function(error) {
            next(error);
        });

};