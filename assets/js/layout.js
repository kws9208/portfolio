// sidebar.js
export function createSidebar(routes) {
  const navLinks = routes.map(route => `
    <a href="#${route.id}" class="sidebar-nav-item">${route.title}</a>
  `).join('');

  return `
    <aside class="sidebar">
        <div class="sidebar-header">
          <a href="#main" class="home-icon-wrapper">
            <img src="./img/letter-w-icon-png-8988.png" />
          </a>
          <input type="checkbox" id="sidebar-toggle" />
          <label for="sidebar-toggle" class="sidebar-toggle-btn">☰</label>
        </div>
        <nav class="sidebar-nav">
            <div class="sidebar-nav-item">
                <img src="./img/note-96.svg"/>새 채팅
            </div>
            <div class="sidebar-nav-item">
                <img src="./img/magnifier-40.svg"/>채팅 검색
            </div>
            <div class="sidebar-nav-item">
                <img src="./img/image-32.svg"/>라이브러리
            </div>
            <h4 class="sidebar-nav-item-heading">프로젝트</h4>
              <div class="sidebar-nav-item">
                <img src="./img/new-folder-29.svg"/>새 프로젝트
            </div>
            <h4 class="sidebar-nav-item-heading">채팅</h4>
            ${navLinks}
        </nav>
    </aside>
  `;
}

export const header = `
  <div class="main-header">
      <span class="header-title"></span>
      <span class="main-title">
        <button id="pdf-download-button" class="pdf-btn">
          <span>📄 PDF로 다운받기</span>
        </button>
        <button id="theme-toggle-button">
          <img id="theme-toggle-icon" src="./img/moon-56.svg" alt="Theme icon" />
        </button> 김우석's 포트폴리오
      </span>
  </div>
`;

export const footer = `
  <div class="main-footer">
      <div class="chat-input-box">
        <div class="chat-input">
          <span class="placeholder"> 
            <span class="plus-icon">+</span> 질문을 입력하세요...
          </span>
          <span class="send-icon">▶</span>
        </div>
      </div>
      <p class="disclaimer">AI는 실수를 할 수 있습니다. 저는 실수에서 배우고 개선합니다.</p>
  </div>
`;