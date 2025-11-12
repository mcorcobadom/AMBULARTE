<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Consultar los últimos 4 artistas con al menos una obra
$sql = "
    SELECT 
        artistas.idArtista, 
        artistas.nombre, 
        artistas.apellidos, 
        artistas.pais, 
        artistas.imagen, 
        (SELECT COUNT(*) FROM obras WHERE obras.idArtista = artistas.idArtista) AS totalObras
    FROM artistas
    HAVING totalObras > 0
    ORDER BY artistas.idArtista DESC
    LIMIT 4
";

$result = $conn->query($sql);

if (!$result) {
    error_log("Error en la consulta de artistas: " . $conn->error);
    http_response_code(500);
    echo json_encode(["error" => "Error en la consulta de artistas"]);
    exit;
}

error_log("Consulta de artistas ejecutada correctamente.");

$artistas = [];
while ($row = $result->fetch_assoc()) {
    $artistas[] = [
        "idArtista" => $row['idArtista'],
        "nombre" => $row['nombre'],
        "apellidos" => $row['apellidos'],
        "pais" => $row['pais'],
        "imagen" => $row['imagen'],
        "totalObras" => $row['totalObras']
    ];
}

error_log("Datos de artistas generados correctamente.");

echo json_encode(["success" => true, "data" => $artistas]);
$conn->close();
?>