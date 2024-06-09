<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['change_product_price'])) {
    $host = '127.0.0.1';
    $port = '5432';
    $dbname = 'store';
    $username = 'postgres';
    $password = '2003';

    $conn = pg_connect("host=$host port=$port dbname=$dbname user=$username password=$password");

    if (!$conn) {
        echo "Ошибка подключения к базе данных.";
        exit;
    }

    // Используем $_POST['product_Id'] вместо $_POST['product_id']
    $product_id = $_POST['product_id'];
    $new_price = $_POST['new_price'];

    if (!is_numeric($new_price)) {
        echo "Цена должна быть числом.";
        pg_close($conn);
        exit;
    }

    $query_check_product = "SELECT * FROM products WHERE product_id = $1";
    $result_check_product = pg_query_params($conn, $query_check_product, array($product_id));

    // Проверка на ошибки при выполнении запроса
    if (!$result_check_product) {
        echo "Ошибка выполнения запроса: " . pg_last_error($conn);
        pg_close($conn);
        exit;
    }

    if (pg_num_rows($result_check_product) > 0) {
        $query_update_price = "UPDATE products SET product_price = $1 WHERE product_id = $2";
        $result_update_price = pg_query_params($conn, $query_update_price, array($new_price, $product_id));

        if ($result_update_price) {
            echo "Цена товара успешно изменена!";
        } else {
            echo "Ошибка при обновлении цены товара: " . pg_last_error($conn); // Добавлено сообщение об ошибке
        }
    } else {
        echo "Товар с указанным ID не найден.";
    }

    pg_close($conn);
}
?>