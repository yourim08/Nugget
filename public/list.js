async function loadList() {
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

        const listContainer = document.querySelector(".lists");

        // learn 값이 true인 데이터만 필터링
        const filteredData = jsonData.filter(item => item["learn"] === true);

        // 데이터가 없는 경우 처리
        if (filteredData.length === 0) {
            listContainer.innerHTML = "<p class='none'>학습한 내용이 없습니다.</p>";
            return;
        }

        // 날짜 및 시간을 기준으로 내림차순으로 정렬 (최신이 위로 오게)
        filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 필터링된 JSON 데이터를 기반으로 리스트 생성
        filteredData.forEach((item, index) => {
            const listItem = document.createElement("div");
            listItem.classList.add("list");

            // 날짜와 토픽 요소 생성
            const dateElement = document.createElement("h1");
            dateElement.classList.add("date");
            dateElement.textContent = item.date || "날짜 없음";

            const topicElement = document.createElement("h1");
            topicElement.classList.add("topic");
            topicElement.textContent = item.topic || "제목 없음";

            // 리스트 이미지 요소 생성
            const listImage = document.createElement("img");
            listImage.src = "list_img/list.svg";
            listImage.alt = "List Image";
            listImage.classList.add("list-img");

            // 리뷰 링크 생성
            const reviewImage = document.createElement("img");
            reviewImage.src = "list_img/list_review.svg";
            reviewImage.alt = "Review Icon";
            reviewImage.classList.add("review-img");

            // 클릭 시 list_into.html로 이동하는 이벤트 핸들러 추가
            reviewImage.addEventListener("click", () => {
                window.location.href = `list_into.html?id=${item.id}`;
            });

            // 리스트 아이템에 요소 추가
            listItem.append(dateElement, topicElement, listImage, reviewImage);

            // 리스트 컨테이너에 리스트 아이템 추가
            listContainer.appendChild(listItem);
        });
    } catch (error) {
        console.error('데이터 로드 오류:', error);
        document.querySelector(".lists").innerHTML = "<p>데이터를 불러오는 중 오류가 발생했습니다.</p>";
    }
}

// 페이지 로드 시 함수 실행
document.addEventListener("DOMContentLoaded", loadList);
