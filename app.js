
document.addEventListener('DOMContentLoaded', () => {
    let boat = document.querySelector('.boat');
    const gameDisplay = document.querySelector('.game-container');
    const sea = document.querySelector('.sea');
    const scoreDisplay = document.querySelector('.score');
    const livesDisplay = document.querySelector('.lives');
    const numOfParachutists=3; //max number of parachuists for each plane, can be changed
    const scoreAdded=10; //score added for each that the user catch, can be changed

    document.addEventListener('keyup', control);
    document.addEventListener('touchmove', touchControl);
    gameDisplay.addEventListener('touchmove', touchControl);

    let boatLeft;
    let boatBottom;
    let isGameOver;
    let isGameStarted;
    let score;
    let lives;
    let gameTimerId;

    //initialize the Game to default settings 
    function initializeGame() {
        isGameStarted = false;
        isGameOver = true;
        score = 0;
        lives = 3;//can be changed
        scoreDisplay.innerText = 'Your Score: 0';
        livesDisplay.innerText = 'Lives: 3';
        boatLeft = 220;
        boatBottom = 10;
        boat = document.querySelector('.boat');
        document.addEventListener('keyup', control);//when clicking on the keyboard
        document.addEventListener('mousemove', mouseControl);//when moving the mouse
    }

    //default setting to the boat
    function startGame() {
        boat.style.bottom = boatBottom + 'px';
        boat.style.left = boatLeft + 'px';
    }

    gameTimerId = setInterval(startGame, 20);

    //when clicking left or right on the keyboard 
    function control(e) {
        //if it's the first move start the game
        if (!isGameStarted) {
            isGameStarted = true;
            isGameOver = false;
            gameTimerId = setInterval(startGame, 20);
            generatePlane();//start the game
        }
        if (e.keyCode === 37) {//move left
            if (boatLeft > 0) boatLeft -= 50;
            boat.style.left = boatLeft + 'px';
        } else if (e.keyCode === 39) {//move right
            if (boatLeft < gameDisplay.offsetWidth - boat.offsetWidth) boatLeft += 50;
            boat.style.left = boatLeft + 'px';
        }
    }

    //when moving the mouse right or left
    function mouseControl(e) {
        if (!isGameStarted) {
            isGameStarted = true;
            isGameOver = false;
            gameTimerId = setInterval(startGame, 20);
            generatePlane();//start the game
        }

        // Calculate the new position of the boat based on the mouse position
        const gameDisplayRect = gameDisplay.getBoundingClientRect();
        boatLeft = e.clientX - gameDisplayRect.left - boat.offsetWidth / 2;

        // Ensure the boat stays within the game container
        if (boatLeft < 20) {
            boatLeft = 20;
        } else if (boatLeft > gameDisplayRect.width - boat.offsetWidth) {
            boatLeft = gameDisplayRect.width - boat.offsetWidth;
        }

        boat.style.left = boatLeft + 'px';
    }

    // When moving the finger on the screen
    function touchControl(e) {
        if (!isGameStarted) {
            isGameStarted = true;
            isGameOver = false;
            gameTimerId = setInterval(startGame, 20);
            generatePlane(); // start the game
        }

        // Prevent default behavior
        e.preventDefault();

        // Calculate the new position of the boat based on the touch position
        const gameDisplayRect = gameDisplay.getBoundingClientRect();
        boatLeft = e.touches[0].clientX - gameDisplayRect.left - boat.offsetWidth / 2;

        // Ensure the boat stays within the game container
        if (boatLeft < 20) {
            boatLeft = 20;
        } else if (boatLeft > gameDisplayRect.width - boat.offsetWidth) {
            boatLeft = gameDisplayRect.width - boat.offsetWidth;
        }

        boat.style.left = boatLeft + 'px';
    }

    //generates planes
    function generatePlane() {
        if (isGameOver) return;//stop generating when the user is out of lives

        let planeLeft = gameDisplay.offsetWidth - 170;//position to start the plane generate
        const topPlane = document.createElement('div');
        topPlane.classList.add('topPlane');
        gameDisplay.appendChild(topPlane);
        topPlane.style.left = planeLeft + 'px';
        topPlane.style.bottom = 580 + 'px';

        function movePlane() {
            planeLeft -= 2;
            topPlane.style.left = planeLeft + 'px';

            if (planeLeft < -topPlane.offsetWidth+100) {
                clearInterval(timerId);
                if (topPlane.parentElement) gameDisplay.removeChild(topPlane);
            }
        }
        let timerId = setInterval(movePlane, 20);

        // Create and drop parachutists randomly
        const numParachutists = Math.floor(Math.random() * numOfParachutists) + 1; // Randomly between 1 and 3
        for (let i = 0; i < numParachutists; i++) {
            setTimeout(() => dropParachutist(planeLeft, 580), Math.random() * 3500);
        }

        if (!isGameOver) {
            let randomDelay = Math.random() * 2000 + 3000;
            setTimeout(generatePlane, randomDelay);
        }
    }

    //drop the parachut from the plane
    function dropParachutist(planeLeft, startBottom) {
        if (isGameOver) return;

        const parachutist = document.createElement('div');
        parachutist.classList.add('parachutist');
        gameDisplay.appendChild(parachutist);
        parachutist.style.left = planeLeft + 10 + 'px';
        parachutist.style.bottom = startBottom - 100 + 'px';

        function moveParachutist() {
            let parachutistBottom = parseFloat(parachutist.style.bottom);
            let parachutistLeft = parseFloat(parachutist.style.left);
            let boatL = parseFloat(boat.style.left);
            let boatB = parseFloat(boat.style.bottom);

            if (parachutistBottom > 150) {//move the Parachutist doen untill the Parachutist get int he sea
                parachutistBottom -= 2;
                parachutist.style.bottom = parachutistBottom + 'px';
                //chack if the boat catches the Parachutist
                if (
                    parachutistBottom <= boatB + 250 &&
                    parachutistLeft >= boatL &&
                    parachutistLeft <= boatL + 120
                ) {
                    if (isGameOver) return;
                    else {
                        // If the boat catches the parachutist
                        updateScore(scoreAdded); // Add the points to the score
                        if (parachutist.parentElement) gameDisplay.removeChild(parachutist); // Remove the parachutist
                        clearInterval(parachutistTimerId); // Stop the timer for this parachutist
                    }
                }
            } else {
                if (isGameOver) return;
                else {
                    // If the parachutist reaches the bottom without being caught
                    if (parachutist.parentElement) gameDisplay.removeChild(parachutist);
                    clearInterval(parachutistTimerId);
                    updateLives(-1); // Subtract a life
                }
            }
        }
        let parachutistTimerId = setInterval(moveParachutist, 20);
    }

    //update the score each time a Parachutist is caught
    function updateScore(points) {
        let currentScore = parseInt(scoreDisplay.innerText.split(': ')[1]);
        currentScore += points;
        scoreDisplay.innerText = `Your Score: ${currentScore}`;
    }

    //update the lives each time a Parachutist is not caught
    function updateLives(change) {
        lives += change;
        livesDisplay.innerText = `Lives: ${lives}`;
        if (lives <= 0) {
            alert('Game Over!');
            gameOver();
        }
    }

    //when there is no moro lives
    function gameOver() {
        console.log('game over');
        isGameOver = true;
        document.removeEventListener('keyup', control);
        const planes = document.querySelectorAll('.topPlane');
        const parachutists = document.querySelectorAll('.parachutist');
        planes.forEach(plane => plane.remove());
        parachutists.forEach(parachutist => parachutist.remove());
        initializeGame();
        location.reload(); //  refreshes the page
    }


    //get ready to start a new game
    initializeGame();
});
