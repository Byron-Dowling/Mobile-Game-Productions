let instance = null;
class SignalManager extends Phaser.Events.EventEmitter 
{
    /**
     * SignalManager is a SINGLETON; DO NOT USE CONSTRUCTOR!
     * (Use SignalManager.get() instead)
     */
    constructor() 
    {
        super();
    }
    static get() 
    {
        if (instance == null) 
        {
            instance = new SignalManager();
        }
        return instance;
    }
}
