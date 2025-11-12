<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Verificar si se enviaron los datos requeridos
if (!isset($_POST['idObra'], $_POST['nombreObra'], $_POST['anioObra'], $_POST['tipoObra'], $_POST['tecnicaObra'], $_POST['dimensionesObra'], $_POST['precioVenta'], $_POST['categoria'])) {
    echo json_encode(["error" => "Faltan datos requeridos"]);
    exit;
}

// Validar y sanitizar los datos
$idObra = mysqli_real_escape_string($conn, $_POST['idObra']);
$nombreObra = mysqli_real_escape_string($conn, $_POST['nombreObra']);
$anioObra = (int) $_POST['anioObra'];
$tipoObra = mysqli_real_escape_string($conn, $_POST['tipoObra']);
$tecnicaObra = mysqli_real_escape_string($conn, $_POST['tecnicaObra']);
$dimensionesObra = mysqli_real_escape_string($conn, $_POST['dimensionesObra']);
$precioVenta = (float) $_POST['precioVenta'];
$idCategoria = (int) $_POST['categoria'];
$imagenObra = isset($_FILES['imagenObra']) ? $_FILES['imagenObra']['name'] : null;
$idArtista = (int)$_POST['idArtista'];

// Verificar si se ha subido una nueva imagen
if ($imagenObra) {
    $uploadDir = __DIR__ . "/../images/Obras/";
    $imagenPath = $uploadDir . basename($imagenObra);

    if (!move_uploaded_file($_FILES['imagenObra']['tmp_name'], $imagenPath)) {
        echo json_encode(["error" => "Error al subir la imagen"]);
        exit;
    }
} else {
    // Si no se sube una nueva imagen, mantener la imagen existente
    $imagenObra = null; 
}

// Actualizar los datos en la base de datos
$sql = "UPDATE obras SET nombre = ?, anio = ?, tipo = ?, tecnica = ?, dimensiones = ?, precioVenta = ?, imagen = IFNULL(?, imagen), idCategoria = ?, idArtista = ? WHERE idObra = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sisssdsiii", $nombreObra, $anioObra, $tipoObra, $tecnicaObra, $dimensionesObra, $precioVenta, $imagenObra, $idCategoria, $idArtista, $idObra);

if ($stmt->execute()) {
    echo json_encode(["success" => "Obra actualizada correctamente"]);
} else {
    echo json_encode(["error" => "Error al actualizar la obra: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>