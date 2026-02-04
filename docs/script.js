// Определяем текущую страницу
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Переключение темы в верхнем меню
const topThemeToggle = document.querySelector('.top-nav-theme-toggle');
if (topThemeToggle) {
    const themeIcon = topThemeToggle.querySelector('i');
    
    // Проверяем сохраненную тему
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-sun';
        topThemeToggle.innerHTML = '<i class="fas fa-sun"></i> <span>Светлая</span>';
    }
    
    topThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.className = 'fas fa-sun';
            topThemeToggle.innerHTML = '<i class="fas fa-sun"></i> <span>Светлая</span>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.className = 'fas fa-moon';
            topThemeToggle.innerHTML = '<i class="fas fa-moon"></i> <span>Темная</span>';
            localStorage.setItem('theme', 'light');
        }
        
        // Синхронизируем с кнопкой в боковом меню
        const sidebarThemeToggle = document.querySelector('.sidebar .theme-toggle');
        if (sidebarThemeToggle) {
            if (document.body.classList.contains('dark-theme')) {
                sidebarThemeToggle.innerHTML = '<span>Светлая тема</span> <i class="fas fa-sun"></i>';
            } else {
                sidebarThemeToggle.innerHTML = '<span>Темная тема</span> <i class="fas fa-moon"></i>';
            }
        }
    });
}

// Переключение темы в боковом меню
const sidebarThemeToggle = document.querySelector('.sidebar .theme-toggle');
if (sidebarThemeToggle) {
    sidebarThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            sidebarThemeToggle.innerHTML = '<span>Светлая тема</span> <i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            sidebarThemeToggle.innerHTML = '<span>Темная тема</span> <i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
        
        // Синхронизируем с кнопкой в верхнем меню
        if (topThemeToggle) {
            const topIcon = topThemeToggle.querySelector('i');
            if (document.body.classList.contains('dark-theme')) {
                topIcon.className = 'fas fa-sun';
                topThemeToggle.innerHTML = '<i class="fas fa-sun"></i> <span>Светлая</span>';
            } else {
                topIcon.className = 'fas fa-moon';
                topThemeToggle.innerHTML = '<i class="fas fa-moon"></i> <span>Темная</span>';
            }
        }
    });
}

// Мобильное меню (верхняя кнопка)
const topNavMobileToggle = document.querySelector('.top-nav-mobile-toggle');
const sidebar = document.getElementById('sidebar');

if (topNavMobileToggle && sidebar) {
    topNavMobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
    
    // Закрытие меню при клике на ссылку (для мобильных)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('open');
            }
        });
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
        
        // Активное состояние для навигационных ссылок в боковом меню
        if (currentPage === 'index.html' || currentPage === '' || currentPage.includes('#')) {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                
                if (href && href.startsWith('#') && href === `#${current}`) {
                    link.classList.add('active');
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

// Плавная прокрутка для всех ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Учитываем верхнее меню
                behavior: 'smooth'
            });
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
});

// Автоматически расширяем боковое меню при наведении на маленьких экранах
window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
        sidebar.classList.remove('open');
    }
});