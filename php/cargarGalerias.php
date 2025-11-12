<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Consultar las galerías activas
$sql = "SELECT idGaleria, nombre, direccion, ciudad, pais, telefono, email, imagen FROM galerias WHERE activo = 1";
$result = $conn->query($sql);

if (!$result) {
    error_log("Error en la consulta de galerías: " . $conn->error);
    http_response_code(500);
    echo json_encode(["error" => "Error en la consulta de galerías"]);
    exit;
}

$galerias = [];
while ($row = $result->fetch_assoc()) {
    $galerias[] = [
        "idGaleria" => $row['idGaleria'],
        "nombre" => $row['nombre'],
        "direccion" => $row['direccion'],
        "ciudad" => $row['ciudad'],
        "pais" => $row['pais'],
        "telefono" => $row['telefono'],
        "email" => $row['email'],
        "imagen" => $row['imagen']
    ];
}

echo json_encode(["success" => true, "data" => $galerias]);
$conn->close();
?>