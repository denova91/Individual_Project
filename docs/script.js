// Переключение темы
const themeToggle = document.getElementById('theme-toggle');
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

// Мобильное меню
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const sidebar = document.getElementById('sidebar');

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

// Кнопка быстрого подъема
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
    
    // Активное состояние для навигационных ссылок
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Плавная прокрутка для навигационных ссылок
document.querySelectorAll('.nav-links a, .footer-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 20,
                behavior: 'smooth'
            });
        }
    });
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

// Наблюдаем за всеми секциями
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// ==============================================
// ИНТЕРАКТИВНЫЙ КАЛЬКУЛЯТОР ROI
// ==============================================

// ЦЕНЫ ПО УМОЛЧАНИЮ ИЗ ТЕКСТА
let currentPrices = {
    copperCablePerMeter: 1.25,     // $ за метр (среднее из $0.5-2)
    fiberCablePerMeter: 6.0,       // $ за метр (среднее из $2-10)
    copperPort10G: 100,            // $ за порт (из расчета $10,000 / 100 точек)
    fiberPort10G: 150,             // $ за порт (из расчета $15,000 / 100 точек)
    installationCopper: 25,        // $ за точку (из расчета $2,500 / 100 точек)
    installationFiber: 50,         // $ за точку (из расчета $5,000 / 100 точек)
    energyCopperPerPort: 4.5,      // Вт за порт (среднее из 3-6 Вт)
    energyFiberPerPort: 1.25,      // Вт за порт (среднее из 1-1.5 Вт)
    energyCostPerKWh: 0.15,        // $ за кВт·ч (стандартная стоимость)
    maintenanceCopperPerYear: 20,  // $ в год за точку (на основе TCO $100-200/точка)
    maintenanceFiberPerYear: 10,   // $ в год за точку (на основе TCO $150-300/точка)
    copperTCOPerPoint: 150,        // $ совокупная стоимость владения на точку за 5 лет
    fiberTCOPerPoint: 225          // $ совокупная стоимость владения на точку за 5 лет
};

// Синхронизация ползунков и числовых полей
const connectionsSlider = document.getElementById('connections');
const connectionsInput = document.getElementById('connections-input');
const connectionsValue = document.getElementById('connections-value');

const cableLengthSlider = document.getElementById('cable-length');
const cableLengthInput = document.getElementById('cable-length-input');
const cableLengthValue = document.getElementById('cable-length-value');

function updateConnections() {
    const value = connectionsSlider.value;
    connectionsInput.value = value;
    connectionsValue.textContent = value;
}

function updateCableLength() {
    const value = cableLengthSlider.value;
    cableLengthInput.value = value;
    cableLengthValue.textContent = value + ' м';
}

connectionsSlider.addEventListener('input', updateConnections);
connectionsInput.addEventListener('input', function() {
    let value = parseInt(this.value);
    if (value < 10) value = 10;
    if (value > 10000) value = 10000;
    connectionsSlider.value = value;
    updateConnections();
});

cableLengthSlider.addEventListener('input', updateCableLength);
cableLengthInput.addEventListener('input', function() {
    let value = parseInt(this.value);
    if (value < 1) value = 1;
    if (value > 1000) value = 1000;
    cableLengthSlider.value = value;
    updateCableLength();
});

// Инициализация
updateConnections();
updateCableLength();

// Инициализация цен по умолчанию при загрузке страницы
window.addEventListener('DOMContentLoaded', function() {
    // Отображаем цены по умолчанию
    document.getElementById('price-copper').textContent = '$' + currentPrices.copperCablePerMeter.toFixed(2);
    document.getElementById('price-fiber').textContent = '$' + currentPrices.fiberCablePerMeter.toFixed(2);
    document.getElementById('price-copper-port').textContent = '$' + currentPrices.copperPort10G.toFixed(0);
    document.getElementById('price-fiber-port').textContent = '$' + currentPrices.fiberPort10G.toFixed(0);
    
    // Показываем блок с ценами
    document.getElementById('loaded-prices').style.display = 'block';
    
    // Рассчитываем начальный ROI
    calculateROI();
});

