socketio.controller('userController', function($scope, userService) {
	userService.getUsers().success(function(users) {
		console.log(users);
	}).error(function(error) {
		console.log(error);
	});
});