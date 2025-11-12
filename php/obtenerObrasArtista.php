<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Verificar si se envió el idArtista
if (!isset($_POST['idArtista'])) {
    http_response_code(400);
    echo json_encode(["error" => "No se especificó el ID del artista"]);
    exit;
}

$idArtista = mysqli_real_escape_string($conn, $_POST['idArtista']);

// Obtener todas las obras del artista
$sql = "SELECT idObra, nombre AS nombreObra, tipo, precioVenta, imagen AS imagenObra FROM obras WHERE idArtista = '$idArtista'";
$result = $conn->query($sql);

$obras = [];
while ($row = $result->fetch_assoc()) {
    $obras[] = $row;
}

$conn->close();

echo json_encode(["success" => true, "obras" => $obras]);
?>