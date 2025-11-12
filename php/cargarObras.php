<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Verificar si se envió el parámetro 'tipo'
if (!isset($_GET['tipo'])) {
    http_response_code(400);
    echo json_encode(["error" => "No se especificó el tipo de obra"]);
    exit;
}

$tipo = mysqli_real_escape_string($conn, $_GET['tipo']);

// Construir la consulta según el tipo de obra. Obtener todas excepto las que ya se han vendido
switch ($tipo) {
    case 'pintura':
    case 'fotografia':
    case 'escultura':
    case 'dibujo':
        $sql = "
            SELECT 
                obras.idObra,
                obras.nombre AS nombreObra,
                obras.tecnica,
                obras.precioVenta,
                obras.imagen AS imagenObra,
                artistas.nombre AS nombreArtista,
                artistas.apellidos,
                artistas.pais
            FROM obras
            INNER JOIN artistas ON obras.idArtista = artistas.idArtista
            WHERE obras.tipo = '$tipo' AND obras.vendida = 0
            ORDER BY obras.nombre
        ";
        break;

    default:
        http_response_code(400);
        echo json_encode(["error" => "Tipo de obra no válido"]);
        exit;
}

$result = $conn->query($sql);

$obras = [];
while ($row = $result->fetch_assoc()) {
    $obras[] = [
        "idObra" => $row['idObra'],
        "nombreObra" => $row['nombreObra'],
        "tecnica" => $row['tecnica'],
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