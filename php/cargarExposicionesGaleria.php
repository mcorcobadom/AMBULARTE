<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Verificar si se envió el parámetro 'idGaleria'
if (!isset($_GET['idGaleria'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan parámetros necesarios"]);
    exit;
}

$idGaleria = mysqli_real_escape_string($conn, $_GET['idGaleria']);

// Consulta para obtener las exposiciones de la galería específica
$sql = "
    SELECT 
        exposiciones.idExposicion,
        exposiciones.nombre AS nombreExposicion,
        exposiciones.zona AS zonaExposicion,
        obras_exposicion.fechaInicio,
        obras_exposicion.fechaFin,
        obras.idObra,
        obras.nombre AS nombreObra,
        obras.imagen AS imagenObra,
        artistas.nombre AS nombreArtista,
        artistas.apellidos AS apellidosArtista
    FROM exposiciones
    LEFT JOIN obras_exposicion ON exposiciones.idExposicion = obras_exposicion.idExposicion
    LEFT JOIN obras ON obras_exposicion.idObra = obras.idObra
    LEFT JOIN artistas ON obras.idArtista = artistas.idArtista
    WHERE exposiciones.idGaleria = '$idGaleria'
    ORDER BY exposiciones.idExposicion DESC
";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(["error" => "Error en la consulta: " . $conn->error]);
    exit;
}

$exposiciones = [];
while ($row = $result->fetch_assoc()) {
    // Formatear las fechas de inicio y fin al formato DD/MM/YYYY

    $fechaInicio = $row['fechaInicio'] ? (new DateTime($row['fechaInicio']))->format('d/m/Y') : null;
    $fechaFin = $row['fechaFin'] ? (new DateTime($row['fechaFin']))->format('d/m/Y') : null;

    $idExposicion = $row['idExposicion'];

    // Agrupar obras por exposición
    if (!isset($exposiciones[$idExposicion])) {
        $exposiciones[$idExposicion] = [
            "idExposicion" => $idExposicion,
            "nombreExposicion" => $row['nombreExposicion'],
            "zonaExposicion" => $row['zonaExposicion'],
            "fechaInicio" => $fechaInicio,
            "fechaFin" => $fechaFin,
            "obras" => []
        ];
    }

    // Agregar obra a la exposición
    $exposiciones[$idExposicion]['obras'][] = [
        "idObra" => $row['idObra'],
        "imagenObra" => $row['imagenObra'],
        "nombreObra" => $row['nombreObra'],
        "nombreArtista" => $row['nombreArtista'],
        "apellidosArtista" => $row['apellidosArtista']
    ];
}

// Reindexar el array para devolverlo como JSON
echo json_encode(["success" => true, "data" => array_values($exposiciones)], JSON_PRETTY_PRINT);
$conn->close();
?>