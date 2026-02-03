// Переключение темы
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');
    
    // Проверяем сохраненную тему в localStorage
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-sun';
        themeToggle.innerHTML = '<span>Светлая тема</span> <i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.className = 'fas fa-sun';
            themeToggle.innerHTML = '<span>Светлая тема</span> <i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.className = 'fas fa-moon';
            themeToggle.innerHTML = '<span>Темная тема</span> <i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });
}

// Мобильное меню
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const sidebar = document.getElementById('sidebar');

if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener('click', () => {
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
        
        // Активное состояние для навигационных ссылок (только если на странице есть якорные ссылки)
        const currentPath = window.location.pathname;
        const isIndexPage = currentPath.endsWith('index.html') || currentPath.endsWith('/');
        
        if (isIndexPage || currentPath.includes('#')) {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                
                // Для якорных ссылок на текущей странице
                if (href.startsWith('#') && href === `#${current}`) {
                    link.classList.add('active');
                }
                
                // Для ссылки на главную страницу, если мы на главной
                if (isIndexPage && href === '#introduction' && !current) {
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

// Плавная прокрутка для навигационных ссылок
document.querySelectorAll('.nav-links a, .footer-links a, .nav-button').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Если это якорная ссылка на текущей странице
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        }
        // Если это ссылка на другую страницу с якорем
        else if (targetId && targetId.includes('#')) {
            // Разрешаем обычную навигацию
            // Браузер сам перейдет по ссылке
        }
        // Для остальных ссылок оставляем обычное поведение
    });
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

// Наблюдаем за всеми секциями на странице
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Наблюдаем за карточками сравнения
document.querySelectorAll('.comparison-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Показываем секции, которые уже видны при загрузке
    const visibleSections = document.querySelectorAll('section');
    visibleSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
});