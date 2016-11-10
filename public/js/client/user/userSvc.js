socketio.service('userService', function($http) {
	this.getUsers = function(number) {
		return $http.get('/users');	
	}
});