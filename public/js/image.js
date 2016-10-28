$(function() {
	var form = '<div class="row" style = "margin-top: 10%;">' + 
	'<div class="col-xs-6 col-md-4"></div>' + 
	'<div class="col-xs-6 col-md-4">' + 
	'<form class="" id="login-form" action={{method}} method="POST" enctype="multipart/form-data">' + 
	'<label for="inputEmail" class="sr-only">Your description</label>' + 
	'<input type="text" id="inputEmail" name="name" class="form-control" placeholder="Your description" required autofocus>' + 
	'<input type="file" id="inputFile" name="file" class="form-control" placeholder="Select your picture" multiple="true" required>' + 
	'</form>' + 
	'</div>' + 
	'<div class="col-xs-6 col-md-4"></div></div>'
	$('#share-experience').click(function(){
		bootbox.dialog({
		    title: "Upload Image",
		    message: form,
		    buttons: {
		        cancel: {
		            label: '<i class="fa fa-times"></i> Cancel'
		        }, 
		        success: {
		            label: "Upload",
		            className: "fa fa-check",
		            callback: function () {

		            }
		        }
		    },
		    callback: function (result) {
		        console.log('This was logged in the callback: ' + result);
		    }
		});
	});
})