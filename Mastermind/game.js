document.addEventListener("DOMContentLoaded", function() {

  const colors = ['red', 'blue', 'green', 'black', 'purple', 'orange'];
  const secretCode = generateSecretCode();
  const tries = document.querySelectorAll(".tries");
  const clearButtons = document.querySelectorAll(".clear");
  let currentTryIndex = 0;
  let currentCircleIndex = 0;
  let player = [];
  let startTime = Date.now();

  // Function to start the timer
  function startTimer() {

    const startTime = Date.now();
    // Select the timer element
    var timerElement = document.querySelector('.timer');
    // Update the timer every second
    function updateTimer() {
      var elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      timerElement.textContent = 'time: ' + elapsedTime + ' sec';
    }
    // Start the timer interval
    var timerInterval = setInterval(updateTimer, 1000);
    // Function to stop the timer
    function stopTimer() {
      clearInterval(timerInterval);
    }
    // Stop the timer after a certain time (1000000 milliseconds in this case)
    setTimeout(stopTimer, 1000000);
    // Add the 'selected' class to the current try
    tries[currentTryIndex].classList.add("selected");
  }

  // Event listener for the start button to start the timer
  document.getElementById('startButton').addEventListener('click', startTimer);

  // Function to generate a random secret code
  function generateSecretCode() {
    var secretCode = [];
    for (var i = 0; i < 4; i++) {
      var randomIndex = Math.floor(Math.random() * colors.length);
      var color = colors[randomIndex];
      secretCode.push(color);
    }
    return secretCode;
  }

    // Event listener for each try element to handle selection
  tries.forEach(function(tryElement) {
    tryElement.addEventListener("click", function() {
      // Remove the 'selected' class from all tries
      tries.forEach(function(tryElement) {
        tryElement.classList.remove("selected");
      });
      // Add the 'selected' class to the currently clicked try
      tryElement.classList.add("selected");
    });
  });


  // Event listener for each clear button to clear selections
  clearButtons.forEach(function(clearButton) {
    clearButton.addEventListener("click", function() {
      // Select the parent try of the clear button
      const tryElement = clearButton.closest(".tries");
      // Select all circle buttons in the try
      const circles = tryElement.querySelectorAll(".circle_try");
      // Clear the background color of each circle button
      circles.forEach(function(circle) {
        circle.style.backgroundColor = '#e4e4e4';
      });
      // Reset the player's selection
      player = [];
      currentCircleIndex = 0;
    });
  });
  
    // Function to reset circle selections
    function resetCircles() {
      const circles = tries[currentTryIndex].querySelectorAll(".circle_try");
      circles.forEach(function(circle) {
        circle.style.backgroundColor = '#e4e4e4';
      });
      player = [];
      currentCircleIndex = 0;
    }
  
  // Function to compare secret code with player's code
  function compareCodes(playerCode) {
    let result = { exact: 0, partial: 0 };

    // Copy secret and player codes to avoid modification
    let secretCopy = [...secretCode];
    let playerCopy = [...playerCode];

    // Compare elements at the same position
    for (let i = 0; i < secretCopy.length; i++) {
      if (secretCopy[i] === playerCopy[i]) {
        result.exact++;
      }
    }

    // Compare elements present in secret code but at different positions
    for (let i = 0; i < playerCopy.length; i++) {
      let index = secretCopy.indexOf(playerCopy[i]);
      if (index !== -1) {
        result.partial++;
        // Remove corresponding elements to avoid recounting
        secretCopy[index] = null;
      }
    }
    result.partial = result.partial - result.exact;
    return result;
  }

  

  // Event listener for each color button to select colors
    const colorButtons = document.querySelectorAll(".colors_control .circle");
    colorButtons.forEach(function(button) {
      button.addEventListener("click", function() {
        const color = button.id;
        if (currentCircleIndex < 4) {
          const circles = tries[currentTryIndex].querySelectorAll(".circle_try");
          circles[currentCircleIndex].style.backgroundColor = color;
          player[currentCircleIndex] = color; // Add color to player's array
          currentCircleIndex++;
        }
      });
    });

  // Event listener for retry button to reload the page
  document.getElementById("retryButton").addEventListener("click", function() {
    let currentTryIndex = 0;
    let currentCircleIndex = 0;
    let player = [];
    let startTime = Date.now();
    window.location.reload();
  });

  // Event listener for validate button to compare codes and show results
  document.getElementById("validbutton").addEventListener("click", function() {

    // Compare codes and get the result
    const result = compareCodes(player);

    // Remove 'selected' class from all tries
    tries.forEach(function(tryElement) {
      tryElement.classList.remove("selected");
    });

    // Add 'selected' class to the next try
    tries[currentTryIndex + 1].classList.add("selected");

    // Update validation points based on results
    const validationDiv = tries[currentTryIndex].querySelector(".validation");
    const bubbles = validationDiv.querySelectorAll(".bubble_valid");
    for (let i = 0; i < result.exact; i++) {
      bubbles[i].classList.add("valid-exact");
    }
    for (let i = result.exact; i < result.exact + result.partial; i++) {
      bubbles[i].classList.add("valid-partial");
    }
    for (let i = result.exact + result.partial; i < bubbles.length; i++) {
      bubbles[i].classList.add("valid-empty");
    }

    // Select modal and modal message elements
    const modal = document.getElementById("myModal");
    const modalMessage = document.getElementById("modalMessage");

    // Select close button and define its onclick function
    const closeButton = document.getElementsByClassName("close")[0];
    closeButton.onclick = function() {
      modal.style.display = "none";
    };

    // Display modal with appropriate message based on result
    if (result.exact === 4) {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      modal.style.display = "block";
      modalMessage.innerHTML = "Congratulations! You won in : " + elapsedTime + " seconds ! <br>The code was : " + secretCode;
      currentTryIndex++;
    } else {
      currentTryIndex++;
      if (currentTryIndex >= tries.length - 1) {
        modal.style.display = "block";
        modalMessage.innerHTML = "Game Over the secret code was : <br>" + secretCode;
      } else {
        tries[currentTryIndex].classList.add("selected");
      }
    }

    resetCircles();

  });

});
