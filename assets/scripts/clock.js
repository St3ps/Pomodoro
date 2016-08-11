
/*
 self.performance = {

    deltaTime : 0,
    next: function (delta) {
        this.deltaTime += delta;
    },

    now: function() {
        return this.deltaTime;
    }

};*/

var Clock = function() {


    this.startTime = 0;
    this.oldTime = 0;
    this.elapsedTime = 0;

    this.running = false;

};

Clock.prototype = {

    constructor: Clock,

    start: function() {

        this.startTime = (performance || Date).now();
        //oldTime will save the original time value from when the timer started -- like zero for example, assuming it had just started from the beggining
        this.oldTime = this.startTime;
        this.running = true;
    },

    stop: function() {

        this.getElapsedTime();
        this.running = false;

    },

    getElapsedTime: function() {
        this.getDelta();
        return this.elapsedTime;
    },

    getDelta: function () {

        var diff = 0;

        if (this.running) {

            var newTime = (performance || Date).now();
            diff = (newTime - this.oldTime) / 1000;
            this.oldTime = newTime;

            this.elapsedTime += diff;


        }

        return diff;


    }


}