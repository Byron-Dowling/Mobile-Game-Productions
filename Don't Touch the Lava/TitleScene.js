class TitleScene extends Phaser.Scene 
{
    constructor() {
        super("TitleScene");
        this.scoresText = null;
        this.username = "";
    }

    preload() {
        // Loading the exit music.
        this.load.audio('CS', './assets/CSharp.mp3');
        this.load.audio('Backsound', './assets/Backsound.wav');

        // load background
        this.load.image("00", "./assets/00.png")
        this.load.image("0", "./assets/volcano.png");
        this.load.image("01", "./assets/volcano1.png");;
        this.load.image("1", "./assets/1.png");
        this.load.image("2", "./assets/2.png");
        this.load.image('bg', './assets/space-2.png');

        this.load.image('cloud1', './assets/Cloud5.png');
        this.load.image('cloud2', './assets/Cloud13.png');
        this.load.image('cloud3', './assets/Cloud16.png');
        this.load.image('cloud4', './assets/Cloud17.png');
    }

    create() 
    {
        let bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg').setOrigin(0.5);
        bg.setDepth(-104).setScale(1.5);


        // Introduction music.
        let introMusic = this.sound.add('CS', { volume: 0.2 });
        introMusic.play(
            {
                loop: true
            })

        this.backgroundLayers = [];

        //setup background stuff
        this.backgroundLayers[0] = this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT-150, 272, 160, "00");
        this.backgroundLayers[0].setDepth(-3);
        this.backgroundLayers[0].setOrigin(0.5);
        this.backgroundLayers[0].setScale(3);


        this.backgroundLayers[1] = this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT -100, 0, 0, "2");
        this.backgroundLayers[1].setDepth(0);
        this.backgroundLayers[1].setOrigin(0.5, 0.2);
        this.backgroundLayers[1].setScale(3);


        this.backgroundLayers[2] = this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT - 370, 0, 0, "0");
        this.backgroundLayers[2].setDepth(-11);
        this.backgroundLayers[2].setOrigin(0);
        this.backgroundLayers[2].setScale(.6);

        this.backgroundLayers[3] = this.add.tileSprite(GAME_WIDTH / 700, GAME_HEIGHT - 370, 0, 0, "01");
        this.backgroundLayers[3].setDepth(-11);
        this.backgroundLayers[3].setOrigin(0);
        this.backgroundLayers[3].setScale(.6);



        // let bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg').setOrigin(0.5);
        // bg.setDepth(-4).setScale(6);
        let cloud2 = this.add.image(895, 50, 'cloud2').setOrigin(0.5);
        cloud2.setScale(-1);
        cloud2.setDepth(-1);

        let cloud3 = this.add.image(876, 15, 'cloud3');
        cloud3.setScale(1);

        let cloud4 = this.add.image(850, 80, 'cloud4');
        cloud4.setScale(1);
        cloud4.setDepth(-2)


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

        // Create an input element for username
        // this.nameInput = this.add.dom(GAME_WIDTH / 2, GAME_HEIGHT - 250, 'input');
        // this.nameInput.setScale(2);
        // this.element = this.nameInput.node;

        // let name = this.add.text(GAME_WIDTH - 520, GAME_HEIGHT /3 , "Enter your Name:",
        //     {
        //         fontFamily: 'Courier New',
        //         fontSize: '25px',
        //         fontWeight: 'bold',
        //         color: 'white'
        //     })

        // The Title settings.
        let text = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 8, "Don't Touch the Lava",
            {
                align: 'center',
                fontFamily: 'Trebuchet MS',
                fill: '#6FEE3F',
                stroke: "red",
                fontSize: '45px',
                strokeThickness: 6
            }).setOrigin(0.5);
        let Kool = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 1.8, 180, 60, 0x000000, 0.3);
        Kool.setInteractive();
        Kool.on('pointerdown', () => 
        {
            introMusic.stop();
            this.sound.play('Backsound',
                {
                    volume: 0.1
                });
            this.scene.start('CreditScene');
        });
        let Credits = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 1.8, "< Credits >",
            {
                align: 'center',
                fontFamily: 'Trebuchet MS',
                fill: '#6FEE3F',
                stroke: "red",
                fontSize: '30px',
                strokeThickness: 6
            }).setOrigin(0.5);
        text.setInteractive();
        this.tweens.add
            (
                {
                    targets: [Credits],
                    duration: 1000,
                    alpha: 0,
                    yoyo: true,
                    repeat: -1
                }
            );

        // Making the Play square Box.
        let PLAY = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2.8, 180, 60, 0x000000, 0.3);
        PLAY.setInteractive();
        PLAY.on('pointerdown', () => {
            introMusic.stop();
            this.sound.play('Backsound',
                {
                    volume: 0.1
                });
            this.scene.start('LevelScene',
                {
                    username: this.username
                });
        });

        let NEW = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2.8, "< PLAY >",
            {
                align: 'center',
                fontFamily: 'Trebuchet MS',
                fill: '#6FEE3F',
                stroke: "red",
                fontSize: '30px',
                strokeThickness: 6
            }).setOrigin(0.5);
        text.setInteractive();
        this.tweens.add
            (
                {
                    targets: [NEW],
                    duration: 1000,
                    alpha: 0,
                    yoyo: true,
                    repeat: -1
                }
            );
        // The Score Scene settings.
        // let score = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT-100, 180, 60, 0x2600F9, 0.3);
        // score.setInteractive();
        // score.on('pointerdown', () => 
        // {
        //     introMusic.stop();
        //     this.sound.play('Backsound', 
        //     {
        //         volume: 0.1
        //     });
        //     this.scene.start('ScoreScene');
        // });
        // let Score = this.add.text(GAME_WIDTH/2, GAME_HEIGHT-100, "< Scores >", 
        // {
        //     fontFamily: 'Trebuchet MS',
        //     align: 'center',
        //     fill : '#6FEE3F',
        //     stroke : "blue",
        //     fontSize : '30px',
        //     strokeThickness : 6
        // }).setOrigin(0.5);
        // text.setInteractive();
        // this.tweens.add
        // (
        //     {
        //     targets: [Score],
        //     duration: 1000,
        //     alpha: 0,
        //     yoyo: true,
        //     repeat: -1
        //     }
        // );

        // The Credits settings.

    }

    update() 
    {
        // this.username = this.element.value;

        // move paralax background
        let generalSpeed = .2;
        this.backgroundLayers[0].tilePositionX += generalSpeed * 1.5;
        this.backgroundLayers[1].tilePositionX += generalSpeed * 2.5;
        this.backgroundLayers[2].tilePositionX = generalSpeed * 2;
        this.backgroundLayers[3].tilePositionX = generalSpeed * 2;  
    }
}
