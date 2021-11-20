class MS4 extends Phaser.Scene 
{
    constructor() 
    {
        super("MS4")
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

    init(data) 
    {
        // Get the username from the title screen
        this.username = data.username;
        if (this.username == "") 
        {
            // No username was provided
            this.username = "N/A";
        }
    }


    preload() 
    {
        this.load.audio('CSharp', './assets/CSharp.mp3');
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
        this.load.image('Tiles', './assets/Level_2_set.png');
        this.load.tilemapTiledJSON('Map', './assets/Level_2.json');
    }


    create() 
    {
        // Background music
        let backgroundMusic = this.sound.add('CSharp', { volume: 0.1 });
        backgroundMusic.play(
            {
                loop: true
            });



        //Add the Tilemap
        this.createMap();
        
       
        // Creating player and enemy and adding physics to them
        this.createPlayer();
        this.createEnemies();
        this.layers.foreground.setCollisionBetween(0,10000,true);
        this.physics.add.collider(this.player, this.layers.foreground);
        //this.physics.add.collider(this.enemyImg, this.layers.foreground);


        // Start the controls overlay
        this.scene.launch("ControlScene");
        this.signals.on('joystick', (data) => 
        {
            this.movePlayer(data);
        });

        this.controlsEnabled = true;

        this.signals.on('jump', () => 
        {
            if (this.player.body.blocked.down) 
            {
                this.player.setVelocityY(-this.jumpSpeed);
            }
        });


        // Should allow jumping with the spacebar
        this.input.keyboard.on('keydown-SPACE', () => 
        {
            this.signals.emit('jump');
        });

        this.signals.on('jump', () => 
        {
            if (this.player.body.blocked.down) 
            {
                this.player.setVelocityY(-this.jumpSpeed);
            }
        });
        this.input.keyboard.on('keyup-SPACE', () => 
        {
            this.jumping = false;
        });

        this.createCamera();
    }


    createCamera() 
    {
        //Add a camera to the scene that focus on the player within a certain area
        this.spriteCamera = this.cameras.main.setBounds(0,0,10000,10000);
        this.spriteCamera.setZoom(1.5);
        this.spriteCamera.startFollow(this.player);
    }


    update() 
    {        
        this.setCollidePlayerEnemy();

        // console.log(this.player.x, this.player.y)

        // If the player touches lava
        if(this.player.y > 900)
        {       
            this.sound.stopAll();  
            this.gameOver = true;
        }

        // Ending banner
        if (this.player.x >= 1583 && this.player.y >= 894)
        {
            // Stop the Music
            this.sound.stopAll(); 
            this.scene.start("WinnerScene");      
            this.gameOver = true;
        }

        let x1 = 100;
        let x2 = 280;
        let x3 = 550;
        let x4 = 710;
        let x5 = 442;
        let x6 = 695;

        // The Limit X of the game
        if (this.enemyImg.x == x3)
        {
            this.enemyImg.flipX = false;
        }

        else if (this.enemyImg.x == x4)
        {
            this.enemyImg.flipX = true; 
        }

        if (this.enemyImg2.x == x1)
        {
            this.enemyImg2.flipX = false;
        }

        else if (this.enemyImg2.x == x2)
        {
            this.enemyImg2.flipX = true; 
        }

        if (this.enemyImg3.x == x5)
        {
            this.enemyImg3.flipX = false;
        }

        else if (this.enemyImg3.x == x6)
        {
            this.enemyImg3.flipX = true; 
        }


        if (this.gameOver == true)
        {
            this.gameOver = false;
            this.scene.stop('ControlScene')
            this.scene.start('GameOver')
        }
    }


    //Create the Tilemap
    createMap() 
    {
        this.map = this.add.tilemap('Map');

        // Create a variable that store the tileset images
        this.tileset = this.map.addTilesetImage('Level_2_set', 'Tiles');

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

    
    createPlayer() 
    {
        this.player = this.physics.add.sprite(20, 840, 'player');
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
    movePlayer(joystick)
    {
        if (joystick.joyX() < 0) 
        {
            this.player.setVelocityX(this.walkSpeed * joystick.joyX());    
            this.player.flipX = true;
            //this.player.anims.play('right');
        }

        else if (joystick.joyX()  > 0) 
        {
            this.player.flipX = false;
            this.player.setVelocityX(this.walkSpeed * joystick.joyX());
            //this.player.anims.play('left');
        }

        else
        {
            this.player.setVelocityX(0);
            //this.player.anims.play('idle');
        }
    }

    generatePlayerAnimations() 
    {
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


    
    createEnemies() {
        // First Enemy
        let path1 = this.add.path(550, 215)
        path1.lineTo(710, 215)
        this.enemyImg = this.add.follower(path1, 550, 215, 'bag of bones');
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


        this.enemyImg.on('animationcomplete-boom', () => {
            this.enemyImg.destroy();
        });

        this.enemyImg.anims.play('idle');


        // Second Enemy
        let path2 = this.add.path(100, 215)
        path2.lineTo(280, 215)
        this.enemyImg2 = this.add.follower(path2, 100, 215, 'bag of bones');
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


        this.enemyImg2.on('animationcomplete-boom', () => {
            this.enemyImg2.destroy();
        });

        this.enemyImg2.anims.play('idle');


        // Third Enemy
        let path3 = this.add.path(442, 550)
        path3.lineTo(695, 550)
        this.enemyImg3 = this.add.follower(path3, 442, 550, 'bag of bones');
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


        this.enemyImg3.on('animationcomplete-boom', () => {
            this.enemyImg3.destroy();
        });

        this.enemyImg3.anims.play('idle');
    }


    setCollidePlayerEnemy() 
    {
        // Destroy any existing collision handler
        if (this.enemyPlayerCollider != null) 
        {
            this.enemyPlayerCollider.destroy();
        }
        
        // Create a new collision handler
        this.enemyPlayerCollider =
            this.physics.add.overlap(this.enemyImg, this.player,
                (en, ply) => 
                {
                    this.player.anims.play('boom');
                }
            );


        this.enemyPlayerCollider =
            this.physics.add.overlap(this.enemyImg2, this.player,
                (en, ply) => 
                {
                    this.player.anims.play('boom');
                }
            );

        this.enemyPlayerCollider =
            this.physics.add.overlap(this.enemyImg3, this.player,
                (en, ply) => 
                {
                    this.player.anims.play('boom');
                }
            );

        this.player.on('animationcomplete-boom', () => 
        {
            this.sound.get('music').stop();
            this.destroyPlayer()
            this.gameOver = true;
        });

    }


    destroyPlayer() 
    {
        // Prevent multiple collision by removing player physics
        // body

        this.player.body.destroy();

        // Disable the player from further controlling movement
        this.controlsEnabled = false;

        this.gameOver = true;
    }
 
}
