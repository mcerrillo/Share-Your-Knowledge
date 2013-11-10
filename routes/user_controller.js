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

// GET /users/new
exports.new = function(req, res, next) {

    var user = models.User.build(
        { userID: 'User ID',
          name:  'Name'
        });
    
    res.render('users/new', {user: user});
};

// POST /users
exports.create = function(req, res, next) {
    var user = models.User.build(
        { userID: req.body.user.userID,
          name:  req.body.user.name
        });
    
    // El login debe ser unico:
    /*models.User.find({where: {userID: req.body.user.userID}})
        .success(function(existing_user) {
            if (existing_user) {
                console.log("Error: El usuario \""+ req.body.user.userID +"\" ya existe: "+existing_user.values);
                //req.flash('error', "Error: El usuario \""+ req.body.user.userID +"\" ya existe.");
                res.render('users/new', 
                           { user: user,
                             validate_errors: {
                                 userID: 'El usuario \"'+ req.body.user.userID +'\" ya existe.'
                             }
                           });
                return;
            } else {

                var validate_errors = user.validate();
                if (validate_errors) {
                    console.log("Errores de validación:", validate_errors);
                    //req.flash('error', 'Los datos del formulario son incorrectos.');
                    for (var err in validate_errors) {
                        //req.flash('error', validate_errors[err]);
                    };
                    res.render('users/new', {user: user,
                                             validate_errors: validate_errors});
                    return;
                } */
                
                user.save()
                    .success(function() {
                        //req.flash('success', 'Usuario creado con éxito.');
                        res.redirect('/users');
                        console.log("Usuario creado con exito");
                    })
                    .error(function(error) {
                        next(error);
                    });
            /*}
        })
        .error(function(error) {
            next(error);
        });*/
};