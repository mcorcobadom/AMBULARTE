<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Consultar las categorías
$sql = "SELECT idCategoria, nombre, descripcion, imagen FROM categorias ORDER BY idCategoria";
$result = $conn->query($sql);

$categorias = [];
while ($row = $result->fetch_assoc()) {
    $categorias[] = [
        "idCategoria" => $row['idCategoria'],
        "nombre" => $row['nombre'],
        "descripcion" => $row['descripcion'],
        "imagen" => $row['imagen']
    ];
}

echo json_encode(["success" => true, "data" => $categorias]);
$conn->close();
?>