$(function(){
	var chat = io('/chat');
	var newUser = io('/newuser');
	var user = window.location.pathname.substr(6);

	function loadAvatar(user, image, data, permission) {
		var li = $(
			'<li class="" role="' + permission + '">' 
				+ '<div class="chat-avatar">' 
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

		$('#user-chat-list > tbody > tr.users-list').each(function(){
			if($(this).attr('online') && $(this).attr('online').length > 0) {
				$(this).append(td);
			}
		});
	}

	function selectUser() {
		$('tr.users-list').click(function(){
			chat.emit('connect to client', $(this).attr('id'));

			$(this).find('td:eq(1)').html('');
			$('#conversation-main').css({'visibility': 'hidden'});
			$('table#user-chat-list').css({'visibility': 'visible'});
			$('#message').attr({'receiver': $(this).attr('id')});

			senderTyping('#message', '#user-typing', $('#send').attr('value'), $('#send').attr('sender'), $('#message').attr('receiver'));
		});
	}

	function sendMessages() {
		$('form#chatting').submit(function(){
			chat.emit('chat messages', {
				sender: document.getElementById('send').value, 
				receiver: document.getElementById('message').getAttribute('receiver'), 
				name: document.getElementById('send').getAttribute('sender'), 
				image: document.getElementById('send').getAttribute('avatar'), 
				message: document.getElementById('message').value
			});

			$('#message').val('');

			return false;
		});
	}

	function senderTyping(input, listen, senderId, senderName, receiverId) {
		$(input).keydown(function(){
			chat.emit('sender start typing', { 
				sender: senderId, 
				senderName: senderName, 
				receiver: receiverId
			});
		});

		$(input).keyup(function(){
			chat.emit('sender stop typing', { 
				sender: senderId, 
				senderName: senderName, 
				receiver: receiverId
			});
		});
	}

	selectUser();
	sendMessages();

	chat.emit('login', {
		userId: document.getElementById('send').value, 
		connectId: document.getElementById('send').value
	});

	chat.on('private messages', function(data){
		$('#user-chat-list > tbody > tr.users-list').each(function(){
			if($(this).attr('id') == data.sender) {
				console.log(data);
				$(this).find('td:eq(1)').attr({'messages': '1'}).html('new messages');
			}
		});
	});

	chat.on('server messages', function(data){
		var li = loadAvatar(data.senderName, data.image, data, 'user');

		console.log('Server reply: ' + data);

		$('#messages-chatting').append(li);
	});

	chat.on('users online', function(data){
		console.log('Online: ' + data);
		$('#user-chat-list > tbody > tr.users-list').each(function(){
			if($(this).attr('id') == data.userId){
				$(this).attr({'online': data.connectId});
			}
		});
	});

	chat.on('notify receiver', function(data){
		$('#user-typing > li:first').html(data.senderName + ' is typing...');
		$('#user-typing').css({ 'visibility': 'visible' });
	});

	chat.on('stop receive notify', function(data){
		$('#user-typing').css({ 'visibility': 'hidden' });
	});

	newUser.on('new user', function(data){
		var user = $(
			'<tr id="' + data.user._id + '" class="users-list" style="cursor: pointer;">' 
			+ '<td style="vertical-align: middle;">' 
			+ '<img class="avatar" src=' + data.user.avatar + ' /> ' + data.user.name 
			+ '</td>' 
			+ '<td id="" style="vertical-align: middle;" messages="0">' 
			+ '</td></tr>');

		$('table#user-chat-list').append(user);

		console.log(data);
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