<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Obtener el email del formulario
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);

if (!$email) {
    echo json_encode(['success' => false, 'mensaje' => 'Email no válido.']);
    exit;
}

try {
    // Preparar la consulta para insertar el email
    $stmt = $conn->prepare("INSERT INTO newsletter (email) VALUES (?)");
    $stmt->bind_param("s", $email);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'mensaje' => '¡Gracias por suscribirte a nuestra newsletter!']);
    } else {
        throw new Exception($conn->error, $conn->errno);
    }
} catch (Exception $e) {
    // Manejar errores específicos
    if ($e->getCode() == 1062) { // Código de error para entrada duplicada
        echo json_encode(['success' => false, 'mensaje' => 'El email ya está registrado.']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al guardar el email: ' . $e->getMensaje()]);
    }
}

// Cerrar la conexión
$stmt->close();
$conn->close();