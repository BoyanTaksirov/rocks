module.exports = class Timer {
    constructor(milliseconds, callback, chance = 1) {
        this.milliseconds = milliseconds;
        this.callback = callback;
        this.chance = chance;

        this.currentCount = 0;

        this.intervalID;

        this.onInterval = this.onInterval.bind(this);
    }

    start() {
        this.reset();
        this.intervalID = setInterval(this.onInterval, this.milliseconds);
    }

    reset() {
        clearInterval(this.intervalID);
        this.intervalID = null;
        this.currentCount = 0;
    }

    onInterval() {
        this.currentCount++;

        var result = Math.random();
        if(result < this.chance) {
            this.callback(); 
        }
    }

    getCurrentCount(){
        return this.currentCount;
    }
}