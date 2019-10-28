class main_scene extends Phaser.Scene {
    constructor() {
        super("playGame")
    }
    preload = () =>  {

		// Preload assets
		this.load.image('player', './assets/player.png');
		this.load.image('coin', './assets/coin.png');
	}

	create = () =>  {
		// Create new Socket
		this.socket = io();
		let self = this

		this.otherPlayers = this.physics.add.group()
		this.socket.on('currentPlayers', function(players) {
			//Check if player's id matches current player's socket id
			Object.keys(players).forEach(function(id) {
				if (players[id].playerId === self.socket.id) {
					addPlayer(self, players[id])
					console.log(players[id])
				} else {
					addOtherPlayers(self, players[id])
				}
			})
		})

		this.socket.on('newPlayer', function (playerInfo) {
			addOtherPlayers(self, playerInfo)
		})

		this.socket.on('disconnect', function (playerId) {
			self.otherPlayers.getChildren().forEach(function (otherPlayer) {
				if (playerId === otherPlayer.playerId) {
					otherPlayer.destroy()
				}
			})
		})

		// Create objects
		this.score = 0;
		let style = {
			font: '20px Arial',
			fill: '#fff'
		};

		// this.player = this.physics.add.sprite(100, 100, 'player')
		this.coin = this.physics.add.sprite(300, 300, 'coin');

		this.arrow = this.input.keyboard.createCursorKeys();

		this.scoreText = this.add.text(20, 20, 'Score: ' + this.score, style);
		// this.playerPosText = this.add.text(500, 20, 'Position: ' + this.player.x + ', ' + this.player.y, style)
	}

	update = () => {

		// Check if the Player collides with the coin
		// if (this.physics.overlap(this.player, this.coin)) {
		// 	// this.hit();
		// }

		// Check if a direction is held down
		if (this.arrow.right.isDown) {
			this.player.x += 3;
		} else if (this.arrow.left.isDown) {
			this.player.x -= 3;
		}

		if (this.arrow.down.isDown) {
			this.player.y += 3;
		} else if (this.arrow.up.isDown) {
			this.player.y -= 3;
		}
		
		// Show the players X and Y coordinates
		// this.playerPosText.setText('Position: ' + this.player.x + ', ' + this.player.y)

	}
}

hit = () => {

	// Spawn Coin at a random location
	this.coin.x = Phaser.Math.Between(100, 600);
	this.coin.y = Phaser.Math.Between(100, 300);

	// Increase Score by 10
	this.score += 10;

	this.scoreText.setText('Score: ' + this.score);

	// Simple animation added to player when colliding with coin
	// this.tweens.add({
	// 	targets: this.players,
	// 	duration: 200,
	// 	scaleX: 1.2,
	// 	scaleY: 1.2,
	// 	yoyo: true,
	// })
}

addPlayer = (self, playerInfo) => {
	self.player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'player')
}

addOtherPlayers = (self, playerInfo) => {
	const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'player')
	otherPlayer.playerId = playerInfo.playerId
	self.otherPlayers.add(otherPlayer)
}