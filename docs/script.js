// Глобальные переменные
let currentLang = localStorage.getItem('lang') || 'ru';
const translations = {};

// =================== ЗАГРУЗКА ПЕРЕВОДОВ ===================
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
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
    loadLanguage(lang);
}

// =================== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ===================
function toggleTheme() {
    const htmlElement = document.documentElement;
    const isDark = htmlElement.classList.contains('dark-theme');
    
    if (isDark) {
        htmlElement.classList.remove('dark-theme');
        htmlElement.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
        updateThemeIcons('light');
    } else {
        htmlElement.classList.remove('light-theme');
        htmlElement.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        updateThemeIcons('dark');
    }
}

function updateThemeIcons(theme) {
    const themeButtons = document.querySelectorAll('#themeToggle, #sidebarThemeToggle');
    themeButtons.forEach(button => {
        const icon = button.querySelector('i');
        const text = button.querySelector('span');
        
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            if (text) text.textContent = 'Светлая тема';
        } else {
            icon.className = 'fas fa-moon';
            if (text) text.textContent = 'Темная тема';
        }
    });
}

// =================== ПРОКРУТКА К РАЗДЕЛУ ===================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        section.style.animation = 'none';
        setTimeout(() => {
            section.style.animation = 'fadeInUp 0.5s ease';
        }, 10);
    }
}

// =================== КНОПКА "НАВЕРХ" ===================
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// =================== МОБИЛЬНОЕ МЕНЮ ===================
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (sidebar.classList.contains('open')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        document.addEventListener('click', (event) => {
            if (!sidebar.contains(event.target) && !mobileToggle.contains(event.target)) {
                sidebar.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
    }
}

// =================== АКТИВНЫЕ КНОПКИ НАВИГАЦИИ ===================
function initActiveNavButtons() {
    const currentPage = window.location.pathname.split('/').pop();
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        const href = button.getAttribute('onclick');
        if (href) {
            const page = href.split("'")[1];
            if (page === currentPage || (currentPage === '' && page === 'index.html')) {
                button.classList.add('active');
            }
        }
    });
}

// =================== АНИМАЦИЯ ПРИ ПРОКРУТКЕ ===================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });
}

// =================== ОБРАБОТЧИКИ ДЛЯ ГЛОССАРИЯ ===================
function initGlossaryLinks() {
    document.querySelectorAll('.glossary-term').forEach(term => {
        term.addEventListener('click', () => {
            window.location.href = `glossary.html#${term.dataset.term}`;
        });
    });
}

// =================== ИНИЦИАЛИЗАЦИЯ ===================
document.addEventListener('DOMContentLoaded', () => {
    // Загрузка сохраненной темы
    const savedTheme = localStorage.getItem('theme') || 'light';
    updateThemeIcons(savedTheme);
    
    // Загрузка языка
    loadLanguage(currentLang);
    
    // Инициализация компонентов
    initBackToTop();
    initMobileMenu();
    initActiveNavButtons();
    initScrollAnimations();
    initGlossaryLinks();
    
    // Обработчики переключения темы
    const themeToggles = document.querySelectorAll('#themeToggle, #sidebarThemeToggle');
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', toggleTheme);
    });
    
    // Обработчики кнопок языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
    
    // Обработчики для кнопок навигации с прокруткой
    document.querySelectorAll('.nav-button[onclick^="scrollToSection"]').forEach(button => {
        button.addEventListener('click', function() {
            const match = this.getAttribute('onclick').match(/scrollToSection\('([^']+)'\)/);
            if (match) {
                scrollToSection(match[1]);
            }
        });
    });
    
    // Анимация таблиц
    document.querySelectorAll('table tr').forEach((row, index) => {
        row.style.animationDelay = `${index * 0.05}s`;
    });
    
    // Показываем приветствие на главной
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        setTimeout(() => {
            const msg = currentLang === 'ru' ? 'Добро пожаловать!' : (currentLang === 'en' ? 'Welcome!' : '欢迎！');
            console.log(msg);
        }, 1000);
    }
});

// =================== КЛАВИАТУРНЫЕ ОБРАБОТЧИКИ ===================
document.addEventListener('keydown', (event) => {
    if (event.altKey && event.key === 't') {
        toggleTheme();
    }
    if (event.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            if (mobileToggle) {
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        }
    }
});