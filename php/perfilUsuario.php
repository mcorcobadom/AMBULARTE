<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Verificar datos requeridos
if (!isset($_POST['idUsuario']) || !isset($_POST['tipo']) || !isset($_POST['perfilCompletado'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos requeridos"]);
    exit;
}

// Validación de datos
if (empty($_POST['nombre']) || empty($_POST['direccion']) || empty($_POST['ciudad']) || empty($_POST['pais']) || empty($_POST['telefono'])) {
    http_response_code(400);
    echo json_encode(["error" => "Todos los campos obligatorios deben estar completos"]);
    exit;
}

// Subida de imagen
$idUsuario = $_POST['idUsuario'];
$tipo = $_POST['tipo'];
$imagenNombre = "";

// Obtener la imagen actual de la base de datos
if ($tipo == "artista") {
    $queryImagen = "SELECT imagen FROM artistas WHERE idArtista = ?";
} elseif ($tipo == "coleccionista") {
    $queryImagen = "SELECT imagen FROM coleccionistas WHERE idColeccionista = ?";
} elseif ($tipo == "galeria") {
    $queryImagen = "SELECT imagen FROM galerias WHERE idGaleria = ?";
} else {
    http_response_code(400);
    echo json_encode(["error" => "Tipo de usuario no válido"]);
    exit;
}

$stmtImagen = $conn->prepare($queryImagen);
$stmtImagen->bind_param("i", $idUsuario);
$stmtImagen->execute();
$resultImagen = $stmtImagen->get_result();
$imagenActual = $resultImagen->fetch_assoc()['imagen'];
$stmtImagen->close();

// Procesar nueva imagen si se ha subido
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] == 0) {
    if (!in_array($_FILES['imagen']['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(["error" => "Sólo se permiten imágenes JPEG, JPG, PNG o GIF"]);
        exit;
    }
    $imagenNombre = "img_" . $idUsuario . "_" . time() . "_" . basename($_FILES['imagen']['name']);
    $uploadDir = __DIR__ . "/../images/Perfil/";
    if (!move_uploaded_file($_FILES['imagen']['tmp_name'], $uploadDir . $imagenNombre)) {
        http_response_code(500);
        echo json_encode(["error" => "Error al subir la imagen"]);
        exit;
    }
} else {
    // Si no se sube una nueva imagen, conservar la actual
    $imagenNombre = $imagenActual;
}

// Preparar campos comunes
$perfilCompletado = $_POST['perfilCompletado'];
$nombre = $_POST['nombre'];
$direccion = $_POST['direccion'];
$ciudad = $_POST['ciudad'];
$codigoPostal = $_POST['codigoPostal'];
$pais = $_POST['pais'];
$telefono = $_POST['telefono'];
$email = $_POST['email'];
$imagen = $imagenNombre;
$activo = 1;

// Obtener los datos actuales para auditoría
$oldData = [];
if ($perfilCompletado == 1) {
    if ($tipo == "artista") {
        $queryOldData = "SELECT * FROM artistas WHERE idArtista = ?";
    } elseif ($tipo == "coleccionista") {
        $queryOldData = "SELECT * FROM coleccionistas WHERE idColeccionista = ?";
    } elseif ($tipo == "galeria") {
        $queryOldData = "SELECT * FROM galerias WHERE idGaleria = ?";
    }

    $stmtOldData = $conn->prepare($queryOldData);
    $stmtOldData->bind_param("i", $idUsuario);
    $stmtOldData->execute();
    $resultOldData = $stmtOldData->get_result();
    $oldData = $resultOldData->fetch_assoc();
    $stmtOldData->close();
}

// Validaciones específicas y consultas
if ($tipo == "artista") {
    $apellidos = $_POST['apellidos'];
    $genero = $_POST['genero'];
    $fechaNacimiento = $_POST['fechaNacimiento'];

    if ($perfilCompletado == 0) {
        $sql = "INSERT INTO artistas (idArtista, nombre, apellidos, genero, fechaNacimiento, direccion, ciudad, codigoPostal, pais, telefono, email, imagen, activo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("isssssssssssi", $idUsuario, $nombre, $apellidos, $genero, $fechaNacimiento, $direccion, $ciudad, $codigoPostal, $pais, $telefono, $email, $imagen, $activo);
    } else {
        $sql = "UPDATE artistas SET nombre = ?, apellidos = ?, genero = ?, fechaNacimiento = ?, direccion = ?, ciudad = ?, codigoPostal = ?, pais = ?, telefono = ?, email = ?, imagen = ?, activo = ? WHERE idArtista = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssssssssi", $nombre, $apellidos, $genero, $fechaNacimiento, $direccion, $ciudad, $codigoPostal, $pais, $telefono, $email, $imagen, $activo, $idUsuario);
    }
} elseif ($tipo == "coleccionista") {
    $apellidos = $_POST['apellidos'];
    $genero = $_POST['genero'];

    if ($perfilCompletado == 0) {
        $sql = "INSERT INTO coleccionistas (idColeccionista, nombre, apellidos, genero, direccion, ciudad, codigoPostal, pais, telefono, email, imagen, activo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("isssssssssii", $idUsuario, $nombre, $apellidos, $genero, $direccion, $ciudad, $codigoPostal, $pais, $telefono, $email, $imagen, $activo);
    } else {
        $sql = "UPDATE coleccionistas SET nombre = ?, apellidos = ?, genero = ?, direccion = ?, ciudad = ?, codigoPostal = ?, pais = ?, telefono = ?, email = ?, imagen = ?, activo = ? WHERE idColeccionista = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssssssii", $nombre, $apellidos, $genero, $direccion, $ciudad, $codigoPostal, $pais, $telefono, $email, $imagen, $activo, $idUsuario);
    }
} elseif ($tipo == "galeria") {
    $metrosCuadrados = $_POST['metrosCuadrados'];

    if ($perfilCompletado == 0) {
        $sql = "INSERT INTO galerias (idGaleria, nombre, direccion, ciudad, codigoPostal, pais, telefono, email, metrosCuadrados, imagen, activo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("isssssssisi", $idUsuario, $nombre, $direccion, $ciudad, $codigoPostal, $pais, $telefono, $email, $metrosCuadrados, $imagen, $activo);
    } else {
        $sql = "UPDATE galerias SET nombre = ?, direccion = ?, ciudad = ?, codigoPostal = ?, pais = ?, telefono = ?, email = ?, metrosCuadrados = ?, imagen = ?, activo = ? WHERE idGaleria = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssssssisii", $nombre, $direccion, $ciudad, $codigoPostal, $pais, $telefono, $email, $metrosCuadrados, $imagen, $activo, $idUsuario);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Tipo de usuario no válido"]);
    exit;
}

// Subir los datos del perfil completado
if ($stmt->execute()) {
    // Registrar auditoría
    $oldDataString = json_encode($oldData);
    $newDataString = json_encode([
        "nombre" => $nombre,
        "direccion" => $direccion,
        "ciudad" => $ciudad,
        "codigoPostal" => $codigoPostal,
        "pais" => $pais,
        "telefono" => $telefono,
        "email" => $email,
        "imagen" => $imagen
    ]);

    $sqlAuditoria = "INSERT INTO auditoria (nombreTabla, accion, idRegistro, datosAnteriores, datosNuevos, usuario, fechaHora) VALUES ('$tipo', 'UPDATE', $idUsuario, '$oldDataString', '$newDataString', '$email', NOW())";

    $conn->query($sqlAuditoria);

    echo json_encode(["success" => "Perfil guardado correctamente"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al guardar perfil: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>