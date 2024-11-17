

function updateCharacter() {
    let levelCount = localStorage.getItem('levelCount');

    // levelCount 값을 항상 최신 상태로 가져옵니다.
    if (levelCount === null) {
        levelCount = 1;
        localStorage.setItem('levelCount', levelCount); // 로컬 스토리지에 초기값 설정
    } else {
        levelCount = parseInt(levelCount);
    }

    console.log("현재 levelCount:", levelCount); // 이 시점에서 levelCount가 최신 상태

    // character.json 파일을 불러와서 해당 level에 맞는 데이터를 표시합니다.
    fetch('character.json')
        .then(response => response.json())
        .then(data => {
            // levelCount에 해당하는 데이터를 찾습니다.
            const character = data.find(item => parseInt(item.level.split('Lv.')[1]) === levelCount);

            console.log("비교하는 levelCount:", levelCount); // levelCount 값

            if (character) {
                // 해당 캐릭터의 이름과 레벨을 #levelText, #nameText에 넣습니다.
                console.log("찾은 캐릭터:", character);
                document.getElementById('levelText').textContent = character.level;
                document.getElementById('nameText').textContent = character.name;
                console.log("넣었고.....")

                // 해당 캐릭터의 이미지를 main_character 이미지에 적용
                const characterImage = character.main_img; // 'character.img'는 JSON 파일 내 이미지 경로
                const mainCharacterImg = document.querySelector('.main_character');
                if (mainCharacterImg) {
                    mainCharacterImg.src = characterImage; // 이미지 경로 업데이트
                    console.log("바꿨다....")
                }
            }
        })
        .catch(error => {
            console.error('Error loading character data:', error);
        });
}




window.addEventListener('load', function () {
    updateCharacter();


    // 접시 로직
    let sauceTotal = localStorage.getItem('sauceTotal')
    if (sauceTotal === null) {
        sauceTotal = 3000;
        localStorage.setItem('sauceTotal', sauceTotal); // 로컬 스토리지에 초기값 설정
    } else {
        sauceTotal = parseInt(sauceTotal);
    }
    let nnn = {
        "1": "main_img/main_white_dish.svg",
        "2": "main_img/main_green_dish.svg",
        "3": "main_img/main_blue_dish.svg",
        "4": "main_img/main_yellow_dish.svg",
        "5": "main_img/main_flower_dish.svg",
        "6": "main_img/main_cat_dish.svg",
        "7": "main_img/main_space_dish.svg",
        "8": "main_img/main_pan_dish.svg",
    };



    let idx = localStorage.getItem("dish");
    if (!idx) {
        idx = "1";
    }

    const plateImage = document.querySelector('#plate');
    plateImage.src = nnn[idx];

    document.querySelector('.main-sauce-count').innerText = sauceTotal;

    // 초기 값
    let xpTotal = localStorage.getItem('xpTotal')
    if (xpTotal === null) {
        xpTotal = 90;
        localStorage.setItem('xpTotal', xpTotal); // 로컬 스토리지에 초기값 설정
    } else {
        xpTotal = parseInt(xpTotal);
    }
    document.querySelector('.main-xp-text').innerText = xpTotal + '/100';

    let initialProgress = localStorage.getItem('progress');
    if (initialProgress === null) {
        initialProgress = 90;
        localStorage.setItem('progress', initialProgress); // 로컬 스토리지에 초기값 설정
    } else {
        initialProgress = parseInt(initialProgress);
    }
    document.querySelector('.progress-bar').style.width = initialProgress + "%";


});
document.querySelector('.main_learn').parentElement.addEventListener('click', function (event) {
    event.preventDefault();  // 기본 동작인 링크 이동을 막음
    if (localStorage.getItem('hasClickedLearn') === 'true') {
        // 경고 이미지와 블러 효과 표시
        document.getElementById('warning-image').style.display = 'block';
        document.getElementById('common_blur').style.display = 'block';
        return;
    }

    // main_quiz_text를 7 / 7로 업데이트
    const quizText = document.querySelector('.main_quiz_text #quiz-progress');
    quizText.textContent = '7 / 7';  // 완료 상태로 변경

    // main_quiz_text와 main_secret 이미지를 숨김
    document.querySelector('.main_quiz_text').style.display = 'none';  // main_quiz_text 숨기기
    document.getElementById('main_secret').style.display = 'none';  // secret 이미지 숨기기

    // localStorage에 상태 저장 (이미지들이 숨겨진 상태로)
    localStorage.setItem('mainQuizTextHidden', 'true');
    localStorage.setItem('mainSecretHidden', 'true');

    // 소스 진행도 업데이트 (10씩 증가)
    let sauceTotal = localStorage.getItem('sauceTotal')
        ? parseInt(localStorage.getItem('sauceTotal'))
        : 60;
    sauceTotal += 10;

    // 경험치 업데이트 (15씩 증가)
    let xpTotal = localStorage.getItem('xpTotal')
        ? parseInt(localStorage.getItem('xpTotal'))
        : 0;
    xpTotal += 15;

    // 레벨 카운터 초기화 및 업데이트
    let levelCount = localStorage.getItem('levelCount')
        ? parseInt(localStorage.getItem('levelCount'))
        : 1; // 초기값 1로 설정

    // 경험치 100 초과 처리
    if (xpTotal >= 100) {
        levelCount += 1; // 레벨 증가
        xpTotal = xpTotal % 100; // 초과 경험치만 남김
        console.log("마이너스 작용");
        localStorage.setItem('levelCount', levelCount); // 레벨 저장
    }

    // progress_bar 업데이트: 경험치를 기준으로 길이 계산
    const currentProgress = (xpTotal / 100) * 100; // 경험치 비율로 진행바 길이 계산

    // localStorage에 새로운 값 저장
    localStorage.setItem('sauceTotal', sauceTotal);
    localStorage.setItem('xpTotal', xpTotal);
    localStorage.setItem('progress', currentProgress);

    // 애니메이션 함수 호출
    animateSauceCount(sauceTotal, 1500); // 1초 동안 증가
    animateXPCount(xpTotal, 1500); // 1초 동안 경험치 증가
    animateProgressBar(currentProgress, 1500); // 1초 동안 진행바 증가

    // 하루에 한번 클릭한 상태로 설정
    localStorage.setItem('hasClickedLearn', 'true');

    // 페이지 이동
    const n = 1;
    window.location.href = `list_into.html?n=${n}`;

    // 레벨 변경 후, 업데이트된 데이터 반영
    updateCharacter(); // 레벨 변경 후 바로 캐릭터 업데이트

});
// 경고 이미지를 클릭할 때 블러 효과 해제
document.getElementById('warning-image').addEventListener("click", function () {
    const blurImage = document.getElementById('common_blur');
    const warningImage = document.getElementById('warning-image');

    blurImage.style.display = "none";
    warningImage.style.display = "none";
});

