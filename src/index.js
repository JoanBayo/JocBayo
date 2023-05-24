import Phaser from 'phaser';
import logoImg from './assets/logo.png';

let backgroundSoundStart
let winSound
let score = 0;
let scoreText;
let scoreImage
let lives = 3;
let livesText;
let coin_sound
let die_sound
let objetoPeligroso
let playerhit
let mataMonstre


// Escena 2
class StartScene extends Phaser.Scene {
    constructor() {
        super({key: 'StartScene'});
    }

    preload() {
        this.load.image('backgroundScene', 'assets/images/backgroundCastle.jpg');
        this.load.image('startButton', 'assets/images/gamestart.png', { frameWidth: 300, frameHeight: 49 });
        this.load.image('aboutbutton', 'assets/images/aboutButton.png', { frameWidth: 300, frameHeight: 49 });
        this.load.audio('backgroundSoundStart', 'assets/sounds/backgroundSound.mp3');
        this.load.audio('mataMonstre', 'assets/sounds/matamata.mp3');
    }

    create() {

        const backgroundImage = this.add.image(0, 0, 'backgroundScene').setOrigin(0, 0);
        backgroundImage.setScale(1.15, 2);

        backgroundSoundStart = this.sound.add('backgroundSoundStart', {loop: true});
        backgroundSoundStart.volume = 0.1
        backgroundSoundStart.play();

        const startButton = this.add.sprite(400, 400, 'startButton').setInteractive();
        const aboutButton = this.add.sprite(400, 500, 'aboutbutton').setInteractive();

        startButton.on('pointerover', () => {
            startButton.setTexture('startButton');
            this.input.setDefaultCursor('pointer');
        });

        startButton.on('pointerout', () => {
            startButton.setTexture('startButton');
            this.input.setDefaultCursor('auto');
        });

        startButton.on('pointerup', () => {
            this.scene.start('Scene1');
            lives = 3;
            score = 0;
            this.input.setDefaultCursor('auto');
        });

        aboutButton.on('pointerover', () => {
            startButton.setTexture('startButton');
            this.input.setDefaultCursor('pointer');
        });

        aboutButton.on('pointerout', () => {
            startButton.setTexture('startButton');
            this.input.setDefaultCursor('auto');
        });

        aboutButton.on('pointerup', () => {
            const url = 'https://github.com/JoanBayo/JocBayo'; // Reemplaza con la URL que desees abrir
            window.open(url, '_blank');
        });
    }

    update() {
    }
}


// Escena 1
class Scene1 extends Phaser.Scene {
    constructor() {
        super({key: 'Scene1'});
    }

    preload() {
        this.load.image('background', 'assets/images/background.jpg');
        this.load.image('lava', 'assets/images/lava.png');
        this.load.image('door', 'assets/images/door.png');
        this.load.image('monster', 'assets/images/monster.png');
        this.load.atlas('player', 'assets/images/kenney_player.png', 'assets/images/kenney_player_atlas.json');
        this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');

        // Load the export Tiled JSON
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');

        this.load.spritesheet('star', 'assets/images/star.png', {frameWidth: 48, frameHeight: 48})

        this.load.audio('coin_sound', 'assets/sounds/Cash Money Sound Effect (mp3cut.net).m4a');
        this.load.audio('die_sound', 'assets/sounds/mort (mp3cut.net).mp3');
    }

