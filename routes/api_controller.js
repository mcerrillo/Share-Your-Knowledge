var models = require('../models/models.js');
var fs = require('fs');
var http = require('http');
var mkdirp = require('mkdirp');

exports.getPublicContent = function(req, res, next) {
	models.UserContent
	   .findAll({where: {status: 'public'},
	             order: 'name'})
	   .success(function(contents) {

	   		var server = 'http://ec2-54-194-72-253.eu-west-1.compute.amazonaws.com:3000';
	   		var links = new Array();

		   	for(var i in contents){
		   		var userID = contents[i].dataValues.userID;
        		var name = contents[i].dataValues.name;
        		var type = contents[i].dataValues.type;
        		var path = contents[i].dataValues.path;

        		var link = server + '/file_download?userID=' + userID + '&name=' + name + '&type=' + type + '&path=' + path;
        		links[i] = link;
		   	}

		   	var result = JSON.stringify(links);
		   	res.end(result);
	   })
	   .error(function(error) {
	       next(error);
	   })
};

exports.getPrivateContent = function(req, res, next) {
	var userId = req.query.id;
	var userEmail = '';
	models.User
		.find({where: {userID: userId}})
		.success(function(user){
			userEmail = user.email; 
		})
		.error(function(error){
			next(error);
		})

	models.UserContent
	   .findAll({where: {userID: userId},
	             order: 'name'})
	   .success(function(own_contents) {
		  models.Authorized
		  	.findAll({where: {email: userEmail},
		  			  include: [ { model: models.UserContent, as: 'content' } ],
	             	  order: 'updatedAt DESC'})
		  	.success(function(authorized_contents){

		  		var server = 'http://ec2-54-194-72-253.eu-west-1.compute.amazonaws.com:3000';
		   		var own_links = new Array();
		   		var authorized_links = new Array();

			   	for(var i in own_contents){
			   		var userID = own_contents[i].dataValues.userID;
	        		var name = own_contents[i].dataValues.name;
	        		var type = own_contents[i].dataValues.type;
	        		var path = own_contents[i].dataValues.path;

	        		var link = server + '/file_download?userID=' + userID + '&name=' + name + '&type=' + type + '&path=' + path;
	        		own_links[i] = link;
			   	}

			   	for(var i in authorized_contents){
			   		var userID = authorized_contents[i].dataValues.userID;
	        		var name = authorized_contents[i].dataValues.name;
	        		var type = authorized_contents[i].dataValues.type;
	        		var path = authorized_contents[i].dataValues.path;

	        		var link = server + '/file_download?userID=' + userID + '&name=' + name + '&type=' + type + '&path=' + path;
	        		authorized_links[i] = link;
			   	}

			   	var links = {own_content: own_links, authorized_content: authorized_links};
			   	var result = JSON.stringify(links);
			   	req.logOut();
			   	res.end(result);

		  	})
		  	.error(function(error) {
	       		next(error);
	   		})
	   })
	   .error(function(error) {
	       next(error);
	   })
};

exports.deleteContent = function(req, res, next) {

	var authorID = req.query.id;
	var name = req.query.name;
	var type = req.query.type;
	var path = req.query.path;

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

	res.end();
};