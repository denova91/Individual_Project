let currentLang = localStorage.getItem('lang') || 'ru';
const translations = {};

async function loadLanguage(lang) {
    try {
        const res = await fetch(`locales/${lang}.json`);
        const data = await res.json();
        translations[lang] = data;
        applyTranslations();
    } catch (e) {
        console.error('Ошибка загрузки языка', e);
    }
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });
    // После применения переводов обновляем текст кнопки темы
    updateThemeIcons();
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
    loadLanguage(lang);
}

function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark-theme');
    if (isDark) {
        html.classList.remove('dark-theme');
        html.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.remove('light-theme');
        html.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
    updateThemeIcons();
}

function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark-theme');
    const themeBtns = document.querySelectorAll('#themeToggle, #sidebarThemeToggle');
    themeBtns.forEach(btn => {
        const icon = btn.querySelector('i');
        const span = btn.querySelector('span');
        if (isDark) {
            icon.className = 'fas fa-sun';
            if (span) span.textContent = 'Светлая тема';
        } else {
            icon.className = 'fas fa-moon';
            if (span) span.textContent = 'Темная тема';
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.pageYOffset > 300);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    if (!toggle || !sidebar) return;
    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        const icon = toggle.querySelector('i');
        icon.className = sidebar.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
    });
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
            sidebar.classList.remove('open');
            toggle.querySelector('i').className = 'fas fa-bars';
        }
    });
}

function initActiveNavButtons() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-button').forEach(btn => {
        const onclick = btn.getAttribute('onclick');
        if (onclick && onclick.includes(current)) {
            btn.classList.add('active');
        } else if (current === 'index.html' && onclick && onclick.includes('index.html')) {
            btn.classList.add('active');
        }
    });
}

function initGlossaryLinks() {
    document.querySelectorAll('.glossary-term').forEach(term => {
        term.addEventListener('click', () => {
            window.location.href = `glossary.html#${term.dataset.term}`;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.className = savedTheme + '-theme';
    updateThemeIcons();

    loadLanguage(currentLang);

    initBackToTop();
    initMobileMenu();
    initActiveNavButtons();
    initGlossaryLinks();

    document.querySelectorAll('#themeToggle, #sidebarThemeToggle').forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    document.querySelectorAll('.nav-button[onclick*="scrollToSection"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const match = btn.getAttribute('onclick').match(/scrollToSection\('([^']+)'\)/);
            if (match) scrollToSection(match[1]);
        });
    });
});