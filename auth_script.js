document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const statusMessage = document.getElementById('form-status-message');
    
    const fullNameInput = document.getElementById('full-name');
    const contactInput = document.getElementById('contact-info');
    const passwordInput = document.getElementById('password');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
        
        statusMessage.className = 'status-message';
        statusMessage.textContent = '';

        // 1. Проверяем ФИО (только буквы, пробелы, дефисы)
        const nameRegex = /^[A-Za-zА-Яа-яЁё\s\-]+$/;
        if (!fullNameInput.value.trim() || !nameRegex.test(fullNameInput.value)) {
            showError(fullNameInput);
            return;
        }

        // 2. Проверяем Телефон или E-mail
        const userInput = contactInput.value.trim();
        
        // Регулярное выражение для Email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        // СТРОГОЕ регулярное выражение для телефона (+X (XXX) XXX-XX-XX или +X XXX XXX-XX-XX)
        const phoneRegex = /^\+[0-9]{1,3}\s?\(?[0-9]{3}\)?\s?[0-9]{3}[\s\-][0-9]{2}[\s\-][0-9]{2}$/;

        // Если ввод не подходит ни под email, ни под строгий формат телефона — это ошибка
        if (!emailRegex.test(userInput) && !phoneRegex.test(userInput)) {
            showError(contactInput);
            return;
        }

        // 3. Проверяем Пароль (минимум 6 символов)
        if (passwordInput.value.length < 6) {
            showError(passwordInput);
            return;
        }

        // Если всё успешно пройденно
        statusMessage.textContent = 'Аккаунт зарегистрирован';
        statusMessage.classList.add('status-success');
        form.reset();
    });

    // Функция для вывода ошибки и очистки конкретного поля
    function showError(inputElement) {
        statusMessage.textContent = 'Ошибка регистрации';
        statusMessage.classList.add('status-error');
        inputElement.value = ''; // Стираем именно то поле, где ошибка
        inputElement.focus();   // Ставим туда курсор
    }
});
