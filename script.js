


function showSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
}

function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
    document.getElementById('signupMessage').style.display = 'none';
}

function signup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "signup.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('signupMessage').textContent = xhr.responseText;
            document.getElementById('signupMessage').style.display = 'block';
        }
    };
    xhr.send("name=" + name + "&email=" + email + "&password=" + password + "&role=" + role);
}

function showSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
}

function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
}
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "login.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.status === 'success') {
                sessionStorage.setItem('userRole', response.role);
                window.location.href = 'main.html';
            } else {
                alert('Invalid email or password');
            }
        }
    };
    xhr.send("email=" + email + "&password=" + password);
}


document.getElementById("addProductForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    // Получаем значения полей формы
    var productId = document.getElementById("productId").value;
    var productName = document.getElementById("productName").value;
    var productMaterial = document.getElementById("productMaterial").value;
    var productWeight = document.getElementById("productWeight").value;
    var productPrice = document.getElementById("productPrice").value;
    var productQuantity = document.getElementById("productQuantity").value;
    var productDiscribe = document.getElementById("productDiscribe").value;

    // Создаем объект FormData для передачи данных формы
    var formData = new FormData();
    formData.append("productId", productId);
    formData.append("productName", productName);
    formData.append("productMaterial", productMaterial);
    formData.append("productWeight", productWeight);
    formData.append("productPrice", productPrice);
    formData.append("productQuantity", productQuantity);
    formData.append("productDiscribe", productDiscribe);

    // Отправляем данные на сервер через AJAX запрос
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "add_product.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Успешный ответ от сервера
                console.log(xhr.responseText);
                // Дополнительные действия при успешном добавлении товара
            } else {
                // Ошибка при запросе к серверу
                console.error("Произошла ошибка: " + xhr.status);
            }
        }
    };
    xhr.send(formData);
});



document.addEventListener('DOMContentLoaded', function () {
    // Функция для отображения данных в модальном окне
    function showPopup(table) {
        let title = "";
        let popupId = "";

        switch (table) {
            case 'clients':
                title = "Клиенты";
                popupId = 'clientsPopup';
                break;
            case 'feedback':
                title = "Отзывы";
                popupId = 'feedbackPopup';
                break;
            case 'orders':
                title = "Заказы";
                popupId = 'ordersPopup';
                break;
            case 'products':
                title = "Наши товары";
                popupId = 'productsPopup';
                break;
            case 'sells':
                title = "Продажи";
                popupId = 'sellsPopup';
                break;
            case 'addProductPopup':
                document.getElementById('addProductPopup').style.display = 'block';
                return;
            case 'deleteProductPopup':
                document.getElementById('deleteProductPopup').style.display = 'block';
                loadProductList('deleteProductId');
                return;
            case 'cngprice':
                document.getElementById('changePricePopup').style.display = 'block';
                loadProductList('changeProductId');
                return;
            default:
                console.error("Unsupported operation for: " + table);
                return;
        }

        fetchAndShowRecords(table, title, popupId);
    }

    // Закрытие любого модального окна по его идентификатору
    function closePopup(popupId) {
        document.getElementById(popupId).style.display = 'none';
    }

    // Загрузка списка продуктов для выбора
    function loadProductList(selectId) {
        fetch('listProducts.php')
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById(selectId);
                select.innerHTML = '';
                data.forEach(product => {
                    const option = document.createElement('option');
                    option.value = product.id;
                    option.textContent = product.name;
                    select.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error loading products:', error);
                alert('Ошибка загрузки списка товаров.');
            });
    }

    // Получение и отображение данных в всплывающем окне
    function fetchAndShowRecords(table, title, popupId) {
        fetch('show_records.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'show_records=true&table=' + encodeURIComponent(table)
        })
            .then(response => response.text())
            .then(html => {
                displayPopup(title, html, popupId);
            })
            .catch(error => {
                console.error('Error fetching records for table: ' + table, error);
                alert('Ошибка загрузки данных для: ' + table);
            });
    }

    // Отображение всплывающего окна с данными
    function displayPopup(title, htmlContent, popupId) {
        const popup = document.getElementById(popupId);
        popup.querySelector('h3').textContent = title;
        popup.querySelector('.table-container').innerHTML = htmlContent;
        popup.style.display = 'block';
    }

    // Привязка событий к кнопкам для отображения соответствующих данных
    document.getElementById('clientBtn')?.addEventListener('click', function () {
        showPopup('clients');
    });

    document.getElementById('feedbackBtn')?.addEventListener('click', function () {
        showPopup('feedback');
    });

    document.getElementById('ordersBtn')?.addEventListener('click', function () {
        showPopup('orders');
    });

    document.getElementById('productBtn')?.addEventListener('click', function () {
        showPopup('products');
    });

    document.getElementById('sellsBtn')?.addEventListener('click', function () {
        showPopup('sells');
    });

    document.getElementById('addProductBtn')?.addEventListener('click', function () {
        showPopup('addProductPopup');
    });

    document.getElementById('dltprdctBtn')?.addEventListener('click', function () {
        showPopup('deleteProductPopup');
    });

    document.getElementById('cngpriceBtn')?.addEventListener('click', function () {
        showPopup('cngprice');
    });

    // Функция удаления продукта
    function deleteProduct() {
        const productId = document.getElementById('deleteProductId').value;
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
            fetch('deleteProduct.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: 'id=' + encodeURIComponent(productId)
            })
                .then(response => response.text())
                .then(result => {
                    alert(result);
                    closePopup('deleteProductPopup');
                    loadProductList('deleteProductId');
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                    alert('Ошибка при удалении товара.');
                });
        }
    }

    document.getElementById('deleteProductForm')?.querySelector('input[type=button]')?.addEventListener('click', deleteProduct);

    // Закрытие всех модальных окон с классом `close`
    document.querySelectorAll('.close').forEach(function (button) {
        const popupId = button.parentElement.parentElement.id;
        button.addEventListener('click', function () {
            closePopup(popupId);
        });
    });


