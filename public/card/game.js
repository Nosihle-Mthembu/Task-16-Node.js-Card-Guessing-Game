document.addEventListener("DOMContentLoaded", () => {
    const startGameBtn = document.getElementById("startGameBtn");
    const gameContainer = document.getElementById("gameContainer");
    const gameInstructions = document.querySelector(".game-instructions");
    const timerDisplay = document.getElementById("timer"); 
    const pauseResumeButton = document.getElementById("pauseResumeButton");

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedPairs = 0;
    const totalPairs = 18;
    const cards = document.querySelectorAll('.card');
    let timeRemaining = 210;
    let timerInterval;
    let isPaused = false;

    // Function to start the timer
    function startTimer() {
        timerInterval = setInterval(() => {
            if (!isPaused) { // Only decrease time if the game is not paused
                const minutes = Math.floor(timeRemaining / 60);
                const seconds = timeRemaining % 60;

                timerDisplay.textContent = `Time left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                timeRemaining--;

                if (timeRemaining < 0) {
                    clearInterval(timerInterval);
                    endGame("Time's up! Game over.");
                }
            }
        }, 1000);
    }

    // Pause/Resume button event listener
    pauseResumeButton.addEventListener("click", () => {
        isPaused = !isPaused; // Toggle pause state
        pauseResumeButton.textContent = isPaused ? "Resume" : "Pause";
        if (isPaused) {
            lockBoard = true;
        } else {
            lockBoard = false;
        }
    });

    // Function to end the game if time runs out
    function endGame(message) {
        alert(message);
        resetGame();
    }

    startGameBtn.addEventListener("click", () => {
        gameInstructions.style.display = "none";
        gameContainer.style.display = "block";
        shuffleCards();
        startTimer(); // Start the timer when the game begins
    });

    function shuffleCards() {
        const cardsArray = Array.from(cards);
        cardsArray.sort(() => Math.random() - 0.5);
        cardsArray.forEach(card => {
            document.querySelector('.grid').appendChild(card);
        });
    }

    cards.forEach(card => {
        card.addEventListener('click', flipCard);
    });

    function flipCard() {
        if (lockBoard || this.classList.contains('matched') || isPaused) return; // Check pause state
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.index === secondCard.dataset.index;

        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        matchedPairs++;

        if (matchedPairs === totalPairs) {
            clearInterval(timerInterval);
            setTimeout(() => {
                alert('Congratulations, you matched all pairs!');
                window.location.href = '/win';
                resetGame();
            }, 500);
        }
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    function resetGame() {
        matchedPairs = 0;
        timeRemaining = 210;
        clearInterval(timerInterval);
        startTimer();

        cards.forEach(card => {
            card.classList.remove('flipped', 'matched');
            card.addEventListener('click', flipCard);
        });

        shuffleCards();
    }
});