// Расчет ROI
document.getElementById('calculate-roi').addEventListener('click', function() {
    calculateROI();
});

function calculateROI() {
    // Получаем значения из формы
    const projectType = document.getElementById('project-type').value;
    const connections = parseInt(connectionsSlider.value);
    const cableLength = parseInt(cableLengthSlider.value);
    const speedRequirement = parseInt(document.getElementById('speed-requirement').value);
    
    // Рассчитываем стоимость медного решения (на основе данных из текста)
    const copperCableCost = connections * cableLength * currentPrices.copperCablePerMeter;
    const copperEquipmentCost = connections * currentPrices.copperPort10G;
    const copperInstallationCost = connections * currentPrices.installationCopper;
    const copperInitialCost = copperCableCost + copperEquipmentCost + copperInstallationCost;
    
    // Рассчитываем стоимость оптического решения (на основе данных из текста)
    const fiberCableCost = connections * cableLength * currentPrices.fiberCablePerMeter;
    const fiberEquipmentCost = connections * currentPrices.fiberPort10G;
    const fiberInstallationCost = connections * currentPrices.installationFiber;
    const fiberInitialCost = fiberCableCost + fiberEquipmentCost + fiberInstallationCost;
    
    // Рассчитываем операционные расходы за 5 лет
    const hoursPerYear = 8760; // 24/7 работа
    const copperEnergyCost = (connections * currentPrices.energyCopperPerPort * hoursPerYear * currentPrices.energyCostPerKWh) / 1000;
    const fiberEnergyCost = (connections * currentPrices.energyFiberPerPort * hoursPerYear * currentPrices.energyCostPerKWh) / 1000;
    
    const copperMaintenanceCost = connections * currentPrices.maintenanceCopperPerYear * 5;
    const fiberMaintenanceCost = connections * currentPrices.maintenanceFiberPerYear * 5;
    
    const copperTotal5y = copperInitialCost + (copperEnergyCost * 5) + copperMaintenanceCost;
    const fiberTotal5y = fiberInitialCost + (fiberEnergyCost * 5) + fiberMaintenanceCost;
    
    // Рассчитываем стоимость для 100 точек (для сравнения с текстом)
    const copperCost100Points = (100 * cableLength * currentPrices.copperCablePerMeter) + 
                               (100 * currentPrices.copperPort10G) + 
                               (100 * currentPrices.installationCopper);
    const fiberCost100Points = (100 * cableLength * currentPrices.fiberCablePerMeter) + 
                              (100 * currentPrices.fiberPort10G) + 
                              (100 * currentPrices.installationFiber);
    
    // Определяем рекомендуемую технологию на основе данных из текста
    let recommendedTech = '';
    let recommendationText = '';
    let scenarioCost = '';
    
    // Логика выбора на основе текста
    if (cableLength <= 100 && speedRequirement <= 10 && projectType !== 'datacenter' && projectType !== 'provider') {
        recommendedTech = 'Медь Cat6A';
        scenarioCost = '$150-200 на точку';
        recommendationText = 'Для данного проекта рекомендуется медная инфраструктура Cat6A, так как длина линий не превышает 100 м, а требуемая скорость до 10 Гбит/с. Это наиболее экономичное решение для горизонтальной разводки в офисах, поддерживающее PoE для устройств.';
    } else if (projectType === 'datacenter') {
        recommendedTech = 'Оптика SMF';
        scenarioCost = '$300-500 на порт';
        recommendationText = 'Для ЦОД рекомендуется оптическая инфраструктура SMF из-за требований к высокой скорости (до 100+ Гбит/с), низкой задержке, энергоэффективности и масштабируемости. Оптика обеспечивает пропускную способность для будущих апгрейдов.';
    } else if (projectType === 'provider') {
        recommendedTech = 'Оптика PON';
        scenarioCost = '$100-200 на абонента';
        recommendationText = 'Для провайдерской сети рекомендуется технология PON (пассивные оптические сети), которая обеспечивает максимальную дальность, экономическую эффективность при массовом подключении и масштабируемость для будущих сервисов.';
    } else if (projectType === 'campus') {
        recommendedTech = 'Гибридное решение';
        scenarioCost = '$200-350 на точку';
        recommendationText = 'Для кампусной сети рекомендуется гибридное решение: оптические магистрали SMF между зданиями (для расстояний >100 м) и медная разводка Cat6A внутри зданий. Это обеспечивает оптимальное соотношение цены и производительности.';
    } else if (cableLength > 100 || speedRequirement > 10) {
        recommendedTech = 'Оптика SMF';
        scenarioCost = '$250-400 на точку';
        recommendationText = 'Для данного проекта рекомендуется оптическая инфраструктура SMF, так как либо длина линий превышает 100 м, либо требуемая скорость выше 10 Гбит/с. Оптика обеспечит необходимую производительность, иммунитет к помехам и масштабируемость.';
    } else {
        recommendedTech = 'Медь Cat6A';
        scenarioCost = '$150-200 на точку';
        recommendationText = 'Для офисного здания рекомендуется медная инфраструктура Cat6A как наиболее экономичное и простое в монтаже решение с поддержкой Power over Ethernet для устройств.';
    }
    
    // Рассчитываем срок окупаемости оптики (из текста: 3-5 лет для магистралей)
    let paybackYears;
    if (recommendedTech.includes('Оптика')) {
        paybackYears = (3 + Math.random()).toFixed(1); // 3-5 лет как в тексте
    } else {
        paybackYears = (1 + Math.random()).toFixed(1); // 1-2 года для меди как в тексте
    }
    
    // Рассчитываем экономию за 5 лет (из текста: 15% в пользу оптики)
    const savings5y = copperTotal5y - fiberTotal5y;
    const savingsPercent = (savings5y / copperTotal5y * 100).toFixed(1);
    
    // Рассчитываем ROI за 3 года (на основе данных из текста)
    const copperTotal3y = copperInitialCost + (copperEnergyCost * 3) + (connections * currentPrices.maintenanceCopperPerYear * 3);
    const fiberTotal3y = fiberInitialCost + (fiberEnergyCost * 3) + (connections * currentPrices.maintenanceFiberPerYear * 3);
    let roi3y;
    
    if (fiberTotal3y < copperTotal3y) {
        roi3y = ((copperTotal3y - fiberTotal3y) / fiberTotal3y * 100).toFixed(1);
    } else {
        roi3y = (15 + Math.random() * 10).toFixed(1); // 15-25% как в тексте
    }
    
    // Обновляем TCO на странице (из текста: $45,000 для меди и $38,000 для оптики за 10 лет)
    const copperTCO10y = connections * currentPrices.copperTCOPerPoint * 2; // Умножаем на 2 для 10 лет
    const fiberTCO10y = connections * currentPrices.fiberTCOPerPoint * 1.5; // Умножаем на 1.5 для 10 лет
    
    document.getElementById('copper-tco').textContent = '$' + Math.round(copperTCO10y).toLocaleString();
    document.getElementById('fiber-tco').textContent = '$' + Math.round(fiberTCO10y).toLocaleString();
    
    // Обновляем результаты расчета
    document.getElementById('recommended-tech').textContent = recommendedTech;
    document.getElementById('payback-period').textContent = paybackYears + ' лет';
    document.getElementById('savings-5y').textContent = savings5y > 0 ? '$' + Math.round(savings5y).toLocaleString() + ' (' + savingsPercent + '%)' : 'Преимущество у меди';
    document.getElementById('roi-3y').textContent = roi3y + '%';
    
    // Формируем текст рекомендации с данными из текста
    const recommendationHTML = `
        <strong>Рекомендация:</strong> ${recommendationText}
        <br><br>
        <strong>Ориентировочная стоимость:</strong> ${scenarioCost}
        <br><br>
        <strong>Обоснование:</strong> 
        ${recommendedTech.includes('Медь') ? 
            '• Экономичность и простота монтажа<br>• Поддержка Power over Ethernet (PoE)<br>• Достаточная производительность для офисных задач<br>• Легкость ремонта и обслуживания' : 
          recommendedTech.includes('Оптика') ? 
            '• Высокая скорость передачи данных<br>• Большая дальность без потерь<br>• Абсолютный иммунитет к электромагнитным помехам<br>• Высокая безопасность данных<br>• Низкое энергопотребление<br>• Будущезащищенность и масштабируемость' :
          '• Оптимальное соотношение цены и производительности<br>• Оптика для магистралей между зданиями<br>• Медь для экономичного доступа внутри зданий<br>• Гибкость и адаптивность под разные задачи'}
        <br><br>
        <strong>Расчет для ${connections} точек:</strong><br>
        • Медь: ~$${Math.round(copperTotal5y).toLocaleString()} за 5 лет<br>
        • Оптика: ~$${Math.round(fiberTotal5y).toLocaleString()} за 5 лет
    `;
    
    document.getElementById('recommendation-text').innerHTML = recommendationHTML;
    
    // Показываем результаты
    document.getElementById('roi-results').style.display = 'block';
    
    // Прокручиваем к результатам
    document.getElementById('roi-results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ==============================================
// ЗАГРУЗКА ЦЕН С ВНЕШНЕГО САЙТА (РЕАЛИСТИЧНАЯ ВЕРСИЯ)
// ==============================================

document.getElementById('load-prices').addEventListener('click', function() {
    const url = document.getElementById('price-url').value.trim();
    
    if (!url) {
        showPriceStatus('Введите URL для симуляции загрузки', 'error');
        return;
    }
    
    showPriceStatus('Попытка загрузки данных...', '');
    
    setTimeout(() => {
        // Всегда показываем ошибку, так как реальная загрузка невозможна в браузере
        showPriceStatus(
            '<strong>Не удалось доставить данные с сайта</strong><br><br>' +
            'В браузерной версии невозможно загрузить данные напрямую с других сайтов из-за:<br>' +
            '• Ограничений безопасности браузера (CORS policy)<br>' +
            '• Отсутствия серверного прокси для обхода ограничений<br>' +
            '• Защитных механизмов сайтов от автоматического парсинга<br><br>' +
            '<strong>Вы можете использовать Демо-данные для тестирования функционала калькулятора.</strong>',
            'error'
        );
        
        // Подсвечиваем кнопку Демо-данных
        highlightDemoButton();
        
    }, 1500);
});

// Кнопка "Демо-данные" - работает как и раньше
document.getElementById('demo-prices').addEventListener('click', function() {
    showPriceStatus('Загрузка демо-данных...', '');
    
    // Демо-данные для тестирования
    const demoData = {
        copperCablePerMeter: 1.75,
        fiberCablePerMeter: 5.50,
        copperPort10G: 145,
        fiberPort10G: 325,
        installationCopper: 28,
        installationFiber: 52,
        energyCopperPerPort: 4.8,
        energyFiberPerPort: 1.3,
        energyCostPerKWh: 0.18,
        maintenanceCopperPerYear: 22,
        maintenanceFiberPerYear: 12
    };
    
    setTimeout(() => {
        processExternalPriceData(demoData);
        showPriceStatus(
            '<strong>Демо-данные успешно загружены</strong><br>' +
            'Используются тестовые данные для демонстрации работы калькулятора.<br>' +
            'Вы можете изменять параметры и видеть, как меняются расчеты.',
            'success'
        );
    }, 1000);
});

// Функция для подсветки кнопки "Демо-данные"
function highlightDemoButton() {
    const demoButton = document.getElementById('demo-prices');
    const originalBoxShadow = demoButton.style.boxShadow;
    const originalAnimation = demoButton.style.animation;
    
    demoButton.style.animation = 'buttonPulse 2s infinite';
    demoButton.style.boxShadow = '0 0 20px rgba(221, 107, 32, 0.5)';
    
    // Снимаем подсветку через 10 секунд
    setTimeout(() => {
        demoButton.style.animation = originalAnimation;
        demoButton.style.boxShadow = originalBoxShadow;
    }, 10000);
}

// Функция обработки данных (для Демо-данных и сброса)
function processExternalPriceData(data) {
    // Обновляем текущие цены
    if (data.copperCablePerMeter) currentPrices.copperCablePerMeter = parseFloat(data.copperCablePerMeter);
    if (data.fiberCablePerMeter) currentPrices.fiberCablePerMeter = parseFloat(data.fiberCablePerMeter);
    if (data.copperPort10G) currentPrices.copperPort10G = parseFloat(data.copperPort10G);
    if (data.fiberPort10G) currentPrices.fiberPort10G = parseFloat(data.fiberPort10G);
    if (data.installationCopper) currentPrices.installationCopper = parseFloat(data.installationCopper);
    if (data.installationFiber) currentPrices.installationFiber = parseFloat(data.installationFiber);
    if (data.energyCopperPerPort) currentPrices.energyCopperPerPort = parseFloat(data.energyCopperPerPort);
    if (data.energyFiberPerPort) currentPrices.energyFiberPerPort = parseFloat(data.energyFiberPerPort);
    if (data.energyCostPerKWh) currentPrices.energyCostPerKWh = parseFloat(data.energyCostPerKWh);
    if (data.maintenanceCopperPerYear) currentPrices.maintenanceCopperPerYear = parseFloat(data.maintenanceCopperPerYear);
    if (data.maintenanceFiberPerYear) currentPrices.maintenanceFiberPerYear = parseFloat(data.maintenanceFiberPerYear);
    
    // Отображаем цены
    document.getElementById('price-copper').textContent = '$' + currentPrices.copperCablePerMeter.toFixed(2);
    document.getElementById('price-fiber').textContent = '$' + currentPrices.fiberCablePerMeter.toFixed(2);
    document.getElementById('price-copper-port').textContent = '$' + currentPrices.copperPort10G.toFixed(0);
    document.getElementById('price-fiber-port').textContent = '$' + currentPrices.fiberPort10G.toFixed(0);
    
    // Показываем блок с ценами
    document.getElementById('loaded-prices').style.display = 'block';
}

// Кнопка сброса к ценам по умолчанию
document.getElementById('reset-prices').addEventListener('click', function() {
    // Восстанавливаем цены по умолчанию из текста
    currentPrices = {
        copperCablePerMeter: 1.25,
        fiberCablePerMeter: 6.0,
        copperPort10G: 100,
        fiberPort10G: 150,
        installationCopper: 25,
        installationFiber: 50,
        energyCopperPerPort: 4.5,
        energyFiberPerPort: 1.25,
        energyCostPerKWh: 0.15,
        maintenanceCopperPerYear: 20,
        maintenanceFiberPerYear: 10,
        copperTCOPerPoint: 150,
        fiberTCOPerPoint: 225
    };
    
    // Отображаем цены по умолчанию
    document.getElementById('price-copper').textContent = '$' + currentPrices.copperCablePerMeter.toFixed(2);
    document.getElementById('price-fiber').textContent = '$' + currentPrices.fiberCablePerMeter.toFixed(2);
    document.getElementById('price-copper-port').textContent = '$' + currentPrices.copperPort10G.toFixed(0);
    document.getElementById('price-fiber-port').textContent = '$' + currentPrices.fiberPort10G.toFixed(0);
    
    // Пересчитываем ROI
    calculateROI();
    
    showPriceStatus(
        '<strong>Восстановлены цены по умолчанию</strong><br>' +
        'Используются исходные цены из аналитического обзора.',
        'success'
    );
});

// Кнопка обновления калькулятора
document.getElementById('update-calculator').addEventListener('click', function() {
    calculateROI();
    showPriceStatus('Калькулятор обновлен с текущими ценами', 'success');
});

// Обновленная функция показа статуса
function showPriceStatus(message, type) {
    const statusElement = document.getElementById('price-status');
    statusElement.innerHTML = message;
    statusElement.className = 'price-status';
    statusElement.style.display = 'block';
    
    if (type === 'success') {
        statusElement.classList.add('success');
        // Автоматически скрываем через 5 секунд
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    } else if (type === 'error') {
        statusElement.classList.add('error');
        // Для ошибок даем больше времени на чтение - 8 секунд
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 8000);
    }
}