// Закрытие модального окна при клике вне его
    window.onclick = function(event) {
        const modal = document.getElementById("signupModal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Открытие модального окна для добавления товара

// Функция для удаления товара (предполагается, что у вас есть форма удаления)
    function deleteProduct() {
        const productId = document.getElementById('deleteProductId').value;
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
            fetch('deleteProduct.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: 'id=' + encodeURIComponent(productId)
            })
                .then(response => response.text())
                .then(result => {
                    alert(result);
                    closePopup('deleteProductPopup');
                    loadProductList('deleteProductId'); // Обновляем список товаров после удаления
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                    alert('Ошибка при удалении товара.');
                });
        }
    }

// Привязка события к кнопке "Удалить товар" в форме удаления товара
    document.getElementById('deleteProductForm')?.querySelector('input[type=button]')?.addEventListener('click', deleteProduct);
    function deleteProduct() {
        const productId = document.getElementById('deleteProductId').value;
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
            fetch('deleteProduct.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: 'id=' + encodeURIComponent(productId)
            })
                .then(response => response.text())
                .then(result => {
                    alert(result);
                    closePopup('deleteProductPopup');
                    loadProductList('deleteProductId'); // Обновляем список товаров после удаления
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                    alert('Ошибка при удалении товара.');
                });
        }
    }

// Привязка события к кнопке "Удалить товар" в форме удаления товара
    document.getElementById('deleteProductForm')?.querySelector('input[type=button]')?.addEventListener('click', deleteProduct);


});


document.getElementById("addProductForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Получаем данные из формы
    var productName = document.getElementById("productName").value;
    var productMaterial = document.getElementById("productMaterial").value;
    var productWeight = document.getElementById("productWeight").value;
    var productPrice = document.getElementById("productPrice").value;
    var productQuantity = document.getElementById("productQuantity").value;
    var productDiscribe = document.getElementById("productDiscribe").value; // Изменено на productDiscribe
    var productId = document.getElementById("productId").value;

    // Создаем объект FormData для отправки данных
    var formData = new FormData();
    formData.append("productName", productName);
    formData.append("productMaterial", productMaterial);
    formData.append("productWeight", productWeight);
    formData.append("productPrice", productPrice);
    formData.append("productQuantity", productQuantity);
    formData.append("productDiscribe", productDiscribe); // Изменено на productDiscribe
    formData.append("productId", productId);

    // Отправляем данные на сервер
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "add_product.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Действия после успешной отправки данных
            alert("Товар успешно добавлен!");
            closeAddProductModal(); // Закрываем модальное окно
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            // Обработка ошибок
            alert("Ошибка при добавлении товара!");
            console.error("Ошибка при добавлении товара:", xhr.status, xhr.statusText);
        }
    };
    xhr.send(formData);
});
function changeProductPrice() {
    const productId = document.getElementById('product_id').value;
    const newPrice = document.getElementById('newPrice').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'update_price.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            alert(xhr.responseText);
            closeChangePriceForm();
        }
    };
    xhr.send(`change_product_price=true&product_id=${productId}&new_price=${newPrice}`);
}

