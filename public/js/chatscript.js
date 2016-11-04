$(function(){
	var chat = io('/chat');
	var roomId = window.location.pathname.substr(6);

	function loadAvatar(user, image, data, permission) {
		var li = $(
			'<li class="" role="' + permission + '">' 
				+ '<div class="">' 
				+ '<img class="avatar" />' + '<b></b></div>' 
				+ '<p style="padding-left: 50px;"></p>' + '</li>'
			);

		li.find('img').attr({'src': image});
		if(data.id) li.find('img').attr({'id': data.id});
		li.find('b').text(user);
		li.find('p').text(data.message);

		return li;
	}

	$('tr.users-list').click(function(){
		alert($(this).attr('id'));
	});

	chat.on('new connection', function(data){
		var li = loadAvatar('Admin', '/img/golang.png', data, 'admin');

		$('#messages-chatting').append(li);
	});

	chat.emit('login', roomId);

	$('form#chatting').submit(function(){
		chat.emit('chat messages', {
			room: roomId, 
			name: document.getElementById('send').getAttribute('user'), 
			image: document.getElementById('send').getAttribute('avatar'), 
			message: document.getElementById('message').value
		});

		$('#message').val('');

		return false;
	});

	chat.on('server messages', function(data){
		var li = loadAvatar(data.user, data.image, data, 'user');
		$('#messages-chatting').append(li);
	});

	// chat.on('connect', function(){
	// 	chat.emit('ferret', 'tobi', function(data){
	// 		console.log(data);
	// 	});
	// });
});