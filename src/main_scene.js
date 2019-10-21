class main_scene extends Phaser.Scene {
    constructor() {
        super("playGame")
    }
    preload() {
		this.load.image('player', '../assets/player.png');
		this.load.image('coin', '../assets/coin.png');
	}

	create() {
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		this.score = 0;
		let style = {
			font: '20px Arial',
			fill: '#fff'
		};

		this.player = this.physics.add.sprite(100, 100, 'player');
		this.coin = this.physics.add.sprite(300, 300, 'coin');

		this.arrow = this.input.keyboard.createCursorKeys();

		this.scoreText = this.add.text(20, 20, 'Score: ' + this.score, style);
		this.playerPosText = this.add.text(500, 20, 'Position: ' + this.player.x + ', ' + this.player.y, style)
	}

	update() {

		if (this.physics.overlap(this.player, this.coin)) {
			this.hit();
		}

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
		this.playerPosText.setText('Position: ' + this.player.x + ', ' + this.player.y)

	}

	hit() {
		this.coin.x = Phaser.Math.Between(100, 600);
		this.coin.y = Phaser.Math.Between(100, 300);

		this.score += 10;

		this.scoreText.setText('Score: ' + this.score);

		this.tweens.add({
			targets: this.player,
			duration: 200,
			scaleX: 1.2,
			scaleY: 1.2,
			yoyo: true,
		})
    }
}