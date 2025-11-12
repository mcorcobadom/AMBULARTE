<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

if (!isset($_POST['idObra'], $_POST['idExposicion'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan parámetros necesarios"]);
    exit;
}

$idObra = mysqli_real_escape_string($conn, $_POST['idObra']);
$idExposicion = mysqli_real_escape_string($conn, $_POST['idExposicion']);

$sql = "DELETE FROM obras_exposicion WHERE idObra = '$idObra' AND idExposicion = '$idExposicion'";

if ($conn->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al eliminar la obra: " . $conn->error]);
}

$conn->close();
?>