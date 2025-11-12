<?php

// Incluir configuración de base de datos
require_once 'config.php';

try {
    // Consulta para obtener las obras disponibles (no vendidas)
    $sql = "
        SELECT 
            obras.idObra, 
            obras.nombre AS nombreObra, 
            obras.imagen AS imagenObra, 
            artistas.nombre AS nombreArtista,
            artistas.apellidos AS apellidosArtista
        FROM obras
        INNER JOIN artistas ON obras.idArtista = artistas.idArtista
        WHERE obras.vendida = 0
    ";

    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    if ($result->num_rows == 0) {
        echo json_encode(["success" => true, "obras" => []]);
        exit;
    }

    $obras = [];
    while ($row = $result->fetch_assoc()) {
        $obras[] = $row;
    }

    echo json_encode(["success" => true, "obras" => $obras]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
} finally {
    $conn->close();
    
}