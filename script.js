$(document).ready(function () {
    let redScore = 0, blueScore = 0;
    let redGamJeons = 0, blueGamJeons = 0;
    let redRoundsWon = 0, blueRoundsWon = 0;
    let roundTime = 120, breakTime = 30;
    let timer, breakTimer;
    let currentRound = 1;
    let timerRunning = false;

    function updateDisplay() {
        $('#redScore').text(redScore);
        $('#blueScore').text(blueScore);
        $('#redGamJeons').text(`Gam-Jeons: ${redGamJeons}`);
        $('#blueGamJeons').text(`Gam-Jeons: ${blueGamJeons}`);
        $('#roundInfo').text(`Round ${currentRound}`);
    }

    function checkWinConditions() {
        if (redGamJeons >= 5) {
            blueRoundsWon++;
            resetRound();
            return;
        }
        if (blueGamJeons >= 5) {
            redRoundsWon++;
            resetRound();
            return;
        }
        if (Math.abs(redScore - blueScore) >= 12) {
            showPTG();
        }
    }

    function startTimer() {
        if (timerRunning) return;
        timerRunning = true;
        $('#breakTimerDisplay').hide();
        $('#timerDisplay').show().removeClass('ptg-blink');
        timer = setInterval(() => {
            roundTime--;
            $('#timerDisplay').text(formatTime(roundTime));
            if (roundTime <= 0) {
                clearInterval(timer);
                resetRound();
            }
        }, 1000);
    }

    function showPTG() {
        clearInterval(timer);
        timerRunning = false;
        $('#timerDisplay').text('PTG').addClass('ptg-blink');
        setTimeout(() => {
            resetRound();
        }, 5000); // Show PTG message for 5 seconds
    }

    function startBreak() {
        let breakTimeLeft = breakTime;
        $('#timerDisplay').hide();
        $('#breakTimerDisplay').show().text(`Break Time: ${formatTime(breakTimeLeft)}`);

        breakTimer = setInterval(() => {
            breakTimeLeft--;
            $('#breakTimerDisplay').text(`Break Time: ${formatTime(breakTimeLeft)}`);
            if (breakTimeLeft <= 0) {
                clearInterval(breakTimer);
                $('#timerDisplay').show();
                $('#breakTimerDisplay').hide();
                roundTime = 120;
                startTimer();
            }
        }, 1000);
    }

    function declareWinner() {
        const winner = redRoundsWon > blueRoundsWon ? 'Red' : 'Blue';
        clearInterval(timer);
        clearInterval(breakTimer);
        $('#timerDisplay').hide();
        $('#breakTimerDisplay').hide();
        $('#winnerDisplay').text(`${winner} Wins!`).fadeIn(500).show();

        setTimeout(() => {
            $('#winnerDisplay').fadeOut(500, resetMatch);
        }, 10000);
    }

    function resetRound() {
        if (redRoundsWon === 2 || blueRoundsWon === 2) {
            declareWinner();
            return;
        }
        redScore = 0;
        blueScore = 0;
        redGamJeons = 0;
        blueGamJeons = 0;
        currentRound++;
        if (currentRound > 3) {
            declareWinner();
        } else {
            startBreak();
        }
        updateDisplay();
    }

    function resetMatch() {
        redScore = 0;
        blueScore = 0;
        redGamJeons = 0;
        blueGamJeons = 0;
        redRoundsWon = 0;
        blueRoundsWon = 0;
        currentRound = 1;
        roundTime = 120;
        updateDisplay();
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${sec < 10 ? '0' : ''}${sec}`;
    }

    function handleKeyPress(event) {
        switch (event.key) {
            case '7': redScore += 1; break;
            case '8': redScore += 2; break;
            case '9': redScore += 3; break;
            case '0': redGamJeons++; blueScore++; break;
            case '1': blueScore += 1; break;
            case '2': blueScore += 2; break;
            case '3': blueScore += 3; break;
            case '4': blueGamJeons++; redScore++; break;
            case '/':
                if (timerRunning) {
                    clearInterval(timer);
                    timerRunning = false;
                } else {
                    startTimer();
                }
                break;
            case '\\':
                resetMatch();
                break;
        }
        updateDisplay();
        checkWinConditions();
    }

    $(document).keydown(handleKeyPress);
});