// 페이지 로드 시 이미지 상태 복원
window.addEventListener('load', function () {
    // main_quiz_text와 main_secret이 숨겨졌는지 체크
    if (localStorage.getItem('mainQuizTextHidden') === 'true') {
        document.querySelector('.main_quiz_text').style.display = 'none';
    }

    if (localStorage.getItem('mainSecretHidden') === 'true') {
        document.getElementById('main_secret').style.display = 'none';
    }

});


//함수===========================================================

// 소스 개수를 천천히 증가시키는 함수
function animateSauceCount(targetCount, duration) {
    const sauceText = document.querySelector(".main-sauce-count");
    let currentCount = parseInt(sauceText.textContent) || 0;
    const increment = 1;
    const totalSteps = targetCount - currentCount;
    const intervalTime = duration / totalSteps;

    const interval = setInterval(() => {
        currentCount += increment;
        if (currentCount >= targetCount) {
            currentCount = targetCount;
            clearInterval(interval);
        }
        sauceText.textContent = currentCount;
    }, intervalTime);
}

// 경험치 개수를 천천히 증가시키는 함수 (균등하게 증가하도록 수정)
function animateXPCount(targetCount, duration) {
    const xpText = document.querySelector(".main-xp-text");
    let currentCount = parseInt(xpText.textContent.split('/')[0]) || 0; // '0/100' 형식
    const totalSteps = Math.abs(targetCount - currentCount);
    const incrementPerStep = (targetCount - currentCount) / totalSteps;  // 단계마다 증가할 양 계산
    const intervalTime = duration / totalSteps; // 각 단계마다 시간 분배

    const interval = setInterval(() => {
        currentCount += incrementPerStep;
        if ((incrementPerStep > 0 && currentCount >= targetCount) || (incrementPerStep < 0 && currentCount <= targetCount)) {
            currentCount = targetCount;
            clearInterval(interval);
        }
        xpText.textContent = Math.round(currentCount) + '/100'; // '0/100' 형식으로 업데이트
    }, intervalTime);
}

// progress_bar를 천천히 증가시키는 함수
function animateProgressBar(targetWidth, duration) {
    const progressBar = document.querySelector(".progress-bar");
    let currentWidth = parseInt(progressBar.style.width) || 0;
    const increment = (targetWidth - currentWidth) / (duration / 10);

    const interval = setInterval(() => {
        currentWidth += increment;
        if (currentWidth >= targetWidth) {
            currentWidth = targetWidth;
            clearInterval(interval);
        }
        progressBar.style.width = currentWidth + "%";
    }, 10);
}
