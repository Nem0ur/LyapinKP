<?php
// Подключение к базе данных
$host = '127.0.0.1'; // Адрес сервера базы данных
$port = '5432'; // Порт базы данных (обычно 5432 для PostgreSQL)
$dbname = 'store'; // Имя базы данных
$username = 'postgres'; // Имя пользователя базы данных
$password = '2003'; // Пароль пользователя базы данных

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Ошибка подключения к базе данных: " . $e->getMessage());
}

// Получаем данные из POST запроса
$productId = $_POST['productId'];
$productName = $_POST['productName'];
$productMaterial = $_POST['productMaterial'];
$productWeight = $_POST['productWeight'];
$productPrice = $_POST['productPrice'];
$productQuantity = $_POST['productQuantity'];
$productDiscribe = $_POST['productDiscribe'];

// Подготавливаем SQL запрос для добавления товара в базу данных
$sql = "INSERT INTO products (product_id, product_name, product_material, product_weight, product_price, product_qis, product_discribe)
        VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $pdo->prepare($sql);

// Выполняем запрос
try {
    $stmt->execute([$productId, $productName, $productMaterial, $productWeight, $productPrice, $productQuantity, $productDiscribe]);
    echo "Товар успешно добавлен в базу данных.";
} catch (PDOException $e) {
    die("Ошибка при добавлении товара: " . $e->getMessage());
}
?>
