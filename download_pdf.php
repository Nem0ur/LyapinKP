<?php

require_once 'vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['table']) && $_POST['table'] === 'sells') {
    // Параметры подключения к базе данных
    $host = '127.0.0.1';
    $dbname = 'store';
    $username = 'postgres';
    $password = '2003';
    $translation = array(
        'sells_id' => 'Номер продажи',
        'product_id' => 'Номер продукта',
        'sells_date' => 'Дата продажи',
        'sells_summ' => 'Сумма продажи'
    );

    // Подключение к базе данных с использованием PDO
    try {
        $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        echo "Ошибка подключения к базе данных: " . $e->getMessage();
        exit();
    }

    // SQL запрос для извлечения данных о продажах
    $sql = "SELECT sells_id, product_id, sells_date, sells_summ FROM sells";
    $stmt = $pdo->query($sql);
    $sells = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // HTML для начала таблицы
    $html = '
    <html>
    <head>
        <style>
            @font-face {
                font-family: "DejaVu Sans";
                src: url("vendor/dompdf/dompdf/lib/fonts/DejaVuSans.ttf") format("truetype");
            }
            body {
                font-family: "DejaVu Sans", sans-serif;
            }
            table {
                font-family: "DejaVu Sans", sans-serif;
                border-collapse: collapse;
                width: 100%;
            }
            th {
                background-color: #f2f2f2;
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
            }
            td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
            }
        </style>
    </head>
    <body>
        <h2>Продажи</h2>
        <table>
            <tr>';

    // Генерация заголовков таблицы
    if (!empty($sells)) {
        foreach ($sells[0] as $column => $value) {
            $translatedColumn = isset($translation[$column]) ? $translation[$column] : $column;
            $html .= '<th>' . htmlspecialchars($translatedColumn) . '</th>';
        }
    }

    $html .= '</tr>';

    // PHP код для заполнения таблицы данными
    foreach ($sells as $sell) {
        $html .= '<tr>';
        foreach ($sell as $value) {
            $html .= '<td>' . htmlspecialchars($value) . '</td>';
        }
        $html .= '</tr>';
    }

    // HTML для конца таблицы
    $html .= '
        </table>
    </body>
    </html>';

    try {
        // Создаем экземпляр класса Dompdf
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isPhpEnabled', true);
        $dompdf = new Dompdf($options);

        // Загружаем HTML в Dompdf
        $dompdf->loadHtml($html);

        // Регистрируем шрифт DejaVu Sans
        $dompdf->set_option('defaultFont', 'DejaVu Sans');

        // Настраиваем параметры страницы
        $dompdf->setPaper('A4', 'portrait');

        // Рендерим PDF
        $dompdf->render();

        // Возвращаем PDF как бинарный поток данных
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="sells.pdf"');
        echo $dompdf->output();
    } catch (Exception $e) {
        echo 'Ошибка при создании PDF: ' . $e->getMessage();
    }
}
?>
