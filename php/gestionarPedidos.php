<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

try {
     // Verificar si se envió la acción
    if (!isset($_POST['accion'])) {
        throw new Exception("No se especificó la acción a realizar");
    }

    $accion = $_POST['accion'];

    if ($accion == 'modificar') {
        // Modificar un pedido
        if (!isset($_POST['idPedido'], $_POST['fechaEntrega'])) {
            throw new Exception("Faltan datos para modificar el pedido");
        }

        $idPedido = (int) $_POST['idPedido'];
        $fechaEntrega = $_POST['fechaEntrega'];

        error_log("Datos recibidos: idPedido = $idPedido, fechaEntrega = $fechaEntrega");

        // Actualizar la fecha de entrega en la tabla pedidos
        $sqlPedidos = "UPDATE pedidos SET fechaEntrega = ? WHERE idPedido = ?";
        $stmtPedidos = $conn->prepare($sqlPedidos);
        if (!$stmtPedidos) {
            throw new Exception("Error al preparar la consulta SQL para pedidos: " . $conn->error);
        }
        $stmtPedidos->bind_param("si", $fechaEntrega, $idPedido);
        $stmtPedidos->execute();


        echo json_encode(["success" => true]);
    } elseif ($accion == 'eliminar') {
        // Eliminar un pedido
        if (!isset($_POST['idPedido'])) {
            throw new Exception("No se especificó el ID del pedido");
        }

        $idPedido = (int) $_POST['idPedido'];

        $sql = "DELETE FROM pedidos WHERE idPedido = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta SQL: " . $conn->error);
        }

        $stmt->bind_param("i", $idPedido);
        $stmt->execute();

        echo json_encode(["success" => true]);
    } elseif ($accion == 'listar') {
        // Listar pedidos del coleccionista
        if (!isset($_POST['idColeccionista'])) {
            throw new Exception("No se especificó el ID del coleccionista");
        }

        $idColeccionista = (int) $_POST['idColeccionista'];

        $sql = "SELECT 
                    p.idPedido, 
                    p.fechaPedido, 
                    p.fechaEntrega, 
                    p.total, 
                    p.metodoPago, 
                    p.pagado, 
                    d.idObra, 
                    d.precioObra, 
                    o.nombre AS nombreObra, 
                    o.imagen AS imagenObra 
                FROM pedidos p
                INNER JOIN detallesPedidos d ON p.idPedido = d.idPedido
                INNER JOIN obras o ON d.idObra = o.idObra
                WHERE p.idColeccionista = ?
                ORDER BY p.fechaPedido DESC";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta SQL: " . $conn->error);
        }

        $stmt->bind_param("i", $idColeccionista);
        $stmt->execute();
        $result = $stmt->get_result();

        $pedidos = [];
        while ($row = $result->fetch_assoc()) {
            $idPedido = $row['idPedido'];
            if (!isset($pedidos[$idPedido])) {
                $pedidos[$idPedido] = [
                    "idPedido" => $idPedido,
                    "fechaPedido" => $row['fechaPedido'],
                    "fechaEntrega" => $row['fechaEntrega'],
                    "total" => $row['total'],
                    "metodoPago" => $row['metodoPago'],
                    "pagado" => $row['pagado'],
                    "obras" => []
                ];
            }
            $pedidos[$idPedido]["obras"][] = [
                "idObra" => $row['idObra'],
                "nombreObra" => $row['nombreObra'],
                "imagenObra" => $row['imagenObra'],
                "precioObra" => $row['precioObra'],
            ];
        }

        echo json_encode(["success" => true, "pedidos" => $pedidos]);
    } else {
        throw new Exception("Acción no válida");
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
} finally {
    if (isset($conn) && $conn) {
        $conn->close();
    }
}
?>