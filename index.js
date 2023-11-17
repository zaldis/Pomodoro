(function() {
    const fixedTitle = document.title;
    const $startBtn = document.getElementById('start-btn');
    const $pauseBtn = document.getElementById('pause-btn');
    const $resetBtn = document.getElementById('reset-btn');

    const $statusLable = document.getElementById('status');

    const $firstSecondsDigit = document.getElementById('first-seconds');
    const $secondSecondsDigit = document.getElementById('second-seconds');
    const $firstMinutesDigit = document.getElementById('first-minutes');
    const $secondMinutesDigit = document.getElementById('second-minutes');
    const $firstHoursDigit = document.getElementById('first-hours');
    const $secondHoursDigit = document.getElementById('second-hours');

    const WORK_MINUTES = 20;
    const MS_IN_SECOND = 1000;
    const SECONDS_IN_MINUTE = 60;
    const MINUTES_IN_HOUR = 60;
    const SECONDS_IN_HOUR = MINUTES_IN_HOUR * SECONDS_IN_MINUTE;

    let timerId = null;
    let startDate = new Date();
    let restSeconds = WORK_MINUTES * SECONDS_IN_MINUTE;

    $startBtn.addEventListener('click', (event) => {
        start();
    });
    $pauseBtn.addEventListener('click', (event) => {
        pause();
    });
    $resetBtn.addEventListener('click', (event) => {
        reset();
    });


    function start() {
        if (timerId) clearInterval(timerId);
        $startBtn.classList.add('pressed');
        $pauseBtn.classList.remove('pressed');
        $statusLable.innerHTML = 'Running';

        startDate = new Date();
        timerId = setInterval(function() {
            if (restSeconds <= 0) {
                sendNotification("Pause time!");
                restSeconds = WORK_MINUTES * SECONDS_IN_MINUTE
                $pauseBtn.click();
            }

            const currDate = new Date();
            const passedMs = currDate - startDate;
            const passedSeconds = Math.round(passedMs / MS_IN_SECOND)
            restSeconds -= passedSeconds;
            document.title = `${Math.floor(restSeconds / SECONDS_IN_MINUTE)} minutes`
            renderClock();
            startDate = currDate;
        }, 1000);
    }

    function pause() {
        $statusLable.innerHTML = 'Paused';
        $pauseBtn.classList.add('pressed');
        $startBtn.classList.remove('pressed');
        clearInterval(timerId);
    }

    function reset() {
        $resetBtn.classList.add('pressed');
        $pauseBtn.classList.remove('pressed');
        $startBtn.classList.remove('pressed');

        pause();

        restSeconds = WORK_MINUTES * SECONDS_IN_MINUTE;
        renderClock();
        document.title = fixedTitle;

        setTimeout(() => {
            $resetBtn.classList.remove('pressed');
        }, 1000);
    }

    function renderClock() {
        const hours = Math.floor(restSeconds / SECONDS_IN_HOUR);
        const minutes = Math.floor((restSeconds - hours * SECONDS_IN_HOUR) / SECONDS_IN_MINUTE)
        const seconds = restSeconds - hours*SECONDS_IN_HOUR - minutes*SECONDS_IN_MINUTE;

        for (let num of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
            $firstSecondsDigit.classList.remove(`clock-number__${num}`);
            $secondSecondsDigit.classList.remove(`clock-number__${num}`);

            $firstMinutesDigit.classList.remove(`clock-number__${num}`);
            $secondMinutesDigit.classList.remove(`clock-number__${num}`);

            $firstHoursDigit.classList.remove(`clock-number__${num}`);
            $secondHoursDigit.classList.remove(`clock-number__${num}`);
        } 

        const firstSecondsDigit = Math.floor(seconds / 10);
        const secondSecondsDigit = seconds % 10;
        $firstSecondsDigit.classList.add(`clock-number__${firstSecondsDigit}`);
        $secondSecondsDigit.classList.add(`clock-number__${secondSecondsDigit}`);

        const firstMinutesDigit = Math.floor(minutes / 10);
        const secondMinutesDigit = minutes % 10;
        $firstMinutesDigit.classList.add(`clock-number__${firstMinutesDigit}`);
        $secondMinutesDigit.classList.add(`clock-number__${secondMinutesDigit}`);

        const firstHoursDigit = Math.floor(hours / 10);
        const secondHoursDigit = Math.floor(hours % 10);
        $firstHoursDigit.classList.add(`clock-number__${firstHoursDigit}`);
        $secondHoursDigit.classList.add(`clock-number__${secondHoursDigit}`);
    }

    function sendNotification(message) {
        if ('Notification' in window) {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission().then((result) => {
                    if (result === 'granted') new Notification('Pomodoro', {body: message});
                });
            } else {
                new Notification('Pomodoro', {body: message});
            }
        } else {
            console.log('The browser is not support Notifications');
        }
    }

    renderClock();
})()
