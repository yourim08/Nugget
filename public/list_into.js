// URL에서 쿼리 파라미터로 전달된 ID 값 가져오기
const urlParams = new URLSearchParams(window.location.search);
let id = parseInt(urlParams.get('id'), 10);
const n = urlParams.get('n');  // 'n' 값 가져오기

console.log(n);

// JSON 데이터 불러오기
async function loadContent() {
    try {
        let localUpdatedList = localStorage.getItem('updatedList');
        if (!localUpdatedList) {
            // JSON 파일에서 데이터를 불러옴
            const response = await fetch('list.json');
            if (!response.ok) throw new Error('JSON 데이터를 불러오지 못했습니다.');

            localUpdatedList = await response.json();
        } else {
            localUpdatedList = JSON.parse(localUpdatedList);
        }
        const jsonData = localUpdatedList;
        if (n) {
            // learn 값이 false인 항목만 필터링
            const learnFalseItems = jsonData.filter(item => item.learn === false || item.learn === "false" || item.learn === undefined);
            // URL에 id 값이 없거나 유효하지 않은 경우, learn이 false인 항목에서 랜덤으로 선택
            if (isNaN(id) || id <= 0 || !learnFalseItems.some(item => item.id === id)) {
                const randomItem = learnFalseItems[Math.floor(Math.random() * learnFalseItems.length)];
                id = randomItem.id;
            }
        }

        // 선택된 ID에 맞는 항목 찾기
        const selectedItem = jsonData.find(item => item.id === id);

        // 제목과 내용을 업데이트
        if (selectedItem) {
            document.querySelector('.title2').textContent = selectedItem.topic2 + "란?" || "제목 없음";
            document.querySelector('.content').textContent = selectedItem.content || "내용 없음";
        } else {
            document.querySelector('.content').textContent = "해당 항목의 데이터를 찾을 수 없습니다.";
        }


    } catch (error) {
        console.error('데이터 로드 오류:', error);
        document.querySelector('.content').textContent = "데이터를 불러오는 중 오류가 발생했습니다.";
    }
}

// 페이지 로드 시 함수 실행
document.addEventListener("DOMContentLoaded", loadContent);

// complete_button 클릭 시 ID 값과 함께 list.html로 이동
document.querySelector('.complete_button a').addEventListener('click', async function (e) {
    e.preventDefault();  // 기본 동작을 막음

    try {
        let localUpdatedList = localStorage.getItem('updatedList');
        if (!localUpdatedList) {
            // JSON 파일에서 데이터를 불러옴
            const response = await fetch('list.json');
            if (!response.ok) throw new Error('JSON 데이터를 불러오지 못했습니다.');

            localUpdatedList = await response.json();
        } else {
            localUpdatedList = JSON.parse(localUpdatedList);
        }

        // 선택된 항목의 learn 값을 true로 변경
        const selectedItem = localUpdatedList.find(item => item.id === id);

        if (selectedItem) {
            selectedItem.learn = true;

            // 날짜가 없을 경우에만 날짜를 업데이트
            if (!selectedItem.date) {
                const today = new Date();
                let dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`; // MM.DD 형식            
                selectedItem.date = dateStr;
            }

            // 변경된 JSON 데이터를 서버로 전송하거나 로컬에서 처리하는 부분 (예시로 localStorage에 저장)
            localStorage.setItem('updatedList', JSON.stringify(localUpdatedList));
        }
    } catch (error) {
        console.error('데이터 로드 오류:', error);
    }

    // 이전 페이지로 이동
    window.history.back();  // 이전 페이지로 돌아가기
});
