<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

try {
    // Verificar los datos recibidos
    if (!isset($_POST['idExposicion'], $_POST['obras'], $_POST['fechaInicio'], $_POST['fechaFin']) || !is_array($_POST['obras'])) {
        throw new Exception("Datos incompletos.");
    }

    $idExposicion = (int)$_POST['idExposicion'];
    $obras = $_POST['obras'];
    $fechaInicio = $_POST['fechaInicio'];
    $fechaFin = $_POST['fechaFin'];

    // Insertar las obras en la exposición
    $stmt = $conn->prepare("INSERT INTO obras_exposicion (idObra, idExposicion, fechaInicio, fechaFin) VALUES (?, ?, ?, ?)");

    foreach ($obras as $idObra) {
        $stmt->bind_param("iiss", $idObra, $idExposicion, $fechaInicio, $fechaFin);
        if (!$stmt->execute()) {
            throw new Exception("Error al insertar la obra: " . $stmt->error);
        }
    }

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
} finally {
    if (isset($conn) && $conn) {
        $conn->close();
    }
}