class MS5 extends Phaser.Scene {
    constructor() {
        super("MS5")
        this.plySpd = 400;
        this.playerScore = null;
        this.worldLevel = null;
        this.player = null;
        this.joystick = null;
        this.controlsEnabled = false;
        this.jumping = false;
        this.ground = null;
        this.Distance = Phaser.Math.Distance;
        this.gameOver = false;
        this.winner = false;

        this.signals = SignalManager.get();
        this.walkSpeed = 200;
        this.jumpSpeed = 325;

        this.enemies = [];
        this.enemyImg = null;
        this.enemyPlayerCollider = null;

        // Camera object
        this.spriteCamera = null;

        // Tilemap variables
        this.map = null;
        this.tileset = null;
        this.layers = {
            background: null,
            foreground: null,
            overhead: null
        }

        // Firebase stuff
        this.database = firebase.firestore();
        this.scoreTable = this.database.collection('HHSH');
    }

    init(data) {
        // Get the username from the title screen
        this.username = data.username;
        if (this.username == "") {
            // No username was provided
            this.username = "N/A";
        }
    }


    preload() {
        this.load.audio('Concert', './assets/Concert.mp3');
        this.load.audio('exp', './assets/explosion_3.wav');
        this.load.spritesheet('player', './assets/spr_RoninIdle_strip.png',
            {
                frameWidth: 64,
                frameHeight: 64
            });

        this.load.spritesheet('runner', './assets/spr_RoninRun_strip.png',
            {
                frameWidth: 64,
                frameHeight: 64
            });

        this.load.spritesheet('bag of bones', './assets/Idle.png',
            {
                frameWidth: 150,
                frameHeight: 150
            });

        this.load.spritesheet('explosion', './assets/Explosion.png',
            {
                frameWidth: 32,
                frameHeight: 32
            });

        this.load.image('background', './assets/0.png');


        // Level two stuff
        this.load.image('Tiles', './assets/Level_3_set.png');
        this.load.tilemapTiledJSON('Map', './assets/Level_3.json');
    }


    create() {
        // Background music
        let backgroundMusic = this.sound.add('Concert', { volume: 0.1 });
        backgroundMusic.play(
            {
                loop: true
            });


        //Add the Tilemap
        this.createMap();

        // Background imagery
        let bg_Sky = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'background').setOrigin(0.5);
        bg_Sky.setScale(100, 1.5).setDepth(-5);


        // Creating player and enemy and adding physics to them
        this.createPlayer();
        //Create an enemy and place on a path
        //x1 is the starting position, x2 is the finished position, y is the constant height
        // this.enemyCreate(200,230,430);
        this.createEnemies();

        this.layers.foreground.setCollisionBetween(0, 10000, true);
        this.physics.add.collider(this.player, this.layers.foreground);
        //this.physics.add.collider(this.enemyImg, this.layers.foreground);


        // Start the controls overlay
        this.scene.launch("ControlScene");
        this.signals.on('joystick', (data) => {
            this.movePlayer(data);
        });

        this.controlsEnabled = true;

        this.signals.on('jump', () => {
            if (this.player.body.blocked.down) {
                this.player.setVelocityY(-this.jumpSpeed);
            }
        });


        // Should allow jumping with the spacebar
        this.input.keyboard.on('keydown-SPACE', () => {
            this.signals.emit('jump');
        });

        this.signals.on('jump', () => {
            if (this.player.body.blocked.down) {
                this.player.setVelocityY(-this.jumpSpeed);
            }
        });
        this.input.keyboard.on('keyup-SPACE', () => {
            this.jumping = false;
        });