    create() {

        const map = this.make.tilemap({key: 'map'});

        const tileset = map.addTilesetImage('kenney_simple_platformer', 'tiles');
        const backgroundImage1 = this.add.image(0, 0, 'background').setOrigin(0, 0);

        const platforms = map.createLayer('Platforms', tileset, 0, 0);

        backgroundImage1.setScale(1, 1);

        platforms.setCollisionByExclusion(-1, true);



        coin_sound = this.sound.add('coin_sound',);
        die_sound = this.sound.add('die_sound');

        this.star1 = this.physics.add.sprite(300, 120, 'star')
        this.physics.add.collider(this.star1, platforms)

        this.star2 = this.physics.add.sprite(800, 600, 'star')
        this.physics.add.collider(this.star2, platforms)

        this.star3 = this.physics.add.sprite(1175, 300, 'star')
        this.physics.add.collider(this.star3, platforms)

        this.star4 = this.physics.add.sprite(1100, 600, 'star')
        this.physics.add.collider(this.star4, platforms)

        this.star5 = this.physics.add.sprite(900, 300, 'star')
        this.physics.add.collider(this.star5, platforms)



        this.door = this.physics.add.sprite(150, 100, 'door')
        this.physics.add.collider(this.door, platforms)

        this.monster = this.physics.add.sprite(420, 280, 'monster')
        this.physics.add.collider(this.monster, platforms)

        this.player = this.physics.add.sprite(150, 2150, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);


        platforms.setCollisionByExclusion(-1, true);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        this.physics.world.bounds.width = platforms.width;
        this.physics.world.bounds.height = platforms.height;

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'robo_player_',
                start: 2,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{key: 'player', frame: 'robo_player_0'}],
            frameRate: 10,
        });

        this.anims.create({
            key: 'jump',
            frames: [{key: 'player', frame: 'robo_player_1'}],
            frameRate: 10,
        });

        this.cursors = this.input.keyboard.createCursorKeys();


        this.lavas = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Lava').objects.forEach((lava) => {
            const lavaSprite = this.lavas.create(lava.x, lava.y - lava.height, 'lava').setOrigin(0);
            lavaSprite.body.setSize(lava.width, lava.height - 20).setOffset(0, 20);
        });

        this.physics.add.overlap(this.player, this.monster, playerHit, null, this);
        this.physics.add.collider(this.player, this.lavas, playerHit, null, this);

        let scoreImage = this.add.image(10, 10, 'star');
        scoreImage.setOrigin(0, 0);
        scoreImage.setScale(0.5);
        scoreText = this.add.text(70, 10, score.toString()+'/5', {
            fontFamily: 'Arial',
            fontSize: '24px',
            fill: '#000000'
        });

        scoreText.setOrigin(1, 0);
        scoreText.setScrollFactor(0);
        scoreImage.setScrollFactor(0);

        livesText = this.add.text(100, 10, '❤️: ' + lives, {fontSize: '24px', fill: '#000000'});
        livesText.setScrollFactor(0);

        this.physics.add.overlap(this.player, this.star1, function (player, star1) {
            incrementScore(star1);
        }, null, this);

        this.physics.add.overlap(this.player, this.star2, function (player, star2) {
            incrementScore(star2);
        }, null, this);

        this.physics.add.overlap(this.player, this.star3, function (player, star3) {
            incrementScore(star3);
        }, null, this);

        this.physics.add.overlap(this.player, this.star4, function (player, star4) {
            incrementScore(star4);
        }, null, this);

        this.physics.add.overlap(this.player, this.star5, function (player, star5) {
            incrementScore(star5);
        }, null, this);

        this.physics.add.overlap(this.player, this.door, level1ToLevel2, null, this);

        function incrementScore(sprite) {
            score++;
            scoreText.setText(score.toString()+ '/5');
            scoreImage.setTexture('star');
            scoreImage.setScale(0.5);
            coin_sound.play();

            sprite.destroy();
        }

    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else {
            // If no keys are pressed, the player keeps still
            this.player.setVelocityX(0);
            // Only show the idle animation if the player is footed
            // If this is not included, the player would look idle while jumping
            if (this.player.body.onFloor()) {
                this.player.play('idle', true);
            }
        }

// Player can jump while walking any direction by pressing the space bar
// or the 'UP' arrow
        if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
            this.player.setVelocityY(-350);
            this.player.play('jump', true);
        }

        if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(false);
        } else if (this.player.body.velocity.x < 0) {
            // otherwise, make them face the other side
            this.player.setFlipX(true);
        }
    }
}



