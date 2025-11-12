$(function () {

    // Eventos para cargar las secciones específicas
    $(document).on("click", ".gestionarArtistas", function () {
        cargarGestionArtistas();
    });

    $(document).on("click", ".gestionarGalerias", function () {
        cargarGestionGalerias();
    });

    $(document).on("click", ".gestionarColeccionistas", function () {
        cargarGestionColeccionistas();
    });
    $(document).on("click", ".auditarOperaciones", function () {
        cargarGestionAditoria();
    });


    //Eventos para añadir artistas, galerías y coleccionistas


    /*EVENTO PARA ABRIR MODAL DEPENDIENDO DEL USUARIO*/
    $(document).on("click", "#addArtista, #addGaleria, #addColeccionista", function () {
        const modal = $("#modalGestionUsuario");
        modal.find(".modal-title").text("Añadir Usuario");
        modal.find("#formGestionUsuario")[0].reset(); // Limpiar el formulario
        modal.find("#camposEspecificos").empty(); // Limpiar los campos específicos

        // Determinar el tipo de usuario
        const tipo = $(this).attr("id").replace("add", "").toLowerCase();
        modal.find("#tipo").val(tipo); // Establecer el tipo de usuario en un campo oculto

        // Configurar la acción como "añadir"
        modal.find("#accion").val("añadir"); // Establecer la acción en un campo oculto

        // Mostrar los campos de email y contraseña y marcarlos como requeridos
        $("#email").parent().removeClass("visually-hidden");
        $("#email").prop("required", true).prop("disabled", false);

        $("#contrasena").parent().removeClass("visually-hidden");
        $("#contrasena").prop("required", true).prop("disabled", false);

        // Limpiar los campos del formulario
        $("#formGestionUsuario")[0].reset();

        // Cargar los campos específicos
        cargarCamposEspecificos(tipo);
        modal.modal("show"); // Mostrar el modal
    });

    // Enviar los datos del formulario para añadir usuario
    $(document).on("submit", "#formGestionUsuario", function (e) {
        e.preventDefault(); // Evitar el comportamiento por defecto del formulario

        const datos = new FormData(this); // Serializar los datos del formulario

        $.ajax({
            url: "php/gestionarUsuariosAdmin.php",
            type: "POST",
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    alert("Usuario guardado correctamente.");
                    $("#modalGestionUsuario").modal("hide"); // Cerrar el modal
                    cargarArtistas(); // Recargar la lista de artistas
                    cargarGalerias(); // Recargar la lista de galerías
                    cargarColeccionistas(); // Recargar la lista de coleccionistas
                    cargarAuditarOperaciones(); // Recargar la auditoría de operaciones
                } else {
                    alert(response.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al guardar el usuario:", textStatus, errorThrown);
            }
        });
    });

    // Modificar Usuario
    $(document).on("click", ".btnModificarArtista", function () {
        const idUsuario = $(this).data("id");

        // Cambiar el título del modal a "Modificar Usuario"
        $("#modalGestionUsuario .modal-title").text("Modificar Usuario");

        // Ocultar los campos de email y contraseña y deshabilitar su validación
        $("#email").parent().addClass("visually-hidden");
        $("#email").prop("required", false);
        $("#contrasena").parent().addClass("visually-hidden");
        $("#contrasena").prop("required", false);

        // Realizar una solicitud AJAX para obtener los datos del artista
        $.ajax({
            url: "php/gestionarUsuariosAdmin.php",
            type: "POST",
            data: { accion: "obtener", idUsuario: idUsuario, tipo: "artista" },
            success: function (response) {
                if (response.success) {
                    const artista = response.data;

                    // Rellenar el formulario con los datos del artista
                    //$("#idArtista").val(artista.idArtista);
                    $("#nombre").val(artista.nombre);
                    $("#apellidos").val(artista.apellidos);
                    $("#email").val(artista.email);
                    $("#telefono").val(artista.telefono);
                    $("#direccion").val(artista.direccion);
                    $("#ciudad").val(artista.ciudad);
                    $("#pais").val(artista.pais);
                    $("#codigoPostal").val(artista.codigoPostal);
                    $("#genero").val(artista.genero);
                    $("#fechaNacimiento").val(artista.fechaNacimiento);
                    $("#accion").val("modificar");
                    $("#idUsuario").val(idUsuario);
                    $("#tipo").val("artista");

                    // Cargar los campos específicos para el tipo "artista"
                    cargarCamposEspecificos("artista");

                    // Mostrar el modal
                    $("#modalGestionUsuario").modal("show");
                } else {
                    console.error("Error al obtener los datos del artista:", response.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error en la solicitud AJAX:", textStatus, errorThrown);
            }
        });
    });

    // Modificar Galería
    $(document).on("click", ".btnModificarColeccionista", function () {
        const idUsuario = $(this).data("id");

        // Cambiar el título del modal a "Modificar Usuario"
        $("#modalGestionUsuario .modal-title").text("Modificar Usuario");

        // Configurar el formulario para modificar
        $("#accion").val("modificar");
        $("#idUsuario").val(idUsuario);

        // Ocultar los campos de email y contraseña y deshabilitar su validación
        $("#email").parent().addClass("visually-hidden");
        $("#email").prop("required", false).prop("disabled", true);

        $("#contrasena").parent().addClass("visually-hidden");
        $("#contrasena").prop("required", false).prop("disabled", true);;

        // Realizar una solicitud AJAX para obtener los datos del coleccionista
        $.ajax({
            url: "php/gestionarUsuariosAdmin.php",
            type: "POST",
            data: { accion: "obtener", idUsuario: idUsuario, tipo: "coleccionista" },
            success: function (response) {
                if (response.success) {
                    const coleccionista = response.data;

                    // Rellenar el formulario con los datos del coleccionista
                    $("#nombre").val(coleccionista.nombre);
                    $("#apellidos").val(coleccionista.apellidos);
                    $("#genero").val(coleccionista.genero);
                    $("#direccion").val(coleccionista.direccion);
                    $("#ciudad").val(coleccionista.ciudad);
                    $("#codigoPostal").val(coleccionista.codigoPostal);
                    $("#telefono").val(coleccionista.telefono);
                    $("#pais").val(coleccionista.pais);
                    $("#accion").val("modificar");
                    $("#idUsuario").val(idUsuario);
                    $("#accion").val("modificar");
                    $("#tipo").val("coleccionista");

                    // Cargar los campos específicos para el tipo "coleccionista"
                    cargarCamposEspecificos("coleccionista");

                    // Mostrar el modal
                    $("#modalGestionUsuario").modal("show");
                } else {
                    console.error("Error al obtener los datos del coleccionista:", response.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error en la solicitud AJAX:", textStatus, errorThrown);
            }
        });
    });

    // Modificar Galería
    $(document).on("click", ".btnModificarGaleria", function () {
        const idUsuario = $(this).data("id");

        // Cambiar el título del modal a "Modificar Usuario"
        $("#modalGestionUsuario .modal-title").text("Modificar Usuario");

        // Configurar el formulario para modificar
        $("#accion").val("modificar");
        $("#idUsuario").val(idUsuario);

        // Ocultar los campos de email y contraseña y deshabilitar su validación
        $("#email").parent().addClass("visually-hidden");
        $("#email").prop("required", false).prop("disabled", true);

        $("#contrasena").parent().addClass("visually-hidden");
        $("#contrasena").prop("required", false).prop("disabled", true);

        // Realizar una solicitud AJAX para obtener los datos de la galería
        $.ajax({
            url: "php/gestionarUsuariosAdmin.php",
            type: "POST",
            data: { accion: "obtener", idUsuario: idUsuario, tipo: "galeria" },
            success: function (response) {
                if (response.success) {
                    const galeria = response.data;

                    // Rellenar el formulario con los datos de la galería
                    $("#nombre").val(galeria.nombre);
                    $("#direccion").val(galeria.direccion);
                    $("#ciudad").val(galeria.ciudad);
                    $("#codigoPostal").val(galeria.codigoPostal);
                    $("#telefono").val(galeria.telefono);
                    $("#pais").val(galeria.pais);
                    $("#metrosCuadrados").val(galeria.metrosCuadrados);
                    $("#accion").val("modificar");
                    $("#idUsuario").val(idUsuario);
                    $("#tipo").val("galeria");

                    // Cargar los campos específicos para el tipo "galeria"
                    cargarCamposEspecificos("galeria");

                    // Mostrar el modal
                    $("#modalGestionUsuario").modal("show");
                } else {
                    console.error("Error al obtener los datos de la galería:", response.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error en la solicitud AJAX:", textStatus, errorThrown);
            }
        });
    });

    // Eliminar Artista
    $(document).on("click", ".btnEliminarArtista", function () {
        const idUsuario = $(this).data("id");
        eliminarUsuario(idUsuario, "artista");
    });

    // Eliminar Galería
    $(document).on("click", ".btnEliminarGaleria", function () {
        const idUsuario = $(this).data("id");
        eliminarUsuario(idUsuario, "galeria");
    });

    // Eliminar Coleccionista
    $(document).on("click", ".btnEliminarColeccionista", function () {
        const idUsuario = $(this).data("id");
        eliminarUsuario(idUsuario, "coleccionista");
    });

    // Reactivar Artista
    $(document).on("click", ".btnReactivarArtista", function () {
        const idUsuario = $(this).data("id");
        console.log("Reactivar Artista clickeado, ID:", idUsuario);
        reactivarUsuario(idUsuario, "artista");
    });

    // Reactivar Galería
    $(document).on("click", ".btnReactivarGaleria", function () {
        const idUsuario = $(this).data("id");
        console.log("Reactivar Galería clickeado, ID:", idUsuario);
        reactivarUsuario(idUsuario, "galeria");
    });

    // Reactivar Coleccionista
    $(document).on("click", ".btnReactivarColeccionista", function () {
        const idUsuario = $(this).data("id");
        console.log("Reactivar Coleccionista clickeado, ID:", idUsuario);
        reactivarUsuario(idUsuario, "coleccionista");
    });

    // Función genérica para eliminar usuarios
    function eliminarUsuario(idUsuario, tipo) {
        if (confirm(`¿Estás seguro de que deseas eliminar este ${tipo}?`)) {
            $.ajax({
                url: "php/gestionarUsuariosAdmin.php",
                type: "POST",
                data: { accion: "eliminar", idUsuario: idUsuario, tipo: tipo },
                success: function (response) {
                    if (response.success) {
                        alert(response.message);
                        // Recargar la lista correspondiente
                        if (tipo == "artista") {
                            cargarArtistas();
                        } else if (tipo == "galeria") {
                            cargarGalerias();
                        } else if (tipo == "coleccionista") {
                            cargarColeccionistas();
                        }
                    } else {
                        alert(response.error);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error al eliminar el usuario:", textStatus, errorThrown);
                }
            });
        }
    }

    // Función genérica para reactivar usuarios
    function reactivarUsuario(idUsuario, tipo) {
        if (confirm(`¿Estás seguro de que deseas reactivar este ${tipo}?`)) {
            $.ajax({
                url: "php/gestionarUsuariosAdmin.php",
                type: "POST",
                data: { accion: "reactivar", idUsuario: idUsuario, tipo: tipo },
                success: function (response) {
                    if (response.success) {
                        alert(response.message);
                        // Recargar la lista correspondiente
                        if (tipo == "artista") {
                            cargarArtistas();
                        } else if (tipo == "galeria") {
                            cargarGalerias();
                        } else if (tipo == "coleccionista") {
                            cargarColeccionistas();
                        }
                    } else {
                        alert(response.error);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error al reactivar el usuario:", textStatus, errorThrown);
                }
            });
        }
    }

})


/*CARGAR ARTISTAS*/

// Función para cargar la gestión de artistas
function cargarGestionArtistas() {
    const resultado = $("#resultado");
    resultado.empty();

    resultado.append(`
            <div class="container rounded mt-5 mb-5 bg-light p-4">
                <h3 class="text-center">Gestión de Artistas</h3>
                <button class="mb-3 btn btnAnadir" id="addArtista"><i class="bi bi-plus"></i>Añadir Artista</button>
                <div class="table-responsive">
                    <table id="tablaArtistas" class="table table-striped table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Apellidos</th>
                                <th>País</th>
                                <th>Teléfono</th>
                                <th>Email</th>
                                <th>Activo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Los datos se cargarán dinámicamente aquí -->
                        </tbody>
                    </table>
                </div>    
            </div>
        `);

    cargarArtistas(); // Llamar a la función para cargar artistas
}

// Función para cargar artistas desde el backend
function cargarArtistas() {
    $.ajax({
        url: "php/gestionarUsuariosAdmin.php",
        type: "POST",
        data: { accion: "listar", tipo: "artista" },
        success: function (response) {
            console.log("Respuesta del servidor para artistas:", response);
            const tablaArtistas = $("#tablaArtistas tbody");
            tablaArtistas.empty(); // Limpiar la tabla antes de añadir nuevos

            if (response.success) {
                response.data.forEach(artista => {
                    tablaArtistas.append(`
                                <tr>
                                    <td>${artista.idArtista}</td>
                                    <td>${artista.nombre}</td>
                                    <td>${artista.apellidos}</td>
                                    <td>${artista.pais}</td>
                                    <td>${artista.telefono}</td>
                                    <td>${artista.email}</td>
                                    <td>${artista.activo}</td>
                                    <td>
                                        <button class="rounded-circle btnMod btnModificarArtista me-2" data-id="${artista.idArtista}"><i class="bi bi-pencil"></i></button>
                                        <button class="rounded-circle btnDel btnEliminarArtista me-2" data-id="${artista.idArtista}"><i class="bi bi-trash3"></i></button>
                                        <button class="rounded-circle btnReactiv btnReactivarArtista me-2" data-id="${artista.idArtista}"><i class="bi bi-arrow-clockwise"></i></button>
                                    </td>
                                </tr>
                            `);
                });
            } else {
                console.error("Error del servidor:", response.error);
                tablaArtistas.append(`<tr><td colspan='8'>Error: ${response.error}</td></tr>`);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error en la petición AJAX:", textStatus, errorThrown);
            console.error("Respuesta del servidor:", jqXHR.responseText);
            const tablaArtistas = $("#tablaArtistas tbody");
            tablaArtistas.append(`<tr><td colspan='8'>Error de conexión: ${textStatus}</td></tr>`);
        }
    });
}

/*CARGAR GALERÍAS*/

function cargarGestionGalerias() {
    const resultado = $("#resultado");
    resultado.empty(); // Limpiar el contenedor antes de cargar nuevos datos

    resultado.append(`
        <div class="container rounded mt-5 mb-5 bg-light p-4">
            <h3 class="text-center">Gestión de Galerías</h3>
            <button class="mb-3 btn btnAnadir" id="addGaleria"><i class="bi bi-plus"></i>Añadir Galería</button>
            <div class="table-responsive">
                <table id="tablaGalerias" class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Dirección</th>
                            <th>Ciudad</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Activo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Los datos se cargarán dinámicamente aquí -->
                    </tbody>
                </table>
            </div>    
        </div>
    `);

    cargarGalerias(); // Llamar a la función para cargar galerías
}

function cargarGalerias() {
    $.ajax({
        url: "php/gestionarUsuariosAdmin.php",
        type: "POST",
        data: { accion: "listar", tipo: "galeria" },
        success: function (response) {
            console.log("Respuesta del servidor para galerías:", response);
            const tablaGalerias = $("#tablaGalerias tbody");
            tablaGalerias.empty(); // Limpiar la tabla antes de añadir nuevas galerías

            if (response.success) {
                response.data.forEach(galeria => {
                    tablaGalerias.append(`
                        <tr>
                            <td>${galeria.idGaleria}</td>
                            <td>${galeria.nombre}</td>
                            <td>${galeria.direccion}</td>
                            <td>${galeria.ciudad}</td>
                            <td>${galeria.telefono}</td>
                            <td>${galeria.email}</td>
                            <td>${galeria.activo}</td>
                            <td>
                                <button class="rounded-circle me-2 btnMod btnModificarGaleria" data-id="${galeria.idGaleria}"><i class="bi bi-pencil"></i></button>
                                <button class="rounded-circle me-2 btnDel btnEliminarGaleria" data-id="${galeria.idGaleria}"><i class="bi bi-trash3"></i></button>
                                <button class="rounded-circle me-2 btnReactiv btnReactivarGaleria" data-id="${galeria.idGaleria}"><i class="bi bi-arrow-clockwise"></i></button>
                            </td>
                        </tr>
                    `);
                });
            } else {
                console.error("Error del servidor:", response.error);
                tablaGalerias.append(`<tr><td colspan='8'>Error: ${response.error}</td></tr>`);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error en la petición AJAX:", textStatus, errorThrown);
            console.error("Respuesta del servidor:", jqXHR.responseText);
            const tablaGalerias = $("#tablaGalerias tbody");
            tablaGalerias.append(`<tr><td colspan='8'>Error de conexión: ${textStatus}</td></tr>`);
        }
    });
}


/*CARGAR COLECCIONISTAS*/
function cargarGestionColeccionistas() {
    const resultado = $("#resultado");
    resultado.empty(); // Limpiar el contenedor antes de cargar nuevos datos

    resultado.append(`
        <div class="container rounded mt-5 mb-5 bg-light p-4">
            <h3 class="text-center">Gestión de Coleccionistas</h3>
            <button class="mb-3 btn btnAnadir" id="addColeccionista"><i class="bi bi-plus"></i>Añadir Coleccionista</button>
            <div class="table-responsive">
                <table id="tablaColeccionistas" class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Dirección</th>
                            <th>Ciudad</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Activo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Los datos se cargarán dinámicamente aquí -->
                    </tbody>
                </table>
            </div>
        </div>
    `);

    cargarColeccionistas();
}

function cargarColeccionistas() {
    $.ajax({
        url: "php/gestionarUsuariosAdmin.php",
        type: "POST",
        data: { accion: "listar", tipo: "coleccionista" },
        success: function (response) {
            console.log("Respuesta del servidor para coleccionistas:", response);
            const tablaColeccionistas = $("#tablaColeccionistas tbody");
            tablaColeccionistas.empty(); // Limpiar la tabla antes de añadir nuevos coleccionistas

            if (response.success) {
                response.data.forEach(coleccionista => {
                    tablaColeccionistas.append(`
                        <tr>
                            <td>${coleccionista.idColeccionista}</td>
                            <td>${coleccionista.nombre}</td>
                            <td>${coleccionista.apellidos}</td>
                            <td>${coleccionista.direccion}</td>
                            <td>${coleccionista.ciudad}</td>
                            <td>${coleccionista.telefono}</td>
                            <td>${coleccionista.email}</td>
                            <td>${coleccionista.activo}</td>
                            <td>
                                <button class="rounded-circle me-2 btnMod btnModificarColeccionista" data-id="${coleccionista.idColeccionista}"><i class="bi bi-pencil"></i></button>
                                <button class="rounded-circle me-2 btnDel btnEliminarColeccionista" data-id="${coleccionista.idColeccionista}"><i class="bi bi-trash3"></i></button>
                                <button class="rounded-circle me-2 btnReactiv btnReactivarColeccionista" data-id="${coleccionista.idColeccionista}"><i class="bi bi-arrow-clockwise"></i></button>
                            </td>
                        </tr>
                    `);
                });
            } else {
                console.error("Error del servidor:", response.error);
                tablaColeccionistas.append(`<tr><td colspan='9'>Error: ${response.error}</td></tr>`);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error en la petición AJAX:", textStatus, errorThrown);
            console.error("Respuesta del servidor:", jqXHR.responseText);
            const tablaColeccionistas = $("#tablaColeccionistas tbody");
            tablaColeccionistas.append(`<tr><td colspan='9'>Error de conexión: ${textStatus}</td></tr>`);
        }
    });
}

/*AUDITAR OPERACIONES*/

/*AUDITAR OPERACIONES*/

// Helpers para formatear y mostrar los datos de auditoría de forma avanzada
function escapeHtml(unsafe) {
    if (unsafe == null || unsafe == undefined) return '';
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderObjectAsHtmlList(obj) {
    if (obj == null || obj == undefined) return '<em>N/A</em>';
    if (typeof obj != 'object') return `<div>${escapeHtml(obj)}</div>`;

    let html = '<ul class="list-unstyled mb-0 small">';
    for (const key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
        const val = obj[key];
        if (typeof val == 'object' && val != null) {
            html += `<li><strong>${escapeHtml(key)}:</strong> ${renderObjectAsHtmlList(val)}</li>`;
        } else {
            html += `<li><strong>${escapeHtml(key)}:</strong> ${escapeHtml(val)}</li>`;
        }
    }
    html += '</ul>';
    return html;
}

// Reemplaza secuencias unicode como "\u00e9" o "u00e9" por el carácter correspondiente
function unescapeUnicodeEscapes(str) {
    if (str == null || str == undefined) return str;
    if (typeof str != 'string') return str;

    // Primero, convertir ocurrencias sin backslash: u00e9 -> \u00e9
    // Esto cubre casos como "Vallu00e9s". Usamos una captura que preserva el carácter anterior
    // para evitar convertir secuencias ya escapadas (\uXXXX).
    str = str.replace(/(^|[^\\])u([0-9A-Fa-f]{4})/g, function (m, p1, p2) {
        return p1 + '\\u' + p2;
    });

    // Ahora reemplazar todas las secuencias \uXXXX por el carácter correspondiente
    return str.replace(/\\u([0-9A-Fa-f]{4})/g, function (match, grp) {
        try {
            return String.fromCharCode(parseInt(grp, 16));
        } catch (e) {
            return match;
        }
    });
}

// Normaliza recursivamente los valores string dentro de un objeto (convierte secuencias unicode residuales)
function normalizeObjectStrings(obj) {
    if (obj == null || obj == undefined) return obj;
    if (typeof obj == 'string') return unescapeUnicodeEscapes(obj);
    if (typeof obj != 'object') return obj;

    if (Array.isArray(obj)) {
        return obj.map(v => normalizeObjectStrings(v));
    }

    const out = {};
    for (const k in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
        const v = obj[k];
        if (typeof v == 'string') out[k] = unescapeUnicodeEscapes(v);
        else if (typeof v == 'object' && v != null) out[k] = normalizeObjectStrings(v);
        else out[k] = v;
    }
    return out;
}
function formatAuditData(raw) {
    // raw puede ser null, string JSON o texto plano
    if (raw == null || raw == undefined) return '<em>N/A</em>';

    // Decodificar entidades HTML que vengan ya escapadas (p.ej. &quot;)
    function decodeHtmlEntities(str) {
        if (typeof str != 'string') return str;
        const txt = document.createElement('textarea');
        txt.innerHTML = str;
        return txt.value;
    }

    let parsed = null;
    if (typeof raw == 'string') {
        const decoded = decodeHtmlEntities(raw.trim());
        try {
            // Intentar parsear JSON; si contiene secuencias tipo u00e9 sin backslash, las normalizamos antes
            let toParse = decoded;
            // Si detectamos 'uXXXX' suelto, convertimos a \uXXXX para que JSON.parse lo interprete
            toParse = unescapeUnicodeEscapes(toParse);
            parsed = JSON.parse(toParse);
            // Normalizar cadenas dentro del objeto (por si quedan secuencias residuales)
            parsed = normalizeObjectStrings(parsed);
        } catch (e) {
            // no es JSON, usar el texto tal cual (decodificado y escapado)
            const decodedAgain = unescapeUnicodeEscapes(decoded);
            const preview = escapeHtml(decodedAgain).replace(/\n/g, '<br>');
            if (preview.length > 200) {
                return `
                    <div class="audit-summary">${preview.substring(0, 200)}... <a href="#" class="audit-toggle">Mostrar más</a></div>
                    <div class="audit-full d-none mt-2">${preview}</div>
                `;
            }
            return `<div class="audit-full">${preview}</div>`;
        }
    } else if (typeof raw == 'object') {
        parsed = normalizeObjectStrings(raw);
    }

    // Si tenemos un objeto, renderizarlo como lista compacta con toggle
    const rendered = renderObjectAsHtmlList(parsed);

    // Mostrar inicialmente solo un enlace para mantener la tabla limpia.
    // El detalle completo (rendered) aparecerá al pulsar el enlace.
    return `
        <div class="audit-summary"><a href="#" class="audit-toggle">Mostrar detalles</a></div>
        <div class="audit-full d-none mt-2">${rendered}</div>
    `;
}

function cargarGestionAditoria() {
    const resultado = $("#resultado");
    resultado.empty(); // Limpiar el contenedor antes de cargar nuevos datos

    // Insertar la estructura de la tabla en el contenedor
    resultado.append(`
        <div class="container rounded mt-5 mb-5 bg-light p-4">
            <h3 class="text-center mb-4">Auditoría de operaciones</h3>
            <div class="table-responsive">
                <table id="tablaAuditoria" class="table table-striped table-hover align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th>ID Auditoría</th>
                            <th>Nombre tabla</th>
                            <th>Acción</th>
                            <th>ID registro</th>
                            <th>Datos anteriores</th>
                            <th>Datos nuevos</th>
                            <th>Usuario</th>
                            <th>Fecha y hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Los datos se cargarán dinámicamente aquí -->
                    </tbody>
                </table>
            </div>
        </div>
    `);

    cargarAuditarOperaciones();
}

function cargarAuditarOperaciones() {
    $.ajax({
        url: "php/auditarOperaciones.php",
        type: "GET",
        success: function (response) {
            const tablaAuditoria = $("#tablaAuditoria tbody");
            tablaAuditoria.empty(); // Limpiar la tabla antes de añadir nuevos datos

            if (response.success) {
                response.data.forEach(auditoria => {
                    tablaAuditoria.append(`
                        <tr>
                            <td>${escapeHtml(auditoria.idAuditoria)}</td>
                            <td>${escapeHtml(auditoria.nombreTabla)}</td>
                            <td>${escapeHtml(auditoria.accion)}</td>
                            <td>${escapeHtml(auditoria.idRegistro ?? 'N/A')}</td>
                            <td class="text-break">${formatAuditData(auditoria.datosAnteriores)}</td>
                            <td class="text-break">${formatAuditData(auditoria.datosNuevos)}</td>
                            <td>${escapeHtml(auditoria.usuario ?? 'N/A')}</td>
                            <td>${escapeHtml(auditoria.fechaHora)}</td>
                        </tr>
                    `);
                });
            } else {
                tablaAuditoria.append("<tr><td colspan='8' class='text-center'>No se encontraron datos en la auditoría.</td></tr>");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error al cargar los datos de auditoría:", textStatus, errorThrown);
        }
    });
}

// Delegado: toggle para mostrar/ocultar el detalle completo de auditoría
$(document).on('click', '.audit-toggle', function (e) {
    e.preventDefault();
    const $link = $(this);
    const $summary = $link.closest('.audit-summary');
    const $full = $summary.siblings('.audit-full');
    $full.toggleClass('d-none');
    if ($full.hasClass('d-none')) {
        $link.text('Mostrar detalles');
    } else {
        $link.text('Ocultar detalles');
    }
});

// Función para cargar los campos específicos de cada usuario
function cargarCamposEspecificos(tipo) {
    // Ocultar y deshabilitar todos los campos específicos
    $(".campoArtista, .campoColeccionista, .campoGaleria")
        .addClass("visually-hidden")
        .find("input, select")
        .prop("disabled", true);

    // Mostrar y habilitar los campos específicos según el tipo
    if (tipo == "artista") {
        $(".campoArtista")
            .removeClass("visually-hidden")
            .find("input, select")
            .prop("disabled", false);
    } else if (tipo == "galeria") {
        $(".campoGaleria")
            .removeClass("visually-hidden")
            .find("input, select")
            .prop("disabled", false);
    } else if (tipo == "coleccionista") {
        $(".campoColeccionista")
            .removeClass("visually-hidden")
            .find("input, select")
            .prop("disabled", false);
    }
}