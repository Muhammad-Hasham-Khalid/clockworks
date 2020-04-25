let timerObj = {
    minutes: 0,
    seconds: 0,
    timerId: 0
}

const soundAlarm = () => {
    let amount = 4;
    let audio = new Audio("Timer_Sound_Effect.mp3");

    const playSound = () => {
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }

    for (let i = 0; i < amount; i++) {
        setTimeout(playSound, 1000 * i);
    }
}

function updateValue(key, value) {
    if (value < 0) {
        value = 0;
        console.log("Positive Numbers only");
    }

    if (key == "seconds") {
        if (value < 10) {
            value = "0" + value;
        }

        if (value > 59) {
            value = "59";
        }
    }

    $("#" + key).html(value || 0);
    timerObj[key] = value;
}

(function detectChanges(key) {
    console.log("detect Changes!!");

    let input = "#" + key + "-input";

    $(input).change(() => {
        updateValue(key, $(input).val());
    });

    $(input).keyup(() => {
        updateValue(key, $(input).val());
    });

    return arguments.callee;

})("minutes")("seconds"); // self calling function being called twice

function startTimer() {
    buttonManager(["start", false], ["stop", true], ["pause", true]);
    freezeInputs();
    timerObj.timerId = setInterval(() => {
        timerObj.seconds--;
        if (timerObj.seconds < 0) {
            if (timerObj.minutes == 0) {
                soundAlarm();
                return stopTimer();
            }
            timerObj.seconds = 59;
            timerObj.minutes--;
        }
        updateValue("minutes", timerObj.minutes);
        updateValue("seconds", timerObj.seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerObj.timerId);
    buttonManager(["start", true], ["stop", false], ["pause", true]);
    unFreezeInputs();
    let seconds = $("#seconds-input").val();
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    updateValue("minutes", $("#minutes-input").val());
    updateValue("seconds", seconds);
}

function pauseTimer() {
    buttonManager(["start", true], ["stop", true], ["pause", false]);
    clearInterval(timerObj.timerId);
}

function buttonManager(...buttons) {
    for (let i = 0; i < buttons.length; i++) {
        let button = "#" + buttons[i][0] + "-button";
        if (buttons[i][1]) {
            $(button).removeAttr("disabled");
        } else {
            $(button).attr("disabled", "disabled");
        }
    }
}

function freezeInputs() {
    $("#minutes-input").attr("disabled", "disabled");
    $("#seconds-input").attr("disabled", "disabled");
}

function unFreezeInputs() {
    $("#minutes-input").removeAttr("disabled");
    $("#seconds-input").removeAttr("disabled");
}