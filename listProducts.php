<?php
// Подключаемся к базе данных
$host = '127.0.0.1';
$port = '5432';
$dbname = 'store';
$username = 'postgres';
$password = '2003';

try {
    // Используем pgsql вместо mysql
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT product_id, product_name FROM products");

    $products = [];
    // Используем правильные имена полей из запроса: product_id и product_name
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $products[] = ['id' => $row['product_id'], 'name' => $row['product_name']];
    }

    echo json_encode($products);
} catch (PDOException $e) {
    echo "Ошибка базы данных: " . $e->getMessage();
}
?>