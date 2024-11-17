window.onload = function () {
    const container = document.querySelector('.scrollable-content');
    const gapX = 119;
    const gapY = 150;

    const itemCountText = document.getElementById('item-count-text');
    let clearStatus = JSON.parse(localStorage.getItem('clearStatus')) || {};
    let levelCount = localStorage.getItem('levelCount');

    // levelCount를 숫자 형식으로 변환
    if (levelCount) {
        levelCount = parseInt(levelCount);
    }

    fetch('character.json')
        .then(response => response.json())
        .then(namesData => {
            // 로컬 스토리지에서 clearStatus를 가져옵니다 (없으면 빈 객체로 초기화)
            const clearStatus = JSON.parse(localStorage.getItem('clearStatus')) || {};

            // JSON 데이터와 로컬 스토리지 동기화
            namesData.forEach((item) => {
                if (item.clear === true && !clearStatus[item.name]) {
                    clearStatus[item.name] = true;
                }
            });

            // levelCount 값이 유효하면 해당 캐릭터의 clear 값을 true로 설정
            if (levelCount >= 1 && levelCount <= namesData.length) {
                const characterName = namesData[levelCount - 1].name;
                clearStatus[characterName] = true; // 해당 캐릭터의 clear 상태를 true로 설정
                // 로컬 스토리지에 저장
                localStorage.setItem('clearStatus', JSON.stringify(clearStatus));
            }

            // clear 상태가 true인 캐릭터의 갯수 세기
            const clearCount = namesData.filter(item => clearStatus[item.name] === true).length;
            const itemCount = namesData.length;

            // itemCountText에 값 설정
            itemCountText.textContent = clearCount + " / " + itemCount;

            for (let i = 0; i < itemCount; i++) {
                const item = document.createElement('div');
                item.classList.add('item');

                const text = document.createElement('p');
                text.classList.add('item-text');

                const name = namesData[i].name;
                const clear = clearStatus[name] || false;
                text.textContent = clear ? `${i + 1}. ${name}` : '???';

                const img = document.createElement('img');
                img.src = "dictionary_img/dictionary_square.svg";
                img.alt = "Square";
                img.classList.add('item-square');

                // 특정 이미지 클릭 시 경고 이미지와 블러 효과 토글
                if (namesData[i].img === "dictionary_img/dictionary_banjuk.svg") {
                    img.addEventListener("click", function () {
                        const warningImage = document.getElementById('warning-image');
                        const commonBlur = document.getElementById('common_blur');
                        const overlay = document.getElementById('overlay');

                        // 경고 이미지와 블러 효과를 토글
                        const isVisible = warningImage.style.display === 'block';

                        if (isVisible) {
                            warningImage.style.display = 'none';
                            commonBlur.style.display = 'none';
                            overlay.style.display = 'none';
                        } else {
                            warningImage.style.display = 'block';
                            commonBlur.style.display = 'block';
                            overlay.style.display = 'block';
                        }
                    });
                }

                if (clear) {
                    const jsonImgSrc = namesData[i].img ? namesData[i].img : "";
                    if (jsonImgSrc) {
                        const jsonImg = document.createElement('img');
                        jsonImg.src = jsonImgSrc;
                        jsonImg.alt = name + " Image";
                        jsonImg.classList.add('item-json-img');
                        item.appendChild(jsonImg);
                    }
                }

                const nameBoxSrc = "dictionary_img/dictionary_name_box.svg";
                const nameBoxImg = document.createElement('img');
                nameBoxImg.src = nameBoxSrc;
                nameBoxImg.alt = "Name Box";
                nameBoxImg.classList.add('name-box-img');

                item.appendChild(text);
                item.appendChild(img);
                item.appendChild(nameBoxImg);

                const left = (i % 3) * gapX;
                const top = Math.floor(i / 3) * gapY;

                item.style.left = `${left}px`;
                item.style.top = `${top}px`;

                container.appendChild(item);
            }


            // 경고 이미지를 눌렀을 때 사라지게 하기
            const warningImage = document.getElementById('warning-image');
            const commonBlur = document.getElementById('common_blur');
            const overlay = document.getElementById('overlay');

            warningImage.addEventListener("click", function () {
                // 경고 이미지와 블러, 오버레이 숨기기
                warningImage.style.display = 'none';
                commonBlur.style.display = 'none';
                overlay.style.display = 'none';
            });

            // 오버레이를 클릭했을 때도 숨기기
            overlay.addEventListener('click', function () {
                warningImage.style.display = 'none';
                commonBlur.style.display = 'none';
                overlay.style.display = 'none';
            });

        });
}
