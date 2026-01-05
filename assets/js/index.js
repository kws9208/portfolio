import { createSidebar, header, footer } from './layout.js';
import { routes } from './routes.js';

const root = document.getElementById('app');

const savedTheme = localStorage.getItem('theme');
const isLightOnLoad = (savedTheme === 'light');
if (isLightOnLoad) {
    document.body.classList.add('light-mode');
}

// --- Initial Render ---
root.innerHTML = `
  ${createSidebar(routes)}
  <div class="main-wrapper">
    ${header}
    <div id="main-content"></div>
    ${footer}
  </div>
`;

const mainContentArea = document.getElementById('main-content');
const headerTitleSpan = document.querySelector('.main-header .header-title');
const themeToggleButton = root.querySelector('#theme-toggle-button');
const themeToggleIcon = root.querySelector('#theme-toggle-icon');
const imageModal = document.getElementById('image-modal');
const modalImg = document.getElementById('image-modal-content');
const closeModal = document.getElementById('image-modal-close');

function setupThemeToggle() {
    if (isLightOnLoad) {
        themeToggleIcon.src = './img/sun-25.svg';
    } else {
        themeToggleIcon.src = './img/moon-56.svg';
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLightMode = document.body.classList.contains('light-mode');
            themeToggleIcon.src = isLightMode ? './img/sun-25.svg' : './img/moon-56.svg';
            localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
        });
    }
}

function setupImageModal() {
    if (imageModal) imageModal.style.display = "none";
    if (closeModal) closeModal.onclick = () => imageModal.style.display = "none";
    if (imageModal) imageModal.onclick = () => imageModal.style.display = "none";

    mainContentArea.addEventListener('click', function (event) {
        const targetImg = event.target;
        if (targetImg.tagName !== 'IMG' || targetImg.classList.contains('profile')) {
            return;
        }

        if (targetImg.closest('.chat-area')) {
            imageModal.style.display = "flex";
            modalImg.src = targetImg.src;
        }
    });
}

async function updatePage() {
    const pageId = window.location.hash.substring(1) || 'main';
    const currentPage = routes.find(route => route.id === pageId) || routes[0];

    try {
        const response = await fetch(currentPage.path);
        if (!response.ok) throw new Error(`Failed to fetch page: ${currentPage.path}`);
        mainContentArea.innerHTML = await response.text();
        
        if (window.MathJax && window.MathJax.typesetPromise) {
            await MathJax.typesetPromise([mainContentArea]);
        }
    } catch (error) {
        console.error('Page loading error:', error);
        mainContentArea.innerHTML = `<p style="text-align: center; padding: 20px;">Error loading content.</p>`;
    }

    if (headerTitleSpan) {
        headerTitleSpan.textContent = currentPage.title;
    }

    document.querySelectorAll('.sidebar-nav-item').forEach(link => {
        if (link.getAttribute('href') === `#${pageId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function extractChatContent(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const chatElement = doc.querySelector(".chat-area");
    return chatElement ? chatElement.innerHTML : "";
}

async function generatePdf() {
    console.log("📄 PDF generation process started...");

    try {
        const pageContents = await Promise.all(
            routes.map(route => fetch(route.path).then(res => res.text()))
        );

        const combinedHTML = `
            <div style="width: 100%; max-width: 210mm; padding: 15mm; box-sizing: border-box; background: white; font-family: sans-serif; color: black;">
                <h1 style="color:#1a73e8;border-bottom:2px solid #eee;">1. 자기소개</h1>
                <div class="chat-area">${extractChatContent(pageContents[0])}</div>
                <div style="page-break-before: always;"></div>
                <h1 style="color:#1a73e8;border-bottom:2px solid #eee;">2. FiD 모델 추론 가속화 연구</h1>
                <div class="chat-area">${extractChatContent(pageContents[1])}</div>
                <div style="page-break-before: always;"></div>
                <h1 style="color:#1a73e8;border-bottom:2px solid #eee;">3. IJCAI 챌린지 수상</h1>
                <div class="chat-area">${extractChatContent(pageContents[2])}</div>
            </div>`;
        
        document.body.classList.add('light-mode');

        if (window.MathJax) {
            console.log("렌더링 대기중...");
            await MathJax.typesetPromise();
        }

        console.log("✨ Creating PDF...");
        const pdfOptions = {
            margin: 10,
            filename: "portfolio.pdf",
            html2canvas: { scale: 2, scrollX: 0, scrollY: 0, useCORS: true, logging: false },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };
        
        await html2pdf().from(combinedHTML).set(pdfOptions).save();
        console.log("🎉 PDF download complete!");

    } catch (error) {
        console.error("PDF generation failed:", error);
    } finally {
        if (!isLightOnLoad) {
            document.body.classList.remove('light-mode');
        }
    }
}

function setupPdfButton() {
    const pdfButton = document.getElementById("pdf-download-button");
    if (pdfButton) {
        pdfButton.addEventListener("click", generatePdf);
    }
}

function initialize() {
    setupThemeToggle();
    setupImageModal();
    setupPdfButton();
    
    window.addEventListener('hashchange', updatePage);
    updatePage(); // Initial page load
}

initialize();
