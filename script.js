// 카테고리별 데이터 관리
const categories = ['music', 'food', 'celebrity'];

// 로컬 스토리지에서 댓글 불러오기
function loadComments(category) {
    const comments = JSON.parse(localStorage.getItem(`favorite_${category}`)) || [];
    const container = document.getElementById(`${category}Container`);
    
    if (comments.length === 0) {
        container.innerHTML = '<div class="empty-state">아직 등록된 내용이 없네요. 첫 번째로 남겨주세요! 💕</div>';
        return;
    }
    
    container.innerHTML = '';
    comments.forEach((comment, index) => {
        const commentCard = createCommentCard(comment, index, category);
        container.appendChild(commentCard);
    });
}

// 모든 카테고리의 댓글 불러오기
function loadAllComments() {
    categories.forEach(category => {
        loadComments(category);
    });
}

// 댓글 카드 생성
function createCommentCard(comment, index, category) {
    const card = document.createElement('div');
    card.className = 'comment-card';
    
    const text = document.createElement('div');
    text.className = 'comment-text';
    text.textContent = comment.text;
    
    const meta = document.createElement('div');
    meta.className = 'comment-meta';
    
    const date = document.createElement('span');
    date.className = 'comment-date';
    date.textContent = formatDate(comment.date);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '삭제';
    deleteBtn.onclick = () => deleteComment(index, category);
    
    meta.appendChild(date);
    meta.appendChild(deleteBtn);
    
    card.appendChild(text);
    card.appendChild(meta);
    
    return card;
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 댓글 추가
function addComment(category, inputId, containerId) {
    const input = document.getElementById(inputId);
    const text = input.value.trim();
    
    if (!text) {
        alert('내용을 입력해주세요!');
        return;
    }
    
    const storageKey = `favorite_${category}`;
    const comments = JSON.parse(localStorage.getItem(storageKey)) || [];
    comments.unshift({
        text: text,
        date: new Date().toISOString()
    });
    
    localStorage.setItem(storageKey, JSON.stringify(comments));
    input.value = '';
    loadComments(category);
}

// 댓글 삭제
function deleteComment(index, category) {
    if (!confirm('이 항목을 삭제하시겠어요?')) return;
    
    const storageKey = `favorite_${category}`;
    const comments = JSON.parse(localStorage.getItem(storageKey)) || [];
    comments.splice(index, 1);
    localStorage.setItem(storageKey, JSON.stringify(comments));
    loadComments(category);
}

// 이벤트 리스너
document.addEventListener('DOMContentLoaded', () => {
    loadAllComments();
    
    // 각 카테고리별 입력창에 Ctrl+Enter 지원
    categories.forEach(category => {
        const inputId = `${category}Input`;
        const containerId = `${category}Container`;
        const input = document.getElementById(inputId);
        
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    addComment(category, inputId, containerId);
                }
            });
        }
    });
});
