$(function() {

	function uploadImage() {
		var form = '<form class="" id="upload-form" action="/images/add" method="POST" enctype="multipart/form-data">' + 
			'<h4>Select your image</h4>' + 
			'<label for="inputEmail" class="sr-only">Your description</label>' + 
			'<input type="text" id="inputEmail" name="name" class="form-control" placeholder="Your description" required autofocus>' + 
			'<input type="file" id="inputFile" name="file" class="form-control" placeholder="Select your picture" multiple="true" required>' + 
			'</form>'

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
			            	$('form#upload-form').submit();
			            }
			        }
			    },
			    callback: function (result) {
			        console.log('This was logged in the callback: ' + result);
			    }
			});
		});
	}

	function loadDefault() {
		var defaultImage = $('div#images').children('div:first').children().attr('src');
		
		$('img.grid-images').click(function(){
			$('header').css({'background-image': 'url(' + $(this).attr('src') + ')'});
		})
	}

	uploadImage();
	loadDefault();
})