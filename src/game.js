/** @type {import("../typings/phaser")} */

var config = {
	type: Phaser.AUTO,
	width: 700,
	height: 400,
	backgroundColor: '#3498db',
	scene: [main_scene],
	physics: { default: 'arcade' },
	parent: 'game',
}

let game = new Phaser.Game(config)
