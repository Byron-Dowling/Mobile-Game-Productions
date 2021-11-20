/**
 * Byron Dowling
 * Mobile Game Productions Summer 1 2021
 * 
 * This program is designed to run a space blaster style game utilizing the built
 * in functionality of the JS Phaser engine. Enemy AI behavior is defined to 
 * provide a challenge to the user as the game progresses.
 * 
 * Additional features added from starter code include:
 *  - Background music
 *  - Sound effects for player bullet
 *  - Different sound effect for enemy bullet
 *  - Way to randomly spawn different enemy type
 *  - Different AI paramters for said different enemy types
 *  - Background imagery on Title Screen and Main Scene
 *  - Different text style and color
 */

class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        // Username the player entered
        this.username = "";
        // Variable to mark if the game is over
        this.gameOver = false;
        // Score counter
        this.score = 0;
        this.scoreText = null;
        // Firebase stuff
        this.database = firebase.firestore();
        this.scoreTable = this.database.collection('scores');
        // Player object
        this.player = null;
        this.plySpd = 400;
        this.plyBullets = [];
        // Joystick object
        this.joystick = null;
        this.controlsEnabled = false;
        // Shooting variables
        this.shooting = false; // Is the player shooting?
        this.lastShot = 0; // Time of last shot (timestamp, ms)
        this.shotTimeout = 250; // Time between shots (ms)
        // Enemy objects
        this.enemies = [];
        this.enemyBullets = [];
        // Timing of enemy spawns
        this.lastSpawned = 0; // Time of last spawn (timestamp, ms)
        this.spawnTime = 3000; // Time between spawns at start (ms)
        this.minSpawnTime = 100; // Smallest spawnTime can get
        // Colliders
        this.bulletEnemyCollider = null;
        this.bulletPlayerCollider = null;
        this.enemyPlayerCollider = null;
    }

    init(data) {
        // Get the username from the title screen
        this.username = data.username;
        if (this.username == "") {
            // No username was provided
            this.username = "Silly Goose";
        }
    }

    preload() 
    {
        // Spritesheets must also include width and height of frames when loading
        this.load.spritesheet('explosion', './assets/Explosion.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        // Load the spaceship
        this.load.spritesheet('player', './assets/ship.png', {
            frameWidth: 16,
            frameHeight: 24
        });

        // Load the lasers
        this.load.spritesheet('lasers', './assets/laser-bolts.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        // Loading enemy ships
        this.load.spritesheet('enemy-m', './assets/enemy-medium.png', {
            frameWidth: 32,
            frameHeight: 16
        });

        // Loading enemy ships
        this.load.spritesheet('enemy-l', './assets/power-up.png', {
            frameWidth: 32,
            frameHeight: 16
        });

        // Loading enemy ships
        this.load.spritesheet('enemy-s', './assets/enemy-small.png', {
            frameWidth: 32,
            frameHeight: 16
        });

        // Loading background image
        this.load.image('background_ms', './assets/Space_Stars2.png');
        this.load.audio('p_shot', './assets/shot_10.wav');
        this.load.audio('e_shot', './assets/FX060.mp3');
        this.load.audio('exp', './assets/explosion_3.wav');

    }

    create() 
    {
        // Background Space image for landing screen
        let bg_Space = this.add.image(400, 400, 'background_ms');
        bg_Space.setScale(13);
    
        // Create the text for keeping track of score
        this.scoreText = this.add.text(225, 10, `${this.score}`, {
            fontSize: '40px'
        });
        // Create player object
        this.createPlayer();
        // A virtual joystick for moving the player
        this.joystick = new VirtualJoystick(this, 60, 740, 50);
        // Set up the shooting controls
        this.createShootingControls();
        // Enable control of the player ship
        this.controlsEnabled = true;
    }

    update() {
        // Update the score text
        this.scoreText.setText(`${this.score}`);
        // Control the player
        this.handlePlayerControls();
        // Check for spawning enemies
        if (this.now() >= this.lastSpawned + this.spawnTime) {
            this.spawnEnemy();
        }
        // Control the enemy ships
        for (let enemy of this.enemies) {
            enemy.ai.update();
        }
        // End the game if necessary
        if (this.gameOver) {
            this.onGameOver();
        }
    }

    createPlayer() {
        this.player = this.physics.add.sprite(225, 650, 'player');
        this.player.setScale(4);
        // Create aniamtions for the player
        this.generatePlayerAnimations();
        // Collide the player with world bounds
        this.player.setCollideWorldBounds(true);
        // Start the player in idle
        this.player.anims.play('idle');
    }

    createShootingControls() {
        // Handle shooting on desktop using spacebar
        this.input.keyboard.on('keydown-SPACE', () => {
            this.shooting = true;
        });
        this.input.keyboard.on('keyup-SPACE', () => {
            this.shooting = false;
        });
        // Create a button to shoot with on mobile
        let shootButton = this.add.circle(390, 740, 50, 0xFF0000, 0.4);
        shootButton.setInteractive();
        // When the player hits the button, start shooting
        shootButton.on('pointerdown', () => {
            this.shooting = true;
        });
        // If the player stops clicking, or moves the pointer out of the
        // button, stop shooting
        shootButton.on('pointerup', () => {
            this.shooting = false;
        });
        shootButton.on('pointerout', () => {
            this.shooting = false;
        });
    }

    createEnemy(x, y, num) 
    {
        // Num passed in is used to determine which enemy type to design
        if (num % 2 == 0 && num < 200)
        {
        // Medium-sized Enemy
        let enemy = this.physics.add.sprite(x, y, 'enemy-m');
        enemy.setScale(3);

        enemy.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('enemy-m', {
                start: 0,
                end: 1
            }),
            frameRate: 8,
            repeat: -1
        });

        // Explosion animation
        enemy.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 7
            }),
            frameRate: 8
        });
		
        // At the end of explosion, die.
        enemy.on('animationcomplete-explode', () => {
            enemy.destroy();
        });
		
        // Play idle by default
        enemy.anims.play('idle');

        // Attach an AI controller to this object
        enemy.ai = new EnemyM(this, enemy);

        // Add the bullet to the list of enemies
        this.enemies.push(enemy);
        this.setCollideBulletEnemy();
        // Rebuild the enemy and player collider
        this.setCollidePlayerEnemy();
    }

    else if(num >= 200)
    {
        // Small-sized Enemy
        let enemy = this.physics.add.sprite(x, y, 'enemy-l');
        enemy.setScale(3);

        enemy.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('enemy-l', {
                start: 0,
                end: 2
            }),
            frameRate: 6,
            repeat: -1
        });

            // Explosion animation
            enemy.anims.create({
                key: 'explode',
                frames: this.anims.generateFrameNumbers('explosion', {
                    start: 0,
                    end: 7
                }),
                frameRate: 8
            });
            // At the end of explosion, die.
            enemy.on('animationcomplete-explode', () => {
                enemy.destroy();
            });
            // Play idle by default
            enemy.anims.play('idle');
            // Attach an AI controller to this object
            enemy.ai = new EnemyS(this, enemy);

            // Changing AI parameters for quicker shooting time and more bullets
            // enemy.ai.shotTimeout = 500;
            // enemy.ai.bullets = 10;

            // Add the bullet to the list of enemies
            this.enemies.push(enemy);
            this.setCollideBulletEnemy();
            // Rebuild the enemy and player collider
            this.setCollidePlayerEnemy();
    }

    else
    {
        // Large Enemy
        let enemy = this.physics.add.sprite(x, y, 'enemy-s');
        enemy.setScale(3);

        enemy.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('enemy-s', {
                start: 0,
                end: 0
            }),
            frameRate: 6,
            repeat: -1
        });

            // Explosion animation
            enemy.anims.create({
                key: 'explode',
                frames: this.anims.generateFrameNumbers('explosion', {
                    start: 0,
                    end: 7
                }),
                frameRate: 8
            });
            // At the end of explosion, die.
            enemy.on('animationcomplete-explode', () => {
                enemy.destroy();
            });
            // Play idle by default
            enemy.anims.play('idle');
            // Attach an AI controller to this object
            enemy.ai = new EnemyM(this, enemy);

            // Changing AI parameters for quicker shooting time and more bullets
            enemy.ai.shotTimeout = 5000;
            enemy.ai.bullets = 3;

            // Add the bullet to the list of enemies
            this.enemies.push(enemy);
            this.setCollideBulletEnemy();
            // Rebuild the enemy and player collider
            this.setCollidePlayerEnemy();
    }

    }

    createEnemyBullet(x, y, flipped) {
        // Creat the sprite object
        let bullet = this.physics.add.sprite(x, y, 'lasers');
        bullet.setScale(4);
        // Create the animation
        bullet.anims.create({
            // Name of the animation
            key: 'bullet',
            // Generate all frame numbers between 0 and 7
            frames: this.anims.generateFrameNumbers('lasers', {
                start: 2,
                end: 3
            }),
            // Animation should be slower than base game framerate
            frameRate: 8,
            repeat: -1
        });
        // Run the animation
        bullet.anims.play('bullet');
        this.sound.play('e_shot',{
            volume: 0.2
        });

        // Set the velocity
        if (flipped) {
            bullet.setVelocity(0, 600);
            bullet.setFlipY(true);
        } else {
            bullet.setVelocity(0, -600);
        }
        bullet.setCollideWorldBounds(true);
        // Turning this on will allow you to listen to the 'worldbounds' event
        bullet.body.onWorldBounds = true;
        // 'worldbounds' event listener
        bullet.body.world.on('worldbounds', (body) => {
            // Check if the body's game object is the sprite you are listening for
            if (body.gameObject === bullet) {
                // Destroy the bullet
                bullet.destroy();
            }
        });
        // Add the bullet to the list of bullets
        this.enemyBullets.push(bullet);
        this.setCollideBulletPlayer();
    }

    createPlayerBullet(x, y, flipped) {
        // Creat the sprite object
        let bullet = this.physics.add.sprite(x, y, 'lasers');
        bullet.setScale(4);
        // Create the animation
        bullet.anims.create({
            // Name of the animation
            key: 'bullet',
            // Generate all frame numbers between 0 and 7
            frames: this.anims.generateFrameNumbers('lasers', {
                start: 2,
                end: 3
            }),
            // Animation should be slower than base game framerate
            frameRate: 8,
            repeat: -1
        });
        // Run the animation
        bullet.anims.play('bullet');
        this.sound.play('p_shot',{
            volume: 0.2
        });
        // Set the velocity
        if (flipped) {
            bullet.setVelocity(0, 600);
            bullet.setFlipY(true);
        } else {
            bullet.setVelocity(0, -600);
        }
        bullet.setCollideWorldBounds(true);
        // Turning this on will allow you to listen to the 'worldbounds' event
        bullet.body.onWorldBounds = true;
        // 'worldbounds' event listener
        bullet.body.world.on('worldbounds', (body) => {
            // Check if the body's game object is the sprite you are listening for
            if (body.gameObject === bullet) {
                // Destroy the bullet
                bullet.destroy();
            }
        });
        // Add the bullet to the list of bullets
        this.plyBullets.push(bullet);
        this.setCollideBulletEnemy();
    }

    destroyPlayer() {
        // Blow up the player
        this.sound.play('exp',{
            volume: 0.1
        });
        this.player.anims.play('explode');
        // Prevent multiple collision by removing player physics
        // body
        this.player.body.destroy();
        // Disable the player from further controlling the ship
        this.controlsEnabled = false;
    }

    generatePlayerAnimations() {
        // Create the idle animation
        this.player.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [2, 7]
            }),
            frameRate: 12,
            repeat: -1
        });
        // Create left/right animations
        this.player.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [0, 5]
            }),
            frameRate: 12,
            repeat: -1
        });
        this.player.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [4, 9]
            }),
            frameRate: 12,
            repeat: -1
        });
        // Explosion animation
        this.player.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 7
            }),
            frameRate: 8
        });
        // After the player is done exploding, we should have a callback
        this.player.on('animationcomplete-explode', () => {
            this.onPlayerExploded();
        });
    }

    handlePlayerControls() {
        if (this.player && this.controlsEnabled) {
            // Handle player movement
            this.player.setVelocity(this.joystick.joyX() * this.plySpd, 0);
            // If the player is holding the button, shoot
            if (this.shooting && this.now() > this.lastShot + this.shotTimeout) {
                this.createPlayerBullet(this.player.x, this.player.y - 80);
                this.lastShot = this.now();
            }
        }
    }

    /**
     * @returns The current time as a ms timestamp
     */
    now() {
        return new Date().getTime();
    }

    /**
     * Runs during update() if the "gameOver" flag has been set.
     * Resets the game.
     */
    onGameOver() {
        // Save the score
        this.saveScore();
        // Reset timers for enemy spawn
        this.lastSpawned = 0;
        this.spawnTime = 5000;
        // Destroy all the stuff
        this.player.destroy();
        for (let e of this.enemies) {
            e.destroy();
        }
        for (let b of this.enemyBullets) {
            b.destroy();
        }
        // Stop running updates on enemies
        this.enemies = [];
        // Reset the bullets
        this.enemyBullets = [];
        // Reset game over variable
        this.gameOver = false;
        // Reset score
        this.score = 0;
        // Restart the game
        this.scene.start('TitleScene');
    }

    onPlayerExploded() {
        // The game will reset immediately when the player is done exploding.
        // Change this if you want multiple lives...
        this.gameOver = true;
    }

    /**
     * Saves the player's score to the firestore database
     */
    async saveScore() {
        let result = await this.scoreTable.add({
            name: this.username,
            score: this.score
        });
        if (result) console.log("Score saved successfully!");
        else console.log("Score failed to save!");
    }

    setCollideBulletEnemy() {
        // Destroy any existing colliders
        if (this.bulletEnemyCollider != null) {
            this.bulletEnemyCollider.destroy();
        }
        // Add collision with all existing bullets
        this.bulletEnemyCollider =
            this.physics.add.overlap(this.enemies, this.plyBullets,
                (en, bu) => {
                    // Increase the player's score
                    this.score++;
                    // Destroy the bullet
                    bu.destroy();
                    this.sound.play('exp',{
                        volume: 0.1
                    });
                    // Make the enemy explode
                    en.anims.play('explode');
                    // Make the enemy "float" down
                    en.setVelocity(0, this.plySpd / 2);
                    // Remove the bullet from the list of bullets
                    this.plyBullets = this.plyBullets.filter((b) => {
                        return b !== bu;
                    });
                    // Remove the enemy from the list of enemies
                    this.enemies = this.enemies.filter((e) => {
                        return e !== en;
                    });
                });
    }

    setCollideBulletPlayer() {
        // Destroy any existing colliders
        if (this.bulletPlayerCollider != null) {
            this.bulletPlayerCollider.destroy();
        }
        // Add collision with player to all bullets
        this.bulletPlayerCollider =
            this.physics.add.overlap(this.enemyBullets, this.player,
                (bullet, player) => {
                    // Destroy the bullet
                    bullet.destroy();
                    // Remove the bullet from the list of bullets
                    this.enemyBullets = this.enemyBullets.filter((b) => {
                        return b !== bullet;
                    });
                    // Start to destroy the player
                    this.destroyPlayer();
                }
            );
    }

    setCollidePlayerEnemy() {
        // Destroy any existing collision handler
        if (this.enemyPlayerCollider != null) {
            this.enemyPlayerCollider.destroy();
        }
        // Create a new collision handler
        this.enemyPlayerCollider =
            this.physics.add.overlap(this.enemies, this.player,
                (en, ply) => {
                    // Explode and enemy
                    en.anims.play('explode');
                    // Set the enemy velocity to "float" down
                    en.setVelocity(0, this.plySpd / 2);
                    // Remove the enemy from the list of enemies
                    this.enemies = this.enemies.filter((e) => {
                        return e !== en;
                    });
                    // Destroy the player
                    this.destroyPlayer();
                }
            );
    }

    /**
     * Spawns an enemy at a random location and sets spawn timer.
     * Different from createEnemy(), which only creates an enemy.
     */
    spawnEnemy() {
        // Pick a random x coordinate without set bounds
        // x will be between 25 and 425
        const x = (Math.random() * 360) + 40;

        // Casting X as a whole number to be used to pick a random enemy design
        let num = Math.round(x)

        // Creates the actual enemy object at the given position
        this.createEnemy(x, 0, num);

        // Set the spawn timer and time between spawns
        this.lastSpawned = this.now();

        if (this.score % 5 == 0)
        {
            this.spawnTime *= 0.95;
        }

        // Puts a hard limit on how small spawn time can get
        if (this.spawnTime < this.minSpawnTime) {
            this.spawnTime = this.minSpawnTime;
        }
    }
}
