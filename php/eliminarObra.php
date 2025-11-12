<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Verificar si se envió el ID de la obra
if (!isset($_POST['idObra'])) {
    echo json_encode(["error" => "No se especificó el ID de la obra"]);
    exit;
}

$idObra = (int) $_POST['idObra'];

// Verificar si la obra está asociada a algún pedido
$sqlCheck = "SELECT COUNT(*) AS total FROM detallesPedidos WHERE idObra = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("i", $idObra);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();
$rowCheck = $resultCheck->fetch_assoc();

if ($rowCheck['total'] > 0) {
    echo json_encode(["error" => "No se puede eliminar la obra porque está asociada a un pedido"]);
    exit;
}

// Eliminar la obra
$sqlDelete = "DELETE FROM obras WHERE idObra = ?";
$stmtDelete = $conn->prepare($sqlDelete);
$stmtDelete->bind_param("i", $idObra);

if ($stmtDelete->execute()) {
    echo json_encode(["success" => "Obra eliminada correctamente"]);
} else {
    echo json_encode(["error" => "Error al eliminar la obra: " . $stmtDelete->error]);
}

$stmtCheck->close();
$stmtDelete->close();
$conn->close();
?>