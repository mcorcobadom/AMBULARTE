<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Consulta para obtener las galerías con exposiciones activas y sus obras
$sql = "
    SELECT 
        galerias.idGaleria,
        galerias.nombre AS nombreGaleria,
        galerias.direccion,
        galerias.telefono,
        galerias.ciudad,
        galerias.imagen AS imagenGaleria,
        exposiciones.idExposicion,
        exposiciones.nombre AS nombreExposicion,
        obras_exposicion.fechaInicio,
        obras_exposicion.fechaFin,
        obras.idObra,
        obras.imagen AS imagenObra,
        obras.tipo AS tipoObra,
        obras.nombre AS nombreObra,
        artistas.idArtista,
        artistas.nombre AS nombreArtista,
        artistas.apellidos AS apellidosArtista,
        artistas.pais AS paisArtista,
        artistas.imagen AS imagenArtista
    FROM galerias
    INNER JOIN exposiciones ON galerias.idGaleria = exposiciones.idGaleria
    INNER JOIN obras_exposicion ON exposiciones.idExposicion = obras_exposicion.idExposicion
    INNER JOIN obras ON obras_exposicion.idObra = obras.idObra
    INNER JOIN artistas ON obras.idArtista = artistas.idArtista
    WHERE galerias.activo = 1
    ORDER BY galerias.idGaleria, exposiciones.idExposicion, obras.idObra
";

$result = $conn->query($sql);

$galerias = [];
while ($row = $result->fetch_assoc()) {
    // Formatear las fechas de inicio y fin al formato DD/MM/YYYY
    $fechaInicio = (new DateTime($row['fechaInicio']))->format('d/m/Y');
    $fechaFin = (new DateTime($row['fechaFin']))->format('d/m/Y');

    $idGaleria = $row['idGaleria'];
    $idExposicion = $row['idExposicion'];

    // Agrupar exposiciones por galería
    if (!isset($galerias[$idGaleria])) {
        $galerias[$idGaleria] = [
            "idGaleria" => $idGaleria,
            "nombreGaleria" => $row['nombreGaleria'],
            "direccion" => $row['direccion'],
            "telefono" => $row['telefono'],
            "ciudad" => $row['ciudad'],
            "imagenGaleria" => $row['imagenGaleria'],
            "exposiciones" => []
        ];
    }

    // Agrupar obras por exposición
    if (!isset($galerias[$idGaleria]['exposiciones'][$idExposicion])) {
        $galerias[$idGaleria]['exposiciones'][$idExposicion] = [
            "idExposicion" => $idExposicion,
            "nombreExposicion" => $row['nombreExposicion'],
            "fechaInicio" => $fechaInicio,
            "fechaFin" => $fechaFin,
            "obras" => []
        ];
    }

    // Agregar obra a la exposición
    $galerias[$idGaleria]['exposiciones'][$idExposicion]['obras'][] = [
        "idObra" => $row['idObra'],
        "imagenObra" => $row['imagenObra'],
        "nombreObra" => $row['nombreObra'],
        "idArtista" => $row['idArtista'],
        "nombreArtista" => $row['nombreArtista'],
        "apellidosArtista" => $row['apellidosArtista'],
        "paisArtista" => $row['paisArtista'],
        "tipoObra" => $row['tipoObra'],
        "imagenArtista" => $row['imagenArtista']
    ];
}

// Reindexar el array para devolverlo como JSON
echo json_encode(["success" => true, "data" => array_values($galerias)], JSON_PRETTY_PRINT);
$conn->close();
?>