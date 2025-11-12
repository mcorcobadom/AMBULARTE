<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Verificar si se envió el parámetro idCategoria
if (!isset($_GET['idCategoria']) || empty($_GET['idCategoria'])) {
    http_response_code(400);
    echo json_encode(["error" => "No se especificó la categoría"]);
    exit;
}

$idCategoria = mysqli_real_escape_string($conn, $_GET['idCategoria']);

// Consultar las obras asociadas a la categoría
$sql = "
    SELECT 
        obras.idObra,
        obras.nombre AS nombreObra,
        obras.tipo,
        obras.precioVenta,
        obras.imagen AS imagenObra,
        artistas.nombre AS nombreArtista,
        artistas.apellidos,
        artistas.pais
    FROM obras
    INNER JOIN artistas ON obras.idArtista = artistas.idArtista
    WHERE obras.idCategoria = '$idCategoria' AND obras.vendida = 0
    ORDER BY obras.nombre
";

$result = $conn->query($sql);

$obras = [];
while ($row = $result->fetch_assoc()) {
    $obras[] = [
        "idObra" => $row['idObra'],
        "nombreObra" => $row['nombreObra'],
        "tipo" => $row['tipo'],
        "precioVenta" => $row['precioVenta'],
        "imagenObra" => $row['imagenObra'],
        "nombreArtista" => $row['nombreArtista'],
        "apellidos" => $row['apellidos'],
        "pais" => $row['pais']
    ];
}

echo json_encode(["success" => true, "data" => $obras]);
$conn->close();
?>