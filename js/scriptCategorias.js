/// <reference types="jquery" />
///npm install @types/jquery --save-dev

$(function () {
    // Obtener el idCategoria desde el atributo data-id
    const idCategoria = $("#seccionDinamica").data("id") 
    console.log("ID de la categoría desde el atributo data-id:", idCategoria) // Depuración

    if (idCategoria) {
        cargarCategoria(idCategoria) // Llamar a la función para cargar la categoría
    } else {
        console.error("No se especificó una categoría.")
    }

    // Obtener el id de la categoría desde un atributo data-categoria en el contenedor principal
    //const idCategoria = $("#masonry-container").data("categoria");

});

//Función para cargar los datos de la página categorias.html según la categoría seleccionada
function cargarCategoria(idCategoria) {
    $.ajax({
        url: "php/cargarCategorias.php", // Archivo PHP para cargar las categorías
        type: "GET",
        dataType: "json",
        success: function (response) {
            if (response.success) {
                const categoria = response.data.find(cat => cat.idCategoria == idCategoria); // Buscar la categoría por ID

                if (categoria) {
                    // Actualizar el contenido dinámico
                    $("#tituloCategoria").text(categoria.nombre);
                    $("#descripcionCategoria").text(categoria.descripcion);
                    $("#cabeceraCategoria").css("background-image", `url('images/Categorias/${categoria.imagen}')`);
                    $("#masonry-container").attr("data-categoria", categoria.nombre.toLowerCase());

                    // Cargar las obras de la categoría
                    cargarObrasPorCategoria(idCategoria);
                } else {
                    console.error("Categoría no encontrada:", idCategoria);
                }
            } else {
                console.error("Error al cargar las categorías:", response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar las categorías:", error);
        }
    });
}

function cargarObrasPorCategoria(idCategoria) {
    $.ajax({
        url: `php/cargarObrasPorCategorias.php?idCategoria=${idCategoria}`, // Enviar el idCategoria como parámetro
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
                            <h5 class="pb-0 mb-2">${obra.nombreObra}</h5>
                            <h6 class="fs-5 mb-3">${obra.nombreArtista} ${obra.apellidos} (${obra.pais})</h6>
                            <p class="mb-2 text-secondary small">${obra.tipo}</p>                            
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