$(function(){
	var chat = io('/chat');
		
	$('form#chatting').submit(function(){
		chat.emit('chat messages', { 
			name: document.getElementById('send').getAttribute('user'), 
			message: document.getElementById('message').value, 
			id: document.getElementById('send').value, 
			image: document.getElementById('send').getAttribute('avatar')
		});

		$('#message').val('');

		return false;
	});

	chat.on('start chatting', function(data){
		$('#messages-chatting').append($('<li>').text('Admin: ' + data.message));
	});

	chat.on('server messages', function(data){
		var li = document.createElement('LI');
		var image = document.createElement('img');
		var label = document.createElement('label');

		image.src = data.image;
		image.className = 'avatar';
		label.id = data.id;

		li.appendChild(image);
		li.appendChild(label);

		$('#messages-chatting').append(li);
	});
});