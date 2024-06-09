<?php
session_start(); // Начинаем сессию

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $host = '127.0.0.1';
    $port = '5432';
    $dbname = 'store';
    $username = 'postgres';
    $password = '2003';

    $loginEmail = $_POST['email'];
    $loginPassword = $_POST['password'];

    try {
        $conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "SELECT client_id AS id, password, 'user' AS role FROM clients WHERE email = :email
                  UNION
                  SELECT id AS id, password, 'manager' AS role FROM managers WHERE email = :email
                  UNION
                  SELECT id AS id, password, 'admin' AS role FROM admins WHERE email = :email";

        $stmt = $conn->prepare($query);
        $stmt->bindParam(':email', $loginEmail);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($loginPassword, $row['password'])) {
                // Сохраняем идентификатор в сессии в зависимости от роли
                if ($row['role'] === 'user') {
                    $_SESSION['client_id'] = $row['id'];
                } elseif ($row['role'] === 'manager') {
                    $_SESSION['manager_id'] = $row['id'];
                } elseif ($row['role'] === 'admin') {
                    $_SESSION['admin_id'] = $row['id'];
                }
                $_SESSION['role'] = $row['role'];
                echo json_encode(['status' => 'success', 'role' => $row['role']]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Invalid email or password']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid email or password']);
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>
