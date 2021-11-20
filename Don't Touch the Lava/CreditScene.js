class CreditScene extends Phaser.Scene 
{
    constructor() 
    {
        super("CreditScene");
        this.Audio = null;
    }

    preload() 
    {
        // Background images.
        // this.load.image('Nebula', './assets/3.png');

        // The audio
        this.load.audio('OUT', './assets/Minute Waltz.mp3');
        this.load.audio('Backsound', './assets/Backsound.wav');
    }

    create() 
    {
        this.Audio = this.sound.add("OUT", 
        {
            volume: .05,
            loop: true
        });
        
        // play Music
        this.Audio.play();


        // Add background
        // let background = this.add.image(400,225,'Nebula');
        // background.setScale(6);

        // The Title settings.
        let Nmenu = this.add.rectangle(GAME_WIDTH/2, 50, 180, 60, 0x2600F9, 0.3);
        let text = this.add.text(GAME_WIDTH/2, 50, "Credits", 
        {
                align: 'center',
                fontFamily: 'Trebuchet MS',
                fill: '#6FEE3F',
                stroke: "red",
                fontSize: '30px',
                strokeThickness: 6
        }).setOrigin(0.5);
        // text.setInteractive();
        // this.tweens.add
        // (
        //     {
        //     targets: [text],
        //     duration: 1000,
        //     alpha: 0,
        //     yoyo: true,
        //     repeat: -1
        //     }
        // );

        // The Go Back to Menu Button.
        let menu = this.add.rectangle(GAME_WIDTH/2, 390, 180, 60, 0x2600F9, 0.3);
        menu.setInteractive();
        menu.on('pointerdown', () => 
        {
            this.Audio.stop();
            this.sound.play('Backsound', 
            {
                 volume: 0.1
            });
            this.scene.start('TitleScene');
        });
        let Menu = this.add.text(GAME_WIDTH/2, 390, "< MENU >", 
        {
            align: 'center',
            fontFamily: 'Trebuchet MS',
            fill: '#6FEE3F',
            stroke: "red",
            fontSize: '30px',
            strokeThickness: 6
        }).setOrigin(0.5);

        let Move2 = this.add.text(GAME_WIDTH/2, 120, "Garrett Johnson",
        {
            fontSize : '30px',
            align: 'center',
            fontFamily: 'Zen',

        }).setOrigin(0.5);

        let Move4 = this.add.text(GAME_WIDTH/2, 160, "Byron Dowling",
        {
            fontSize : '30px',
            align: 'center',
            fontFamily: 'Zen',

        }).setOrigin(0.5);

        let Myname = this.add.text(GAME_WIDTH/2, 200, "Loic Konan",
        {
            fontSize : '30px',
            align: 'center',
            fontFamily: 'Zen',

        }).setOrigin(0.5);

        let Move3 = this.add.text(GAME_WIDTH/2, 270, "Websites used",
        {
            fontSize : '30px',
            align: 'center',
            fontFamily: 'Zen',

        }).setOrigin(0.5);


        let Move = this.add.text(GAME_WIDTH/2, 310, "OpenGameArt & itch.io",
        {
            fontSize : '20px',
            align: 'center',
            fontFamily: 'Zen',

        }).setOrigin(0.5);


    }
}

