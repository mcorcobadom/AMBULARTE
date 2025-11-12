/// <reference types="jquery" />
///npm install @types/jquery --save-dev

$(function () {
    // Cargar los artistas y sus obras al cargar la página
    cargarArtistas();

});

function cargarArtistas() {
    $.ajax({
        url: "php/cargarArtistasYObras.php", 
        type: "GET",
        dataType: "json",
        success: function (respuesta) {
            if (respuesta.success) {
                mostrarArtistas(respuesta.data); 
            } else {
                $("#seccionDinamica").removeClass("visually-hidden").html("<p>No se encontraron artistas.</p>");
            }
        },
        error: function () {
            $("#seccionDinamica").removeClass("visually-hidden").html("<p>Error al cargar los artistas.</p>");
        },
    });
}

function mostrarArtistas(artistas) {
    const contenedor = $("#resultado");
    contenedor.empty(); // Limpiar contenido anterior
    
        artistas.forEach((artista) => {
            const artistaDiv = $(`
                <div class="container mb-5 bg-light p-4 rounded">
                    <p class="text-uppercase small fw-medium">${artista.pais}</p>
                    <h3 class="h2 text-uppercase fw-light mb-4">${artista.nombre} ${artista.apellidos}</h3>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="row">
                                ${artista.obras.map(obra => `
                                <div class="col-md-3 mb-4">
                                    <div class="cardArtistas">
                                        <img src="images/Obras/${obra.imagen}" class="imgObra card-img-top" alt="${obra.nombre}">
                                        <div class="card-body text-center mt-3 mb-3">
                                            <h5 class="card-title text-truncate fs-5 fw-bold mb-2">${obra.nombre}</h5>
                                            <p class="text-muted mb-2">${obra.tipo} | <span class="small text-muted>${obra.dimensiones}</span></p>
                                            <p class="small text-muted">${obra.dimensiones}</p>
                                            <p class="fw-bold me-2">${obra.precioVenta}€</p>
                                            <button class="addCesta w-75" data-id="${obra.idObra}" data-precio="${obra.precioVenta}">Comprar</button>
                                        </div>
                                    </div>
                                </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `);
            contenedor.append(artistaDiv);
        });
    }