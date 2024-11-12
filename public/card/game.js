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
 // Shuffle cards
function shuffleCards() {
    const cardsArray = Array.from(cards); // Convert NodeList to Array for shuffling

    // Shuffle the cards randomly
    cardsArray.sort(() => Math.random() - 0.5);

    // Reorder the cards in the DOM to reflect the shuffle
    cardsArray.forEach(card => {
        document.querySelector('.grid').appendChild(card); // Append each shuffled card back to the grid
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
// document.getElementById('resetButton').addEventListener('click', resetGame);

// function resetGame() {
//     // Prevent default behavior if the function is bound to an event
//     if (event) event.preventDefault();

//     // Reset game variables (example)
//     score = 0;
//     moves = 0;
//     flippedCards = [];

//     // Shuffle and re-render the cards
//     shuffleCards();
//     renderCards();

//     // Reset the UI elements (if you have score and move displays)
//     document.getElementById('scoreDisplay').textContent = score;
//     document.getElementById('movesDisplay').textContent = moves;

//     console.log("Game has been reset!");
// }


// function renderCards() {
//     // Render the shuffled cards on the grid
//     const gameGrid = document.getElementById('gameGrid');
//     gameGrid.innerHTML = '';  // Clear the grid
//     cards.forEach(card => {
//         // Add code to render each card in the shuffled order
//         gameGrid.appendChild(createCardElement(card));
//     });
// }

// Reset game functionality  
document.getElementById('resetButton').addEventListener('click', resetGame);  
  
function resetGame() {  
  if (event) event.preventDefault();  
  
  // Reset game variables  
  matchedPairs = 0;  
  
  // Reset each card's state and DOM element  
  cards.forEach(card => {  
   card.classList.remove('flipped', 'matched');  
  });  
  
  // Shuffle the cards  
  shuffleCards();  
}


function renderCards() {
    const gameGrid = document.getElementById('gameGrid');
    
    // Ensure the game grid exists in the DOM
    if (!gameGrid) {
        console.error("Game grid element not found in the DOM.");
        return;
    }

    gameGrid.innerHTML = ''; // Clear the grid

    // Render each card by creating and appending elements
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        cardElement.id = `card-${card.id}`; // Ensure each card has a unique ID
        gameGrid.appendChild(cardElement);
    });
}

function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    // Set initial content to the card back
    cardElement.innerHTML = card.backContent;

    // Event listener for flipping the card
    cardElement.addEventListener('click', () => flipCard(card));

    return cardElement;
}

});
