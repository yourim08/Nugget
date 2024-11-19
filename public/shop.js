// 초기 sauceTotal 설정 및 표시
let sauceTotal = localStorage.getItem('sauceTotal')
    ? parseInt(localStorage.getItem('sauceTotal'))
    : 3000;
const sauceTotalText = document.getElementById('sauceTotalText');
sauceTotalText.innerText = sauceTotal;

// dishStates 초기화 및 로드
let dishStates = JSON.parse(localStorage.getItem('dishStates')) || {};




// 페이지 로드 시 상태 복원
document.querySelectorAll('.dish_state').forEach(dish => {
    const dishId = dish.getAttribute('data-id');
    const state = dishStates[dishId];

    const currentImage = dish.querySelector('img');
    const countElement = dish.querySelector('.count');

    // 홀드 상태 또는 체크 상태일 때 count 값을 0으로 고정
    if (state === 'check' || state === 'hold') {
        currentImage.src = (state === 'check') ? 'shop_img/shop_check.svg' : 'shop_img/shop_hold.svg';
        currentImage.className = state;
        countElement.innerText = '0'; // count 값을 0으로 설정
        countElement.style.display = 'none'; // 카운트 숨김

        // 로컬 스토리지에도 count 값을 0으로 저장
        localStorage.setItem(`count_${dishId}`, '0');
    } else {
        // 다른 상태에서는 로컬 스토리지에서 count 값을 불러옴
        let count = localStorage.getItem(`count_${dishId}`) || countElement.innerText;
        countElement.innerText = count;
        countElement.style.display = (count === '0') ? 'none' : 'block';
    }
});


// 경고 이미지와 블러를 제어하는 함수
function showWarning() {
    const warningImage = document.getElementById('warning-image');
    const blurBackground = document.getElementById('common_blur');

    // 경고 이미지와 블러를 표시
    warningImage.style.display = 'block';
    blurBackground.style.display = 'block';

    // 경고 이미지를 클릭하면 숨김
    warningImage.addEventListener('click', hideWarning);

    // 블러 클릭 시 경고창 닫기
    blurBackground.addEventListener('click', hideWarning);
}

function hideWarning() {
    const warningImage = document.getElementById('warning-image');
    const blurBackground = document.getElementById('common_blur');

    // 경고 이미지와 블러를 숨김
    warningImage.style.display = 'none';
    blurBackground.style.display = 'none';

    // 이벤트 제거 (중복 방지)
    warningImage.removeEventListener('click', hideWarning);
    blurBackground.removeEventListener('click', hideWarning);
}

// dish_state 클릭 이벤트 수정
document.querySelectorAll('.dish_state').forEach(dish => {
    dish.addEventListener('click', (event) => {
        const countElement = dish.querySelector('.count');
        let count = parseInt(countElement ? countElement.innerText : 0);
        const checkImageSrc = 'shop_img/shop_check.svg'; // check 이미지 경로
        const holdImageSrc = 'shop_img/shop_hold.svg'; // hold 이미지 경로
        const currentImage = dish.querySelector('img');

        if (sauceTotal >= count) {
            if (currentImage.src.endsWith('shop_check.svg')) {
                alert("이미 check 상태입니다."); // 이미 check 이미지인 경우 알림
            } else {
                if (dishStates[dish.getAttribute('data-id')] != undefined) {
                    // alert("이미 산 내역입니다.");
                } else {
                    sauceTotal -= count;
                    localStorage.setItem('sauceTotal', sauceTotal);

                    // 업데이트된 sauceTotal 값을 즉시 반영
                    updateSauceTotalText();
                }

                // 모든 dish의 이미지를 hold 이미지로 변경 (sauce 제외)
                document.querySelectorAll('.dish_state img').forEach(img => {
                    if (!img.src.endsWith('shop_sauce.svg')) {
                        img.src = holdImageSrc;
                        img.className = "hold";
                    }
                });

                // 현재 이미지를 check 이미지로 변경
                currentImage.src = checkImageSrc;
                currentImage.className = "check";

                // 상태를 localStorage에 저장
                Object.keys(dishStates).forEach(function (key) {
                    dishStates[key] = "hold";
                });

                dishStates[dish.getAttribute('data-id')] = 'check';
                localStorage.setItem('dish', dish.getAttribute('data-id'));

                // count를 0으로 변경하고 숨김
                countElement.innerText = '0';
                countElement.style.display = 'none'; // count 요소 숨기기

                localStorage.setItem('dishStates', JSON.stringify(dishStates));
            }
        } else {
            // alert("Not enough sauce left!");
            showWarning(); // 경고 표시
        }
    });
});


// sauceTotal 텍스트 실시간 업데이트 함수
function updateSauceTotalText() {
    sauceTotalText.innerText = sauceTotal;
}

// 카테고리 버튼 클릭 이벤트 설정
// 페이지가 로드되었을 때 접시 카테고리를 기본 선택
window.addEventListener('DOMContentLoaded', () => {
    // 접시 아이템을 기본으로 표시
    document.getElementById('dish-items').style.display = 'flex';

    // 기본 선택된 버튼의 스타일 변경
    document.querySelectorAll('.category-btn').forEach(button => {
        if (button.getAttribute('data-category') === 'dish') {
            button.style.backgroundColor = '#FDE17D';
        } else {
            button.style.backgroundColor = '';
        }
    });
});

// 버튼 클릭 이벤트 설정
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const category = event.target.getAttribute('data-category');

        // 모든 카테고리 아이템 숨기기
        document.querySelectorAll('.all_dishs, .all_furniture, .all_decor').forEach(item => {
            item.style.display = 'none';
        });

        // 선택된 카테고리 아이템 보이기
        if (category === 'dish') {
            document.getElementById('dish-items').style.display = 'flex';
        } else if (category === 'furniture') {
            document.getElementById('furniture-items').style.display = 'block';
        } else if (category === 'decor') {
            document.getElementById('decor-items').style.display = 'block';
        }

        // 선택된 버튼 스타일 변경
        document.querySelectorAll('.category-btn').forEach(button => {
            if (button.getAttribute('data-category') === category) {
                button.style.backgroundColor = '#FDE17D';
            } else {
                button.style.backgroundColor = '';
            }
        });
    });
});
