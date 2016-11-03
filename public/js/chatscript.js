$(function(){
	function formSubmit() {

	}

	function startChatting() {
		var socket = io();
		
		$('form#chatting').submit(function(){
			socket.emit('chat messages', {user: $('#send').attr('user'), message: $('#message').val(), id: $('#send').attr('value')});
			$('#message').val('');
			return false;
		});

		socket.on('start chatting', function(data){
			$('#messages-chatting').append($('<li>').text('Admin: ' + data.message));
		});

		socket.on('server messages', function(data){
			var li = document.createElement('LI');
			var image = document.createElement('img');

			li.appendChild(image);

			$('#messages-chatting').append(li);
			$('#messages-chatting').append($('<li>').attr('id',data.id).text(data.user + ': ' + data.message));
		});
	}

	function serverMessages() {

	}

	function loadHeaderBackground() {
		$('a.header-site').each(function(){
			if($(this).attr('active') && $(this).attr('id') != 'home' && $(this).attr('id') != 'list-images') {
				$('header').css({'background-position': 'none'});
			}
		});
	}

	loadHeaderBackground();
});