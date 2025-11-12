/// <reference types="jquery" />
///npm install @types/jquery --save-dev

$(function () {

    // Obtener el tipo de obra desde un atributo data-tipo en el contenedor principal
    const tipo = $("#masonry-container").data("tipo")

    if (tipo) {
        cargarObras(tipo);
    } else {
        console.warn("No se especificó el tipo de obra.");
    }

});

function cargarObras(tipo) {
    $.ajax({
        url: `php/cargarObras.php?tipo=${tipo}`, // Enviar el tipo como parámetro
        type: "GET",
        dataType: "json",
        success: function (respuesta) {
            if (respuesta.success) {
                mostrarObras(respuesta.data);
            } else {
                $("#masonry-container").html("<p>No se encontraron obras.</p>");
            }
        },
        error: function () {
            $("#masonry-container").html("<p>Error al cargar las obras.</p>");
        }
    });
}

function mostrarObras(obras) {
    const contenedor = $("#masonry-container");
    contenedor.empty(); // Limpiar contenido anterior

    let elementos = [];

    obras.forEach((obra) => {
        const obraDiv = $(`
            <div class="col-lg-4 col-md-6 col-sm-12">
                <article class="seccionItem me-lg-auto ms-lg-0 mx-auto position-relative mb-5">
                    <div class="img_container g-md-4">
                        <div class="thumbnailCellWrapper quick-zoom-hover">
                            <img src="images/Obras/${obra.imagenObra}" alt="" class="img-fluid rounded">
                        </div>
                        <div class="text-center p-3">                           
                            <h5 class="pb-0 mb-2">${obra.nombreObra}</h4>
                            <h6 class="fs-5 mb-3">${obra.nombreArtista} ${obra.apellidos} (${obra.pais})</h5>
                            <p class="mb-2 text-secondary small">${obra.tecnica}</h6>                            
                            <p class="fw-bold">${obra.precioVenta} €</p>
                            <button class="addCesta w-75" data-id="${obra.idObra}" data-precio="${obra.precioVenta}">Comprar</button>
                        </div>
                    </div>
                </article>
            </div>
        `);

        elementos.push(obraDiv);
        contenedor.append(obraDiv);
    });

    // Espera a que todas las imágenes se hayan cargado antes de inicializar Masonry
    let imagenes = contenedor.find("img");
    let total = imagenes.length;
    let cargadas = 0;

    imagenes.on("load", function () {
        cargadas++;
        if (cargadas == total) {
            new Masonry('#masonry-container', {
                itemSelector: '.col-lg-4',
                columnWidth: '.col-lg-4',
                percentPosition: true
            });
        }
    });

    // Manejar imágenes en caché (ya cargadas)
    imagenes.each(function () {
        if (this.complete) $(this).trigger("load");
    });
}
