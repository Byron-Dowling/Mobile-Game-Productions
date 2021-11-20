class AI {
    constructor(scene, obj, behavior) {
        /**
         * Scene that the GameObject belongs to
         * @type {Phaser.Scene}
         */
        this.scene = scene;
        /**
         * Game object that the AI affects
         * @type {Phaser.GameObjects.GameObject}
         */
        this.obj = obj;
        /**
         * Update should be a function that modifies this.scene or this.obj
         * @type {()=>void} 
         */
        this.update = behavior.bind(this);
    }

    /**
     * Changes the AI's update() method to a new method
     * @param {()=>void)} func 
     */
    change(func){
        this.update = func.bind(this);
    }
}
