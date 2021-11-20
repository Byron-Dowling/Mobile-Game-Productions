class LevelScene extends Phaser.Scene
{
    constructor()
    {
        super("LevelScene");
    }
    preload() 
    {
        // Levels images.
        this.load.image('level1Background', './assets/level1_SS.png')
        this.load.image('level2Background', './assets/level2_SS.png')
        this.load.image('level3Background', './assets/level_3_SS.png')

        // Sound.
        this.load.audio('Backsound', './assets/Backsound.wav');
       
        this.load.audio('Concert', './assets/Concert.mp3');


        // load background
        this.load.image("Layer01", "./assets/Layer01.png");

        this.load.image('cloud1', './assets/Cloud5.png');
        this.load.image('cloud2', './assets/Cloud13.png');
        this.load.image('cloud3', './assets/Cloud16.png');
        this.load.image('cloud4', './assets/Cloud17.png');
    }
    create() 
    {
       // Background music
       let Audio = this.sound.add('Concert', { volume: 0.3 });
       Audio.play(
           {
               loop: true
           });


        // Add background
        let background = this.add.image(GAME_WIDTH/2, GAME_HEIGHT/2,'Layer01');
        background.setDepth(-6);
        background.setScale(3);

        // adding level text
        let lvl1Text = this.add.text(GAME_WIDTH-650, GAME_HEIGHT-350,'Level One',
        {
            fontFamily: 'Zen',
            fill : '#ec008c',
            stroke : "blue",
            fontSize : '30px',
            fontWeight : 'bold',
            strokeThickness : 6,
            color: 'green'
        }
        ).setOrigin(0.5);
        lvl1Text.setScale(1);


        // Level preview images.
        let border1 = this.add.rectangle(GAME_WIDTH-650, GAME_HEIGHT-250, 200, 105, 0x00000, 1);
        let lvl1Bck = this.add.image(GAME_WIDTH-650, GAME_HEIGHT-250,'level1Background');
        lvl1Bck.setScale(.064);

        let level01 = this.add.rectangle(GAME_WIDTH-650, GAME_HEIGHT-350, 160, 30, 0x2600F9, 0.3);
        level01.setInteractive();
        level01.on('pointerdown', () => 
        {
            Audio.stop();
            this.sound.play('Backsound', 
            {
                volume: 0.1
            });
            this.scene.start('MainScene');
        });



        // adding level text
        let lvl2Text = this.add.text(GAME_WIDTH-400, GAME_HEIGHT-350,'Level Two',
        {
            fontFamily: 'Zen',
            fill : '#ec008c',
            stroke : "blue",
            fontSize : '30px',
            fontWeight : 'bold',
            strokeThickness : 6,
            color: 'green'
        }
        ).setOrigin(0.5);
        lvl2Text.setScale(1);
        

        // Level preview images.
        let border2 = this.add.rectangle(GAME_WIDTH-400, GAME_HEIGHT-250, 200, 105, 0x00000, 1);
        let lvl2Bck = this.add.image(GAME_WIDTH-400, GAME_HEIGHT-250,'level2Background');
        lvl2Bck.setScale(.1375);
       
        let level02 = this.add.rectangle(GAME_WIDTH-400, GAME_HEIGHT-350, 160, 30, 0x2600F9, 0.3);
        level02.setInteractive();
        level02.on('pointerdown', () => 
        {
            Audio.stop();
            this.sound.play('Backsound', 
            {
                volume: 0.1
            });
            this.scene.start('MS5');
        });


        let lvl3Text = this.add.text(GAME_WIDTH-150, GAME_HEIGHT-350,'Level Three',
        {
            fontFamily: 'Zen',
            fill : '#ec008c',
            stroke : "blue",
            fontSize : '30px',
            fontWeight : 'bold',
            strokeThickness : 6,
            color: 'green'
        }).setOrigin(0.5);


        let border3 = this.add.rectangle(GAME_WIDTH-150, GAME_HEIGHT-250, 200, 105, 0x00000, 1);
        let lvl3Bck = this.add.image(GAME_WIDTH-150, GAME_HEIGHT-250,'level3Background');
        lvl3Bck.setScale(.15);

        lvl3Text.setScale(1);
        let level03 = this.add.rectangle(GAME_WIDTH-150, GAME_HEIGHT-350, 160, 30, 0x2600F9, 0.3);
        level03.setInteractive();
        level03.on('pointerdown', () => 
        {
            Audio.stop();
            this.sound.play('Backsound', 
            {
                volume: 0.1
            });
            this.scene.start('MS4');
        });

        
        let cloud2 = this.add.image(895, 50, 'cloud2').setOrigin(0.5,0.5);
        cloud2.setScale(1);
        cloud2.setDepth(-1);

        let cloud3 = this.add.image(876, 15, 'cloud3');
        cloud3.setScale(1);
        
        let cloud4 = this.add.image(850, 80, 'cloud4');
        cloud4.setScale(1);
        cloud4.setDepth(-1.5)
       
        
        this.tweens.add(
        {
            targets: [cloud3],
            duration: 30000,
            repeat: -1,
            x: -110,
        });
        this.tweens.add(
        {
                targets: [cloud2],
                duration: 50000,
                repeat: -1,
                x: -150,
        });
        this.tweens.add(
        {
            targets: [cloud4],
            duration: 40000,
            repeat: -1,
            x: -120,
        });

        // Changes the scene to level one
        lvl1Bck.setInteractive();
        lvl1Bck.on('pointerdown', () => 
        {
            Audio.stop();
            this.sound.play('Backsound',
            {
                volume: 0.1
            });
            this.scene.start("MainScene");
        });


        // Changes the scene to level three
        lvl2Bck.setInteractive();
        lvl2Bck.on('pointerdown', () => 
        {
            Audio.stop();
            this.sound.play('Backsound', 
            {
                volume: 0.1
            });
            this.scene.start("MS5");
        });

        // Changes the scene to level three
        lvl3Bck.setInteractive();
        lvl3Bck.on('pointerdown', () => 
        {
            Audio.stop();
            this.sound.play('Backsound', 
            {
                volume: 0.1
            });
            this.scene.start("MS4");
        });


        // Making the Back square Box.
        let back = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT-50, 130, 40, 0x2600F9, 0.3);
        back.setInteractive();
        back.on('pointerdown', () => 
        {
            Audio.stop();
            this.sound.play('Backsound', 
            {
                volume: 0.1
            });
            this.scene.start('TitleScene');
        });
        
        let Back = this.add.text(GAME_WIDTH/2, GAME_HEIGHT-50, "< Back >", 
        {
            fontFamily: 'Zen',
            fill : '#ec008c',
            stroke : "blue",
            fontSize : '30px',
            fontWeight : 'bold',
            strokeThickness : 6,
            color: 'green'
        }).setOrigin(0.5);
        this.tweens.add
        (
            {
            targets: [Back],
            duration: 1000,
            alpha: 0,
            yoyo: true,
            repeat: -1
            });        
    }
}
