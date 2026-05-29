// 1. НАВЕШИВАЕМ ОБРАБОТЧИК НА КНОПКУ "НАЙТИ"
// Когда пользователь кликает на кнопку, запускается функция searchProducts()
document.getElementById('searchButton').addEventListener('click', function() {
    searchProducts(); // Вызов функции поиска
});

// 2. НАВЕШИВАЕМ ОБРАБОТЧИК НА ПОЛЕ ВВОДА
// Слушаем событие "keyup" - когда пользователь отпускает клавишу на клавиатуре
document.getElementById('searchInput').addEventListener('keyup', function(event) {
    // Проверяем, была ли нажата клавиша Enter
    if (event.key === 'Enter') {
        searchProducts(); // Если Enter - запускаем поиск
    }
});

// 3. ОСНОВНАЯ ФУНКЦИЯ ПОИСКА
function searchProducts() {
    // Получаем значение из поля поиска и переводим в НИЖНИЙ РЕГИСТР (маленькие буквы)
    let searchText = document.getElementById('searchInput').value.toLowerCase();

    // Находим ВСЕ элементы с классом 'block1' (карточки товаров)
    let products = document.querySelectorAll('.block1');
    
    // Счетчик найденных товаров
    let foundCount = 0;

    // Перебираем каждую карточку товара
    products.forEach(product => {
        let productName = product.querySelector('.name').textContent.toLowerCase();

        // ПРОВЕРКА УСЛОВИЯ
        if (productName.includes(searchText) || searchText === '') {
            // ПОКАЗЫВАЕМ товар
            product.style.display = 'block';
            // Увеличиваем счетчик, если товар подходит под поиск (и поиск не пустой)
            if (searchText !== '' && productName.includes(searchText)) {
                foundCount++;
            }
        } else {
            // СКРЫВАЕМ товар
            product.style.display = 'none';
        }
    });
    
    // ПОКАЗЫВАЕМ ВСПЛЫВАЮЩЕЕ ОКНО, ЕСЛИ ТОВАР НЕ НАЙДЕН
    if (searchText !== '' && foundCount === 0) {
        alert(`❌ Товар "${searchText}" не найден!\nПопробуйте изменить запрос.`);
    }
}