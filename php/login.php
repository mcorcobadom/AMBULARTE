<?php

// Incluir configuración de base de datos
require_once 'config.php';

if (!isset($_POST['email']) || empty($_POST['email'])) {
    echo json_encode(["error" => "Falta el parámetro 'email'"]);
    exit();
}
if (!isset($_POST['contrasena']) || empty($_POST['contrasena'])) {
    echo json_encode(["error" => "Falta el parámetro 'contrasena'"]);
    exit();
}

$email = $_POST['email'];
$contrasena = $_POST['contrasena'];


// Buscar usuario por email
$sql = "SELECT * FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// Si existe el usuario
if ($result->num_rows > 0) {
    $usuario = $result->fetch_assoc();

    // Verificar la contraseña usando password_verify
    if (password_verify($contrasena, $usuario['contrasena'])) {
        echo json_encode(["success" => $usuario], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["error" => "Email o contraseña incorrectos"]);
    }
} else {
    echo json_encode(["error" => "Email o contraseña incorrectos"]);
}

$stmt->close();
$conn->close();

?>
