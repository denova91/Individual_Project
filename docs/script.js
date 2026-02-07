// Функция переключения темы
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

// Обновление иконок темы
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

// Функция для прокрутки к разделу
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        
        // Добавляем визуальный эффект для активного раздела
        section.style.animation = 'none';
        setTimeout(() => {
            section.style.animation = 'fadeInUp 0.5s ease';
        }, 10);
    }
}

// Кнопка "Наверх"
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
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

// Мобильное меню
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            
            // Анимация иконки бургер-меню
            const icon = mobileToggle.querySelector('i');
            if (sidebar.classList.contains('open')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', (event) => {
            if (!sidebar.contains(event.target) && !mobileToggle.contains(event.target)) {
                sidebar.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });
    }
}

// Инициализация активных кнопок навигации
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

// Анимация при прокрутке
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
    
    // Наблюдаем за всеми секциями
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });
}

// Функция для показа уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Убираем уведомление через 5 секунд
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Загрузка сохраненной темы
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.className = savedTheme + '-theme';
    updateThemeIcons(savedTheme);
    
    // Инициализация компонентов
    initBackToTop();
    initMobileMenu();
    initActiveNavButtons();
    initScrollAnimations();
    
    // Назначение обработчиков событий
    const themeToggles = document.querySelectorAll('#themeToggle, #sidebarThemeToggle');
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', toggleTheme);
    });
    
    // Добавляем обработчики для кнопок навигации
    document.querySelectorAll('.nav-button[onclick^="scrollToSection"]').forEach(button => {
        button.addEventListener('click', function() {
            const match = this.getAttribute('onclick').match(/scrollToSection\('([^']+)'\)/);
            if (match) {
                scrollToSection(match[1]);
            }
        });
    });
    
    // Анимация для таблиц
    document.querySelectorAll('table tr').forEach((row, index) => {
        row.style.animationDelay = `${index * 0.05}s`;
    });
    
    // Добавляем эффект печати для заголовков
    const pageHeader = document.querySelector('.page-header h1');
    if (pageHeader) {
        const text = pageHeader.textContent;
        pageHeader.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                pageHeader.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
    }
    
    // Показываем приветственное уведомление на главной странице
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        setTimeout(() => {
            showNotification('Добро пожаловать в сравнительный анализ медных и оптических линий связи!', 'info');
        }, 1000);
    }
});

// Добавляем обработчик для клавиатуры
document.addEventListener('keydown', (event) => {
    // Alt + T для переключения темы
    if (event.altKey && event.key === 't') {
        toggleTheme();
    }
    
    // Escape для закрытия мобильного меню
    if (event.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            if (mobileToggle) {
                const icon = mobileToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        }
    }
});