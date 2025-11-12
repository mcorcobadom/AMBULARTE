<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Verificar si se enviaron los parámetros necesarios
if (!isset($_GET['tipo'], $_GET['fechaInicio'], $_GET['fechaFin'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan parámetros necesarios"]);
    exit;
}

$tipo = mysqli_real_escape_string($conn, $_GET['tipo']);
$fechaInicio = mysqli_real_escape_string($conn, $_GET['fechaInicio']);
$fechaFin = mysqli_real_escape_string($conn, $_GET['fechaFin']);

// Construir la consulta según el tipo de obra y las fechas
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
    WHERE obras.tipo = '$tipo' 
    AND obras.vendida = 0
    AND obras.idObra NOT IN (
        SELECT idObra 
        FROM obrasExposiciones
        INNER JOIN exposiciones ON obrasExposiciones.idExposicion = exposiciones.idExposicion
        WHERE (fechaInicio <= '$fechaFin' AND fechaFin >= '$fechaInicio')
    )
    ORDER BY obras.nombre
";

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