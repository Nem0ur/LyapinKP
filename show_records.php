<?php
if (isset($_POST['show_records']) && $_POST['show_records'] == 'true') {
    $table = $_POST['table'];
    showRecords($table);
}

function showRecords($table) {
    $host = '127.0.0.1';
    $port = '5432';
    $dbname = 'store';
    $username = 'postgres';
    $password = '2003';

    $translation = array(
        'order_id' => 'Номер заказа',
        'client_id' => 'Номер клиента',
        'product_id' => 'Номер товара',
        'feedback_id' => 'Номер отзыва',
        'sell_id' => 'Номер продажи',
        'client_fn' => 'Имя клиента',
        'client_pn' => 'Номер телефона',
        'client_email' => 'Электронная почта клиента',
        'product_name' => 'Название товара',
        'product_price' => 'Цена товара',
        'order_status' => 'Статус заказа',
        'feedback_text' => 'Текст отзыва',
        'client_dor' => 'Дата рождения',
        'email' => 'Почта',
        'password' => 'Пароль',
        'feedback_date' => 'Дата отзыва',
        'product_material' => 'Материал',
        'product_weight' => 'Вес',
        'product_qis' => 'Количество на складе',
        'product_discribe' => 'Описание',
        'sells_date' => 'Дата продажи',
        'sells_id' => 'Номер продажи',
        'sells_pm' => 'Способ оплаты',
        'sells_summ' => 'Сумма оплаты',
        'order_date' => 'Дата оплаты',
        'order_dd' => 'Дата приезда',
    );

    try {
        $conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname;user=$username;password=$password");
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Измененный SQL запрос с JOIN для таблицы sells
        if ($table == 'sells') {
            $query = "SELECT sells.sells_id, sells.sells_date, sells.sells_summ, products.product_name
                      FROM sells
                      INNER JOIN products ON sells.product_id = products.product_id";
        } elseif ($table == 'orders') {
            // Измененный SQL запрос с JOIN для таблицы orders
            $query = "SELECT orders.order_id, orders.client_id, orders.order_status, products.product_name
                      FROM orders
                      INNER JOIN products ON orders.product_id = products.product_id";
        } else {
            // Оставляем запрос без изменений для остальных таблиц
            $query = "SELECT * FROM \"$table\"";
        }

        $stmt = $conn->query($query);

        $columnCount = $stmt->columnCount();
        $columnMeta = array();

        for ($i = 0; $i < $columnCount; $i++) {
            $columnMeta[] = $stmt->getColumnMeta($i);
        }

        $html = '<table border="1">';

        $html .= '<tr>';
        foreach ($columnMeta as $meta) {
            $columnName = $meta['name'];
            $translatedName = isset($translation[$columnName]) ? $translation[$columnName] : $columnName;
            $html .= '<th>' . htmlspecialchars($translatedName) . '</th>';
        }
        $html .= '</tr>';

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $html .= '<tr>';
            foreach ($columnMeta as $meta) {
                $columnName = $meta['name'];
                $html .= '<td>' . htmlspecialchars($row[$columnName]) . '</td>';
            }
            $html .= '</tr>';
        }
        $html .= '</table>';

        $conn = null;

        echo $html;
    } catch (PDOException $e) {
        die('Ошибка подключения: ' . $e->getMessage());
    }
}
?>
