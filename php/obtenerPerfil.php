<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

if (!isset($_POST['idUsuario']) || !isset($_POST['tipo'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos requeridos"]);
    exit;
}

$idUsuario = $_POST['idUsuario'];
$tipo = $_POST['tipo'];

if($tipo){
    switch ($tipo) {
        case "artista":
            $sql = "SELECT nombre, apellidos, genero, fechaNacimiento, direccion, ciudad, codigoPostal, pais, telefono, imagen FROM artistas WHERE idArtista = ?";
            break;
        case "coleccionista":
            $sql = "SELECT nombre, apellidos, genero, direccion, ciudad, codigoPostal, pais, telefono, imagen FROM coleccionistas WHERE idColeccionista = ?";
            break;
        case "galeria":
            $sql = "SELECT nombre, direccion, ciudad, codigoPostal, pais, telefono, metrosCuadrados, imagen FROM galerias WHERE idGaleria = ?";
            break;
        case "admin":
            echo json_encode([
                "success" => true,
                "data" => [
                    "nombre" => "admin",
                    "imagen" => "perfilAdminDefecto.png", 
                    "email" => "admin@ambularte.com"
                ]
            ]);
            exit;
        default:
            http_response_code(400);
            echo json_encode(["error" => "Tipo de usuario no válido"]);
            exit;
    }
}


$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $idUsuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    $data['tipo'] = $tipo; //Incluir tipo para precargarDatosPerfil
    echo json_encode(["success" => true, "data" => $data]);
} else {
    echo json_encode(["error" => "No se encontraron datos para este usuario"]);
}

$stmt->close();
$conn->close();
?>