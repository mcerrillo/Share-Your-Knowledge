var models = require('../models/models.js');
var fs = require('fs');
var mkdirp = require('mkdirp');

exports.show = function(req, res, next) {
	models.UserContent
	   .findAll({where: {userID: req.session.passport.user.id},
	             order: 'updatedAt DESC'})
	   .success(function(contents) {
		  res.render('index',{ render_body: 'profile', userName: req.session.passport.user.displayName, contents:contents });
	   })
	   .error(function(error) {
	       next(error);
	   })
};

exports.create = function(req, res, next) {
	
	var tmp_path = req.files.thumbnail.path;
	//var folder_path = './file/'+req.session.passport.user.id;
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
			status: "public"
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

exports.delete = function(req, res, next) {
	var authorID = req.query.userID;
	var name = req.query.name;
	var type = req.query.type;
	var path = req.query.path;
	if (authorID != req.session.passport.user.id) {
		alert("You are not allowed to delete this file");
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
	        			console.log("**************************");
	        			//alert("File deleted successfully");
	        			//req.flash('success', 'File deleted successfully');
                	})
            }
        })
	res.redirect('/profile');
};