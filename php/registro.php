<?php

// Incluir configuración de base de datos
require_once 'config.php';

if (!isset($_POST['email']) || empty($_POST['email']) ||
    !isset($_POST['contrasena']) || empty($_POST['contrasena']) ||
    !isset($_POST['tipoUsuario']) || empty($_POST['tipoUsuario'])) {

    echo json_encode(["error" => "Debes completar todos los campos"]);
    exit();
}

$email = $_POST['email'];
$contrasena = $_POST['contrasena'];
$tipoUsuario = $_POST['tipoUsuario'];

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["error" => "Email no válido"]);
    exit();
}


// Comprobar si el email ya existe
$sql_check = "SELECT idUsuario FROM usuarios WHERE email = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    echo json_encode(["error" => "Ya existe un usuario con ese email"]);
    $stmt_check->close();
    $conn->close();
    exit();
}
$stmt_check->close();

// Cifrar la contraseña
$hash = password_hash($contrasena, PASSWORD_DEFAULT);

// Insertar usuario
$sql = "INSERT INTO usuarios (email, contrasena, tipo) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $email, $hash, $tipoUsuario);

if ($stmt->execute()) {
    echo json_encode(["success" => "Se ha creado la cuenta correctamente, ya puedes iniciar sesión."]);
} else {
    echo json_encode(["error" => "Error al registrar el usuario: " . $stmt->error]);
}

$stmt->close();
$conn->close();

?>
