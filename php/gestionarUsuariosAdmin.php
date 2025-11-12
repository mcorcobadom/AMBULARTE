<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

// Verificar conexión a la base de datos
if (!$conn) {
    echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos: " . mysqli_connect_error()]);
    exit;
}

try {
    // Verificar que se envió la acción
    if (!isset($_POST['accion'])) {
        throw new Exception("No se especificó ninguna acción");
    }

    $accion = $_POST['accion'];

    if ($accion == "listar") {
        if (!isset($_POST['tipo']) || empty($_POST['tipo'])) {
            throw new Exception("Faltan datos obligatorios");
        }
    
        $tipo = $_POST['tipo'];
    
        if ($tipo == "artista") {
            $sql = "SELECT * FROM artistas";
        } elseif ($tipo == "galeria") {
            $sql = "SELECT * FROM galerias";
        } elseif ($tipo == "coleccionista") {
            $sql = "SELECT * FROM coleccionistas";
        } else {
            throw new Exception("Tipo de usuario no válido");
        }
    
        $result = $conn->query($sql);
    
        if ($result == false) {
            throw new Exception("Error en la consulta SQL: " . $conn->error);
        }
        
        if ($result->num_rows > 0) {
            $datos = [];
    
            while ($row = $result->fetch_assoc()) {
                $datos[] = $row;
            }
        
            echo json_encode([
                "success" => true,
                "data" => $datos,
                "total" => count($datos)
            ]);
        } else {
            echo json_encode([
                "success" => false, 
                "error" => "No se encontraron registros",
                "sql_executed" => $sql
            ]);
        }
    }elseif ($accion == "obtener") {
        if (!isset($_POST['idUsuario']) || empty($_POST['idUsuario']) || !isset($_POST['tipo']) || empty($_POST['tipo'])) {
            throw new Exception("Faltan datos obligatorios");
        }
    
        $idUsuario = $_POST['idUsuario'];
        $tipo = $_POST['tipo'];
    
        // Consultar la tabla correspondiente según el tipo
        if ($tipo == "artista") {
            $sql = "SELECT * FROM artistas WHERE idArtista = ?";
        } elseif ($tipo == "galeria") {
            $sql = "SELECT * FROM galerias WHERE idGaleria = ?";
        } elseif ($tipo == "coleccionista") {
            $sql = "SELECT * FROM coleccionistas WHERE idColeccionista = ?";
        } else {
            throw new Exception("Tipo de usuario no válido");
        }
    
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $idUsuario);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($result->num_rows > 0) {
            $usuario = $result->fetch_assoc();
            echo json_encode(["success" => true, "data" => $usuario]);
        } else {
            echo json_encode(["success" => false, "error" => "Usuario no encontrado"]);
        }
    
        $stmt->close();
    }
    elseif ($accion == "añadir") {
        // Validar los datos necesarios
        if (!isset($_POST['email']) || empty($_POST['email']) ||
            !isset($_POST['contrasena']) || empty($_POST['contrasena']) ||
            !isset($_POST['tipo']) || empty($_POST['tipo'])) {
            throw new Exception("Faltan datos obligatorios");
        }

        $email = $_POST['email'];
        $contrasena = password_hash($_POST['contrasena'], PASSWORD_BCRYPT); // Encriptar la contraseña
        $tipo = $_POST['tipo']; // Puede ser 'artista', 'coleccionista' o 'galeria'

        // Validar el tipo de usuario
        if (!in_array($tipo, ['artista', 'coleccionista', 'galeria'])) {
            throw new Exception("Tipo de usuario no válido");
        }

        // Comprobar si el email ya existe
        $sqlCheck = "SELECT idUsuario FROM usuarios WHERE email = ?";
        $stmtCheck = $conn->prepare($sqlCheck);
        $stmtCheck->bind_param("s", $email);
        $stmtCheck->execute();
        $stmtCheck->store_result();

        if ($stmtCheck->num_rows > 0) {
            throw new Exception("Ya existe un usuario con ese email");
        }
        $stmtCheck->close();

        // Insertar el usuario en la tabla `usuarios`
        $sqlUsuario = "INSERT INTO usuarios (email, contrasena, tipo) VALUES (?, ?, ?)";
        $stmtUsuario = $conn->prepare($sqlUsuario);
        $stmtUsuario->bind_param("sss", $email, $contrasena, $tipo);

        if ($stmtUsuario->execute()) {
            $idUsuario = $stmtUsuario->insert_id; // Obtener el ID del usuario recién creado

            // Insertar en la tabla correspondiente según el tipo
            if ($tipo == "artista") {
                $sqlPerfil = "INSERT INTO artistas (idArtista, nombre, apellidos, genero, fechaNacimiento, direccion, ciudad, codigoPostal, pais, telefono, email) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $stmtPerfil = $conn->prepare($sqlPerfil);
                $stmtPerfil->bind_param("issssssssss", $idUsuario, $_POST['nombre'], $_POST['apellidos'], $_POST['genero'], $_POST['fechaNacimiento'], $_POST['direccion'], $_POST['ciudad'], $_POST['codigoPostal'], $_POST['pais'], $_POST['telefono'], $email);
            } elseif ($tipo == "galeria") {
                $sqlPerfil = "INSERT INTO galerias (idGaleria, nombre, direccion, ciudad, codigoPostal, pais, telefono, email, metrosCuadrados) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $stmtPerfil = $conn->prepare($sqlPerfil);
                $stmtPerfil->bind_param("isssssssi", $idUsuario, $_POST['nombre'], $_POST['direccion'], $_POST['ciudad'], $_POST['codigoPostal'], $_POST['pais'], $_POST['telefono'], $email, $_POST['metrosCuadrados']);
            } elseif ($tipo == "coleccionista") {
                $sqlPerfil = "INSERT INTO coleccionistas (idColeccionista, nombre, apellidos, genero, direccion, ciudad, codigoPostal, pais, telefono, email) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $stmtPerfil = $conn->prepare($sqlPerfil);
                $stmtPerfil->bind_param("isssssssss", $idUsuario, $_POST['nombre'], $_POST['apellidos'], $_POST['genero'], $_POST['direccion'], $_POST['ciudad'], $_POST['codigoPostal'], $_POST['pais'], $_POST['telefono'], $email);
            }

            if ($stmtPerfil->execute()) {
                echo json_encode(["success" => "Usuario y perfil creados correctamente"]);
            } else {
                throw new Exception("Error al crear el perfil: " . $stmtPerfil->error);
            }

            $stmtPerfil->close();
        } else {
            throw new Exception("Error al crear el usuario: " . $stmtUsuario->error);
        }

        $stmtUsuario->close();
    } elseif ($accion == "modificar") {

        // validar los datos necesarios
        if (!isset($_POST['idUsuario']) || empty($_POST['idUsuario']) ||
            !isset($_POST['nombre']) || empty($_POST['nombre']) ||
            !isset($_POST['direccion']) || empty($_POST['direccion']) ||
            !isset($_POST['ciudad']) || empty($_POST['ciudad']) ||
            !isset($_POST['pais']) || empty($_POST['pais']) ||
            !isset($_POST['telefono']) || empty($_POST['telefono']) ||
            !isset($_POST['tipo']) || !in_array($_POST['tipo'], ['artista', 'galeria', 'coleccionista'])) {
            error_log("Faltan datos obligatorios o tipo inválido: " . print_r($_POST, true));
            echo json_encode(["success" => false, "error" => "Faltan datos obligatorios o tipo inválido"]);
            exit;
        }
        
        // Validar campos específicos según el tipo
        if ($_POST['tipo'] == 'artista') {
            if (!isset($_POST['genero']) || empty($_POST['genero']) ||
                !isset($_POST['fechaNacimiento']) || empty($_POST['fechaNacimiento'])) {
                error_log("Faltan datos específicos para artista: " . print_r($_POST, true));
                echo json_encode(["success" => false, "error" => "Faltan datos específicos para artista"]);
                exit;
            }
        } elseif ($_POST['tipo'] == 'coleccionista') {
            if (!isset($_POST['apellidos']) || empty($_POST['apellidos']) ||
                !isset($_POST['genero']) || empty($_POST['genero'])) {
                error_log("Faltan datos específicos para coleccionista: " . print_r($_POST, true));
                echo json_encode(["success" => false, "error" => "Faltan datos específicos para coleccionista"]);
                exit;
            }
        } elseif ($_POST['tipo'] == 'galeria') {
            if (!isset($_POST['metrosCuadrados']) || trim($_POST['metrosCuadrados']) == '') {
                error_log("Faltan datos específicos para galería: " . print_r($_POST, true));
                echo json_encode(["success" => false, "error" => "Faltan datos específicos para galería"]);
                exit;
            }
        }
    
        $idUsuario = $_POST['idUsuario'];
        $tipo = $_POST['tipo'];
        $nombre = $_POST['nombre'];
        $telefono = $_POST['telefono'] ?? null;
        $direccion = $_POST['direccion'] ?? null;
        $ciudad = $_POST['ciudad'] ?? null;
        $pais = $_POST['pais'] ?? null;
        $codigoPostal = $_POST['codigoPostal'] ?? null;
        $genero = $_POST['genero'] ?? null;
        $metrosCuadrados = $_POST['metrosCuadrados'] ?? null;
        $imagen = null;
    
        // Verificar si se envió una nueva imagen
        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] == UPLOAD_ERR_OK) {
            $nombreImagen = $_FILES['imagen']['name'];
            $rutaTemporal = $_FILES['imagen']['tmp_name'];
            $rutaDestino = "../images/Perfil" . $nombreImagen;
        
            // Mover la imagen al directorio de destino
            if (!move_uploaded_file($rutaTemporal, $rutaDestino)) {
                error_log("Error al mover la imagen: $rutaTemporal a $rutaDestino");
                throw new Exception("Error al subir la imagen");
            }
        } else {
            // Si no se envió una nueva imagen, mantener la existente
            $rutaDestino = null;
            error_log("No se subió una nueva imagen, se mantiene la existente.");
        }
    
        // Actualizar los datos en la tabla correspondiente
        if ($tipo == "artista") {
            $sql = "UPDATE artistas SET nombre = ?, apellidos = ?, genero = ?, fechaNacimiento = ?, direccion = ?, ciudad = ?, codigoPostal = ?, pais = ?, telefono = ?";
            if ($rutaDestino) {
                $sql .= ", imagen = ?";
            }
            $sql .= " WHERE idArtista = ?";
            $stmt = $conn->prepare($sql);
    
            if ($rutaDestino) {
                $stmt->bind_param("ssssssssssi", $_POST['nombre'], $_POST['apellidos'], $_POST['genero'], $_POST['fechaNacimiento'], $_POST['direccion'], $_POST['ciudad'], $_POST['codigoPostal'], $_POST['pais'], $_POST['telefono'], $rutaDestino, $idUsuario);
            } else {
                $stmt->bind_param("sssssssssi", $_POST['nombre'], $_POST['apellidos'], $_POST['genero'], $_POST['fechaNacimiento'], $_POST['direccion'], $_POST['ciudad'], $_POST['codigoPostal'], $_POST['pais'], $_POST['telefono'], $idUsuario);
            }
        }

        if ($tipo == "coleccionista") {
            $sql = "UPDATE coleccionistas SET nombre = ?, apellidos = ?, genero = ?, direccion = ?, ciudad = ?, codigoPostal = ?, pais = ?, telefono = ?";
            if ($rutaDestino) {
                $sql .= ", imagen = ?";
            }
            $sql .= " WHERE idColeccionista = ?";
            $stmt = $conn->prepare($sql);
        
            if ($rutaDestino) {
                $stmt->bind_param("sssssssssi", $nombre, $_POST['apellidos'], $genero, $direccion, $ciudad, $codigoPostal, $pais, $telefono, $rutaDestino, $idUsuario);
            } else {
                $stmt->bind_param("ssssssssi", $nombre, $_POST['apellidos'], $genero, $direccion, $ciudad, $codigoPostal, $pais, $telefono, $idUsuario);
            }

        }
        if ($tipo == "galeria") {
            $sql = "UPDATE galerias SET nombre = ?, direccion = ?, ciudad = ?, codigoPostal = ?, pais = ?, telefono = ?, metrosCuadrados = ?";
            if ($rutaDestino) {
                $sql .= ", imagen = ?";
            }
            $sql .= " WHERE idGaleria = ?";
            $stmt = $conn->prepare($sql);
        
            if ($rutaDestino) {
                $stmt->bind_param("ssssssisi", $nombre, $direccion, $ciudad, $codigoPostal, $pais, $telefono, $_POST['metrosCuadrados'], $rutaDestino, $idUsuario);
            } else {
                $stmt->bind_param("ssssssii", $nombre, $direccion, $ciudad, $codigoPostal, $pais, $telefono, $_POST['metrosCuadrados'], $idUsuario);
            }
        }


        if (!$stmt->execute()) {
            error_log("Error en la consulta SQL: " . $stmt->error);
            echo json_encode(["success" => false, "error" => "Error al ejecutar la consulta: " . $stmt->error]);
            exit;
        }
        
        // Verificar si se afectaron filas
        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Usuario modificado correctamente"]);
        } else {
            // Cambiar el mensaje para reflejar que la consulta se ejecutó, pero no hubo cambios visibles
            echo json_encode(["success" => true, "message" => "Usuario modificado correctamente (sin cambios visibles)"]);
        }

        $stmt->close();
    } elseif ($accion == "eliminar") {
        if (!isset($_POST['idUsuario']) || empty($_POST['idUsuario']) ||
            !isset($_POST['tipo']) || !in_array($_POST['tipo'], ['artista', 'galeria', 'coleccionista'])) {
            error_log("Faltan datos obligatorios o tipo inválido: " . print_r($_POST, true));
            echo json_encode(["success" => false, "error" => "Faltan datos obligatorios o tipo inválido"]);
            exit;
        }
    
        $idUsuario = $_POST['idUsuario'];
        $tipo = $_POST['tipo'];
    
        // Verificar si el usuario ya está inactivo
        $sqlVerificar = "SELECT activo FROM usuarios WHERE idUsuario = ?";
        $stmtVerificar = $conn->prepare($sqlVerificar);
        $stmtVerificar->bind_param("i", $idUsuario);
        $stmtVerificar->execute();
        $resultVerificar = $stmtVerificar->get_result();
    
        if ($resultVerificar->num_rows > 0) {
            $usuario = $resultVerificar->fetch_assoc();
            if ($usuario['activo'] == 0) {
                echo json_encode(["success" => false, "error" => "Este usuario está inactivo"]);
                exit;
            }
        } else {
            echo json_encode(["success" => false, "error" => "Usuario no encontrado"]);
            exit;
        }
    
        // Desactivar el usuario en la tabla usuarios
        $sqlUsuarios = "UPDATE usuarios SET activo = 0 WHERE idUsuario = ?";
        $stmtUsuarios = $conn->prepare($sqlUsuarios);
        $stmtUsuarios->bind_param("i", $idUsuario);
    
        if (!$stmtUsuarios->execute()) {
            error_log("Error al desactivar el usuario en la tabla usuarios: " . $stmtUsuarios->error);
            echo json_encode(["success" => false, "error" => "Error al desactivar el usuario"]);
            exit;
        }
    
        // Desactivar el usuario en la tabla específica
        $tabla = $tipo . "s"; // Determinar la tabla (artistas, galerias, coleccionistas)
        $idColumna = "id" . ucfirst($tipo); // Determinar la columna de ID (idArtista, idGaleria, idColeccionista)
    
        $sqlEspecifico = "UPDATE $tabla SET activo = 0 WHERE $idColumna = ?";
        $stmtEspecifico = $conn->prepare($sqlEspecifico);
        $stmtEspecifico->bind_param("i", $idUsuario);
    
        if ($stmtEspecifico->execute()) {
            echo json_encode(["success" => true, "message" => ucfirst($tipo) . " eliminado correctamente"]);
        } else {
            error_log("Error al desactivar el usuario en la tabla $tabla: " . $stmtEspecifico->error);
            echo json_encode(["success" => false, "error" => "Error al desactivar el usuario en la tabla $tabla"]);
        }
    
        $stmtVerificar->close();
        $stmtUsuarios->close();
        $stmtEspecifico->close();
    }elseif ($accion == "eliminar") {
    if (!isset($_POST['idUsuario']) || empty($_POST['idUsuario']) ||
        !isset($_POST['tipo']) || !in_array($_POST['tipo'], ['artista', 'galeria', 'coleccionista'])) {
        error_log("Faltan datos obligatorios o tipo inválido: " . print_r($_POST, true));
        echo json_encode(["success" => false, "error" => "Faltan datos obligatorios o tipo inválido"]);
        exit;
    }

    $idUsuario = $_POST['idUsuario'];
    $tipo = $_POST['tipo'];

    // Verificar si el usuario ya está inactivo
    $sqlVerificar = "SELECT activo FROM usuarios WHERE idUsuario = ?";
    $stmtVerificar = $conn->prepare($sqlVerificar);
    $stmtVerificar->bind_param("i", $idUsuario);
    $stmtVerificar->execute();
    $resultVerificar = $stmtVerificar->get_result();

    if ($resultVerificar->num_rows > 0) {
        $usuario = $resultVerificar->fetch_assoc();
        if ($usuario['activo'] == 0) {
            echo json_encode(["success" => false, "error" => "Este usuario está inactivo"]);
            exit;
        }
    } else {
        echo json_encode(["success" => false, "error" => "Usuario no encontrado"]);
        exit;
    }

    // Desactivar el usuario en la tabla usuarios
    $sqlUsuarios = "UPDATE usuarios SET activo = 0 WHERE idUsuario = ?";
    $stmtUsuarios = $conn->prepare($sqlUsuarios);
    $stmtUsuarios->bind_param("i", $idUsuario);

    if (!$stmtUsuarios->execute()) {
        error_log("Error al desactivar el usuario en la tabla usuarios: " . $stmtUsuarios->error);
        echo json_encode(["success" => false, "error" => "Error al desactivar el usuario"]);
        exit;
    }

    // Desactivar el usuario en la tabla específica
    $tabla = $tipo . "s"; // Determinar la tabla (artistas, galerias, coleccionistas)
    $idColumna = "id" . ucfirst($tipo); // Determinar la columna de ID (idArtista, idGaleria, idColeccionista)

    $sqlEspecifico = "UPDATE $tabla SET activo = 0 WHERE $idColumna = ?";
    $stmtEspecifico = $conn->prepare($sqlEspecifico);
    $stmtEspecifico->bind_param("i", $idUsuario);

    if ($stmtEspecifico->execute()) {
        echo json_encode(["success" => true, "message" => ucfirst($tipo) . " eliminado correctamente"]);
    } else {
        error_log("Error al desactivar el usuario en la tabla $tabla: " . $stmtEspecifico->error);
        echo json_encode(["success" => false, "error" => "Error al desactivar el usuario en la tabla $tabla"]);
    }

    $stmtVerificar->close();
    $stmtUsuarios->close();
    $stmtEspecifico->close();
}elseif ($accion == "reactivar") {
    if (!isset($_POST['idUsuario']) || empty($_POST['idUsuario']) ||
        !isset($_POST['tipo']) || !in_array($_POST['tipo'], ['artista', 'galeria', 'coleccionista'])) {
        error_log("Faltan datos obligatorios o tipo inválido: " . print_r($_POST, true));
        echo json_encode(["success" => false, "error" => "Faltan datos obligatorios o tipo inválido"]);
        exit;
    }

    $idUsuario = $_POST['idUsuario'];
    $tipo = $_POST['tipo'];

    // Verificar si el usuario ya está activo
    $sqlVerificar = "SELECT activo FROM usuarios WHERE idUsuario = ?";
    $stmtVerificar = $conn->prepare($sqlVerificar);
    $stmtVerificar->bind_param("i", $idUsuario);
    $stmtVerificar->execute();
    $resultVerificar = $stmtVerificar->get_result();

    if ($resultVerificar->num_rows > 0) {
        $usuario = $resultVerificar->fetch_assoc();
        if ($usuario['activo'] == 1) {
            echo json_encode(["success" => false, "error" => "Este usuario ya está activo"]);
            exit;
        }
    } else {
        echo json_encode(["success" => false, "error" => "Usuario no encontrado"]);
        exit;
    }

    // Reactivar el usuario en la tabla usuarios
    $sqlUsuarios = "UPDATE usuarios SET activo = 1 WHERE idUsuario = ?";
    $stmtUsuarios = $conn->prepare($sqlUsuarios);
    $stmtUsuarios->bind_param("i", $idUsuario);

    if (!$stmtUsuarios->execute()) {
        error_log("Error al reactivar el usuario en la tabla usuarios: " . $stmtUsuarios->error);
        echo json_encode(["success" => false, "error" => "Error al reactivar el usuario"]);
        exit;
    }

    // Reactivar el usuario en la tabla específica
    $tabla = $tipo . "s"; // Determinar la tabla (artistas, galerias, coleccionistas)
    $idColumna = "id" . ucfirst($tipo); // Determinar la columna de ID (idArtista, idGaleria, idColeccionista)

    $sqlEspecifico = "UPDATE $tabla SET activo = 1 WHERE $idColumna = ?";
    $stmtEspecifico = $conn->prepare($sqlEspecifico);
    $stmtEspecifico->bind_param("i", $idUsuario);

    if ($stmtEspecifico->execute()) {
        echo json_encode(["success" => true, "message" => ucfirst($tipo) . " reactivado correctamente"]);
    } else {
        error_log("Error al reactivar el usuario en la tabla $tabla: " . $stmtEspecifico->error);
        echo json_encode(["success" => false, "error" => "Error al reactivar el usuario en la tabla $tabla"]);
    }

    $stmtVerificar->close();
    $stmtUsuarios->close();
    $stmtEspecifico->close();
}
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>