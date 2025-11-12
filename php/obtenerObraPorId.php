<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Verificar si se envió el parámetro idObra
if (!isset($_POST['idObra'])) {
    echo json_encode(["error" => "No se especificó el ID de la obra"]);
    exit;
}

$idObra = mysqli_real_escape_string($conn, $_POST['idObra']);

// Consultar los datos de la obra
$sql = "
    SELECT 
        obras.idObra,
        obras.nombre AS nombreObra,
        obras.anio,
        obras.tipo,
        obras.tecnica,
        obras.dimensiones,
        obras.precioVenta,
        obras.imagen AS imagenObra,
        artistas.nombre AS nombreArtista,
        artistas.apellidos
    FROM obras
    INNER JOIN artistas ON obras.idArtista = artistas.idArtista
    WHERE obras.idObra = '$idObra'
";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $obra = $result->fetch_assoc();
    echo json_encode(["success" => true, "data" => $obra]);
} else {
    echo json_encode(["error" => "Obra no encontrada"]);
}

$conn->close();
?>