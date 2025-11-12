<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Consulta para obtener los datos de la tabla auditoria
$sql = "SELECT idAuditoria, nombreTabla, accion, idRegistro, datosAnteriores, datosNuevos, usuario, fechaHora FROM auditoria ORDER BY fechaHora DESC";
$result = $conn->query($sql);

$auditoria = [];
while ($row = $result->fetch_assoc()) {
    $auditoria[] = $row;
}

echo json_encode(["success" => true, "data" => $auditoria]);

$conn->close();