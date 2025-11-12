<?php

// Usar variables de entorno de Docker Compose
$host = $_ENV['DB_HOST'] ?? 'db';
$username = $_ENV['DB_USER'] ?? 'root';
$password = $_ENV['DB_PASSWORD'] ?? '1234';
$database = $_ENV['DB_NAME'] ?? 'AmbulArte';

// Conectar a MySQL
$conn = mysqli_connect($host, $username, $password, $database);

if (!$conn) {
    error_log("Error de conexión MySQL: " . mysqli_connect_error());
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión a la base de datos"]);
    exit;
}

mysqli_set_charset($conn, "utf8mb4");
?>