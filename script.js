function initDatePickers() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(input => {
        if (!input.min) {
            input.min = today;
        }
    });
}


function initPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = '🙈';
            } else {
                input.type = 'password';
                this.textContent = '👁️';
            }
        });
    });
}


function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    document.body.appendChild(notification);
    

    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                z-index: 9999;
                animation: slideIn 0.3s;
            }
            
            .notification-info {
                background-color: var(--primary-color);
            }
            
            .notification-success {
                background-color: var(--secondary-color);
            }
            
            .notification-error {
                background-color: var(--danger);
            }
            
            .close-notification {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                margin-left: 15px;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    

    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.remove();
    });
}


function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


function validatePhone(phone) {
    const re = /^[\+]?[1-9]\d{1,14}$/;
    return re.test(phone.replace(/\D/g, ''));
}


function showFormError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorId = `${inputId}Error`;
    let errorEl = document.getElementById(errorId);
    
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.id = errorId;
        errorEl.className = 'error-message';
        input.parentNode.appendChild(errorEl);
    }
    
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    input.classList.add('error');
    

    const removeError = () => {
        errorEl.style.display = 'none';
        input.classList.remove('error');
        input.removeEventListener('input', removeError);
    };
    
    input.addEventListener('input', removeError, { once: true });
}


function initIndexPage() {

    const searchForm = document.getElementById('flightSearchForm');
    if (searchForm) {

        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split('T')[0];
        
        const departureInput = document.getElementById('departure');
        const returnInput = document.getElementById('return');
        
        if (departureInput) {
            departureInput.value = today;
            departureInput.min = today;
        }
        
        if (returnInput) {
            returnInput.value = nextWeekStr;
            returnInput.min = today;
        }
        

        if (departureInput && returnInput) {
            departureInput.addEventListener('change', function() {
                returnInput.min = this.value;
                if (returnInput.value < this.value) {
                    returnInput.value = this.value;
                }
            });
        }
        

        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const from = document.getElementById('from').value;
            const to = document.getElementById('to').value;
            const departure = document.getElementById('departure').value;
            const passengers = document.getElementById('passengers').value;
            
            if (!from || !to) {
                showNotification('Пожалуйста, заполните пункты отправления и назначения', 'error');
                return;
            }
            

            const searchBtn = this.querySelector('button[type="submit"]');
            const originalText = searchBtn.textContent;
            searchBtn.textContent = 'Поиск...';
            searchBtn.disabled = true;
            
            setTimeout(() => {
                showNotification(`Найдены рейсы из ${from} в ${to}`, 'success');
                searchBtn.textContent = originalText;
                searchBtn.disabled = false;
                

            }, 1500);
        });
    }
    

    document.querySelectorAll('.btn-outline').forEach(btn => {
        if (btn.textContent.includes('Подробнее')) {
            btn.addEventListener('click', function() {
                const flightCard = this.closest('.flight-card');
                const flightTitle = flightCard.querySelector('h3').textContent;
                showNotification(`Детали рейса: ${flightTitle}`, 'info');
            });
        }
    });
}


function initSearchPage() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Поиск выполнен. Фильтры применены.', 'success');
        });
    }
    

    document.querySelectorAll('#filter-airline, #filter-price, #filter-stops, #filter-sort').forEach(select => {
        select.addEventListener('change', function() {
            showNotification('Фильтры обновлены', 'info');
        });
    });
}

function initProfilePage() {

    const tabLinks = document.querySelectorAll('.profile-menu a');
    const tabContents = document.querySelectorAll('.profile-section');
    
    if (tabLinks.length > 0) {
        tabLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                

                tabLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                const targetId = this.getAttribute('href').substring(1);
                tabContents.forEach(content => {
                    content.style.display = content.id === targetId ? 'block' : 'none';
                });
            });
        });
        

        if (tabContents.length > 0) {
            tabContents[0].style.display = 'block';
        }
    }
    

    document.querySelectorAll('.booking-actions button').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            const card = this.closest('.booking-card');
            const flight = card.querySelector('h3').textContent;
            
            switch(action) {
                case 'Online Check-in':
                    showNotification(`Check-in для ${flight} откроется за 24 часа до вылета`, 'info');
                    break;
                case 'Билет':
                    showNotification(`Электронный билет для ${flight} отправлен на email`, 'success');
                    break;
                case 'Изменить':
                    showNotification(`Редактирование бронирования для ${flight}`, 'info');
                    break;
                case 'Оплатить':
                    showNotification(`Переход к оплате для ${flight}`, 'info');
                    break;
                case 'Отменить':
                    if (confirm('Вы уверены, что хотите отменить бронирование?')) {
                        showNotification(`Бронирование ${flight} отменено`, 'success');
                    }
                    break;
            }
        });
    });
    

    const saveProfileBtn = document.querySelector('button[onclick*="saveProfile"]');
    if (saveProfileBtn) {
        saveProfileBtn.onclick = function() {
            showNotification('Изменения профиля сохранены', 'success');
        };
    }
}