        this.createCamera();
    }


    createCamera() {
        //Add a camera to the scene that focus on the player within a certain area
        this.spriteCamera = this.cameras.main.setBounds(0, 0, 10000, 10000);
        this.spriteCamera.setZoom(1.5);
        this.spriteCamera.startFollow(this.player);
    }


    update() {
        this.setCollidePlayerEnemy();

        //console.log(this.player.x, this.player.y)

        let x1 = 624;
        let x2 = 492;
        let x3 = 1032;
        let x4 = 784;
        let x5 = 1648;
        let x6 = 1905;
        let x7 = 2537;
        let x8 = 2302;
        let x9 = 2028;
        let x10 = 1964;
        let x11 = 1419;
        let x12 = 1227;
        let x13 = 720;
        let x14 = 543;
        let x15 = 2895;
        let x16 = 2753;

        // The Limit X of the game
        if (this.enemyImg.x == x2) {
            this.enemyImg.flipX = false;
        }

        else if (this.enemyImg.x == x1) {
            this.enemyImg.flipX = true;
        }


        if (this.enemyImg2.x == x4) {
            this.enemyImg2.flipX = false;
        }

        else if (this.enemyImg2.x == x3) {
            this.enemyImg2.flipX = true;
        }


        if (this.enemyImg3.x == x5) {
            this.enemyImg3.flipX = false;
        }

        else if (this.enemyImg3.x == x6) {
            this.enemyImg3.flipX = true;
        }


        if (this.enemyImg4.x == x8) {
            this.enemyImg4.flipX = false;
        }

        else if (this.enemyImg4.x == x7) {
            this.enemyImg4.flipX = true;
        }


        if (this.enemyImg5.x == x10) {
            this.enemyImg5.flipX = false;
        }

        else if (this.enemyImg5.x == x9) {
            this.enemyImg5.flipX = true;
        }


        if (this.enemyImg6.x == x12) {
            this.enemyImg6.flipX = false;
        }

        else if (this.enemyImg6.x == x11) {
            this.enemyImg6.flipX = true;
        }


        if (this.enemyImg7.x == x14) {
            this.enemyImg7.flipX = false;
        }

        else if (this.enemyImg7.x == x13) {
            this.enemyImg7.flipX = true;
        }


        if (this.enemyImg8.x == x16) {
            this.enemyImg8.flipX = false;
        }

        else if (this.enemyImg8.x == x15) {
            this.enemyImg8.flipX = true;
        }



        // Ending banner
        if (this.player.x >= 3150 && this.player.y >= 1468)
        {
            // Stop the Music
            this.sound.stopAll(); 
            this.scene.start("MS4");      
            this.gameOver = true;
        }


        if (this.gameOver == true) 
        {
            // Stop the Music
            this.sound.stopAll();       
            this.gameOver = false;
            this.scene.stop('ControlScene')
            this.scene.start('GameOver')
        }
    }

        // Moving to the next level after completing level
        loadNextLevel()
        {
            if(this.winner == true)
            {
                this.winner = false;
                this.sound.stopAll();       // Stop the Music
                this.scene.stop('ControlScene');
                this.scene.start("WinnerScene");
            }
    
        }


    //Create the Tilemap
    createMap() {
        this.map = this.add.tilemap('Map');

        // Create a variable that store the tileset images
        this.tileset = this.map.addTilesetImage('Level_3_set', 'Tiles');

        //Add the background(layer the player and entities walk infront of)
        this.backgroundLayer = this.map.createLayer('background', this.tileset, 0, 0);
        this.backgroundLayer.setDepth(2);

        //Add the foreground(layer which the player and entities walk on)
        this.foregroundLayer = this.map.createLayer('foreground', this.tileset, 0, 0);
        this.foregroundLayer.setDepth(1);

        //Add the overhead(layer which the player and entities walk behind)
        this.overheadLayer = this.map.createLayer('overhead', this.tileset, 0, 0);
        this.overheadLayer.setDepth(0);

        //Put the layers in an object so that they can accessed from different functions
        this.layers =
        {
            background: this.backgroundLayer,
            foreground: this.foregroundLayer,
            overhead: this.overheadLayer
        };
    }


    createPlayer() {
        this.player = this.physics.add.sprite(40, 394, 'player');
        //this.player = this.physics.add.sprite(885, 140, 'player');
        this.player.setScale(1);

        // this.player.setGravity(0, 300);
        this.player.setSize(30, 35);
        this.player.body.setAllowGravity(true);
        this.player.body.setDamping(true);
        this.player.setDrag(0.9, 0.95);

        // Create aniamtions for the player
        this.generatePlayerAnimations();

        // Start the player in idle
        this.player.anims.play('idle');
    }


    // Controls to move the player.
    movePlayer(joystick) {
        if (joystick.joyX() < 0) {
            this.player.setVelocityX(this.walkSpeed * joystick.joyX());
            this.player.flipX = true;
            //this.player.anims.play('right');
        }

        else if (joystick.joyX() > 0) {
            this.player.flipX = false;
            this.player.setVelocityX(this.walkSpeed * joystick.joyX());
            //this.player.anims.play('left');
        }

        else {
            this.player.setVelocityX(0);
            //this.player.anims.play('idle');
        }
    }

    generatePlayerAnimations() {
        // Create the idle animation
        this.player.anims.create(
            {
                key: 'idle',
                frames: this.anims.generateFrameNumbers('player',
                    {
                        start: 0, end: 7
                    }),
                frameRate: 8,
                repeat: -1
            });


        // Create left / right animations
        this.player.anims.create(
            {
                key: 'left',
                frames: this.anims.generateFrameNumbers('runner',
                    {
                        start: 0, end: 9
                    }),
                frameRate: 6,
                repeat: -1
            });

        this.player.anims.create(
            {
                key: 'right',
                frames: this.anims.generateFrameNumbers('runner',
                    {
                        start: 0, end: 9
                    }),
                frameRate: 6,
                repeat: -1
            });


        // Explosion animation
        this.player.anims.create(
            {
                key: 'boom',
                frames: this.anims.generateFrameNumbers('explosion',
                    {
                        start: 0,
                        end: 7
                    }),
                frameRate: 8
            })
    }

    
    createEnemies() 
    {
        // First Enemy
        let path1 = this.add.path(624, 494)
        path1.lineTo(492, 494)
        this.enemyImg = this.add.follower(path1, 624, 494, 'bag of bones'); 
        this.enemyImg.setScale(0.75)

        this.enemyImg.startFollow(
        {
            duration: 3500,
            yoyo: true,
            repeat: -1
        });

        this.enemyImg = this.physics.add.existing(this.enemyImg);
        this.enemyImg.body.setAllowGravity(false);
        this.enemyImg.body.setSize(32, 40);

        this.enemyImg.anims.create(
            {
                key: 'idle',
                frames: this.anims.generateFrameNumbers('bag of bones',
                    {
                        start: 0,
                        end: 3
                    }),
                frameRate: 8,
                repeat: -1
            });


        this.enemyImg.anims.create(
            {
                key: 'boom',
                frames: this.anims.generateFrameNumbers('explosion',
                    {
                        start: 0,
                        end: 7
                    }),
                frameRate: 8
            });

        
        this.enemyImg.on('animationcomplete-boom', () => 
        {
            this.enemyImg.destroy();
        });

        this.enemyImg.anims.play('idle');


        // Second Enemy
        let path2 = this.add.path(1032, 526)
        path2.lineTo(784, 526)
        this.enemyImg2 = this.add.follower(path2, 1032, 526, 'bag of bones'); 
        this.enemyImg2.setScale(0.75);

        this.enemyImg2.startFollow(
        {
            duration: 3500,
            yoyo: true,
            repeat: -1
        });

        this.enemyImg2 = this.physics.add.existing(this.enemyImg2);
        this.enemyImg2.body.setAllowGravity(false);
        this.enemyImg2.body.setSize(32, 40);

        this.enemyImg2.anims.create(
            {
                key: 'idle',
                frames: this.anims.generateFrameNumbers('bag of bones',
                    {
                        start: 0,
                        end: 3
                    }),
                frameRate: 8,
                repeat: -1
            }
            );


        this.enemyImg2.anims.create(
            {
                key: 'boom',
                frames: this.anims.generateFrameNumbers('explosion',
                    {
                        start: 0,
                        end: 7
                    }),
                frameRate: 8
            });

        
        this.enemyImg2.on('animationcomplete-boom', () => 
        {
            this.enemyImg2.destroy();
        });

        this.enemyImg2.anims.play('idle');


        // Third Enemy
        let path3 = this.add.path(1648, 463)
        path3.lineTo(1905, 463)
        this.enemyImg3 = this.add.follower(path3, 1648, 463, 'bag of bones'); 
        this.enemyImg3.setScale(0.75);

        this.enemyImg3.startFollow(
        {
            duration: 4500,
            yoyo: true,
            repeat: -1
        });

        this.enemyImg3 = this.physics.add.existing(this.enemyImg3);
        this.enemyImg3.body.setAllowGravity(false);
        this.enemyImg3.body.setSize(32, 40);

        this.enemyImg3.anims.create(
            {
                key: 'idle',
                frames: this.anims.generateFrameNumbers('bag of bones',
                    {
                        start: 0,
                        end: 3
                    }),
                frameRate: 8,
                repeat: -1
            }
            );


        this.enemyImg3.anims.create(
            {
                key: 'boom',
                frames: this.anims.generateFrameNumbers('explosion',
                    {
                        start: 0,
                        end: 7
                    }),
                frameRate: 8
            });

        
        this.enemyImg3.on('animationcomplete-boom', () => 
        {
            this.enemyImg3.destroy();
        });

        this.enemyImg3.anims.play('idle');


        // Fourth Enemy
        let path4 = this.add.path(2537, 1103)
        path4.lineTo(2302, 1103)
        this.enemyImg4 = this.add.follower(path4, 2537, 1103, 'bag of bones'); 
        this.enemyImg4.setScale(0.75);

        this.enemyImg4.startFollow(
        {
            duration: 4500,
            yoyo: true,
            repeat: -1
        });

        this.enemyImg4 = this.physics.add.existing(this.enemyImg4);
        this.enemyImg4.body.setAllowGravity(false);
        this.enemyImg4.body.setSize(32, 40);

        this.enemyImg4.anims.create(
            {
                key: 'idle',
                frames: this.anims.generateFrameNumbers('bag of bones',
                    {
                        start: 0,
                        end: 3
                    }),
                frameRate: 8,
                repeat: -1
            }
            );


        this.enemyImg4.anims.create(
            {
                key: 'boom',
                frames: this.anims.generateFrameNumbers('explosion',
                    {
                        start: 0,
                        end: 7
                    }),
                frameRate: 8
            });

        
        this.enemyImg4.on('animationcomplete-boom', () => 
        {
            this.enemyImg4.destroy();
        });

        this.enemyImg4.anims.play('idle');


        // Fifth Enemy
        let path5 = this.add.path(2028, 783)
        path5.lineTo(1964, 783)
        this.enemyImg5 = this.add.follower(path5, 2028, 783, 'bag of bones'); 
        this.enemyImg5.setScale(0.75);

        this.enemyImg5.startFollow(
        {
            duration: 4500,
            yoyo: true,
            repeat: -1
        });

        this.enemyImg5 = this.physics.add.existing(this.enemyImg5);
        this.enemyImg5.body.setAllowGravity(false);
        this.enemyImg5.body.setSize(32, 40);

        this.enemyImg5.anims.create(
            {
                key: 'idle',
                frames: this.anims.generateFrameNumbers('bag of bones',
                    {
                        start: 0,
                        end: 3
                    }),
                frameRate: 8,
                repeat: -1
            }
            );


        this.enemyImg5.anims.create(
            {
                key: 'boom',
                frames: this.anims.generateFrameNumbers('explosion',
                    {
                        start: 0,
                        end: 7
                    }),
                frameRate: 8
            });

        
        this.enemyImg5.on('animationcomplete-boom', () => 
        {
            this.enemyImg5.destroy();
        });

        this.enemyImg5.anims.play('idle');


        // Sixth Enemy
        let path6 = this.add.path(1419, 1039)
        path6.lineTo(1227, 1039)
        this.enemyImg6 = this.add.follower(path6, 1419, 1039, 'bag of bones'); 
        this.enemyImg6.setScale(0.75);

        this.enemyImg6.startFollow(
        {
            duration: 4500,
            yoyo: true,
            repeat: -1
        });

        this.enemyImg6 = this.physics.add.existing(this.enemyImg6);
        this.enemyImg6.body.setAllowGravity(false);
        this.enemyImg6.body.setSize(32, 40);

        this.enemyImg6.anims.create(
            {
                key: 'idle',
                frames: this.anims.generateFrameNumbers('bag of bones',
                    {
                        start: 0,
                        end: 3
                    }),
                frameRate: 8,
                repeat: -1
            }
            );


        this.enemyImg6.anims.create(
            {
                key: 'boom',
                frames: this.anims.generateFrameNumbers('explosion',
                    {
                        start: 0,
                        end: 7
                    }),
                frameRate: 8
            });

        
        this.enemyImg6.on('animationcomplete-boom', () => 
        {
            this.enemyImg6.destroy();
        });

        this.enemyImg6.anims.play('idle');


        // Seventh Enemy
        let path7 = this.add.path(720, 910)
        path7.lineTo(543, 910)
        this.enemyImg7 = this.add.follower(path7, 720, 910, 'bag of bones'); 
        this.enemyImg7.setScale(0.75);

        this.enemyImg7.startFollow(
        {
            duration: 4500,
            yoyo: true,
            repeat: -1
        });

        this.enemyImg7 = this.physics.add.existing(this.enemyImg7);
        this.enemyImg7.body.setAllowGravity(false);
        this.enemyImg7.body.setSize(32, 40);

        this.enemyImg7.anims.create(
            {
                key: 'idle',
                frames: this.anims.generateFrameNumbers('bag of bones',
                    {
                        start: 0,
                        end: 3
                    }),
                frameRate: 8,
                repeat: -1
            }
            );


        this.enemyImg7.anims.create(
            {
                key: 'boom',
                frames: this.anims.generateFrameNumbers('explosion',
                    {
                        start: 0,
                        end: 7
                    }),
                frameRate: 8
            });

        
        this.enemyImg7.on('animationcomplete-boom', () => 
        {
            this.enemyImg7.destroy();
        });

        this.enemyImg7.anims.play('idle');


        // Eighth Enemy
        let path8 = this.add.path(2895, 1166)
        path8.lineTo(2753, 1166)
        this.enemyImg8 = this.add.follower(path8, 2895, 1166, 'bag of bones'); 
        this.enemyImg8.setScale(0.75);

        this.enemyImg8.startFollow(
        {
            duration: 4500,
            yoyo: true,
            repeat: -1
        });

        this.enemyImg8 = this.physics.add.existing(this.enemyImg8);
        this.enemyImg8.body.setAllowGravity(false);
        this.enemyImg8.body.setSize(32, 40);

        this.enemyImg8.anims.create(
            {
                key: 'idle',
                frames: this.anims.generateFrameNumbers('bag of bones',
                    {
                        start: 0,
                        end: 3
                    }),
                frameRate: 8,
                repeat: -1
            }
            );


        this.enemyImg8.anims.create(
            {
                key: 'boom',
                frames: this.anims.generateFrameNumbers('explosion',
                    {
                        start: 0,
                        end: 7
                    }),
                frameRate: 8
            });

        
        this.enemyImg8.on('animationcomplete-boom', () => 
        {
            this.enemyImg8.destroy();
        });

        this.enemyImg8.anims.play('idle');
    }


    setCollidePlayerEnemy() {
        // Destroy any existing collision handler
        if (this.enemyPlayerCollider != null) {
            this.enemyPlayerCollider.destroy();
        }

        // Create a new collision handler
        this.enemyPlayerCollider =
            this.physics.add.overlap(this.enemyImg, this.player,
                (en, ply) => {
                    this.player.anims.play('boom');
                }
            );


        this.enemyPlayerCollider =
            this.physics.add.overlap(this.enemyImg2, this.player,
                (en, ply) => {
                    this.player.anims.play('boom');
                }
            );

        this.enemyPlayerCollider =
            this.physics.add.overlap(this.enemyImg3, this.player,
                (en, ply) => {
                    this.player.anims.play('boom');
                }
            );

        this.enemyPlayerCollider =
        this.physics.add.overlap(this.enemyImg4, this.player,
            (en, ply) => {
                this.player.anims.play('boom');
            }
        );

        this.enemyPlayerCollider =
        this.physics.add.overlap(this.enemyImg5, this.player,
            (en, ply) => {
                this.player.anims.play('boom');
            }
        );

        this.enemyPlayerCollider =
        this.physics.add.overlap(this.enemyImg6, this.player,
            (en, ply) => {
                this.player.anims.play('boom');
            }
        );

        this.enemyPlayerCollider =
        this.physics.add.overlap(this.enemyImg7, this.player,
            (en, ply) => {
                this.player.anims.play('boom');
            }
        );

        this.enemyPlayerCollider =
        this.physics.add.overlap(this.enemyImg8, this.player,
            (en, ply) => {
                this.player.anims.play('boom');
            }
        );

        this.player.on('animationcomplete-boom', () => {
            this.destroyPlayer()
            this.gameOver = true;
        });

    }


    destroyPlayer() {
        // Prevent multiple collision by removing player physics
        // body

        this.player.body.destroy();

        // Disable the player from further controlling movement
        this.controlsEnabled = false;

        this.gameOver = true;
    }

    //Create an enemy and put it on a path
    // enemyCreate(x1, x2, y) {
    //     let pathA = this.add.path(x1, y).lineTo(x2, y);
    //     let enemyB = this.add.follower(pathA, x1, y, 'bag of bones');
    //     enemyB.setScale(0.75);
    //     enemyB.startFollow({
    //         duration: 3500,
    //         yoyo: true,
    //         repeat: -1
    //     });
    //     enemyB = this.physics.add.existing(enemyB);
    //     enemyB.body.setAllowGravity(false);
    //     enemyB.body.setSize(32,40);
    //     enemyB.anims.create({
    //         key: 'idle',
    //         frames: this.anims.generateFrameNumbers('bag of bones',
    //             {
    //                 start: 0,
    //                 end: 3
    //             }),
    //         frameRate: 8,
    //         repeat: -1
    //     });
    //     enemyB.anims.create({
    //         key: 'boom',
    //         frames: this.anims.generateFrameNumbers('explosion',
    //             {
    //                 start: 0,
    //                 end: 7
    //             }),
    //         frameRate: 8
    //     });
    //     enemyB.on('animationcomplete-boom', ()=>{
    //         enemyB.destroy();
    //     });
    //     enemyB.anims.play('idle');
    //     //Add a collider for the enemy and player
    //     this.setCollidePlayerEnemy(enemyB);
    // }

}
