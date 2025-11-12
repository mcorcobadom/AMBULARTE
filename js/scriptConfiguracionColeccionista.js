$(function () {
    const idColeccionista = $("#seccionDinamica").data("id-coleccionista")

    cargarPedidosColeccionista(idColeccionista);

    //Guardar los cambios
    //El coleccionista sólo puede modificar la fecha de entrega 
    $(document).on("click", ".modificarPedido", function () {
        const idPedido = $(this).data("id");
        const fechaEntrega = $(this).data("fecha-entrega");

    
        console.log("Datos precargados en el modal:", { idPedido, fechaEntrega }); // Depurar los valores
    
        // Precargar los datos en el formulario del modal
        $("#fechaEntrega").val(fechaEntrega);


    
        // Asignar el ID del pedido al formulario
        $("#formModificarPedido").data("id", idPedido);
    
        // Mostrar el modal
        $("#modalModificarPedido").modal("show");

    });

    //MODIFICAR PEDIDO
    $(document).on("submit", "#formModificarPedido", function (e) {
        e.preventDefault();
    
        const idPedido = $("#formModificarPedido").data("id"); // Capturar el ID del pedido desde el atributo data
        const fechaEntrega = $("#fechaEntrega").val(); // Capturar la fecha de entrega
    
        if (!fechaEntrega) {
            alert("Por favor, completa todos los campos antes de guardar.");
            return;
        }
    
        // Enviar los datos al servidor
        $.ajax({
            url: "php/gestionarPedidos.php",
            type: "POST",
            data: { accion: "modificar", idPedido, fechaEntrega},
            success: function (response) {
                if (response.success) {
                    alert("Pedido modificado correctamente");
                    $("#modalModificarPedido").modal("hide");
                    location.reload(); // Recargar la página completa
                    cargarPedidosColeccionista(idColeccionista); // Recargar los datos
                } else {
                    console.error("Error al modificar el pedido:", response.error);
                    alert("No se pudo modificar el pedido: " + response.error);
                }
            },
            error: function () {
                console.error("Error en la solicitud AJAX");
                alert("Error al intentar modificar el pedido.");
            }
        });
    });

    // ELIMINAR PEDIDO
    $(document).on("click", ".eliminarPedido", function () {
        const idPedido = $(this).data("id"); // Obtener el ID del pedido desde el botón
        eliminarPedido(idPedido); // Llamar a la función para eliminar el pedido
    });       
})

function cargarPedidosColeccionista(idColeccionista) {
    $.ajax({
        url: "php/gestionarPedidos.php",
        type: "POST",
        data: { accion: "listar", idColeccionista },
        success: function (response) {
            const contenedorPedidos = $("#listaPedidos");
            contenedorPedidos.empty();

            if (response.success) {
                const pedidos = response.pedidos;

                let acordeonHTML = `<div class="accordion" id="accordionPedidos">`;

                Object.values(pedidos).forEach(pedido => {
                    const obrasHTML = pedido.obras.map(obra => `
                        <div class="d-flex align-items-center mb-3">
                            <img src="images/Obras/${obra.imagenObra}" alt="${obra.nombreObra}" class="img-thumbnail me-3" style="width: 100px; height: 100px;">
                            <div>
                                <p><strong>${obra.nombreObra}</strong></p>
                                <p>Precio: ${parseFloat(obra.precioObra).toFixed(2)} €</p>
                            </div>
                        </div>
                    `).join("");

                    acordeonHTML += `
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="heading${pedido.idPedido}">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${pedido.idPedido}" aria-expanded="false" aria-controls="collapse${pedido.idPedido}">
                                    Pedido #${pedido.idPedido} - ${pedido.fechaPedido}
                                </button>
                            </h2>
                            <div id="collapse${pedido.idPedido}" class="accordion-collapse collapse" aria-labelledby="heading${pedido.idPedido}" data-bs-parent="#accordionPedidos">
                                <div class="accordion-body">
                                    <p><strong>Fecha de entrega:</strong> ${pedido.fechaEntrega || "Pendiente"}</p>
                                    <p><strong>Total:</strong> ${pedido.total} €</p>
                                    <p><strong>Método de pago:</strong> ${pedido.metodoPago}</p>
                                    <p><strong>Pagado:</strong> ${pedido.pagado ? "Sí" : "No"}</p>
                                    <hr>
                                    ${obrasHTML}
                                    <button class="btnMod modificarPedido" 
                                        data-id="${pedido.idPedido}" 
                                        data-fecha-entrega="${pedido.fechaEntrega}">
                                        <i class="bi bi-pencil me-2"></i>Modificar
                                    </button>
                                    <button class="btnDel eliminarPedido" data-id="${pedido.idPedido}"><i class="bi bi-trash3 me-2"></i>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    `;
                });

                acordeonHTML += `</div>`;
                contenedorPedidos.append(acordeonHTML);
            } else {
                contenedorPedidos.append("<p>No se encontraron pedidos.</p>");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error al cargar los pedidos:", textStatus, errorThrown);
        }
    });
}

function eliminarPedido(idPedido) {
    if (confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
        $.ajax({
            url: "php/gestionarPedidos.php",
            type: "POST",
            data: { accion: "eliminar", idPedido },
            success: function (response) {
                if (response.success) {
                    alert("Pedido eliminado correctamente");
                    location.reload();
                } else {
                    console.error("Error al eliminar el pedido:", response.error);
                    alert("No se pudo eliminar el pedido: " + response.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error en la solicitud AJAX:", textStatus, errorThrown);
                alert("Error al intentar eliminar el pedido.");
            }
        });
    }
}