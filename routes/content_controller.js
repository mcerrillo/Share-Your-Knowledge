var models = require('../models/models.js');
var fs = require('fs');
var mkdirp = require('mkdirp');

exports.show = function(req, res, next) {
	models.UserContent
	   .findAll({where: {userID: req.session.passport.user.id},
	             order: 'name'})
	   .success(function(own_contents) {

		  models.Authorized
		  	.findAll({where: {email: req.session.passport.user.emails[0].value},
	             	  order: 'updatedAt DESC'})//,
	             	  //include: [ { model: models.UserContent, as: 'content' } ]})
		  	.success(function(authorized_contents){
		  		res.render('index',{ render_body: 'profile', userName: req.session.passport.user.displayName, own_contents: own_contents, authorized_contents: 0, fl: req.flash()});
		  	})
		  	.error(function(error) {
	       		next(error);
	   		})

	   })
	   .error(function(error) {
	       next(error);
	   })
};

exports.showPublic = function(req, res, next) {
	models.UserContent
	   .findAll({where: {status: 'public'},
	             order: 'name'})
	   .success(function(contents) {

		   	if(req.session.passport.user){
				res.render('index',{ render_body: 'main', userName: req.session.passport.user.displayName, contents: contents, fl: req.flash()});
			}else{
				res.render('index',{ render_body: 'main', userName: undefined, contents: contents, fl: req.flash()});
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
                req.flash('error', "The file: \""+ req.files.thumbnail.originalFilename +"\" already exists");
                res.redirect('/profile');
                return;
            } else {
            	if(req.files.thumbnail.originalFilename == ''){
            		req.flash('error', "No file selected");
	                res.redirect('/profile');
	                return;
            	}else{
            		content.save()
                    .success(function() {
                        req.flash('success','File successfully uploaded');
                        res.redirect('/profile');
                    })
                    .error(function(error) {
                        next(error);
                    });
            	}   
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
		req.flash('error','You are not allowed to public this file');
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
		req.flash('error','You are not allowed to make this file private');
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
	var aux = 0;
	var contentID = req.query.contentID;
	var email = req.body.email;

	/*models.User.find({where: {email: email},
		  			  include: [ { model: models.Authorized, as: 'authorized' } ],
	             	  order: 'updatedAt DESC'})*/

	 models.User.find({where: {email: email}})
        .success(function(existing_user) {
            if (existing_user) {
            	models.Authorized.find({where: {contentID: contentID, email: email}})
            		.success(function(authorized_content){
            			if(authorized_content){
            				req.flash('success', "The file was already shared with " + email);
            			}
            			else{
            				var authorized = models.Authorized.build(
								{
									contentID: contentID,
									email: email
								});
                			authorized.save()
			                    .success(function() {
			                    	aux=25
			                    	req.flash('success','Authorized user successfully added');
			                    })
			                    .error(function(error) {
			                        next(error);
			                    });
            			}
            		})
                
            }else{
            	req.flash('error','No user with email: ' + email);             
            }
        })
        .error(function(error) {
            next(error);
        });
	res.redirect('/profile');
};

exports.delete = function(req, res, next) {
	var authorID = req.query.userID;
	var name = req.query.name;
	var type = req.query.type;
	var path = req.query.path;
	var authority = req.query.authority;

	if(authority == 'owner'){
		models.UserContent.find({where: {userID: authorID, name: name, type: type}})
	        .success(function(existing_content) {
	            if (existing_content) {
	            	var contentID = existing_content.dataValues.id;

	                existing_content.destroy()
	                	.success(function(){
	                		fs.unlink(path, function(e) {
		            			if(e){console.log(e);}
		        			});
	                	})

	                models.Authorized.find({where: {contentID: contentID}})
	                	.success(function(authorized_content) {
	                		if(authorized_content){
	                			authorized_content.destroy()
	                				.success(function(){})
	                		}
	                	})
	            }
	        })
	}else{
		var contentID = req.query.contentID;
		models.Authorized.find({where: {contentID: contentID}})
	                	.success(function(authorized_content) {
	                		if(authorized_content){
	                			authorized_content.destroy()
	                				.success(function(){})
	                		}
	                	})
	}

	res.redirect('/profile');
};

exports.download = function(req, res, next) {
	var userID = req.query.userID;
	var name = req.query.name;
	var type = req.query.type;
	var path = req.query.path;
	models.UserContent.find({where: {userID: userID, name: name, type: type}})
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

exports.searchPublic = function(req, res, next){

	var searchText = req.body.search_query;
	models.UserContent
		.findAll({where: ["name like ? AND status like ?",'%' + searchText + '%','public'],
				  order: "updatedAt DESC"})
		.success(function(contents){
			if(req.session.passport.user){
				res.render('index',{ render_body: 'main', userName: req.session.passport.user.displayName, contents:contents, fl: req.flash()});
			}else{
				res.render('index',{ render_body: 'main', userName: undefined, contents:contents, fl: req.flash()});
			}
		})
		.error(function(error) {
	       next(error);
	   	})
};