document.addEventListener("DOMContentLoaded", () => {
  const startGameBtn = document.getElementById("startGameBtn");
  const gameContainer = document.getElementById("gameContainer");
  const gameInstructions = document.querySelector(".game-instructions");

  // Event listener to start the game
  startGameBtn.addEventListener("click", () => {
      gameInstructions.style.display = "none";  // Hide instructions
      gameContainer.style.display = "block";    // Show game grid
      shuffleCards(); // Shuffle cards when game starts
  });

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matchedPairs = 0;
  const totalPairs = 18;
  const cards = document.querySelectorAll('.card');

  // Shuffle cards
  function shuffleCards() {
      const cardsArray = Array.from(cards); // Convert NodeList to Array for shuffling
      cardsArray.sort(() => Math.random() - 0.5); // Shuffle cards

      // Reorder cards in the DOM
      cardsArray.forEach(card => {
          document.querySelector('.grid').appendChild(card); // Assuming there's a parent container
      });
  }

  // Add event listeners to cards
  cards.forEach(card => {
      card.addEventListener('click', flipCard);
  });

  // Flip a card
  function flipCard() {
      if (lockBoard) return; // Prevent flipping cards when the board is locked
      if (this === firstCard) return; // Prevent flipping the same card twice

      this.classList.add('flipped'); // Show the card

      if (!firstCard) {
          firstCard = this;
          return;
      }

      secondCard = this;
      checkForMatch();
  }

  // Check if two cards match
  function checkForMatch() {
      const isMatch = firstCard.dataset.index === secondCard.dataset.index;

      if (isMatch) {
          disableCards();
      } else {
          unflipCards();
      }
  }

  // Disable matched cards
  function disableCards() {
      firstCard.removeEventListener('click', flipCard);
      secondCard.removeEventListener('click', flipCard);

      matchedPairs++;
      if (matchedPairs === totalPairs) {
          setTimeout(() => {
              window.location.href = '/win'; // Redirect to win page after all pairs are matched
          }, 500);
      }
      resetBoard();
  }

  // Unflip cards if they don't match
  function unflipCards() {
      lockBoard = true;
      setTimeout(() => {
          firstCard.classList.remove('flipped');
          secondCard.classList.remove('flipped');
          resetBoard();
      }, 1500);
  }

  // Reset board after a turn
  function resetBoard() {
      [firstCard, secondCard, lockBoard] = [null, null, false];
  }

  // Reset game functionality
  function resetGame() {
      matchedPairs = 0;
      cards.forEach(card => {
          card.classList.remove('flipped');
          card.addEventListener('click', flipCard); // Re-enable click listeners after reset
      });
      shuffleCards();
  }
});
