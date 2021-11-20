class VirtualJoystick 
{
    /**
     * @param {Phaser.Scene} scene Scene to add the virtual joystick to
     * @param {number} x Coordinates to place the virtual joystick
     * @param {number} y 
     * @param {number} radius The radius of the outer circle of the joystick
     * @param {{base: number, stick: number, alpha: number}} colorConfig Object
     * that is used to configure the color of the base and stick, and
     * transparency of the overall joystick object
     */
    constructor(scene, x, y, radius, colorConfig) 
    {
        // Base variables
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colorConfig = colorConfig || 
        {
            base: 0xFFFFFF,
            stick: 0xFF0000,
            alpha: 0.4
        }
        // Outer circle, part that doesn't move
        this.base = scene.add.circle(x, y, radius, this.colorConfig.base, this.colorConfig.alpha);
        // Joystick circle
        this.stick = scene.add.circle(x, y, .45 * radius, this.colorConfig.stick, this.colorConfig.alpha);

        // Make the stick draggable
        this.stick.setInteractive({ draggable: true });
        scene.input.setDraggable(this.stick);

        // Handle dragging the stick
        scene.input.on('drag', (_, stick, dragX, dragY) => 
        {
            if (stick === this.stick) 
            {
                this.dragStick(dragX, dragY);
            }
        });
        scene.input.on('dragend', (_, stick) => 
        {
            if (stick === this.stick) 
            {
                this.resetStick();
            }
        });
    }

    /**
     * @returns Value ranging from -1 to 1 representing how far the stick is in
     * the X direction
     */
    joyX() 
    {
        return (this.stick.x - this.x) / this.radius;
    }

    /**
     * @returns Value ranging from -1 to 1 representing how far the stick is in
     * the Y direction
     */
    joyY() 
    {
        return (this.stick.y - this.y) / this.radius;
    }

    /**
     * @returns The angle from -pi to pi that the joystick is currently at from
     * the center. This uses Phaser's angle system, where 0rad is to the right,
     * and going up from there is negative and down from there is positive.
     */
    joyR() 
    {
        return Phaser.Math.Angle.BetweenPoints(this, this.stick);
    }

    /**
     * Attempts to drag the stick to a given position, but restricts it based on radius
     * @param {Phaser.GameObjects.Arc} stick The game object representing the stick
     * @param {number} dragX X position being dragged to
     * @param {number} dragY Y position being dragged to
     */
    dragStick(dragX, dragY) 
    {
        // Get the distance from center to drag point
        let dist = Phaser.Math.Distance.Between(this.x, this.y, dragX, dragY);
        // If we aren't outside the radius, move the stick to that position
        if (dist < this.radius) 
        {
            this.stick.x = dragX;
            this.stick.y = dragY;
        }
        // If we are outside the radius, move the stick towards the pointer but not on it
        else 
        {
            let angle = Phaser.Math.Angle.Between(this.x, this.y, dragX, dragY);
            let xRadius = Math.cos(angle) * this.radius;
            let yRadius = Math.sin(angle) * this.radius;
            this.stick.x = this.x + xRadius;
            this.stick.y = this.y + yRadius;
        }
    }

    /**
     * Reset's the sticks position to the center
     * @param {Phaser.GameObjects.Arc} stick The game object representing the stick
     */
    resetStick() 
    {
        this.stick.setPosition(this.x, this.y);
    }
}
