// При загрузке страницы пытаемся получить сохраненную корзину из localStorage
// localStorage - это хранилище браузера, которое сохраняет данные даже после перезагрузки
// Если данных нет (null), то создаем пустой массив []
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Функция сохраняет текущее состояние корзины в localStorage
// JSON.stringify превращает массив объектов в строку для хранения
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Эта функция вызывается при нажатии кнопки "Купить" в каталоге
// Параметр button - это кнопка, на которую нажали
function addToCartFromCard(button) {
    // button.closest('.block1') - находим родительский блок товара (с классом block1)
    const block = button.closest('.block1');
    
    // Находим название товара и получаем его текст
    const name = block.querySelector('.name').innerText;
    
    // Получаем цену товара (с учетом скидки)
    // Сначала ищем элемент с классом .new (скидочная цена)
    let price = block.querySelector('.new');
    if (price) {
        // Если есть скидка - берем новую цену, убираем " ₽" и превращаем в число
        price = parseInt(price.innerText.replace(' ₽', ''));
    } else {
        // Если скидки нет - берем обычную цену
        price = block.querySelector('.price');
        price = parseInt(price.innerText.replace(' ₽', ''));
    }
    
    // Проверяем, есть ли уже такой товар в корзине
    const existing = cart.find(item => item.name === name);
    
    if (existing) {
        // Если товар уже есть - увеличиваем количество на 1
        existing.quantity++;
    } else {
        // Если товара нет - добавляем новый объект с количеством 1
        cart.push({ name, price, quantity: 1 });
    }
    
    // Сохраняем обновленную корзину в localStorage
    saveCart();
    
    // Показываем уведомление об успешном добавлении
    alert(`✅ ${name} добавлен в корзину!`);
    
    // Обновляем отображение корзины
    updateCartDisplay();
}

// Функция отрисовывает все товары из корзины на странице
function updateCartDisplay() {
    // Находим контейнер для списка товаров и элемент для общей суммы
    const cartItemsList = document.getElementById('cartItemsList');
    const totalPriceSpan = document.getElementById('totalPrice');
    
    // Если на странице нет контейнера корзины - выходим (например, на странице каталога)
    if (!cartItemsList) return;
    
    // Если корзина пуста - показываем сообщение
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Корзина пуста</div>';
        if (totalPriceSpan) totalPriceSpan.innerText = '0 ₽';
        return;
    }
    
    // Очищаем контейнер перед отрисовкой
    cartItemsList.innerHTML = '';
    let total = 0;  // Переменная для подсчета общей суммы
    
    // Перебираем все товары в корзине
    cart.forEach((item, index) => {
        // Считаем сумму за один товар (цена * количество)
        const sum = item.price * item.quantity;
        total += sum;  // Добавляем к общей сумме
        
        // Создаем HTML-элемент для строки товара
        const row = document.createElement('div');
        row.className = 'cart-item';  // Добавляем класс для CSS стилей
        
        // Заполняем строку данными о товаре
        row.innerHTML = `
            <div><strong>${item.name}</strong></div>           <!-- Название -->
            <div>${item.price} ₽</div>                         <!-- Цена -->
            <div>
                <!-- Кнопка уменьшения количества -->
                <button class="qty-btn" onclick="changeQuantity(${index}, -1)" style="margin: 0 5px; padding: 2px 8px; cursor: pointer;">-</button>
                <span class="qty">${item.quantity}</span>      <!-- Количество -->
                <!-- Кнопка увеличения количества -->
                <button class="qty-btn" onclick="changeQuantity(${index}, 1)" style="margin: 0 5px; padding: 2px 8px; cursor: pointer;">+</button>
            </div>
            <div>${sum} ₽                                       <!-- Сумма за товар -->
                <!-- Кнопка удаления товара -->
                <button class="remove-btn" onclick="removeItem(${index})" style="margin-left: 10px; padding: 2px 8px; cursor: pointer; background: #ff4444; color: white; border: none; border-radius: 3px;">✖</button>
            </div>
        `;
        
        // Добавляем строку в контейнер корзины
        cartItemsList.appendChild(row);
    });
    
    // Обновляем отображение общей суммы
    if (totalPriceSpan) totalPriceSpan.innerText = total + ' ₽';
}

// Функция изменяет количество товара
// index - позиция товара в массиве cart
// delta - на сколько изменить (+1 или -1)
function changeQuantity(index, delta) {
    // Проверяем, существует ли товар
    if (!cart[index]) return;
    
    // Вычисляем новое количество
    const newQuantity = cart[index].quantity + delta;
    
    if (newQuantity <= 0) {
        // Если количество стало 0 или меньше - удаляем товар из корзины
        cart.splice(index, 1);  // splice удаляет элемент по индексу
    } else {
        // Иначе обновляем количество
        cart[index].quantity = newQuantity;
    }
    
    // Сохраняем изменения и обновляем отображение
    saveCart();
    updateCartDisplay();
}

// Функция полностью удаляет товар из корзины
function removeItem(index) {
    cart.splice(index, 1);  // Удаляем 1 элемент по индексу index
    saveCart();             // Сохраняем изменения
    updateCartDisplay();    // Обновляем отображение
}

// Функция оформления заказа (вызывается при нажатии на кнопку "Перейти к оформлению")
function checkout() {
    // Проверяем, не пустая ли корзина
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    // Получаем общую сумму
    const total = document.getElementById('totalPrice')?.innerText || '0 ₽';
    
    // Показываем сообщение с деталями заказа
    alert(`🎉 Спасибо за заказ!\nСумма: ${total}\nТовары: ${cart.map(i => `${i.name} (${i.quantity} шт.)`).join(', ')}`);
    
    // Очищаем корзину
    cart = [];
    saveCart();          // Сохраняем пустую корзину
    updateCartDisplay(); // Обновляем отображение
}

// Ждем, пока весь HTML загрузится, затем отображаем корзину
// DOMContentLoaded - событие, когда HTML полностью загружен и построен
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();  // Показываем корзину (если она есть на странице)

});
