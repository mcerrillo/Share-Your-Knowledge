var models = require('../models/models.js');
var fs = require('fs');
var mkdirp = require('mkdirp');

exports.show = function(req, res, next) {
	models.UserContent
	   .findAll({where: {userID: req.session.passport.user.id},
	             order: 'updatedAt DESC'})
	   .success(function(contents) {
		  res.render('index',{ render_body: 'profile', userName: req.session.passport.user.displayName, contents:contents});
	   })
	   .error(function(error) {
	       next(error);
	   })
};

exports.showPublic = function(req, res, next) {
	models.UserContent
	   .findAll({where: {status: 'public'},
	             order: 'updatedAt DESC'})
	   .success(function(contents) {

		   	if(req.session.passport.user){
				res.render('index',{ render_body: 'main', userName: req.session.passport.user.displayName, contents:contents});
			}else{
				res.render('index',{ render_body: 'main', userName: undefined, contents:contents});
			}
	   })
	   .error(function(error) {
	       next(error);
	   })
};

exports.create = function(req, res, next) {
	
	var tmp_path = req.files.thumbnail.path;
    var target_path = './files/'+req.session.passport.user.id + '/' + req.files.thumbnail.name;
    mkdirp('./files/'+req.session.passport.user.id, function(err) { 

	    if (err) console.log(err);
	    // move the file from the temporary location to the intended location
	    fs.rename(tmp_path, target_path, function(err) {
	        if (err) console.log(err);
	        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
	        fs.unlink(tmp_path, function() {
	            if (err) console.log(err);
	        });
	    });
	});
    

	var content = models.UserContent.build(
		{
			userID: req.session.passport.user.id,
			name: req.files.thumbnail.originalFilename,
			type: req.files.thumbnail.type,
			path: target_path,
			status: "private"
		});

	// El login debe ser unico:
    models.UserContent.find({where: {userID: req.session.passport.user.id, name: req.files.thumbnail.originalFilename, type: req.files.thumbnail.type}})
        .success(function(existing_content) {
            if (existing_content) {
                console.log("El archivo: \""+ req.files.thumbnail.originalFilename +"\" ya existe");
                res.redirect('/profile');
                return;
            } else {                
                content.save()
                    .success(function() {
                        console.log("Archivo añadido con exito");
                        res.redirect('/profile');
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

exports.deleteAll = function(req, res, next) {

};

exports.public = function(req, res, next) {
	var authorID = req.query.userID;
	var name = req.query.name;
	var type = req.query.type;
	var path = req.query.path;
	if (authorID != req.session.passport.user.id) {
		//alert("You are not allowed to public this file");
        res.redirect('/profile');
	};

	models.UserContent.find({where: {userID: authorID, name: name, type: type}})
		.success(function(content){
			if (content) { 
			    content.updateAttributes({
			      status: 'public'
			    }).success(function() {});
	  		}
		})


	res.redirect('/profile');
};

exports.private = function(req, res, next) {
	var authorID = req.query.userID;
	var name = req.query.name;
	var type = req.query.type;
	var path = req.query.path;
	if (authorID != req.session.passport.user.id) {
		//alert("You are not allowed to public this file");
        res.redirect('/profile');
	};

	models.UserContent.find({where: {userID: authorID, name: name, type: type}})
		.success(function(content){
			if (content) { 
			    content.updateAttributes({
			      status: 'private'
			    }).success(function() {});
	  		}
		})


	res.redirect('/profile');
};

exports.share = function(req, res, next) {
	res.redirect('/profile');
};

exports.delete = function(req, res, next) {
	var authorID = req.query.userID;
	var name = req.query.name;
	var type = req.query.type;
	var path = req.query.path;
	if (authorID != req.session.passport.user.id) {
		//alert("You are not allowed to delete this file");
        res.redirect('/profile');
	};

	models.UserContent.find({where: {userID: authorID, name: name, type: type}})
        .success(function(existing_content) {
            if (existing_content) {
                existing_content.destroy()
                	.success(function(){
                		fs.unlink(path, function(e) {
	            			if(e){console.log(e);}
	        			});
                	})
            }
        })

	res.redirect('/profile');
};

exports.download = function(req, res, next) {
	var authorID = req.query.userID;
	var name = req.query.name;
	var type = req.query.type;
	var path = req.query.path;

	models.UserContent.find({where: {userID: authorID, name: name, type: type}})
        .success(function(existing_content) {
            if (existing_content) {
                res.download(path,name,function(err){
                	if(err){
                		console.log(err);
                	}
                });
            }
        })
};