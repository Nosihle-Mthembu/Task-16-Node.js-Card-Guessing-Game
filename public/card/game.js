document.addEventListener("DOMContentLoaded", () => {
    const startGameBtn = document.getElementById("startGameBtn");
    const gameContainer = document.getElementById("gameContainer");
    const gameInstructions = document.querySelector(".game-instructions");
    const timerDisplay = document.getElementById("timer"); // Timer display element

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedPairs = 0;
    const totalPairs = 18;
    const cards = document.querySelectorAll('.card');
    let timeRemaining = 210; // Set the total time for the timer in seconds (2:30 minutes)
    let timerInterval;
    let score = 0; // Track moves or pairs matched

    // Function to start the timer
    function startTimer() {
        timerInterval = setInterval(() => {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;

            timerDisplay.textContent = `Time left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeRemaining--;

            if (timeRemaining < 0) {
                clearInterval(timerInterval);
                endGame("Time's up! Game over.");
            }
        }, 1000);
    }

    // Function to end the game (either win or loss)
    function endGame(message) {
        // Store score and time in localStorage for both win/loss
        localStorage.setItem('score', score);
        localStorage.setItem('time', timeRemaining < 0 ? 0 : timeRemaining); // Ensure time doesn't go negative

        if (message === "Time's up! Game over.") {
            // Redirect to the lost page if the game is lost
            window.location.href = '/lost';
        } else {
            // Game won, redirect to the win page
            window.location.href = '/win';
        }
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
        if (lockBoard || this.classList.contains('matched')) return;
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
        score++; // Increment score for each match found
    
        if (matchedPairs === totalPairs) {
            clearInterval(timerInterval); // Stop the timer when the game is won
            endGame('You Won! Congratulations!');
        } else if (timeRemaining < 0) {
            endGame("Time's up! Game over.");
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

    document.getElementById('resetButton').addEventListener('click', resetGame);

    function resetGame() {
        matchedPairs = 0;
        timeRemaining = 210; // Reset timer to 2:30
        clearInterval(timerInterval); // Stop any existing timer
        startTimer(); // Restart the timer

        cards.forEach(card => {
            card.classList.remove('flipped', 'matched');
            card.addEventListener('click', flipCard);
        });

        shuffleCards();
    }
});
