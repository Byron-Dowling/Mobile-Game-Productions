class GameOver extends Phaser.Scene 
{
    constructor() 
    {
        super('GameOver');
        
    }
    preload() 
    {
        this.load.audio('OUT', './assets/Minute Waltz.mp3');
        this.load.audio('Backsound', './assets/Backsound.wav');
    }

    create() 
    {
        this.Audio = this.sound.add("OUT", 
        {
            volume: .5,
            loop: true
        });
        
        // Add a Game Over text
        let GO = this.add.text(GAME_WIDTH / 2, (GAME_HEIGHT / 2) - 100, 'GAME OVER', 
        {
            fontFamily: 'Trebuchet MS',
            fill: '#6FEE3F',
            stroke: "blue",
            fontSize: '64px',
            strokeThickness: 6

            // fontFamily: 'Georgia',
            // color: 'white'
        }).setOrigin(0.5);

        // Pose a question
        let again = this.add.text(GAME_WIDTH / 2, (GAME_HEIGHT / 2) + 25, 'RETRY ?', 
        {
            fontFamily: 'Georgia',
            fontSize: '32px',
            color: 'white'
        }).setOrigin(0.5);

        // Add retry text
        let btnY = this.add.rectangle((GAME_WIDTH / 2) - 100, (GAME_HEIGHT / 2) + GAME_HEIGHT / 4, GAME_WIDTH / 6, GAME_HEIGHT / 8, 0x00ff00, 0.4);
        btnY.setOrigin(0.5);

        // Add retry button
        let btnYText = this.add.text((GAME_WIDTH / 2) - 100, (GAME_HEIGHT / 2) + GAME_HEIGHT / 4, 'Yes', 
        {
            fontFamily: 'Georgia',
            fontSize: '32px',
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
        let btnNText = this.add.text((GAME_WIDTH / 2) + 100, (GAME_HEIGHT / 2) + GAME_HEIGHT / 4, 'No', 
        {
            fontFamily: 'Georgia',
            fontSize: '32px',
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
            targets: [btnY, btnN, btnYText, btnNText],
            duration: 500,
            alpha: 0,
            yoyo: true,
            repeat: -1
        });

    }
    update() { }
}
