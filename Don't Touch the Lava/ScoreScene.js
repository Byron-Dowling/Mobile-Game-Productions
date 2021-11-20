class ScoreScene extends Phaser.Scene 
{
    constructor() 
    {
        super("ScoreScene");

        // Firebase stuff
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
        this.database = firebase.firestore();
        this.scoreTable = this.database.collection('HHSH')
        .orderBy('Score', 'desc')
        .limit(5);

        // HTML stuff
        this.nameInput = null;
        /** @type {HTMLInputElement} */
        this.element = null;
    }

    preload() 
    {
        // Background images.
        this.load.image('Nebula', './assets/0.png');
        this.load.audio('out', './assets/Minute Waltz.mp3');
    }

    create() 
    {
        this.Audio = this.sound.add("out", 
        {
            volume: .2,
            loop: true
        });
        
        // play Music
        this.Audio.play();

        // Add background
        // let background = this.add.image(225,225,'Nebula');
        // background.setScale(.5);

        // The Title settings.
        let Score = this.add.rectangle(GAME_WIDTH/2, 50, 280, 60, 0x2600F9, 0.3);
        let Crazy = this.add.text(GAME_WIDTH/2, 50, "*** High Scores ***", 
        {
            fontFamily: 'Zen',
            align: 'center',
            fill : '#6FEE3F',
            stroke : "blue",
            fontSize : '30px',
            strokeThickness : 6

        }).setOrigin(0.5);

        
        // Text for the high score table
        this.scoresText = this.add.text(GAME_WIDTH/2, 250, "", 
        {
            align: "right",
            fontFamily: 'Zen',
            fill : '#6FEE3F',
            stroke : "blue",
            fontSize : '25px',
            strokeThickness : 6
        }).setOrigin(.5);   

        // Run our database query to get scores
        this.getAllScores();

        // The Go Back to Menu Button.
        let menu = this.add.rectangle(GAME_WIDTH/2, 410, 180, 60, 0x2600F9, 0.3);
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
        let Menu = this.add.text(GAME_WIDTH/2, 410, "< MENU >", 
        {
            fontFamily: 'Zen',
            align: 'center',
            fill : '#6FEE3F',
            stroke : "blue",
            fontSize : '30px',
            strokeThickness : 6
        }).setOrigin(0.5);

    }

    async getAllScores() 
    {
        let snap = await this.scoreTable.get();
        snap.forEach(
            (docSnap) => 
            {
                const data = docSnap.data();
                const { name, score } = data;
                let Menu = this.add.text(GAME_WIDTH/2, 110, "****************************",
                {
                    fontFamily: 'Zen',
                    align: 'center',
                    fill : '#6FEE3F',
                    stroke : "blue",
                    fontSize : '30px',
                    strokeThickness : 6
                }).setOrigin(0.5);
                
                let scoreString = `${score}`.padStart(5, "0");
                this.scoresText.text += `${name}...  ${scoreString}\n`;
            
                let bottom = this.add.text(GAME_WIDTH/2, 370, "****************************",
                {
                    fontFamily: 'Zen',
                    align: 'center',
                    fill : '#6FEE3F',
                    stroke : "blue",
                    fontSize : '30px',
                    strokeThickness : 6
                }).setOrigin(0.5);
                
            
            }
        );
    }

}
