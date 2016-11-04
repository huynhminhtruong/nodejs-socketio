$(function(){
	var chat = io('/chat');
	var roomId = Number(window.location.pathname.match(/\/chat\/(\d+)$/)[1]);

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

	chat.on('new connection', function(data){
		var li = loadAvatar('Admin', '/img/golang.png', data, 'admin');

		$('#messages-chatting').append(li);
	});
		
	$('form#chatting').submit(function(){
		chat.emit('chat messages', { 
			name: document.getElementById('send').getAttribute('user'), 
			message: document.getElementById('message').value, 
			roomId: roomId, 
			image: document.getElementById('send').getAttribute('avatar')
		});

		$('#message').val('');

		return false;
	});

	chat.on('server messages', function(data){
		var li = loadAvatar(data.user, data.image, data, 'user');

		alert('Server reply');

		$('#messages-chatting').append(li);
	});
});