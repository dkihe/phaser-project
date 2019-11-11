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

		this.socket.on('playerMoved', function (playerInfo) {
			self.otherPlayers.getChildren().forEach(function (otherPlayer) {
				if (playerInfo.playerId === otherPlayer.playerId) {
					otherPlayer.setPosition(playerInfo.x, playerInfo.y);
			  	}
			});
		});

		this.socket.on('coinLocation', function (coinLocation) {
			if (self.coin) self.coin.destroy();
			self.coin = self.physics.add.image(coinLocation.x, coinLocation.y, 'coin');
			self.physics.add.overlap(self.player, self.coin, function () {
				this.socket.emit('coinCollected');
			}, null, self);
		});

		// Create objects
		// this.score = 0;

		let style = {
			font: '20px Arial',
			fill: '#fff'
		};

		// this.player = this.physics.add.sprite(100, 100, 'player')
		// this.coin = this.physics.add.sprite(300, 300, 'coin');

		this.arrow = this.input.keyboard.createCursorKeys();

		// this.scoreText = this.add.text(20, 20, 'Score: ' + this.score, style);
		// this.playerPosText = this.add.text(500, 20, 'Position: ' + this.player.x + ', ' + this.player.y, style)
	}

	update = () => {
		if (this.player) {
			// Collide with Coin
			// if (this.physics.overlap(this.player, this.coin)) {
			// 	hit(this.coin)
			// 	// Increase Score by 10
			// 	// this.score += 10;

			// 	// this.scoreText.setText('Score: ' + this.score);
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

			this.physics.world.wrap(this.player, 5);

			// emit player movement
			var x = this.player.x;
			var y = this.player.y;
			if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y)) {
				this.socket.emit('playerMovement', { 
					x: this.player.x, y: this.player.y
				});
			}
			
			// save old position data
			this.player.oldPosition = {
				x: this.player.x,
				y: this.player.y,
			};
		}
		// Show the players X and Y coordinates
		// this.playerPosText.setText('Position: ' + this.player.x + ', ' + this.player.y)

	}
}

hit = (coin) => {

	// Spawn Coin at a random location
	coin.x = Phaser.Math.Between(100, 600);
	coin.y = Phaser.Math.Between(100, 300);

	// Increase Score by 10
	// score += 10;

	// text.setText('Score: ' + score);

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

addCoin = (self, coinInfo) => {
	self.coin = self.physics.add.sprite(coinInfo.x, coinInfo.y, 'coin')
}