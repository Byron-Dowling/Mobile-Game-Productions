class WinnerScene extends Phaser.Scene 
{
    constructor() 
    {
        super('WinnerScene');
        
    }
    preload() 
    {

        this.load.audio('OUT', './assets/Ram.mp3');
        this.load.audio('Backsound', './assets/Backsound.wav');

        // pictures
        this.load.image("golden", "./assets/golden_trophy.png");
        this.load.image("best", "./assets/star.png");
        this.load.image("best1", "./assets/star2.png");
        this.load.image("finish", "./assets/finished_text.png");;
    }

    create() 
    {
        // Decorations
        let finish = this.add.image(GAME_WIDTH / 2, (GAME_HEIGHT / 8), 'finish').setOrigin(0.5);
        finish.setDepth(-104).setScale(.2);

        let TROPHY = this.add.image(GAME_WIDTH / 2, (GAME_HEIGHT / 3.5), 'golden').setOrigin(0.5);
        TROPHY.setDepth(-104).setScale(.1);

        let best = this.add.image(GAME_WIDTH / 4, (GAME_HEIGHT / 6), 'best').setOrigin(0.5);
        best.setDepth(-104).setScale(.6);

        let best1 = this.add.image(GAME_WIDTH / 1.4, (GAME_HEIGHT / 6), 'best1').setOrigin(0.5);
        best1.setDepth(-104).setScale(.6);


        this.Audio = this.sound.add("OUT", 
        {
            volume: .05,
            loop: true
        });
        
        // play Music
        this.Audio.play();


        // Add a Game Over text
        let GO = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'CONGRATULATIONS!', 
        {
            fontFamily: 'Trebuchet MS',
            fill: 'red',
            stroke: "yellow",
            fontSize: '64px',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Pose a question
        // let again = this.add.text(GAME_WIDTH / 2, (GAME_HEIGHT / 2) + 25, 'YOU WIN', 
        // {
        //     fontFamily: 'Zen',
        //     fontSize: '32px',
        //     color: 'white'
        // }).setOrigin(0.5);

        // Add retry text
        let btnY = this.add.rectangle((GAME_WIDTH / 2) - 100, (GAME_HEIGHT / 2) + GAME_HEIGHT / 4, GAME_WIDTH / 6, GAME_HEIGHT / 8, 0x00ff00, 0.4);
        btnY.setOrigin(0.5);

        // Add retry button
        let btnYText = this.add.text((GAME_WIDTH / 2) - 100, (GAME_HEIGHT / 2) + GAME_HEIGHT / 4, 'PLAY AGAIN', 
        {
            fontFamily: 'Georgia',
            fontSize: '20px',
            color: 'white'
        }).setOrigin(0.5);
        btnY.setInteractive();
        btnY.on('pointerdown', () => 
        {
            this.Audio.stop();
            this.sound.play('Backsound', 
            {
                 volume: 0.1
            });
            this.scene.stop();
            this.scene.start('LevelScene');
        });

        // Add quit text
        let btnN = this.add.rectangle((GAME_WIDTH / 2) + 100, (GAME_HEIGHT / 2) + GAME_HEIGHT / 4,
            GAME_WIDTH / 6, GAME_HEIGHT / 8, 0xff0000, 0.4);
        btnN.setOrigin(0.5);
      
        // Add quit button
        let btnNText = this.add.text((GAME_WIDTH / 2) + 100, (GAME_HEIGHT / 2) + GAME_HEIGHT / 4, 'MENU', 
        {
            fontFamily: 'Georgia',
            fontSize: '20px',
            color: 'white'
        }).setOrigin(0.5);
        btnN.setInteractive();
        btnN.on('pointerdown', () => 
        {
            this.Audio.stop();
            this.sound.play('Backsound', 
            {
                 volume: 0.1
            });

            this.scene.stop();
            this.scene.start('TitleScene');
        });

        // Add tweens to the buttons and text
        this.tweens.add(
        {
            targets: [btnY, btnN, btnYText, btnNText,best, best1],
            duration: 2000,
            alpha: 0,
            yoyo: true,
            repeat: -1
        });

        this.tweens.add(
        {
                targets: [best, best1],
                duration: 2000,
                alpha: 0,
                yoyo: true,
                repeat: -1
        });
    }
    
    update() { }
}
