class EnemyS extends AI {
    constructor(scene, obj) {
        super(scene, obj, () => { });
        this.change(this.moveDown);
        this.strafing = false;
        this.lastShot = 0;
        this.shotTimeout = 1000;
        this.bullets = 10;
    }

    moveDown() {
        this.obj.setVelocity(0, .25 * this.scene.plySpd);
        // Check if we should change states
        if ((this.scene.player.y - this.obj.y) < 275) {
            this.change(this.strafe);
        }
    }

    strafe() {
        // If this state just started, go right
        if (!this.strafing) {
            this.strafing = true;
            // Go right
            this.obj.setVelocity(.25 * this.scene.plySpd, 0);
        }

        // If on the left side of the screen, go right
        if (this.obj.x < 100) {
            this.obj.setVelocity(.25 * this.scene.plySpd, 0);
        }
        // If on the right side of the screen, go left
        else if (this.obj.x > 350) {
            this.obj.setVelocity(-.25 * this.scene.plySpd, 0);
        }

        // Check if we should shoot
        if (this.now() > this.lastShot + this.shotTimeout) {
            this.scene.createEnemyBullet(this.obj.x, this.obj.y + 50, true);
            this.lastShot = this.now();
            this.bullets--;
        }

        // If out of bullets, change state
        if (this.bullets <= 0) {
            this.strafing = false;
            this.change(this.charge);
        }
    }

    charge() {
        // this.scene.physics.moveToObject(this.obj, this.scene.player, this.plySpd * .25);
        let angle = Phaser.Math.Angle.BetweenPoints(this.obj, this.scene.player);
        let xSpd = Math.cos(angle) * this.scene.plySpd * .25;
        let ySpd = Math.sin(angle) * this.scene.plySpd * .25;
        this.obj.setVelocity(xSpd, ySpd);
        if(this.obj.y > this.scene.player.y){
            this.obj.y = 0;
            this.bullets = 5;
            this.change(this.moveDown);
        }
    }

    now() {
        return new Date().getTime();
    }
}
