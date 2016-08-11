
var progressSize = 100;

/* If i were to use media queries in JS ... */
//if(window.matchMedia( "(min-width: 500px)").matches) {
//    progressSize = 150;
//} else {
//    progressSize = 100;
//}

$("#divProgress").circleProgress({
    value: 0.0,
    animation: 0,
    size: progressSize

})

    $("#slider-session").slider({

        max: 50,
        min: 25,
        value: 25,
        slide: function(event, ui) {
            p.length = moment(ui.value, "mm:ss");
            $("#slider-session-text").html(ui.value);
            slider_sessionLength = ui.value;

        }


    });

    $("#slider-break").slider({
        max: 15,
        min: 5,
        value: 5,
        slide: function(event, ui) {
            p.break_length = moment(ui.value, "mm:ss");
            $("#slider-break-text").html(ui.value);
            slider_breakLength = ui.value;

        }

    });


var slider_sessionLength = $("#slider-session-text").html();
var slider_breakLength = $("#slider-break-text").html();

var pomoStatus =  {

    states: ['Session', 'Break', 'Settings'], //for reading purposes only
    current: 'Session',
    interrupt: false

};

var hasStarted = false;
var runningTime = null;


var Pomodoro = function(length, break_length) {
    Clock.call(this);

    this.length = moment(length);
    this.break_length = moment(break_length);


};


Pomodoro.prototype = Object.create(Clock.prototype, {

    constructor: {value: Pomodoro},

    beginSession: {value : function beginSession(phase) {

        if(this.running === true) {

            if (hasStarted) {

                if(phase === "Session") {

                    this.total = moment(slider_sessionLength, "mm:ss")
                    this.timer = this.length;
                    //this.timer = this.length;
                    //console.log("timer:", this.timer);
                }
                else {
                    this.total =  moment(slider_breakLength, "mm:ss")
                    this.timer = this.break_length;
                    //this.timer = this.break_length;
                }

               hasStarted = false;
            }

            pomoStatus.interrupt = true;


            runningTime += this.getDelta()

            if(Math.floor(runningTime) >= 1) {

                this.timer.subtract(Math.floor(runningTime), "s");
                runningTime = 0;


            }


            console.log("totalseconds:", this.total.seconds(), "elapsedTime()", this.getElapsedTime(), "this.timer:", this.timer.minutes());
            //console.log("totalseconds:", this.total, "elapsedTime()", this.getElapsedTime());

            $("#divProgress").circleProgress({
                animation: 0,
                value: this.getElapsedTime()/((this.total.minutes() * 60)+ this.total.seconds()) ,
                size: progressSize,
                fill: {
                    gradient: ["#37FF5C", "#17B235"]
                }
            });

            console.log("thisTimer", this.timer);

            if (this.running === true && this.timer.minutes() === 0 && this.timer.seconds() === 0) {
                console.log("TIME TO STOP ITS TIME TO STOP!");
                $('.timer h1').text("--:--");
                this.stop();
                Clock.call(this);

                pomoStatus.interrupt = false;


                if(phase === "Session")
                    this.length = moment(slider_sessionLength, "mm:ss");
                else
                    this.break_length = moment(slider_breakLength, "mm:ss");

            }
            //display time
            $('.timer h1').text(this.timer.format(this.timer._f));

            requestAnimationFrame(beginSession.bind(this, phase));
        } else {

            //Did it finish on it's own or did you interrupt it?


            if(!pomoStatus.interrupt) {

                if (phase === "Session") {
                    pomoStatus.current = "Break"
                    btn.html("Take a break");

                } else {
                    pomoStatus.current = "Session"

                }

            } else if(pomoStatus.interrupt) {
                pomoStatus.interrupt = false;


            }

            //change the text of the timer to whatever is apropriate -- this should probably be moved to the if statement above, as the text should change according to what phase was interrupted or what phase was not interrupted
            $('.timer h1').text("--:--");
            console.log("The pomo has stopped ticking");
        }

    }},

    init: { value: function(a, b) {
        Clock.call(this);
        this.length = a || moment($("#slider-session-text").html(), "mm:ss");
        this.break_length = b || moment($("#slider-break-text").html(), "mm:ss");
    }}



});

var  p = new Pomodoro(moment(slider_sessionLength, "mm:ss"),moment(slider_breakLength, "mm:ss"));
var btn =  $('a.button.session');

  btn.click(function () {

        console.log(pomoStatus);
        if($('#collapse1').attr('aria-expanded') === 'true')
        {
            $('#collapse1').collapse('toggle');
        }

        console.log('ayo');
        if (pomoStatus.interrupt === true) {
            if (pomoStatus.current === 'Session') {
                p.stop();
                btn.html("Keep going");


            }
            else if (pomoStatus.current === 'Break') {

                p.stop();
                p.init();
                btn.html("Back to work")
                hasStarted = true;
                pomoStatus.current = 'Session';

            }

        } else if (pomoStatus.interrupt === false) {
            if (pomoStatus.current === 'Session') {
                p.start();
                hasStarted = true;
                p.beginSession('Session');
                btn.html("Interrupt");

            }
            else if (pomoStatus.current === 'Break') {
                p.start();
                hasStarted = true;
                p.beginSession('Break');
                btn.html("Interrupt");

            }

        }

    });