// Escena 3
class Scene2 extends Phaser.Scene {
    constructor() {
        super({key: 'Scene2'});
    }

    preload() {
        this.load.image('background2', 'assets/images/background.jpg');
        this.load.image('spike', 'assets/images/spike.png');
        this.load.image('lava', 'assets/images/lava.png');
        this.load.image('door2', 'assets/images/door.png');
        this.load.image('monster2', 'assets/images/monster.png');
        this.load.atlas('player', 'assets/images/kenney_player.png', 'assets/images/kenney_player_atlas.json');
        this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');

        this.load.tilemapTiledJSON('map2', 'assets/tilemaps/level2.json');

        this.load.spritesheet('star2', 'assets/images/star.png', {frameWidth: 48, frameHeight: 48})

        this.load.audio('coin_sound', 'assets/sounds/Cash Money Sound Effect (mp3cut.net).m4a');
        this.load.audio('die_sound', 'assets/sounds/mort (mp3cut.net).mp3');

    }

    create() {
        const map = this.make.tilemap({key: 'map2'});

        const tileset = map.addTilesetImage('kenney_simple_platformer', 'tiles');
        const backgroundImage1 = this.add.image(0, 0, 'background2').setOrigin(0, 0);

        const platforms = map.createLayer('Platforms', tileset, 0, 0);

        backgroundImage1.setScale(1, 1);

        platforms.setCollisionByExclusion(-1, true);

        coin_sound = this.sound.add('coin_sound',);
        die_sound = this.sound.add('die_sound');

        this.star1 = this.physics.add.sprite(500, 2100, 'star2')
        this.physics.add.collider(this.star1, platforms)

        this.star2 = this.physics.add.sprite(800, 1950, 'star2')
        this.physics.add.collider(this.star2, platforms)

        this.star3 = this.physics.add.sprite(100, 1680, 'star2')
        this.physics.add.collider(this.star3, platforms)

        this.star4 = this.physics.add.sprite(900, 1580, 'star2')
        this.physics.add.collider(this.star4, platforms)

        this.star5 = this.physics.add.sprite(1200, 1300, 'star2')
        this.physics.add.collider(this.star5, platforms)

        this.star6 = this.physics.add.sprite(1200, 900, 'star2')
        this.physics.add.collider(this.star6, platforms)

        this.star7 = this.physics.add.sprite(800, 600, 'star2')
        this.physics.add.collider(this.star7, platforms)

        this.star8 = this.physics.add.sprite(450, 720, 'star2')
        this.physics.add.collider(this.star8, platforms)

        this.star9 = this.physics.add.sprite(300, 450, 'star2')
        this.physics.add.collider(this.star9, platforms)

        this.star10 = this.physics.add.sprite(670, 200, 'star2')
        this.physics.add.collider(this.star10, platforms)



        this.door = this.physics.add.sprite(1100, 370, 'door2')
        this.physics.add.collider(this.door, platforms)

        this.monster = this.physics.add.sprite(739, 600, 'monster2')
        this.physics.add.collider(this.monster, platforms)


        this.player = this.physics.add.sprite(150, 2150, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);


        platforms.setCollisionByExclusion(-1, true);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        this.physics.world.bounds.width = platforms.width;
        this.physics.world.bounds.height = platforms.height;

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'robo_player_',
                start: 2,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{key: 'player', frame: 'robo_player_0'}],
            frameRate: 10,
        });

        this.anims.create({
            key: 'jump',
            frames: [{key: 'player', frame: 'robo_player_1'}],
            frameRate: 10,
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Spikes').objects.forEach((spike) => {
            const spikeSprite = this.spikes.create(spike.x, spike.y - spike.height, 'spike').setOrigin(0);
            spikeSprite.body.setSize(spike.width, spike.height - 20).setOffset(0, 20);
        });

        this.lavas = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Lava').objects.forEach((lava) => {
            const lavaSprite = this.lavas.create(lava.x, lava.y - lava.height, 'lava').setOrigin(0);
            lavaSprite.body.setSize(lava.width, lava.height - 20).setOffset(0, 20);
        });

        this.physics.add.overlap(this.player, this.monster, playerHit, null, this);
        this.physics.add.collider(this.player, this.spikes, playerHit, null, this);
        this.physics.add.collider(this.player, this.lavas, playerHit, null, this);

        let scoreImage = this.add.image(10, 10, 'star2');
        scoreImage.setOrigin(0, 0);
        scoreImage.setScale(0.5);
        scoreText = this.add.text(80, 10, score.toString() + '/10', {
            fontFamily: 'Arial',
            fontSize: '24px',
            fill: '#000000'
        });

        scoreText.setOrigin(1, 0);
        scoreText.setScrollFactor(0);
        scoreImage.setScrollFactor(0);

        livesText = this.add.text(100, 10, '❤️: ' + lives, {fontSize: '24px', fill: '#000000'});
        livesText.setScrollFactor(0);

        this.physics.add.overlap(this.player, this.star1, function (player, star1) {
            incrementScore(star1);
        }, null, this);

        this.physics.add.overlap(this.player, this.star2, function (player, star2) {
            incrementScore(star2);
        }, null, this);

        this.physics.add.overlap(this.player, this.star3, function (player, star3) {
            incrementScore(star3);
        }, null, this);

        this.physics.add.overlap(this.player, this.star4, function (player, star4) {
            incrementScore(star4);
        }, null, this);

        this.physics.add.overlap(this.player, this.star5, function (player, star5) {
            incrementScore(star5);
        }, null, this);

        this.physics.add.overlap(this.player, this.star6, function (player, star6) {
            incrementScore(star6);
        }, null, this);

        this.physics.add.overlap(this.player, this.star7, function (player, star7) {
            incrementScore(star7);
        }, null, this);

        this.physics.add.overlap(this.player, this.star8, function (player, star8) {
            incrementScore(star8);
        }, null, this);

        this.physics.add.overlap(this.player, this.star9, function (player, star9) {
            incrementScore(star9);
        }, null, this);

        this.physics.add.overlap(this.player, this.star10, function (player, star10) {
            incrementScore(star10);
        }, null, this);

        this.physics.add.overlap(this.player, this.door, level2ToVictory, null, this);

        function incrementScore(sprite) {
            score++;
            scoreText.setText(score.toString() + '/10');
            scoreImage.setTexture('star2');
            scoreImage.setScale(0.5);
            coin_sound.play();

            sprite.destroy();
        }
    }

    update(){
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-200);
                if (this.player.body.onFloor()) {
                    this.player.play('walk', true);
                }
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(200);
                if (this.player.body.onFloor()) {
                    this.player.play('walk', true);
                }
            } else {
                // If no keys are pressed, the player keeps still
                this.player.setVelocityX(0);
                // Only show the idle animation if the player is footed
                // If this is not included, the player would look idle while jumping
                if (this.player.body.onFloor()) {
                    this.player.play('idle', true);
                }
            }

