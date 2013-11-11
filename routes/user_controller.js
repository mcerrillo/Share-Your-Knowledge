var models = require('../models/models.js');

// GET /users
exports.index = function(req, res, next) {

    models.User
        .findAll({order: 'name'})
        .success(function(users) {
            res.render('users/index', {
                users: users
            });
        })
        .error(function(error) {
            next(error);
        });
};

// After login
exports.login = function(req, res, next) {
    var user = models.User.build(
        { userID: user.id,
          name:  user.displayName
        });
    
    // El login debe ser unico:
    models.User.find({where: {userID: req.user.id}})
        .success(function(existing_user) {
            if (existing_user) {
                console.log("El usuario \""+ req.user.id +"\" ya existe");
                res.redirect('/');
                return;
            } else {                
                user.save()
                    .success(function() {
                        console.log("Usuario creado con exito");
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