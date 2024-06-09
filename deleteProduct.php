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

    // Получаем ID товара из POST запроса
    $id = $_POST['id'];

    // Удаляем товар из базы данных
    $stmt = $pdo->prepare("DELETE FROM products WHERE product_id = ?");
    $stmt->execute([$id]);

    echo "Товар успешно удален";
} catch (PDOException $e) {
    echo "Ошибка базы данных: " . $e->getMessage();
}
?>