// Player can jump while walking any direction by pressing the space bar
// or the 'UP' arrow
            if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
                this.player.setVelocityY(-350);
                this.player.play('jump', true);
            }

            if (this.player.body.velocity.x > 0) {
                this.player.setFlipX(false);
            } else if (this.player.body.velocity.x < 0) {
                // otherwise, make them face the other side
                this.player.setFlipX(true);
            }
        }



}

// Escena 4
class winScene extends Phaser.Scene {
    constructor() {
        super({key: 'winScene'});
    }

    preload() {
        this.load.image('background5', 'assets/images/winingScene.jpg');
        this.load.image('homeButton2', 'assets/images/61972.png');
        this.load.image('congrats', 'assets/images/congratulations.png');
        this.load.audio('winSound', 'assets/sounds/winwinwin.mp3');
    }

    create() {
        const background5 = this.add.image(0, 0, 'background5').setOrigin(0, 0);
        background5.setScale(1, 1);
        const congrats = this.add.image(0, 0, 'congrats').setOrigin(0, 0);
        congrats.setScale(1, 1);

        const homeButton2 = this.add.sprite(400, 500, 'homeButton2').setInteractive();

        winSound = this.sound.add('winSound', {loop: false});
        winSound.volume = 1
        winSound.play();


        homeButton2.on('pointerover', () => {
            homeButton2.setTexture('homeButton2');
            this.input.setDefaultCursor('pointer');
        });

        homeButton2.on('pointerout', () => {
            homeButton2.setTexture('homeButton2');
            this.input.setDefaultCursor('auto');
        });

        homeButton2.on('pointerup', () => {
            this.scene.start('StartScene');
            this.input.setDefaultCursor('auto');
        });    }

}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameOverScene'});
    }

    preload() {
        this.load.image('background6', 'assets/images/loseScene.jpg');
        this.load.image('homeButton3', 'assets/images/61972.png');
        this.load.image('gameover', 'assets/images/gameover.png');
        this.load.audio('loseSound', 'assets/sounds/mortmort.mp3');
    }

    create() {
        const background6 = this.add.image(0, 0, 'background6').setOrigin(0, 0);
        background6.setScale(1, 1);
        const congrats = this.add.image(0, 0, 'gameover').setOrigin(-0.5, -2);
        congrats.setScale(1, 1);

        const homeButton3 = this.add.sprite(400, 400, 'homeButton3').setInteractive();

        winSound = this.sound.add('loseSound', {loop: false});
        winSound.volume = 1
        winSound.play();


        homeButton3.on('pointerover', () => {
            homeButton3.setTexture('homeButton3');
            this.input.setDefaultCursor('pointer');
        });

        homeButton3.on('pointerout', () => {
            homeButton3.setTexture('homeButton3');
            this.input.setDefaultCursor('auto');
        });

        homeButton3.on('pointerup', () => {
            this.scene.start('StartScene');
            this.input.setDefaultCursor('auto');
        });    }
}

