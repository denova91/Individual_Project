// Определяем текущую страницу
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const currentHash = window.location.hash || '';

// Переключение темы в верхнем меню
const topThemeToggle = document.querySelector('.top-nav-theme-toggle');
if (topThemeToggle) {
    const themeIcon = topThemeToggle.querySelector('i');
    
    // Проверяем сохраненную тему
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-sun';
        topThemeToggle.innerHTML = '<i class="fas fa-sun"></i> <span>Светлая</span>';
        
        // Синхронизируем боковую кнопку
        const sidebarThemeBtn = document.querySelector('.sidebar-theme');
        if (sidebarThemeBtn) {
            sidebarThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            sidebarThemeBtn.setAttribute('data-tooltip', 'Светлая тема');
        }
    }
    
    topThemeToggle.addEventListener('click', () => {
        toggleTheme();
    });
}

// Переключение темы в боковом меню
const sidebarThemeBtn = document.querySelector('.sidebar-theme');
if (sidebarThemeBtn) {
    sidebarThemeBtn.addEventListener('click', () => {
        toggleTheme();
    });
}

// Функция переключения темы
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    const topThemeToggle = document.querySelector('.top-nav-theme-toggle');
    const sidebarThemeBtn = document.querySelector('.sidebar-theme');
    
    if (document.body.classList.contains('dark-theme')) {
        // Устанавливаем темную тему
        localStorage.setItem('theme', 'dark');
        
        // Обновляем верхнюю кнопку
        if (topThemeToggle) {
            topThemeToggle.innerHTML = '<i class="fas fa-sun"></i> <span>Светлая</span>';
        }
        
        // Обновляем боковую кнопку
        if (sidebarThemeBtn) {
            sidebarThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            sidebarThemeBtn.setAttribute('data-tooltip', 'Светлая тема');
        }
    } else {
        // Устанавливаем светлую тему
        localStorage.setItem('theme', 'light');
        
        // Обновляем верхнюю кнопку
        if (topThemeToggle) {
            topThemeToggle.innerHTML = '<i class="fas fa-moon"></i> <span>Темная</span>';
        }
        
        // Обновляем боковую кнопку
        if (sidebarThemeBtn) {
            sidebarThemeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            sidebarThemeBtn.setAttribute('data-tooltip', 'Темная тема');
        }
    }
}

// Мобильное меню (верхняя кнопка)
const topNavMobileToggle = document.querySelector('.top-nav-mobile-toggle');
const sidebar = document.getElementById('sidebar');

if (topNavMobileToggle && sidebar) {
    topNavMobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && 
            !sidebar.contains(e.target) && 
            !topNavMobileToggle.contains(e.target) && 
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
}

// Кнопка быстрого подъема
const backToTopButton = document.getElementById('back-to-top');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
        
        // Активное состояние для кнопок в боковом меню
        if (currentPage === 'index.html' || currentPage === '') {
            const sections = document.querySelectorAll('section[id]');
            const navButtons = document.querySelectorAll('.nav-button[data-section]');
            
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop - 100) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            navButtons.forEach(button => {
                button.classList.remove('active');
                const section = button.getAttribute('data-section');
                
                if (section && section === currentSection) {
                    button.classList.add('active');
                }
                
                // Активируем кнопку "Введение" если мы вверху страницы
                if (!currentSection && section === 'introduction') {
                    button.classList.add('active');
                }
            });
        }
    });
    
    // Инициализация - скрываем кнопку при загрузке
    backToTopButton.classList.remove('show');
    
    // Добавляем обработчик для кнопки "Наверх"
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Плавная прокрутка для всех якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Закрываем мобильное меню
            if (window.innerWidth <= 992 && sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
    });
});

// Обработчики для кнопок в боковом меню
document.querySelectorAll('.nav-button[data-section]').forEach(button => {
    button.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        const targetElement = document.querySelector(`#${section}`);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Закрываем мобильное меню
            if (window.innerWidth <= 992 && sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
    });
});

// Активное состояние для ссылок в верхнем меню
document.querySelectorAll('.top-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || 
        (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
    }
});

// Анимация появления элементов при скролле
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

// Наблюдаем за секциями и карточками
document.querySelectorAll('section, .comparison-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Показываем видимые элементы
    const visibleElements = document.querySelectorAll('section, .comparison-card');
    visibleElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
    
    // Активируем первую кнопку навигации
    const firstNavButton = document.querySelector('.nav-button[data-section]');
    if (firstNavButton && currentPage === 'index.html' && !currentHash) {
        firstNavButton.classList.add('active');
    }
    
    // Активируем кнопку по хэшу
    if (currentHash && currentHash !== '#') {
        const hashSection = currentHash.replace('#', '');
        const targetButton = document.querySelector(`.nav-button[data-section="${hashSection}"]`);
        if (targetButton) {
            document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
            targetButton.classList.add('active');
        }
    }
});

// Автоматически закрываем боковое меню при ресайзе
window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && sidebar) {
        sidebar.classList.remove('open');
    }
});