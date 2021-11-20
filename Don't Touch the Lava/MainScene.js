class MainScene extends Phaser.Scene 
{
    constructor() 
    {
        super("MainScene")
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
        this.timeLimit = 90000;
        this.completionTime = 0;
        this.elapsed = 0;

        this.signals = SignalManager.get();
        this.walkSpeed = 200;
        this.jumpSpeed = 375;

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
        this.load.audio('MW', './assets/Minute Waltz.mp3');
        this.load.audio('exp', './assets/explosion_3.wav');
        this.load.spritesheet('player', './assets/spr_RoninIdle_strip.png',
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

        this.load.spritesheet('lava', './assets/Lava.png',
        {
            frameWidth: 32,
            frameHeight: 32
        })

        this.load.image('background', './assets/0.png');
       
        // Load the tilemap assets
        this.load.image('Tiles', './assets/Tileset.png');
        this.load.tilemapTiledJSON('Map', './assets/Platform-map.json');
        
    }



    create() 
    {
        // Background music
        let backgroundMusic = this.sound.add('MW', { volume: 0.1 });
        backgroundMusic.play(
            {
                loop: true
            });


        // Background imagery
        let bg_Space = this.add.image(400, 400, 'background');
        bg_Space.setScale(6);


        //Add the Tilemap
        this.createMap();


        // Creating player and enemy and adding physics to them
        this.createPlayer();
        this.createEnemies();
        this.layers.foreground.setCollisionBetween(0,10000,true);
        this.physics.add.collider(this.player, this.layers.foreground);
        this.physics.add.collider(this.enemyImg, this.layers.foreground);

        // Start the controls overlay
        this.scene.launch("ControlScene");
        this.signals.on('joystick', (data) => 
        {
            this.movePlayer(data);
        });


        this.controlsEnabled = true;

        this.signals.on('jump', () => {
            if (this.player.body.blocked.down) 
            {
                this.player.setVelocityY(-this.jumpSpeed);
            }
        });

        // Should allow jumping
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
        // Add a camera to the scene that focus on the player within a certain area
        this.spriteCamera = this.cameras.main.setBounds(0,0,10000,10000);
        this.spriteCamera.setZoom(1.5);
        this.spriteCamera.startFollow(this.player);
    }


    update() 
    {
        this.setCollidePlayerEnemy();

        //console.log(this.player.x, this.player.y)

        // If the player touches lava
        if(this.player.y > 910 && this.player.x > 368 && this.player.x <= 1300)
        {       
            this.player.destroy();
            this.sound.stopAll();       // Stop the Music
            this.gameOver = true;
        }


        if (this.player.x >= 1584 && this.player.y >= 910)
        {
            // Stop the Music
            this.sound.stopAll();       
           
            // this.scene.stop('ControlScene');
            this.scene.start("MS5");
        }

        if (this.gameOver == true)
        {
            // Stop the Music
            this.sound.stopAll();       
            this.gameOver = false;
            this.scene.stop('ControlScene')
            this.scene.start('GameOver')
        }

        let x1 = 494;
        let x2 = 220;
        let x3 = 791;
        let x4 = 1072;
        let x5 = 1267;
        let x6 = 1130;
        let x7 = 1193;
        let x8 = 1048;

        // The Limit X of the game
        if (this.enemyImg.x == x2)
        {
            this.enemyImg.flipX = false;
        }

        else if (this.enemyImg.x == x1)
        {
            this.enemyImg.flipX = true; 
        }

        if (this.enemyImg2.x == x3)
        {
            this.enemyImg2.flipX = false;
        }

        else if (this.enemyImg2.x == x4)
        {
            this.enemyImg2.flipX = true; 
        }

        if (this.enemyImg3.x == x6)
        {
            this.enemyImg3.flipX = false;
        }

        else if (this.enemyImg3.x == x5)
        {
            this.enemyImg3.flipX = true; 
        }

        if (this.enemyImg4.x == x8)
        {
            this.enemyImg4.flipX = false;
        }

        else if (this.enemyImg4.x == x7)
        {
            this.enemyImg4.flipX = true; 
        }

    }


    // // Moving to the next level after completing level
    // loadNextLevel()
    // {
    //     if(this.winner == true)
    //     {
    //         this.winner = false;
    //         this.sound.stopAll();       // Stop the Music
    //         this.scene.stop('ControlScene');
    //         this.scene.start("MoveToLevel2");
    //     }

    // }

    onGameOver()
    {
        this.gameOver = false;
        this.scene.start('MainScene');
    }


    //Create the Tilemap
    createMap() 
    {
        this.map = this.add.tilemap('Map');

        //Create a variable that store the tileset images
        //this.tileset = this.map.addTilesetImage('Level_2_set', 'Tiles');
        this.tileset = this.map.addTilesetImage('Platform-set', 'Tiles');

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
        this.player = this.physics.add.sprite(55, 100, 'player');
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
        // if (this.player.body.blocked.down) 
        // {
        // this.player.setVelocityX(this.walkSpeed * joystick.joyX());
        // }

        if (joystick.joyX() < 0) 
        {
            this.player.setVelocityX(this.walkSpeed * joystick.joyX());    
            this.player.flipX = true;
        }

        else if (joystick.joyX()  > 0) 
        {
            this.player.flipX = false;
            this.player.setVelocityX(this.walkSpeed * joystick.joyX());
        }

        else
        {
            this.player.setVelocityX(0);
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
                frames: this.anims.generateFrameNumbers('player',
                    {
                        frames: [0, 3]
                    }),
                frameRate: 12
            });

        this.player.anims.create(
            {
                key: 'right',
                frames: this.anims.generateFrameNumbers('player',
                    {
                        frames: [4, 7]
                    }),
                frameRate: 12
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

        
        // Lava Animation
        this.player.anims.create(
            {
                key: 'burn',
                frames: this.anims.generateFrameNumbers('lava',
                {
                    start: 4,
                    end: 13
                }),
                frameRate: 8
            }
        )
    }



    createEnemies() 
    {
        // First Enemy
        let path1 = this.add.path(494, 167)
        path1.lineTo(220, 167)
        this.enemyImg = this.add.follower(path1, 494, 167, 'bag of bones'); 
        this.enemyImg.setScale(0.75)

        this.enemyImg.startFollow(
        {
            duration: 5500,
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
        let path2 = this.add.path(791, 71)
        path2.lineTo(1072, 71)
        this.enemyImg2 = this.add.follower(path2, 791, 71, 'bag of bones'); 
        this.enemyImg2.setScale(0.75);

        this.enemyImg2.startFollow(
        {
            duration: 5500,
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
        let path3 = this.add.path(1267, 391)
        path3.lineTo(1130, 391)
        this.enemyImg3 = this.add.follower(path3, 1267, 391, 'bag of bones'); 
        this.enemyImg3.setScale(0.75);

        this.enemyImg3.startFollow(
        {
            duration: 4000,
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
        let path4 = this.add.path(1193, 711)
        path4.lineTo(1048, 711)
        this.enemyImg4 = this.add.follower(path4, 1193, 711, 'bag of bones'); 
        this.enemyImg4.setScale(0.75);


        this.enemyImg4.startFollow(
        {
            duration: 3000,
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
 

         // Create a new collision handler
         this.enemyPlayerCollider =
             this.physics.add.overlap(this.enemyImg2, this.player,
                 (en, ply) => 
                 {
                     this.player.anims.play('boom');
                 }
             );
 

         // Create a new collision handler
         this.enemyPlayerCollider =
             this.physics.add.overlap(this.enemyImg3, this.player,
                 (en, ply) => 
                 {
                     this.player.anims.play('boom');
                 }
             );
 

        // Create a new collision handler
        this.enemyPlayerCollider =
            this.physics.add.overlap(this.enemyImg4, this.player,
                (en, ply) => 
                {
                    this.player.anims.play('boom');
                }
            );


         this.player.on('animationcomplete-boom', () => 
         {
             this.destroyPlayer()
             this.gameOver = true;
         });
    }

    
    destroyEnemy()
    {
        this.enemies = this.enemies.filter((e) => 
        {
            return e !== this.enemyImg;
        });

        this.enemyImg.body.destroy();
    }


    destroyPlayer() 
    {
        // Prevent multiple collision by removing player physics
        // body

        this.player.body.destroy();
        // Disable the player from further controlling the ship
        this.controlsEnabled = false;

        this.gameOver = true;
    }
}
