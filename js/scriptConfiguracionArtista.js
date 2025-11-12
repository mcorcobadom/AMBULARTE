$(function () {
    const idArtista = $("#seccionDinamica").data("id-artista")
    cargarObrasArtista(idArtista)

    // Mostrar el modal para añadir una nueva obra
    $(document).on("click", "#addObra", function () {
        $("#modalAddObra").modal("show")
    });

    // Enviar los datos del formulario para añadir una obra nueva
    $(document).on("submit", "#formAddObra", function (e) {
        e.preventDefault();
    
        const formData = new FormData(this);
    
        // Agregar dinámicamente el idArtista
        const idArtista = $("#seccionDinamica").data("id-artista"); 
        formData.append("idArtista", idArtista);
    
        // Depuración: Verificar los datos enviados
        console.log("Datos enviados:", [...formData.entries()]);
    
        $.ajax({
            url: "php/addObra.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log("Respuesta del servidor:", response);
                if (response.success) {
                    alert("Obra añadida correctamente.");
                    location.reload();
                } else {
                    alert("Error al añadir la obra: " + response.error);
                }
            },
            error: function (xhr) {
                console.error("Error en la solicitud AJAX:", xhr.responseText);
                alert("Error al intentar añadir la obra: " + xhr.responseText);
            }
        });
    });

    $(document).on("click", ".modificarObra", function () {
        const idObra = $(this).data("id");
        console.log("Id obra", idObra);
    
        // Asignar el ID de la obra al formulario del modal
        $("#formModificarObra").data("id", idObra);
    
        modificarObra(idObra);
    }); 

    $(document).on("submit", "#formModificarObra", function (e) {
        e.preventDefault();

        // Agregar dinámicamente el idArtista
        const idArtista = $("#seccionDinamica").data("id-artista"); 
                
    
        const formData = new FormData(this);
        formData.append("idObra", $("#formModificarObra").data("id")); 
        formData.append("idArtista", idArtista);

        console.log("Datos enviados:", [...formData.entries()]);
    
        $.ajax({
            url: "php/modificarObra.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    alert("Obra actualizada correctamente");
                    $("#modalModificarObra").modal("hide");
                    location.reload(); // Recargar la lista de obras
                } else {
                    console.error("Error al actualizar la obra:", response.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error en la solicitud AJAX:", textStatus, errorThrown);
                console.log("Respuesta del servidor:", jqXHR.responseText);
            }
        });
    });

    $(document).on("click", ".eliminarObra", function () {
        const idObra = $(this).data("id");
    
        if (confirm("¿Estás seguro de que deseas eliminar esta obra?")) {
            $.ajax({
                url: "php/eliminarObra.php",
                type: "POST",
                data: { idObra: idObra },
                success: function (response) {
                    if (response.success) {
                        alert("Obra eliminada correctamente");
                        location.reload(); // Recargar la lista de obras
                    } else {
                        console.error("Error al eliminar la obra:", response.error);
                        alert("No se pudo eliminar la obra: " + response.error);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error en la solicitud AJAX:", textStatus, errorThrown);
                    alert("Error al intentar eliminar la obra.");
                }
            });
        }
    });
})

function cargarObrasArtista(idArtista){
    $.ajax({
        url: "php/obtenerObrasArtista.php",
        type: "POST",
        data: { idArtista: idArtista },
        dataType: "json",
        success: function (response) {
            if (response.success) {
                const obras = response.obras;
                const listaObras = $("#listaObras");
                listaObras.empty();

                obras.forEach((obra) => {
                    const obraHTML = `
                        <div class="col-md-3">
                            <div class="card">
                                <img src="images/Obras/${obra.imagenObra}" class="card-img-top imgObra" alt="${obra.nombreObra}">
                                <div class="card-body">
                                    <h5 class="card-title">${obra.nombreObra}</h5>
                                    <p class="card-text"><strong>Tipo:</strong> ${obra.tipo}</p>
                                    <p class="card-text"><strong>Precio:</strong> ${obra.precioVenta} €</p>
                                    <button class="modificarObra btnMod" data-id="${obra.idObra}"><i class="bi bi-pencil me-2"></i>Modificar</button>
                                    <button class="eliminarObra btnDel" data-id="${obra.idObra}"><i class="bi bi-trash3 me-2"></i>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    `;
                    listaObras.append(obraHTML);
                });
            } else {
                console.error("Error al cargar las obras:", response.error);
            }
        },
        error: function () {
            console.error("Error en la solicitud AJAX");
        }
    });
}

function modificarObra(idObra) {
    $.ajax({
        url: "php/obtenerObraPorId.php",
        type: "POST",
        data: { idObra: idObra },
        dataType: "json",
        success: function (response) {
            console.log("Respuesta del servidor:", response); // Inspeccionar la respuesta

            if (response.success) {
                const obra = response.data;

                // Precargar los datos en el formulario
                $("#nombreObraModificar").val(obra.nombreObra);
                $("#anioObraModificar").val(obra.anio);
                $("#selectTipoObraModificar").val(obra.tipo);
                $("#tecnicaObraModificar").val(obra.tecnica);
                $("#dimensionesObraModificar").val(obra.dimensiones);
                $("#precioVentaModificar").val(obra.precioVenta);
                $("#selectCategoria").val(obra.categoria);

                // Mostrar el modal
                $("#modalModificarObra").modal("show");
            } else {
                console.error("Error al obtener los datos de la obra:", response.error);
            }
        },
        error: function () {
            console.error("Error en la solicitud AJAX");
        }
    });
}
