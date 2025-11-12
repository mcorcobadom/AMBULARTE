<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Verificar la acción solicitada
if (!isset($_POST['accion'])) {
    echo json_encode(["error" => "No se especificó ninguna acción"]);
    exit;
}

$accion = $_POST['accion'];

switch ($accion) {
    case 'añadir':
        // Código para añadir una nueva exposición
        $nombreExposicion = $_POST['nombreExposicion'];
        $zonaExposicion = $_POST['zonaExposicion'];
        $obras = $_POST['obras']; // Obras seleccionadas
        $fechaInicio = $_POST['fechaInicio']; // Fecha de inicio de las obras
        $fechaFin = $_POST['fechaFin']; // Fecha de fin de las obras
        $idGaleria = $_POST['idGaleria']; // ID de la galería
    
        if (empty($nombreExposicion) || empty($zonaExposicion) || empty($idGaleria) || empty($obras)) {
            echo json_encode(["error" => "Faltan datos necesarios para añadir la exposición"]);
            exit;
        }
    
        // Insertar la exposición en la tabla exposiciones
        $sqlExposicion = "INSERT INTO exposiciones (nombre, zona, idGaleria) VALUES (?, ?, ?)";
        $stmtExposicion = $conn->prepare($sqlExposicion);
    
        if (!$stmtExposicion) {
            echo json_encode(["error" => "Error al preparar la consulta para exposiciones: " . $conn->error]);
            exit;
        }
    
        $stmtExposicion->bind_param("ssi", $nombreExposicion, $zonaExposicion, $idGaleria);
    
        if (!$stmtExposicion->execute()) {
            echo json_encode(["error" => "Error al insertar la exposición: " . $stmtExposicion->error]);
            $stmtExposicion->close();
            $conn->close();
            exit;
        }
    
        // Obtener el ID de la exposición recién insertada
        $idExposicion = $stmtExposicion->insert_id;
        $stmtExposicion->close();
    
        // Insertar las obras asociadas en la tabla obras_exposicion
        $sqlObrasExposicion = "INSERT INTO obras_exposicion (idObra, idExposicion, fechaInicio, fechaFin) VALUES (?, ?, ?, ?)";
        $stmtObrasExposicion = $conn->prepare($sqlObrasExposicion);
    
        if (!$stmtObrasExposicion) {
            echo json_encode(["error" => "Error al preparar la consulta para obras_exposicion: " . $conn->error]);
            $conn->close();
            exit;
        }
    
        foreach ($obras as $idObra) {
            $stmtObrasExposicion->bind_param("iiss", $idObra, $idExposicion, $fechaInicio, $fechaFin);
            if (!$stmtObrasExposicion->execute()) {
                echo json_encode(["error" => "Error al insertar la obra en la exposición: " . $stmtObrasExposicion->error]);
                $stmtObrasExposicion->close();
                $conn->close();
                exit;
            }
        }
    
        $stmtObrasExposicion->close();
    
        echo json_encode(["success" => true, "message" => "Exposición añadida correctamente"]);
        break;
        case 'modificar':
            // Verificar si se recibieron los parámetros necesarios
            if (!isset($_POST['idExposicion'], $_POST['nombreExposicion'], $_POST['fechaInicio'], $_POST['fechaFin'])) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan parámetros necesarios"]);
                exit;
            }
        
            // Escapar los datos recibidos para evitar inyección SQL
            $idExposicion = mysqli_real_escape_string($conn, $_POST['idExposicion']);
            $nombreExposicion = mysqli_real_escape_string($conn, $_POST['nombreExposicion']);
            $fechaInicio = mysqli_real_escape_string($conn, $_POST['fechaInicio']);
            $fechaFin = mysqli_real_escape_string($conn, $_POST['fechaFin']);
        
            // Actualizar el nombre de la exposición en la tabla exposiciones
            $sqlNombre = "
                UPDATE exposiciones 
                SET nombre = '$nombreExposicion' 
                WHERE idExposicion = '$idExposicion'
            ";
        
            if (!$conn->query($sqlNombre)) {
                http_response_code(500);
                echo json_encode(["error" => "Error al modificar el nombre de la exposición: " . $conn->error]);
                exit;
            }
        
            // Actualizar las fechas de inicio y fin en la tabla obras_exposicion
            $sqlFechas = "
                UPDATE obras_exposicion 
                SET fechaInicio = '$fechaInicio', fechaFin = '$fechaFin' 
                WHERE idExposicion = '$idExposicion'
            ";
        
            if ($conn->query($sqlFechas)) {
                echo json_encode(["success" => true]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Error al modificar las fechas de la exposición: " . $conn->error]);
            }
            break;
    case 'eliminar':
        // Código para eliminar una exposición
        $idExposicion = $_POST['idExposicion'];

        if (empty($idExposicion)) {
            echo json_encode(["error" => "Faltan datos necesarios para eliminar la exposición"]);
            exit;
        }

        // Eliminar las obras asociadas a la exposición
        $sqlEliminarObras = "DELETE FROM obras_exposicion WHERE idExposicion = ?";
        $stmtEliminarObras = $conn->prepare($sqlEliminarObras);

        if (!$stmtEliminarObras) {
            echo json_encode(["error" => "Error al preparar la consulta para eliminar las obras de la exposición: " . $conn->error]);
            exit;
        }

        $stmtEliminarObras->bind_param("i", $idExposicion);

        if (!$stmtEliminarObras->execute()) {
            echo json_encode(["error" => "Error al eliminar las obras de la exposición: " . $stmtEliminarObras->error]);
            $stmtEliminarObras->close();
            $conn->close();
            exit;
        }

        $stmtEliminarObras->close();

        // Eliminar la exposición
        $sqlEliminarExposicion = "DELETE FROM exposiciones WHERE idExposicion = ?";
        $stmtEliminarExposicion = $conn->prepare($sqlEliminarExposicion);

        if (!$stmtEliminarExposicion) {
            echo json_encode(["error" => "Error al preparar la consulta para eliminar la exposición: " . $conn->error]);
            exit;
        }

        $stmtEliminarExposicion->bind_param("i", $idExposicion);

        if ($stmtEliminarExposicion->execute()) {
            echo json_encode(["success" => true, "message" => "Exposición eliminada correctamente"]);
        } else {
            echo json_encode(["error" => "Error al eliminar la exposición: " . $stmtEliminarExposicion->error]);
        }

        $stmtEliminarExposicion->close();
        break;

    default:
        echo json_encode(["error" => "Acción no válida"]);
        break;

}

$conn->close();
?>