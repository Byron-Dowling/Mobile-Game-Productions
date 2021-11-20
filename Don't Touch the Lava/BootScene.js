class BootScene extends Phaser.Scene 
{
    constructor() 
    {
        super("BootScene");
        this.loadingBar = null;
        this.loadingTxt = null;
        this.percentage = 0;
        this.fileLoading = "";
    }

    preload() 
    {
        // Create the loading bar
        this.loadingBar = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT-250, 790, 60, 0x6FEE3F);
        this.loadingTxt = this.add.text(GAME_WIDTH/2, GAME_HEIGHT-190, " 0%", 
        {
            align: 'center',
            fontFamily: 'Trebuchet MS',
            fill : '#6FEE3F',
            stroke : "blue",
            fontSize : '30px',
            strokeThickness : 6
        });
        this.loadingTxt.setOrigin(0.5);

        // Load a bunch of assets
        this.load.image('6', './assets/0.png');

        for (let i = 0; i < 100; i++) 
        {
            this.load.image(`Loading...${i}`, './assets/0.png');           
        }
        
        // Loading events listeners
        this.load.on('progress', (percent) => 
        {
            this.loadingBar.setScale(percent, 1);
            this.percentage = Math.floor(percent * 100);
            this.updateText();
        });
        
        this.load.on('fileprogress', (data) => 
        {
            // this.fileLoading = data.src;
            this.fileLoading = data.key;
            this.updateText();
        });
        
        this.load.on('complete', (data) => 
        {
            this.scene.start('TitleScene');
        });
    }

    updateText()
    {
        this.loadingTxt.setText(`${this.fileLoading} %`);
    }

}