function showPopup(popupId) {
    const modalId = popupId + 'Modal';
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error(`Element with id '${modalId}' not found`);
    }
}

function closeChangePriceForm() {
    document.getElementById('cngpriceModal').style.display = 'none';
}



document.addEventListener('DOMContentLoaded', function() {
    const role = sessionStorage.getItem('userRole');

    if (role === 'user') {
        document.getElementById('clientBtn').style.display = 'none';
        document.getElementById('ordersBtn').style.display = 'none';
        document.getElementById('sellsBtn').style.display = 'none';
        document.getElementById('addProductBtn').style.display = 'none';
        document.getElementById('dltprdctBtn').style.display = 'none';
        document.getElementById('ordersBtn').style.display = 'none';
        document.getElementById('cngpriceBtn').style.display = 'none';

    } else if (role === 'manager') {
        document.getElementById('sellsBtn').style.display = 'none';
        document.getElementById('addProductBtn').style.display = 'none';
        document.getElementById('dltprdctBtn').style.display = 'none';
        document.getElementById('clientBtn').style.display = 'none';
        document.getElementById('paymentBtn').style.display = 'none';
        document.getElementById('carrierBtn').style.display = 'none';
        document.getElementById('companyBtn').style.display = 'none';
        document.getElementById('modifyOrderBtn').style.display = 'none';
        document.getElementById('createOrderBtn').style.display = 'none';
        document.getElementById('deleteCarrierBtn').style.display = 'none';
        document.getElementById('addCarrierBtn').style.display = 'none';
        document.getElementById('showAirplaneOrdersBtn').style.display = 'none';
        document.getElementById('showMarch2023OrdersBtn').style.display = 'none';
        document.getElementById('myOrdersBtn').style.display = 'none';
        document.getElementById('downloadPdfBtn').style.display = 'none';



    } else if (role === 'admin') {

    }
});

function logout() {
    // Удаление данных сеанса из локального хранилища или cookie (в зависимости от ваших настроек)
    localStorage.removeItem('username'); // Пример для локального хранилища
    // Перенаправление пользователя на страницу авторизации
    window.location.href = 'index.html';
}



document.getElementById("downloadPdfBtn").addEventListener("click", function() {
    // Создаем новый объект FormData
    const formData = new FormData();
    formData.append("table", "sells");

    // Отправляем POST запрос на сервер
    fetch("/download_pdf.php", {
        method: "POST",
        body: formData
    })
        .then(response => response.blob())  // Получаем ответ как Blob (двоичный файл)
        .then(blob => {
            // Создаем ссылку для скачивания
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = "sells.pdf";  // Имя файла для сохранения
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);  // Освобождаем память
        })
        .catch(error => console.error("Ошибка скачивания PDF:", error));
});

let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    alert(name + ' добавлен(а) в корзину');
}

function showCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        updateCartTable();
        cartModal.style.display = 'flex';
    } else {
        console.error(`Element with id 'cartModal' not found`);
    }
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

function updateCartTable() {
    const cartTableBody = document.querySelector('#cartTable tbody');
    cartTableBody.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const priceCell = document.createElement('td');

        nameCell.textContent = item.name;
        priceCell.textContent = item.price + '$';

        row.appendChild(nameCell);
        row.appendChild(priceCell);
        cartTableBody.appendChild(row);

        totalPrice += item.price;
    });

    document.getElementById('totalPrice').textContent = totalPrice + '$';
}

// Закрытие модального окна корзины при клике вне его
window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    if (event.target === cartModal) {
        closeCart();
    }
}

// Закрытие модального окна корзины при нажатии на клавишу Esc
window.addEventListener('keydown', function(event) {
    const cartModal = document.getElementById('cartModal');
    if (event.key === 'Escape' && cartModal.style.display === 'flex') {
        closeCart();
    }
});
