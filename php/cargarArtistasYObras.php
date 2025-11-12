<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Consulta para obtener los artistas y sus obras relacionadas. Excluir las obras que se han vendido
$sql = "
    SELECT 
        artistas.idArtista, 
        artistas.nombre AS nombreArtista,
        artistas.apellidos,
        artistas.pais,
        obras.idObra, 
        obras.nombre AS nombreObra, 
        obras.tipo, 
        obras.dimensiones, 
        obras.precioVenta, 
        obras.imagen AS imagenObra
    FROM artistas
    LEFT JOIN obras ON artistas.idArtista = obras.idArtista AND obras.vendida = 0
    ORDER BY artistas.idArtista, obras.idObra
";

$result = $conn->query($sql);

$artistas = [];
while ($row = $result->fetch_assoc()) {
    $idArtista = $row['idArtista'];

    // Agrupar obras por artista
    if (!isset($artistas[$idArtista])) {
        $artistas[$idArtista] = [
            "idArtista" => $idArtista,
            "nombre" => $row['nombreArtista'],
            "apellidos" => $row['apellidos'], 
            "pais" => $row['pais'],
            "obras" => []
        ];
    }

    // Agregar obra al artista
    if (!empty($row['idObra'])) {
        $artistas[$idArtista]["obras"][] = [
            "idObra" => $row['idObra'],
            "nombre" => $row['nombreObra'],
            "tipo" => $row['tipo'],
            "dimensiones" => $row['dimensiones'],
            "precioVenta" => $row['precioVenta'],
            "imagen" => $row['imagenObra']
        ];
    }
}

// Filtrar artistas que no tienen obras
$artistasConObras = array_filter($artistas, function ($artista) {
    return count($artista['obras']) > 0;
});

echo json_encode(["success" => true, "data" => array_values($artistasConObras)]);
$conn->close();
?>