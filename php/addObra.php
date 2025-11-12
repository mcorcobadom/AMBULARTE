<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

try {
    // Validar campos obligatorios
    if (!isset($_REQUEST['nombreObra'], $_REQUEST['anioObra'], $_REQUEST['tipoObra'], $_REQUEST['tecnicaObra'], $_REQUEST['dimensionesObra'], $_REQUEST['precioVenta'], $_REQUEST['idCategoria'], $_REQUEST['idArtista'])) {
        throw new Exception("Faltan datos obligatorios para añadir la obra.");
    }
    

    $nombre = $_REQUEST['nombreObra'];
    $anio = (int)$_REQUEST['anioObra'];
    $tipo = $_REQUEST['tipoObra'];
    $tecnica = $_REQUEST['tecnicaObra'];
    $dimensiones = $_REQUEST['dimensionesObra'];
    $precioVenta = (float)$_REQUEST['precioVenta'];
    $idCategoria = (int)$_REQUEST['idCategoria'];
    $idArtista = (int)$_REQUEST['idArtista'];
    $vendida = 0; // Por defecto, la obra no está vendida

    error_log(print_r($_POST, true));
error_log(print_r($_FILES, true));
    // Validar y procesar la imagen
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (isset($_FILES['imagenObra']) && $_FILES['imagenObra']['error'] == UPLOAD_ERR_OK) {
        if (!in_array($_FILES['imagenObra']['type'], $allowedTypes)) {
            throw new Exception("Sólo se permiten imágenes JPEG, JPG, PNG o GIF.");
        }
        $imagenNombre = "obra_" . uniqid() . "_" . basename($_FILES['imagenObra']['name']);
        $rutaDestino = "../images/Obras/" . $imagenNombre;

        if (!move_uploaded_file($_FILES['imagenObra']['tmp_name'], $rutaDestino)) {
            throw new Exception("Error al subir la imagen.");
        }
    } else {
        throw new Exception("No se proporcionó una imagen válida.");
    }

    // Insertar la obra en la base de datos
    $sql = "INSERT INTO obras (nombre, anio, tipo, tecnica, dimensiones, precioVenta, vendida, imagen, idCategoria, idArtista) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Error al preparar la consulta: " . $conn->error);
    }

    $stmt->bind_param("sisssdisii", $nombre, $anio, $tipo, $tecnica, $dimensiones, $precioVenta, $vendida, $imagenNombre, $idCategoria, $idArtista);

    if (!$stmt->execute()) {
        throw new Exception("Error al insertar la obra: " . $stmt->error);
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
?>