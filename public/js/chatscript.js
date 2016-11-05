$(function(){
	var chat = io('/chat');
	var user = window.location.pathname.substr(6);

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

	function loadUserStatus() {
		var td = $(
			'<td>' 
			+ '<i class="fa fa-check" aria-hidden="true"></i>' 
			+ 'Online' 
			+ '</td>');

		$('#user-list > tbody > tr.users-list').each(function(){
			if($(this).attr('online') && $(this).attr('online').length > 0) {
				$(this).append(td);
			}
		});
	}

	$('tr.users-list').click(function(){
		chat.emit('connect to client', $(this).attr('id'));

		$('#conversation-main').css({'visibility': 'hidden'});
		$('table#user-list').css({'visibility': 'visible'});
		$('#message').attr({'receiver': $(this).attr('id')});
	});

	chat.on('private messages', function(data){
		$('#user-list > tbody > tr.users-list').each(function(){
			if($(this).attr('id') == data.sender) {
				console.log(data);
				$(this).find('td:eq(1)').attr({'messages': '1'}).html('new messages');
			}
		});
	});

	chat.on('server messages', function(data){
		var li = loadAvatar(data.user, data.image, data, 'user');

		console.log('Server reply: ' + data);

		$('#messages-chatting').append(li);
	});

	chat.emit('login', {
		userId: document.getElementById('send').value, 
		connectId: document.getElementById('send').value
	});

	$('form#chatting').submit(function(){
		chat.emit('chat messages', {
			sender: document.getElementById('send').value, 
			receiver: document.getElementById('message').getAttribute('receiver'), 
			name: document.getElementById('send').getAttribute('user'), 
			image: document.getElementById('send').getAttribute('avatar'), 
			message: document.getElementById('message').value
		});

		$('#message').val('');

		return false;
	});

	chat.on('users online', function(data){
		console.log('Online: ' + data);
		$('#user-list > tbody > tr.users-list').each(function(){
			if($(this).attr('id') == data.userId){
				$(this).attr({'online': data.connectId});
				loadUserStatus();
			}
		});
	});

	// chat.on('new connection', function(data){
	// 	var li = loadAvatar('Admin', '/img/golang.png', data, 'admin');

	// 	$('#messages-chatting').append(li);
	// });

	// chat.on('connect', function(){
	// 	chat.emit('ferret', 'tobi', function(data){
	// 		console.log(data);
	// 	});
	// });
});