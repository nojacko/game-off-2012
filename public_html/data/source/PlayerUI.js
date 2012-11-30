function PlayerUI () {
	this.domRoot = $('#ui');
}

PlayerUI.method('addPlayer', function (player) { 
	var id = 'player_' + player.id;
	this.domRoot.append(
		'<div id="' + id + '" class="players">' + 
		'	<div class="stop">X</div>'+ 
		'	<div class="name">Player</div>' + 
		'	<div class="health">' + 
		'		<div class="bar"></div>' + 
		'	</div>' + 
		'	' + 
		'</div>'
	);	
	
	this.updatePlayer(player);
	
	/*
	 * Mouse Actions
	 */
	var playerElement = $('#'+id);	
	playerElement.find('.name').click(function () {
		var playerElement = $(this).parent();
		var id = playerElement.attr('id');
		var player = GAME.level.playerGroup.getPlayerById(id);
		var active = player.onClick();
		
		$('.players').removeClass('active')
		
		if (active) {
			playerElement.addClass('active');
		}
	});
	playerElement.find('.name').mouseover(function () {
		var playerElement = $(this).parent();
		playerElement.addClass('hover');
		
		var id = playerElement.attr('id');
		var player = GAME.level.playerGroup.getPlayerById(id);
		player.onMouseOver();
	});
	playerElement.find('.name').mouseout(function () {
		var playerElement = $(this).parent();
		playerElement.removeClass('hover');
		
		var id = playerElement.attr('id');
		var player = GAME.level.playerGroup.getPlayerById(id);
		player.onMouseOut();
	});
	
	playerElement.find('.stop').click(function () {
		var playerElement = $(this).parent();
		var id = playerElement.attr('id')
		var player = GAME.level.playerGroup.getPlayerById(id);
		player.stop();
	});
});

PlayerUI.method('removePlayer', function (player) { 
	$('#player_' + player.id).remove();
});

PlayerUI.method('updatePlayer', function (player) { 
	var dom = $('#player_' + player.id);
	
	if (player.isActive()) {
		dom.addClass('active');		
	}
	
	dom.find('.health .bar').width(player.health + '%');
});

PlayerUI.method('update', function () { 
	
	for (var i in GAME.level.playerGroup.players) {
		var player = GAME.level.playerGroup.players[i];
		this.updatePlayer(player);
	}
});

PlayerUI.method('draw', function () { 
	this.domRoot.html('');
	for (var i in GAME.level.playerGroup.players) {
		var player = GAME.level.playerGroup.players[i];
		this.addPlayer(player);
	}
});
