<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $host = '127.0.0.1';
    $port = '5432';
    $dbname = 'store'; // Изменено на store
    $username = 'postgres';
    $password = '2003';

    $signupName = $_POST['name'];
    $signupEmail = $_POST['email'];
    $signupPassword = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $signupRole = $_POST['role'];

    try {
        $conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        if ($signupRole == 'user') {
            $query = "INSERT INTO clients (client_fn, email, password) VALUES (:name, :email, :password)";
        } elseif ($signupRole == 'manager') {
            $query = "INSERT INTO managers (name, email, password) VALUES (:name, :email, :password)";
        } elseif ($signupRole == 'admin') {
            $query = "INSERT INTO admins (name, email, password) VALUES (:name, :email, :password)";
        }

        $stmt = $conn->prepare($query);
        $stmt->bindParam(':name', $signupName);
        $stmt->bindParam(':email', $signupEmail);
        $stmt->bindParam(':password', $signupPassword);
        $stmt->execute();

        echo "Успешно зарегистрирован!";
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>