// Configuración del juego
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [StartScene, Scene1, Scene2, GameOverScene, winScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            //300
            debug: false
        }
    },
};

function playerHit(player) {

    if (lives === 1) {
        this.scene.start('GameOverScene');
        try {
            fondo.pause()
        }catch (e){
        }
        try {
            fondo.pause()
        }catch (e){
        }
    } else if (player.y+64 < this.monster.y){
        mataMonstre = this.sound.add('mataMonstre', {loop: false});
        mataMonstre.volume = 1
        mataMonstre.play();
        this.monster.destroy()
    } else{
        die_sound.play();
        this.physics.pause();
        player.setY(this.player.y - 500);
        lives--
        livesText.setText('❤️: ' + lives);
        // Set velocity back to 0
        player.setVelocity(0, 0);
        // Put the player back in its original position
        player.setX(150);
        player.setY(2150);
        // Use the default `idle` animation
        player.play('idle', true);
        // Set the visibility to 0 i.e. hide the player
        player.setAlpha(0);
        // Add a tween that 'blinks' until the player is gradually visible
        let tw = this.tweens.add({
            targets: player,
            alpha: 1,
            duration: 100,
            ease: 'Linear',
            repeat: 5,
        });
        setTimeout(() => {
            this.physics.resume();
        }, 600);
    }
}

function level1ToLevel2() {
    if (score >= 5){
        score = 0;
        this.scene.start('Scene2');
    }
}

function level2ToVictory() {
    if (score >= 10){
        backgroundSoundStart.stop();
        this.scene.start('winScene');
    }
}

// Creación del juego
const game = new Phaser.Game(config);



