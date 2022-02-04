$(document).ready(function () {
    var beep = $("#beep")[0];

    var defaultSessionMinutes = parseInt($("#session-length").html());
    var defaultBreakMinutes = parseInt($("#break-length").html());
    var breakTimeInSeconds = defaultBreakMinutes * 60;
    var sessionTimeInSeconds = defaultSessionMinutes * 60;
    var countDown;
    var breakStarts;
    var timeoutInterval = 250;

    updateUI(sessionTimeInSeconds);

    function reset() {
        breakTimeInSeconds = defaultBreakMinutes * 60;
        sessionTimeInSeconds = defaultSessionMinutes * 60;
        $("#timer-label").html("Session");//start
        updateUI(sessionTimeInSeconds);
    }

    //when reset is clicked return everything back to default
    $("#reset").click(function () {
        clearTimeout(countDown);
        clearTimeout(breakStarts);

        countDown = null;
        breakStarts = null;

        beep.pause();
        beep.currentTime = 0;
        defaultSessionMinutes = 25;
        defaultBreakMinutes = 5;
        reset();
    });

    //increment and decrement break lenght by 1
    $("#break-decrement").click(function () {
        if (defaultBreakMinutes > 1) {
            defaultBreakMinutes -= 1;
            breakTimeInSeconds = defaultBreakMinutes * 60;
            updateUI(sessionTimeInSeconds);
        }
    });

    $("#break-increment").click(function () {
        if (defaultBreakMinutes < 60) {
            defaultBreakMinutes += 1;
            breakTimeInSeconds = defaultBreakMinutes * 60;
            updateUI(sessionTimeInSeconds);
        }
    });

    //increment and decrement session length by 1
    $("#session-decrement").click(function () {
        if (defaultSessionMinutes > 1) {
            defaultSessionMinutes -= 1;
            sessionTimeInSeconds = defaultSessionMinutes * 60;
            updateUI(sessionTimeInSeconds);
        }
    });

    $("#session-increment").click(function () {
        if (defaultSessionMinutes < 60) {
            defaultSessionMinutes += 1;
            sessionTimeInSeconds = defaultSessionMinutes * 60;
            updateUI(sessionTimeInSeconds);
        }
    });

    //when start clicked start timer
    $("#start_stop").click(function () {
        if (countDown || breakStarts) {
            if (countDown) {
                clearTimeout(countDown); // stop
                countDown = null;
            }
            else if (breakStarts) {
                clearTimeout(breakStarts); // stop
                breakStarts = null;
            }
        }
        else {
            if (sessionTimeInSeconds === 0) {
                breakStarts = setTimeout(breakTimer, timeoutInterval);
            } else {
                countDown = setTimeout(sessionTimer, timeoutInterval);
            }
        }
    });

    function sessionTimer() {
        sessionTimeInSeconds -= 1;
        updateUI(sessionTimeInSeconds);

        if (sessionTimeInSeconds === 0) {
            beep.play();
            clearTimeout(countDown);

            setTimeout(function () {
                $("#timer-label").html("Break");
                breakTimeInSeconds++;
                breakStarts = setTimeout(breakTimer, timeoutInterval);
            }, timeoutInterval);
        } else {
            clearTimeout(countDown);
            countDown = setTimeout(sessionTimer, timeoutInterval);
        }
    }

    function breakTimer() {
        breakTimeInSeconds -= 1;
        updateUI(breakTimeInSeconds);

        if (breakTimeInSeconds === 0) {
            beep.play();
            clearTimeout(breakStarts);

            setTimeout(function () {
                reset();
                $("#timer-label").html("Session");//start

                countDown = setTimeout(sessionTimer, timeoutInterval);
            }, timeoutInterval);
        } else {
            clearTimeout(breakStarts);
            breakStarts = setTimeout(breakTimer, timeoutInterval);
        }
    }

    function updateUI(secondsToSetTheClockTo) {
        $("#session-length").html(defaultSessionMinutes);
        $("#break-length").html(defaultBreakMinutes);

        var minutes = Math.floor(secondsToSetTheClockTo / 60);
        var seconds = secondsToSetTheClockTo % 60;

        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        $("#time-left").html(minutes + ":" + seconds);

    }

});