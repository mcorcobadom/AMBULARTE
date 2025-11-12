$(function () {

    const idGaleria = $("#seccionDinamica").data("id-galeria");

    cargarExposiciones(idGaleria);

    // Evento para abrir el modal de añadir exposición
    $(document).on("click", "#addExposicion", function () {
        $("#modalNuevaExposicion").modal("show");
        cargarObrasDisponibles();
    });

    // Evento para guardar una nueva exposición
    $(document).on("click", "#guardarExposicion", function () {
        const nombreExposicion = $("#nombreExposicion").val();
        const zonaExposicion = $("#zonaExposicion").val();
        const fechaInicio = $("#fechaInicio").val();
        const fechaFin = $("#fechaFin").val();
        const idGaleria = $("#seccionDinamica").data("id-galeria"); // Obtener el ID de la galería
        const obrasSeleccionadas = [];

        // Recopilar las obras seleccionadas
        $(".seleccionarObra:checked").each(function () {
            obrasSeleccionadas.push($(this).val());
        });

        if (!nombreExposicion || !zonaExposicion || !fechaInicio || !fechaFin) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        if (obrasSeleccionadas.length == 0) {
            alert("Por favor, selecciona al menos una obra.");
            return;
        }

        // Enviar los datos al servidor
        $.ajax({
            url: "php/gestionarExposiciones.php",
            type: "POST",
            data: {
                accion: "añadir",
                nombreExposicion: nombreExposicion,
                zonaExposicion: zonaExposicion,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                idGaleria: idGaleria,
                obras: obrasSeleccionadas
            },
            success: function (response) {
                if (response.success) {
                    alert("Exposición creada correctamente.");
                    $("#modalNuevaExposicion").modal("hide");
                    cargarExposiciones($("#seccionDinamica").data("id-galeria")); // Recargar exposiciones
                } else {
                    alert("Error al crear la exposición: " + response.error);
                }
            },
            error: function (xhr) {
                console.error("Error al crear la exposición:", xhr.responseText);
                alert("Error al crear la exposición.");
            }
        });
    });

    // Evento para eliminar una obra de la exposición
    $(document).on("click", ".eliminarObra", function () {
        const idObra = $(this).data("id");
        const idExposicion = $(this).data("id-exposicion");

        $.ajax({
            url: "php/eliminarObraExposicion.php",
            type: "POST",
            data: { idObra: idObra, idExposicion: idExposicion },
            success: function (response) {
                if (response.success) {
                    alert("Obra eliminada correctamente.");
                    cargarExposiciones($("#seccionDinamica").data("id-galeria")); // Recargar exposiciones
                } else {
                    alert("Error al eliminar la obra: " + response.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al eliminar la obra:", textStatus, errorThrown);
            }
        });
    });

    // Evento para añadir una obra a la exposición
    $(document).on("click", ".addObras", function () {
        const idExposicion = $(this).data("id-exposicion");
        console.log("ID de la exposición:", idExposicion); // Depuración
        $("#confirmarSeleccionObras").data("id-exposicion", idExposicion); // Guardar el ID de la exposición en el botón de confirmación
        cargarObrasDisponibles(); // Cargar las obras disponibles
        $("#modalSeleccionarObras").modal("show"); // Mostrar el modal
    });

    // hacer que al clickear la tarjeta se marque/desmarque la checkbox
    $(document).on('click', '.obra-card', function (e) {
        // evitar que el click sobre el checkbox dispare doble toggle
        if ($(e.target).is('input[type="checkbox"]') || $(e.target).is('label')) return;
        const checkbox = $(this).find('.seleccionarObra');
        checkbox.prop('checked', !checkbox.prop('checked'));
    });

    // Evento para confirmar la selección de obras
    $(document).on("click", "#confirmarSeleccionObras", function () {
        const idExposicion = $(this).data("id-exposicion");
        const obrasSeleccionadas = [];

        // Recopilar las obras seleccionadas
        $(".seleccionarObra:checked").each(function () {
            obrasSeleccionadas.push($(this).val());
        });

        console.log("Obras seleccionadas:", obrasSeleccionadas); // Depuración

        if (obrasSeleccionadas.length == 0) {
            alert("Por favor, selecciona al menos una obra.");
            return;
        }

        // Extraer las fechas de inicio y fin del botón de añadir obras
        let fechaInicio = $(`.addObras[data-id-exposicion="${idExposicion}"]`).data("fecha-inicio");
        let fechaFin = $(`.addObras[data-id-exposicion="${idExposicion}"]`).data("fecha-fin");


        // Formatear las fechas al formato YYYY-MM-DD
        fechaInicio = formatearFecha(fechaInicio);
        fechaFin = formatearFecha(fechaFin);

        if (!fechaInicio || !fechaFin) {
            alert("No se encontraron las fechas de inicio y fin para esta exposición.");
            return;
        }

        // Enviar las obras seleccionadas al servidor
        $.ajax({
            url: "php/addObrasExposicion.php",
            type: "POST",
            data: { idExposicion: idExposicion, obras: obrasSeleccionadas, fechaInicio: fechaInicio, fechaFin: fechaFin },
            success: function (response) {
                if (response.success) {
                    alert("Obras añadidas correctamente.");
                    $("#modalSeleccionarObras").modal("hide");
                    cargarExposiciones($("#seccionDinamica").data("id-galeria")); // Recargar exposiciones
                } else {
                    alert("Error al añadir las obras: " + response.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al añadir las obras:", textStatus, errorThrown);
            }
        });
    });

    // Evento para abrir el modal de modificar exposición
    $(document).on("click", ".modificarExposicion", function () {
        const idExposicion = $(this).data("id");
        const nombreExposicion = $(this).data("nombre");
        const fechaInicio = $(this).data("fecha-inicio");
        const fechaFin = $(this).data("fecha-fin");

        $("#idExposicionModificar").val(idExposicion);
        $("#nombreExposicionModificar").val(nombreExposicion);
        $("#fechaInicioModificar").val(fechaInicio);
        $("#fechaFinModificar").val(fechaFin);

        $("#modalModificarExposicion").modal("show");
    });

    // Evento para confirmar la modificación de la exposición
    $(document).on("click", "#confirmarModificarExposicion", function () {
        const idExposicion = $("#idExposicionModificar").val();
        const nombreExposicion = $("#nombreExposicionModificar").val();
        const fechaInicio = $("#fechaInicioModificar").val();
        const fechaFin = $("#fechaFinModificar").val();

        $.ajax({
            url: "php/gestionarExposiciones.php",
            type: "POST",
            data: {
                accion: "modificar",
                idExposicion: idExposicion,
                nombreExposicion: nombreExposicion,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin
            },
            success: function (response) {
                if (response.success) {
                    alert("Exposición modificada correctamente.");
                    $("#modalModificarExposicion").modal("hide");
                    cargarExposiciones($("#seccionDinamica").data("id-galeria")); // Recargar exposiciones
                } else {
                    alert("Error al modificar la exposición: " + response.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al modificar la exposición:", textStatus, errorThrown);
            }
        });
    });

    // Evento para eliminar una exposición
    $(document).on("click", ".eliminarExposicion", function () {
        const idExposicion = $(this).data("id-exposicion");

        if (!idExposicion) {
            alert("No se pudo identificar la exposición a eliminar.");
            return;
        }

        if (!confirm("¿Estás seguro de que deseas eliminar esta exposición?")) {
            return;
        }

        $.ajax({
            url: "php/gestionarExposiciones.php",
            type: "POST",
            data: { accion: "eliminar", idExposicion: idExposicion },
            success: function (response) {
                if (response.success) {
                    alert("Exposición eliminada correctamente.");
                    cargarExposiciones($("#seccionDinamica").data("id-galeria")); // Recargar exposiciones
                } else {
                    alert("Error al eliminar la exposición: " + response.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al eliminar la exposición:", textStatus, errorThrown);
            }
        });
    });

});


function cargarObrasDisponibles() {
    $.ajax({
        url: "php/cargarObrasDisponibles.php",
        type: "GET",
        dataType: "json",
        success: function (response) {
            console.log("Respuesta del servidor:", response); // Depuración
            if (response.success) {
                const obras = response.obras;
                let html = '<div class="row g-3">';

                obras.forEach(obra => {
                    const imagen = obra.imagenObra ? `images/Obras/${obra.imagenObra}` : 'images/Obras/placeholder.png';

                    html += `
                            <div class="col-12 col-md-6 col-lg-4">
                                <div class="card h-100 obra-card">
                                    <div class="row g-0 align-items-center">
                                        <div class="col-auto p-2">
                                            <img src="${imagen}" alt="${obra.nombreObra}" class="img-thumbnail obra-thumb" style="width:96px; height:96px; object-fit:cover;">
                                        </div>
                                        <div class="col">
                                            <div class="card-body py-2 px-2">
                                                <h6 class="card-title mb-1">${obra.nombreObra}</h6>
                                                <p class="card-text small text-muted mb-1">${obra.nombreArtista} ${obra.apellidosArtista}</p>
                                                <div class="form-check">
                                                    <input class="seleccionarObra form-check-input" type="checkbox" value="${obra.idObra}" id="obra_${obra.idObra}">
                                                    <label class="form-check-label small" for="obra_${obra.idObra}">Seleccionar</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                });

                html += '</div>';
                $(".listaObras").html(html);
            } else {
                alert("No se pudieron cargar las obras: " + response.error);
            }
        },
        error: function (xhr) {
            console.error("Error en la solicitud AJAX:", xhr.responseText);
            alert("Error al cargar las obras.");
        }
    });
}

// Función para cargar las exposiciones de la galería logueada
function cargarExposiciones(idGaleria) {
    $.ajax({
        url: "php/cargarExposicionesGaleria.php",
        type: "GET",
        data: { idGaleria: idGaleria },
        success: function (response) {
            const listaExposiciones = $("#listaExposiciones");
            listaExposiciones.empty(); // Limpiar el contenedor antes de añadir nuevas exposiciones

            if (response.success) {
                if (response.data.length == 0) {
                    listaExposiciones.append("<p>No hay exposiciones activas para esta galería.</p>");
                    return;
                }

                response.data.forEach(exposicion => {
                    let obrasHTML = "";

                    if (exposicion.obras.length == 0) {
                        // Mostrar mensaje si no hay obras asociadas
                        obrasHTML = `
                            <div class="alert alertaError" role="alert">
                                No existen obras todavía, añade obras.
                            </div>
                        `;
                    } else {
                        // Generar HTML para las obras asociadas
                        exposicion.obras.forEach(obra => {
                            obrasHTML += `
                                <div class="card bg-light mb-3">
                                    <div class='row'>
                                        <div class='col-md-2 justify-content-center'>
                                            ${obra.imagenObra ?
                                    `<img class='img-fluid rounded' src="images/Obras/${obra.imagenObra}" alt="${obra.nombreObra}" width='250px' height='250px'>`
                                    : `<p class="text-muted">Sin imagen disponible</p>`}
                                        </div>
                                        <div class='col-md-10'>
                                            <div class="card-body d-flex justify-content-between align-items-center">
                                                <div class="p-3">
                                                    <h5 class='card-title'>${obra.nombreObra}</h5>
                                                    <p class="card-text"><strong>Artista:</strong> ${obra.nombreArtista} ${obra.apellidosArtista}</p>
                                                </div>
                                                <div class="p-3">
                                                    <button class="btnDel eliminarObra" data-id="${obra.idObra}" data-id-exposicion="${exposicion.idExposicion}">
                                                        <i class="bi bi-trash3"></i> Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        });
                    }

                    // Generar HTML para la exposición
                    listaExposiciones.append(`
                        <div class="col-12 mb-4">
                            <div class="card">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5>${exposicion.nombreExposicion}</h5>
                                        <p>Zona: ${exposicion.zonaExposicion}</p>
                                        <p>Del ${exposicion.fechaInicio} al ${exposicion.fechaFin}</p>
                                    </div>
                                    <div class="d-flex flex-wrap justify-content-between align-content-center">
                                        <button class="btnMod modificarExposicion me-3" data-id="${exposicion.idExposicion}" 
                                            data-nombre="${exposicion.nombreExposicion}" data-fecha-inicio="${exposicion.fechaInicio}" 
                                            data-fecha-fin="${exposicion.fechaFin}">
                                            <i class="bi bi-pencil"></i> Modificar
                                        </button>
                                        <button class="btnDel eliminarExposicion me-3" data-id-exposicion="${exposicion.idExposicion}">
                                            <i class="bi bi-trash3"></i> Eliminar
                                        </button>
                                        <button class="btnAnadir addObras me-3" 
                                            data-id-exposicion="${exposicion.idExposicion}" 
                                            data-fecha-inicio="${exposicion.fechaInicio}" 
                                            data-fecha-fin="${exposicion.fechaFin}">
                                            <i class="bi bi-plus"></i> Añadir Obras
                                        </button>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        ${obrasHTML}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `);
                });
            } else {
                alert("Error al cargar las exposiciones: " + response.error);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error al cargar las exposiciones:", textStatus, errorThrown);
        }
    });
}

// Función para formatear fechas de DD/MM/YYYY a YYYY-MM-DD
function formatearFecha(fecha) {
    const partes = fecha.split("/");
    if (partes.length == 3) {
        return `${partes[2]}-${partes[1]}-${partes[0]}`; // Formato YYYY-MM-DD
    }
    return null; // Si el formato no es válido, devolver null
}