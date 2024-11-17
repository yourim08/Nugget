fetch('quiz.json')
    .then(response => response.json())  // JSON 형식으로 변환
    .then(data => {
        const maxQuizCount = 7;  // 최대 퀴즈 수
        let usedIndices = JSON.parse(localStorage.getItem('usedIndices')) || []; // 사용된 인덱스 배열
        let localUpdatedList = JSON.parse(localStorage.getItem('updatedList')) || [];  // 로컬스토리지에서 리스트 불러오기

        // learn 값이 true인 항목만 필터링
        const filteredList = localUpdatedList.filter(item => item.learn === true);

        // 퀴즈 데이터를 화면에 표시하는 함수
        function loadQuiz() {
            if (usedIndices.length >= maxQuizCount) {
                localStorage.removeItem('usedIndices');
                window.location.href = 'main.html';
                return;
            }

            if (filteredList.length === 0) {
                alert('학습할 항목이 없습니다.');
                return;
            }

            // 랜덤한 항목을 선택하기 위해 필터링된 리스트에서 랜덤 인덱스를 가져옴
            const randomItem = filteredList[Math.floor(Math.random() * filteredList.length)];

            // 퀴즈 데이터에서 해당 항목과 연관된 문제를 선택
            let currentQuizIndex;
            do {
                currentQuizIndex = Math.floor(Math.random() * data.length);
            } while (usedIndices.includes(currentQuizIndex)); // 중복된 퀴즈가 나오지 않도록

            const quiz = data[currentQuizIndex];
            const questionElement = document.querySelector('.question');
            const textElement = document.querySelector('.text'); // 복습 문제 텍스트 요소
            const talkElement = document.querySelector('.talk'); // talk 요소
            const quizImage = document.querySelector('.curious'); // 이미지를 변경할 요소

            questionElement.textContent = quiz.question;
            textElement.textContent = '복습 문제입니다.';  // 복습 문제 텍스트 표시

            const rectangles = document.querySelectorAll('.rectangle');
            rectangles.forEach((rectangle, i) => {
                if (quiz.options[i]) {
                    rectangle.textContent = ''; // 기존 텍스트 제거
                    const optionText = document.createElement('span');
                    optionText.textContent = quiz.options[i];
                    optionText.classList.add('option-text');
                    rectangle.appendChild(optionText);
                    rectangle.onclick = () => {
                        rectangle.classList.add('selected');
                        checkAnswer(quiz.options[i], quiz.answer, textElement, talkElement, quizImage, rectangles, currentQuizIndex);
                    };
                }
            });
        }

        // 정답을 체크하고 결과를 처리하는 함수
        function checkAnswer(selectedAnswer, correctAnswer, textElement, talkElement, quizImage, rectangles, currentQuizIndex) {
            const container = document.querySelector('.container');

            textElement.textContent = '';
            talkElement.style.display = 'none';

            const newImage = document.createElement('img');
            if (selectedAnswer === correctAnswer) {
                container.style.backgroundColor = '#6FFE5C';
                quizImage.src = 'quiz_img/quiz_happy.svg';
                newImage.src = 'quiz_img/quiz_o.svg';
                newImage.alt = 'O';
            } else {
                container.style.backgroundColor = '#FF7171';
                quizImage.src = 'quiz_img/quiz_sad.svg';
                newImage.src = 'quiz_img/quiz_x.svg';
                newImage.alt = 'X';
            }
            newImage.style.position = 'absolute';
            newImage.style.marginTop = '146px';
            newImage.style.marginLeft = '89px';
            newImage.style.zIndex = '1';
            container.appendChild(newImage);

            // 사용된 인덱스를 저장하고 2초 후 다음 문제로 이동
            setTimeout(() => {
                rectangles.forEach(rectangle => {
                    rectangle.style.display = 'none';
                });

                const stopDiv = document.createElement('div');
                stopDiv.classList.add('button', 'stop');
                stopDiv.textContent = '그만 두기';
                container.appendChild(stopDiv);

                const continueDiv = document.createElement('div');
                continueDiv.classList.add('button', 'continue');
                continueDiv.textContent = '계속 하기';
                container.appendChild(continueDiv);

                console.log('Used indices length:', usedIndices.length);


                if (usedIndices.length >= maxQuizCount - 1) {
                    continueDiv.style.display = 'none';
                    stopDiv.textContent = '돌아가기'; // 돌아가기 버튼 표시
                    localStorage.removeItem('usedIndices');
                }

                continueDiv.addEventListener('click', () => {
                    if (usedIndices.length < maxQuizCount) {
                        location.reload();
                        loadQuiz();
                    }
                });

                stopDiv.onclick = () => {
                    window.location.href = 'main.html';
                };

                // 퀴즈 인덱스를 사용된 인덱스 배열에 추가
                usedIndices.push(currentQuizIndex);
                localStorage.setItem('usedIndices', JSON.stringify(usedIndices));

                if (selectedAnswer === correctAnswer) {
                    let sauceTotal = parseInt(localStorage.getItem('sauceTotal')) || 3000;
                    sauceTotal += 5;
                    localStorage.setItem('sauceTotal', sauceTotal);

                    // 화면에 업데이트
                    // document.querySelector('.main-sauce-count').innerText = sauceTotal;
                }
            }, 1500);

            rectangles.forEach(rectangle => {
                rectangle.onclick = null;
                rectangle.style.pointerEvents = 'none';
            });
        }

        // 첫 번째 퀴즈 로딩
        loadQuiz();
    })
    .catch(error => console.error('퀴즈 데이터를 불러오는 중 오류가 발생했습니다:', error));
