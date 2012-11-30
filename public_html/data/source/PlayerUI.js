function PlayerUI () {
	this.domRoot = $('#ui');
}

PlayerUI.method('addPlayer', function (player) { 
	var id = 'player_' + player.id;
	this.domRoot.append(
		'<div id="' + id + '" class="players">' + 
		'	<div class="stop">X</div>'+ 
		'	<div class="name">'+player.name+'</div>' + 
		'	<div class="health">' + 
		'		<div class="bar"></div>' + 
		'	</div>' + 
		'	<div class="ammo">' + 
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
	dom.find('.ammo .bar').width((player.ammo/player.maxAmmo)*100 + '%');
});

PlayerUI.method('update', function () { 
	// Score
	var score = this.domRoot.find('#score');
	score.find('#level').html('Level: ' + GAME.level.score.level);
	score.find('#kills').html('Kills: ' + GAME.level.score.kills);
	score.find('#score').html('Score: ' + GAME.level.score.score);
	
	// Players
	for (var i in GAME.level.playerGroup.players) {
		var player = GAME.level.playerGroup.players[i];
		this.updatePlayer(player);
	}
});

PlayerUI.method('draw', function () { 
	this.domRoot.html(
		'<div id="score">' + 
		'	<div id="level">Level: 0</div>' +  
		'	<div id="kills">Kills: 0</div>' +
		'	<div id="score">Score: 0</div>' +
		'</div>'
	);
	for (var i in GAME.level.playerGroup.players) {
		var player = GAME.level.playerGroup.players[i];
		this.addPlayer(player);
	}
});
