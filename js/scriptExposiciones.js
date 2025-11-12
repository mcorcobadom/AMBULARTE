$(function () {
    cargarExposiciones();
});

function cargarExposiciones() {
    $.ajax({
        url: "php/cargarExposiciones.php",
        type: "GET",
        dataType: "json",
        success: function (respuesta) {
            if (respuesta.success) {
                mostrarExposiciones(respuesta.data);
            } else {
                $("#resultado").html("<p>No se encontraron exposiciones.</p>");
            }
        },
        error: function () {
            $("#resultado").html("<p>Error al cargar las exposiciones.</p>");
        },
    });
}
function mostrarExposiciones(galerias) {
    const contenedor = $("#resultado");
    contenedor.empty();

    galerias.forEach((galeria) => {
        const exposicionesArray = Object.values(galeria.exposiciones || {});
        let exposicionesHTML = "";

        if (exposicionesArray.length == 0) {
            // Mostrar mensaje si no hay exposiciones
            exposicionesHTML = `<p class="text-muted">No hay exposiciones disponibles en esta galería.</p>`;
        } else {
            exposicionesHTML = exposicionesArray.map((expo, expoIndex) => {
                const obrasPorArtista = agruparObrasPorArtista(expo.obras);
                const artistasHTML = generarArtistasHTML(obrasPorArtista, galeria.idGaleria, expoIndex);

                return `
                    <div class="mb-5 p-3 bg-white rounded shadow-sm">
                        <h4>Exposición ${expo.nombreExposicion}</h4>
                        <p class="text-muted"><i class="bi bi-calendar-date-fill me-2 colorIcono"></i> Del ${expo.fechaInicio} al ${expo.fechaFin}</p>
                        ${artistasHTML}
                    </div>
                `;
            }).join("");
        }

        // Generar el HTML de la galería
        const galeriaHTML = `
            <div class="mb-5 p-4 border rounded contenedorGaleria">
                <div class="d-flex justify-content-md-between flex-wrap mb-3">
                    <div class="infoGaleria p-3 w-md-50">
                        <h2 class="text-dark">Galería ${galeria.nombreGaleria}</h2>
                        <p><i class="bi bi-geo-alt-fill me-2 colorIcono"></i>${galeria.direccion}, ${galeria.ciudad}</p> 
                        <p><i class="bi bi-telephone-fill me-2 colorIcono"></i>${galeria.telefono}</p>
                    </div>
                    <div>
                        <img src="images/Galerías/${galeria.imagenGaleria}" class="img-fluid rounded mb-3" alt="${galeria.nombreGaleria}" style="max-height: 300px;">
                    </div>
                    
                </div>
                ${exposicionesHTML}
            </div>
        `;

        contenedor.append(galeriaHTML);
    });
}

function generarExposicionesHTML(exposiciones, idGaleria) {
    if (!exposiciones || Object.keys(exposiciones).length == 0) {
        return `<p class="text-muted">No hay exposiciones disponibles en esta galería.</p>`;
    }

    const exposicionesArray = Object.values(exposiciones);
    return exposicionesArray.map((expo, expoIndex) => {
        const obrasPorArtista = agruparObrasPorArtista(expo.obras);
        const artistasHTML = generarArtistasHTML(obrasPorArtista, idGaleria, expoIndex);

        return `
            <div class="mb-5 p-3 bg-white rounded shadow-sm">
                <h4 class="text-primary">${expo.nombreExposicion}</h4>
                <p class="text-muted">Del ${expo.fechaInicio} al ${expo.fechaFin}</p>
                ${artistasHTML}
            </div>
        `;
    }).join("");
}

function agruparObrasPorArtista(obras) {
    const obrasPorArtista = new Map();

    obras.forEach((obra) => {
        const idArtista = obra.idArtista;

        if (!obrasPorArtista.has(idArtista)) {
            obrasPorArtista.set(idArtista, {
                nombre: `${obra.nombreArtista} ${obra.apellidosArtista}`,
                pais: obra.paisArtista,
                imagen: obra.imagenArtista,
                obras: [],
            });
        }

        obrasPorArtista.get(idArtista).obras.push(obra);
    });
    return obrasPorArtista;
}

function generarArtistasHTML(obrasPorArtista, idGaleria, expoIndex) {
    return Array.from(obrasPorArtista.entries()).map(([idArtista, artista]) => {
        const obrasHTML = artista.obras.map((obra) => `
            <div class="col-md-3 mb-3">
                <div class="card h-100">
                    <img src="images/Obras/${obra.imagenObra}" class="card-img-top imgObra" alt="${obra.nombreObra}">
                    <div class="card-body">
                        <h5 class="card-title">${obra.nombreObra}</h5>
                        <p>${obra.tipoObra}</p>
                    </div>
                </div>
            </div>
        `).join("");

        return `
            <div class="mb-4 border-bottom pb-3">
                <div class="d-flex align-items-center mb-2">
                    <img src="images/Perfil/${artista.imagen}" class="rounded-circle me-3" width="60" height="60" alt="${artista.nombre}">
                    <div>
                        <h5 class="mb-0">${artista.nombre}</h5>
                        <small class="text-muted">${artista.pais}</small>
                    </div>
                    <button class="ms-auto" data-bs-toggle="collapse" data-bs-target="#obrasArtista${idGaleria}-${expoIndex}-${idArtista}">
                        Ver obras
                    </button>
                </div>
                <div class="collapse mt-3" id="obrasArtista${idGaleria}-${expoIndex}-${idArtista}">
                    <div class="row">
                        ${obrasHTML}
                    </div>
                </div>
            </div>
        `;
    }).join("");
}