<?php
header('Content-Type: application/json');

// Incluir configuración de base de datos
require_once 'config.php';

try {

    // Verificar si se enviaron los datos necesarios
    if (!isset($_POST['carrito'], $_POST['metodoPago'], $_POST['idColeccionista'])) {
        throw new Exception("Faltan datos necesarios para completar la compra");
    }

    $idColeccionista = $_POST['idColeccionista'];

    if (empty($idColeccionista)) {
        throw new Exception("El ID del coleccionista no puede estar vacío");
    }

    $carrito = json_decode($_POST['carrito'], true);
    $metodoPago = $_POST['metodoPago'];
    $observaciones = isset($_POST['observaciones']) ? $_POST['observaciones'] : "Sin observaciones";

    if (!$carrito || !is_array($carrito)) {
        throw new Exception("El carrito está vacío o mal formateado");
    }

    // Crear el pedido en la tabla pedidos
    $fechaPedido = date("Y-m-d");
    $fechaEntrega = isset($_POST['fechaEntrega']) ? $_POST['fechaEntrega'] : null;
    $total = array_reduce($carrito, function ($sum, $obra) {
        return $sum + $obra['precioVenta'];
    }, 0);

    $sqlPedido = "INSERT INTO pedidos (fechaPedido, fechaEntrega, total, metodoPago, pagado, idColeccionista) VALUES (?, ?, ?, ?, 0, ?)";
    $stmtPedido = $conn->prepare($sqlPedido);

    if (!$stmtPedido) {
        throw new Exception("Error al preparar la consulta para pedidos: " . $conn->error);
    }

    $stmtPedido->bind_param("ssdsi", $fechaPedido, $fechaEntrega, $total, $metodoPago, $idColeccionista);

    if (!$stmtPedido->execute()) {
        throw new Exception("Error al insertar en pedidos: " . $stmtPedido->error);
    }

    $idPedido = $stmtPedido->insert_id; // Obtener el ID del pedido recién creado
    $stmtPedido->close();

    // Procesar cada obra en el carrito
    foreach ($carrito as $obra) {
        if (!isset($obra['idObra'], $obra['precioVenta'])) {
            throw new Exception("Datos incompletos en el carrito");
        }

        $idObra = $obra['idObra'];
        $precioVenta = $obra['precioVenta'];

        // Insertar en la tabla detallesPedidos
        $sqlDetalles = "INSERT INTO detallesPedidos (idPedido, idObra, precioObra, observaciones) VALUES (?, ?, ?, ?)";
        $stmtDetalles = $conn->prepare($sqlDetalles);

        if (!$stmtDetalles) {
            throw new Exception("Error al preparar la consulta para detallesPedidos: " . $conn->error);
        }

        $stmtDetalles->bind_param("iids", $idPedido, $idObra, $precioVenta, $observaciones);

        if (!$stmtDetalles->execute()) {
            throw new Exception("Error al insertar en detallesPedidos: " . $stmtDetalles->error);
        }

        $stmtDetalles->close();

        // Actualizar el estado de la obra a "vendida"
        $sqlActualizarObra = "UPDATE obras SET vendida = 1 WHERE idObra = ?";
        $stmtActualizarObra = $conn->prepare($sqlActualizarObra);

        if (!$stmtActualizarObra) {
            throw new Exception("Error al preparar la consulta para actualizar obras: " . $conn->error);
        }

        $stmtActualizarObra->bind_param("i", $idObra);

        if (!$stmtActualizarObra->execute()) {
            throw new Exception("Error al actualizar el estado de la obra: " . $stmtActualizarObra->error);
        }

        $stmtActualizarObra->close();
    }

    // Actualizar el estado del pedido a "pagado"
    $sqlActualizarPedido = "UPDATE pedidos SET pagado = 1 WHERE idPedido = ?";
    $stmtActualizarPedido = $conn->prepare($sqlActualizarPedido);

    if (!$stmtActualizarPedido) {
        throw new Exception("Error al preparar la consulta para actualizar el pedido: " . $conn->error);
    }

    $stmtActualizarPedido->bind_param("i", $idPedido);

    if (!$stmtActualizarPedido->execute()) {
        throw new Exception("Error al actualizar el estado del pedido: " . $stmtActualizarPedido->error);
    }

    $stmtActualizarPedido->close();

    // Respuesta exitosa
    echo json_encode(["success" => true, "idPedido" => $idPedido]);

} catch (Exception $e) {
    // Manejo de errores
    echo json_encode(["error" => $e->getMessage()]);
} finally {
    // Cerrar la conexión
    if (isset($conn) && $conn) {
        $conn->close();
    }
}
?>