function initAdminPage() {

    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('.content-section, .stats-grid, .charts-grid');
    
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                

                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                

                const targetId = this.getAttribute('href').substring(1);
                
                sections.forEach(section => {
                    if (section.classList.contains('stats-grid') || section.classList.contains('charts-grid')) {
                        section.style.display = targetId === 'dashboard' ? 'grid' : 'none';
                    } else {
                        section.style.display = section.id === targetId ? 'block' : 'none';
                    }
                });
            });
        });
    }
    

    document.querySelectorAll('.action-buttons button').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent;
            const row = this.closest('tr');
            const id = row.querySelector('td:first-child').textContent;
            
            switch(action) {
                case '✏️':
                    showNotification(`Редактирование ${id}`, 'info');
                    break;
                case '🗑️':
                    if (confirm(`Удалить ${id}?`)) {
                        showNotification(`${id} удален`, 'success');
                        row.style.opacity = '0.5';
                    }
                    break;
                case '👁️':
                    showNotification(`Просмотр ${id}`, 'info');
                    break;
                case '💳':
                    if (confirm(`Подтвердить оплату ${id}?`)) {
                        showNotification(`Оплата ${id} подтверждена`, 'success');
                    }
                    break;
                case '↩️':
                    if (confirm(`Вернуть средства для ${id}?`)) {
                        showNotification(`Возврат ${id} инициирован`, 'success');
                    }
                    break;
                case '🚫':
                    if (confirm(`Заблокировать ${id}?`)) {
                        showNotification(`${id} заблокирован`, 'success');
                    }
                    break;
            }
        });
    });
    

    const addFlightBtn = document.querySelector('button[onclick*="openAddFlightModal"]');
    const flightModal = document.getElementById('addFlightModal');
    
    if (addFlightBtn && flightModal) {
        addFlightBtn.onclick = function() {
            flightModal.style.display = 'flex';
        };
        

        flightModal.querySelector('.close-modal').onclick = function() {
            flightModal.style.display = 'none';
        };
        

        flightModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
        

        flightModal.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Новый рейс добавлен успешно!', 'success');
            flightModal.style.display = 'none';
            this.reset();
        });
    }
}


function initLoginPage() {

    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                

                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                authForms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === `${tab}Form`) {
                        form.classList.add('active');
                    }
                });
            });
        });
        

        window.switchToRegister = function() {
            tabBtns[1].click();
        };
        
        window.switchToLogin = function() {
            tabBtns[0].click();
        };
    }
    

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            let isValid = true;
            

            if (!validateEmail(email)) {
                showFormError('loginEmail', 'Пожалуйста, введите корректный email');
                isValid = false;
            }
            

            if (password.length < 6) {
                showFormError('loginPassword', 'Пароль должен содержать минимум 6 символов');
                isValid = false;
            }
            
            if (isValid) {
                const loginBtn = this.querySelector('button[type="submit"]');
                const originalText = loginBtn.textContent;
                loginBtn.textContent = 'Вход...';
                loginBtn.disabled = true;
                
                setTimeout(() => {
                    showNotification('Вход выполнен успешно! Перенаправляем...', 'success');
                    loginBtn.textContent = originalText;
                    loginBtn.disabled = false;

                    setTimeout(() => {
                        window.location.href = 'profile.html';
                    }, 1500);
                }, 1500);
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const email = document.getElementById('registerEmail').value;
            let isValid = true;

            if (!validateEmail(email)) {
                showFormError('registerEmail', 'Пожалуйста, введите корректный email');
                isValid = false;
            }

            if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
                showFormError('registerPassword', 'Пароль должен содержать минимум 8 символов, включая цифры и буквы');
                isValid = false;
            }

            if (password !== confirmPassword) {
                showFormError('confirmPassword', 'Пароли не совпадают');
                isValid = false;
            }
            

            if (!document.getElementById('acceptTerms').checked) {
                showFormError('acceptTerms', 'Необходимо принять условия использования');
                isValid = false;
            }
            
            if (isValid) {
                const registerBtn = this.querySelector('button[type="submit"]');
                const originalText = registerBtn.textContent;
                registerBtn.textContent = 'Регистрация...';
                registerBtn.disabled = true;
                
                setTimeout(() => {
                    showNotification('Регистрация успешна! Проверьте email для подтверждения.', 'success');
                    registerBtn.textContent = originalText;
                    registerBtn.disabled = false;
                    this.reset();
                }, 1500);
            }
        });
    }
    

    const forgotModal = document.getElementById('forgotPasswordModal');
    if (forgotModal) {
        window.openForgotPasswordModal = function() {
            forgotModal.style.display = 'flex';
        };
        
        window.closeForgotPasswordModal = function() {
            forgotModal.style.display = 'none';
        };
        
        window.sendResetLink = function() {
            const email = document.getElementById('resetEmail').value;
            if (!validateEmail(email)) {
                showFormError('resetEmail', 'Пожалуйста, введите корректный email');
                return;
            }
            
            showNotification(`Ссылка для восстановления отправлена на ${email}`, 'success');
            closeForgotPasswordModal();
        };
        

        forgotModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeForgotPasswordModal();
            }
        });
    }
    

    const successModal = document.getElementById('successModal');
    if (successModal) {
        window.closeSuccessModal = function() {
            successModal.style.display = 'none';
        };
    }
}


document.addEventListener('DOMContentLoaded', function() {

    initDatePickers();
    initPasswordToggles();

    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    
    switch(filename) {
        case 'index.html':
        case '':
            initIndexPage();
            break;
        case 'search.html':
            initSearchPage();
            break;
        case 'profile.html':
            initProfilePage();
            break;
        case 'admin.html':
            initAdminPage();
            break;
        case 'login.html':
            initLoginPage();
            break;
    }

    if (filename === 'login.html' && window.location.search.includes('demo')) {
        document.getElementById('loginEmail').value = 'demo@skytravel.ru';
        document.getElementById('loginPassword').value = 'demo123';
    }
});