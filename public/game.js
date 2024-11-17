// 요소 가져오기
const nugget = document.getElementById('nugget');
const fork1 = document.getElementById('fork'); // 첫 번째 포크
const fork2 = document.createElement('img'); // 두 번째 포크 추가
fork2.src = 'img/fork.png';
fork2.id = 'fork2';

const ketchapp = document.createElement('img'); // 케첩 추가
ketchapp.src = 'img/ketchapp.png';
ketchapp.id = 'ketchapp';

const mustard = document.createElement('img'); // 머스타드 추가
mustard.src = 'img/mustard.png';
mustard.id = 'mustard';

const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.createElement('div');
const highScoreDisplay = document.createElement('div');
const gameOverText = document.createElement('div');
const restartButton = document.createElement('img');
restartButton.src = 'img/restart.svg';
restartButton.id = 'restart-button';
restartButton.style.cursor = 'pointer';
const homeButton = document.createElement('img');
homeButton.src = 'img/home.svg';
homeButton.id = 'home-button';
homeButton.style.cursor = 'pointer';

// 초기 설정
let nuggetPosition = 140;
let fork1Position = -60;
let fork2Position = -60;
let ketchappPosition = -60;
let mustardPosition = -60;
let fork1Speed = 5;
let fork2Speed = 7;
let ketchappSpeed = 8;
let mustardSpeed = 5;
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let gameInterval;
let scoreInterval;
let ketchappInterval;
let mustardInterval;
let isGameOver = false;

// 게임 UI 설정
scoreDisplay.id = 'score';
highScoreDisplay.id = 'high-score';
gameOverText.id = 'game-over';

gameContainer.appendChild(scoreDisplay);
gameContainer.appendChild(highScoreDisplay);
gameContainer.appendChild(gameOverText);
gameContainer.appendChild(restartButton);
gameContainer.appendChild(homeButton);
gameContainer.appendChild(ketchapp);
gameContainer.appendChild(mustard);
gameContainer.appendChild(fork2);
let sauceTotal = localStorage.getItem('sauceTotal') ? parseInt(localStorage.getItem('sauceTotal')) : 60;

// 점수 초기화 함수
function resetScore() {
    score = 0;
    scoreDisplay.textContent = `점수: ${score}`;
    highScoreDisplay.textContent = `최고점수: ${highScore}`;
}

// 슬픈 이미지로 변경하는 함수 (포크 충돌 시)
function changeNuggetImageToSad() {
    nugget.src = 'img/sad.svg';
}

// 잠시 슬픈 이미지로 변경하는 함수 (소스 충돌 시)
function temporarilyChangeNuggetImage() {
    nugget.src = 'img/happy.svg';
    setTimeout(() => {
        nugget.src = 'img/nugget.svg';
    }, 1000);
}

// 키보드 입력 처리
document.addEventListener('keydown', (e) => {
    if (isGameOver) return;

    if (e.key === 'ArrowLeft' && nuggetPosition > 0) {
        nuggetPosition -= 20;
    } else if (e.key === 'ArrowRight' && nuggetPosition < 275) {
        nuggetPosition += 20;
    }
    nugget.style.left = `${nuggetPosition}px`;
});

// 포크 충돌 감지 함수
function isCollision(fork) {
    const nuggetRect = nugget.getBoundingClientRect();
    const forkRect = fork.getBoundingClientRect();
    const forkEndY = forkRect.bottom;

    return (
        nuggetRect.bottom >= forkEndY + 20 &&
        nuggetRect.top <= forkEndY - 20 &&
        nuggetRect.right >= forkRect.left + 40 &&
        nuggetRect.left <= forkRect.right - 40
    );
}
// 소스 충돌 감지 함수
function issauceCollision(sauce) {
    const nuggetRect = nugget.getBoundingClientRect();
    const sauceRect = sauce.getBoundingClientRect();

    return (
        nuggetRect.bottom >= sauceRect.top &&
        nuggetRect.top <= sauceRect.bottom &&
        nuggetRect.right >= sauceRect.left &&
        nuggetRect.left <= sauceRect.right
    );
}

// 게임 시작 함수
function startGame() {
    isGameOver = false;
    gameOverText.style.display = 'none';
    restartButton.style.display = 'none';
    homeButton.style.display = 'none';
    resetScore();

    scoreInterval = setInterval(() => {
        score += 100;
        scoreDisplay.textContent = `점수: ${score}`;
    }, 10000);

    gameInterval = setInterval(() => {
        fork1Position += fork1Speed;
        fork2Position += fork2Speed;
        fork1.style.top = `${fork1Position}px`;
        fork2.style.top = `${fork2Position}px`;

        if (isCollision(fork1) || isCollision(fork2)) {
            changeNuggetImageToSad();
            endGame();
        }

        if (fork1Position >= gameContainer.clientHeight) {
            fork1Position = -60;
            fork1.style.left = `${Math.random() * 275}px`;
            fork1.style.display = 'block';
        }

        if (fork2Position >= gameContainer.clientHeight) {
            fork2Position = -60;
            fork2.style.left = `${Math.random() * 275}px`;
            fork2.style.display = 'block';
        }
    }, 20);

    ketchappInterval = setInterval(() => {
        ketchappPosition += ketchappSpeed;
        ketchapp.style.top = `${ketchappPosition}px`;

        if (issauceCollision(ketchapp)) {
            temporarilyChangeNuggetImage();
            score += 50;
            scoreDisplay.textContent = `점수: ${score}`;
            ketchappPosition = -60;
            ketchapp.style.left = `${Math.random() * 275}px`;
            ketchapp.style.display = 'none';
        }

        if (ketchappPosition >= gameContainer.clientHeight) {
            ketchappPosition = -60;
            ketchapp.style.left = `${Math.random() * 275}px`;
            ketchapp.style.display = 'block';
        }
    }, 50);

    mustardInterval = setInterval(() => {
        mustardPosition += mustardSpeed;
        mustard.style.top = `${mustardPosition}px`;

        if (issauceCollision(mustard)) {
            temporarilyChangeNuggetImage();
            score += 30;
            scoreDisplay.textContent = `점수: ${score}`;
            mustardPosition = -60;
            mustard.style.left = `${Math.random() * 275}px`;
            mustard.style.display = 'none';
        }

        if (mustardPosition >= gameContainer.clientHeight) {
            mustardPosition = -60;
            mustard.style.left = `${Math.random() * 275}px`;
            mustard.style.display = 'block';
        }
    }, 40);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(scoreInterval);
    clearInterval(ketchappInterval);
    clearInterval(mustardInterval);
    isGameOver = true;

    changeNuggetImageToSad();

    // 점수에서 10으로 나눈 값을 sauceTotal에 더함
    sauceTotal += Math.floor(score / 10);
    localStorage.setItem('sauceTotal', sauceTotal);

    // 최고 점수 업데이트
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }

    gameOverText.textContent = 'Game Over';
    gameOverText.style.display = 'block';
    restartButton.style.display = 'block';
    homeButton.style.display = 'block';
}

// 재시작 버튼 클릭 이벤트
restartButton.addEventListener('click', () => {
    fork1Position = -60;
    fork2Position = -60;
    ketchappPosition = -60;
    mustardPosition = -60;
    nuggetPosition = 140;
    nugget.src = 'img/nugget.svg';
    startGame();
});
homeButton.addEventListener('click', () => {
    window.location.href = 'main.html';
});

// 게임 시작
startGame();
