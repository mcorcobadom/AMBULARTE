/// <reference types="jquery" />
///npm install @types/jquery --save-dev

//Array para almacenar las obras del carrito de la compra
let carrito = []

$(function () {
    //Comprobar si existen una sesión iniciada
    let objetoUsuario = JSON.parse(localStorage.getItem("usuario"))
    if (objetoUsuario != null) {
        usuarioLogueadoCorrecto(objetoUsuario)
    }

    //Cargar secciones del div principal
    cargarCategorias()
    cargarNovedades()
    cargarGalerias()

    //Botón de configuración del dropdown
    $(document).on("click", ".configuracion", function(){
        cargarConfiguracion(objetoUsuario)
    })

    //Botones del Carousel
    $(document).on("click", ".botonCarouselAbout", function(){
        cargarPaginaNavegadorSecciones("about")
    })

    $(document).on("click", ".botonCarouselArtistas", function(){
        cargarPaginaNavegadorSecciones("artistas")
    })
    $(document).on("click", ".botonCarouselExposiciones", function(){
        cargarPaginaNavegadorSecciones("exposiciones")
    })

    //Sección Categorías
    $(document).on("click", "#categorias .categoria-card", function () {
        const idCategoria = $(this).data("id") // Obtener el ID de la categoría
        // Establecer el idCategoria como atributo data-id en el contenedor dinámico
        $("#seccionDinamica").attr("data-id", idCategoria)
        //Ocultar el contenedor principal
        $("#principal").addClass("visually-hidden")
        //Mostrar la sección dinámica y cargar categoría seleccionada
        $("#seccionDinamica").removeClass("visually-hidden").load("categorias.html") 
        $("html, body").animate({ scrollTop: $("#seccionDinamica").offset().top }, 800) // Animación de desplazamiento
    })

    //Sección Explora
    $(document).on("click", "#explora .categoria-card", function () {
        const seccion = $(this).data("seccion")
        cargarPaginaNavegadorSecciones(seccion)
    })

    //Sección Novedades
    $(document).on("click", "#verArtistas", function () {
        // Ocultar el contenedor principal
        $("#principal").addClass("visually-hidden")
    
        // Mostrar la sección dinámica y cargar artistas.html
        $("#seccionDinamica").removeClass("visually-hidden").load("artistas.html", function () {
            $("html, body").animate({ scrollTop: $("#seccionDinamica").offset().top }, 800)
        })
    })

    //Sección Galerías y exposiciones
    $(document).on("click", "#verExposiciones", function () {
        // Ocultar el contenedor principal
        $("#principal").addClass("visually-hidden")
    
        // Mostrar la sección dinámica y cargar exposiciones.html
        $("#seccionDinamica").removeClass("visually-hidden").load("exposiciones.html", function () {
            $("html, body").animate({ scrollTop: $("#seccionDinamica").offset().top }, 800)
        })
    })

    //Si se pulsa el botón de completar perfil
    $(document).on("click", ".botonPerfil", function () {
        cargarFormularioPerfilUsuario(objetoUsuario)
    })

    //Modal registro
    $(document).on("click", "#registrarse", function (e) {
        e.preventDefault()
        //Cerrar el modal de iniciar sesión
        $("#modalInicioSesion").modal("hide")
        //Abrir el modal de registro
        $("#modalRegistro").modal("show")
    })
    //Modal inicio sesión
    $(document).on("click", "#inicioSesion", function (e) {
        e.preventDefault()
        //Cerrar el modal de registro
        $("#modalRegistro").modal("hide")
        //Abrir el modal de iniciar sesión
        $("#modalInicioSesion").modal("show")
    })

    // Enviar formulario de Inicio de Sesión al pulsar Enter o el botón
    $(document).on("submit", "#formInicioSesion", function (e) {
        e.preventDefault();
        consultarUsuario();
    });

    // Enviar formulario de Registro al pulsar Enter o el botón
    $(document).on("submit", "#formRegistro", function (e) {
        e.preventDefault();
        crearCuentaUsuario();
    });

    //Cerrar sesión
    $(document).on("click", ".cerrarSesion", function () {
        $(".logueado").addClass("visually-hidden")
        $(".login").removeClass("visually-hidden")
        //Borrar localStorage
        localStorage.clear()
        // Recargar la página para volver al estado inicial
        location.reload()
    })

    //Navegador de secciones
    $(".navSecciones .nav-link").on("click", function (e) {
        e.preventDefault()
        const seccion = $(this).data("seccion")

        cargarPaginaNavegadorSecciones(seccion)
    });

    /*FOOTER*/
    /*Sobre nosotros*/
    $(".enlaceAbout").on("click", function (e) {
        e.preventDefault(); // Evitar la recarga de la página
        const seccion = $(this).data("seccion"); // Obtener la sección del atributo data-seccion
        cargarSobreNosotros(seccion)
    })

    //Suscribirse al newsletter
    $(document).on("submit", "#formNewsletter", function (e) {
        e.preventDefault()
        const email = $("#emailNewsletter").val() // Obtén el valor del email

        // Validar que el email no esté vacío
        if (!email) {
            $("#newsletterFeedback")
                .removeClass("visually-hidden text-success")
                .addClass("text-danger")
                .text("Por favor, introduce un email válido.")
            return
        }
        suscribirseNewsletter(email)
    })

    // Navegador de secciones móvil
    // Cerrar el offcanvas al hacer clic en un enlace (usar API de Bootstrap para evitar dejar el backdrop)
    $(document).on("click", ".offcanvas .nav-link", function () {
        const offcanvasEl = $(this).closest('.offcanvas')[0];
        if (!offcanvasEl) return;
        // Obtener la instancia existente o crear una nueva si no existe
        let offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (!offcanvasInstance) {
            offcanvasInstance = new bootstrap.Offcanvas(offcanvasEl);
        }
        offcanvasInstance.hide();
    });

    /*CESTA DE LA COMPRA*/

    //Añadir una obra a la cesta de la compra
    $(document).on("click", ".addCesta", function () {
        const idObra = $(this).data("id");
        const precioVenta = parseFloat($(this).data("precio")); 
    
        // Verificar si la obra ya está en el carrito
        const obraExistente = carrito.find(item => item.idObra == idObra);
        if (obraExistente) {
            alert("Esta obra ya está en el carrito.");
            return;
        }
        // Agregar la obra al carrito
        carrito.push({ idObra: idObra, precioVenta: precioVenta })
    
        // Actualizar el carrito en el offcanvas
        let carritoHTML = carrito.map(item => `<p>Obra ID: ${item.idObra} - Precio: ${item.precioVenta} €</p>`).join("");
        $("#carritoItems").html(carritoHTML);
    
        // Actualizar el total
        actualizarTotalCarrito()
        console.log("Tamaño del carrito:", carrito.length);
        actualizarBadgeCarrito(carrito.length) 
        
    })

    //Cesta de la compra
    $(document).on("click", "#cesta", function () {
        //Borrar el contenido del offcanvas
        $("#offcanvasRight .offcanvas-body").empty()
        //Mostrar las obras
        carrito.forEach(obra => {
            mostrarCesta(obra.idObra)
        })
    })

    //Eliminar una obra del carrito
    $(document).on("click", ".eliminarObra", function () {
        const idObra = $(this).data("id");
        $(`#obra-${idObra}`).remove(); // Eliminar la obra de la cesta
        carrito = carrito.filter((elemento) => elemento.idObra !== idObra); // Eliminar la obra del array `carrito`
        
        // Actualizar el total y el badge
        actualizarTotalCarrito();
        actualizarBadgeCarrito(carrito.length);
    });

    //Confirmar la compra
    $(document).on("click", "#finalizarCompra", function () {
        if (carrito.length == 0) {
            alert("La cesta está vacía.")
            return
        }

        // Comprobar si el usuario está logueado y es tipo "coleccionista"
        if (!objetoUsuario) {
            alert("Debes iniciar sesión para finalizar la compra.");
            return;
        }

        if (objetoUsuario.tipo != "coleccionista") {
            alert("Debes ser coleccionista para poder comprar.");
            return;
        }

        // Mostrar el modal para finalizar la compra
        $("#modalFinalizarCompra").modal("show");

        
    });

    $(document).on("click", "#confirmarCompraModal", function () {
        const metodoPago = $("#metodoPago").val();
        const observaciones = $("#observaciones").val();
        const idUsuario = objetoUsuario.idUsuario

        if (!metodoPago) {
            alert("Por favor, selecciona un método de pago.");
            return;
        }

        // Enviar los datos al servidor
        $.ajax({
            url: "php/confirmarCompra.php",
            type: "POST",
            data: {
                carrito: JSON.stringify(carrito),
                metodoPago: metodoPago,
                observaciones: observaciones,
                idColeccionista: idUsuario
            },
            success: function (response) {
                if (response.success) {
                    alert("Compra confirmada correctamente");
                    location.reload();
                } else {
                    console.error("Error al confirmar la compra:", response.error);
                    alert("No se pudo confirmar la compra: " + response.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al confirmar la compra:", textStatus, errorThrown);
                alert("Error al intentar confirmar la compra.");
            }
        });

        // Cerrar el modal
        $("#modalFinalizarCompra").modal("hide");
    })    

})

//Función que comprueba si las credenciales del usuario son correctas.
function consultarUsuario() {
    //Borrar el contenido del alert de login
    $(".errorLogin").empty().addClass("visually-hidden")

    let mensajeError = ""
    //Validar todos los campos con HTML5 Form Validation API
    const form = $("#formInicioSesion")[0]
    if (!form.checkValidity()) {
        form.reportValidity()
        return
    }

    //Si el formulario es válido, se recogen los datos
    let email = $("#emailInicio").val().trim()
    let contraseña = $("#passwordInicio").val().trim()
    let datos = {
        email: email,
        contrasena: contraseña,
    }
    $.ajax({
        url: "php/login.php",
        type: "POST",
        data: datos,
        dataType: "json",
        success: function (respuesta) {
            if (respuesta.success) {
                const usuario = respuesta.success

                //Guardar en  LocalStorage
                localStorage.setItem("usuario", JSON.stringify(usuario))
                let objetoUsuario = JSON.parse(localStorage.getItem("usuario"))
                usuarioLogueadoCorrecto(objetoUsuario)

                //Ocultar modal
                $("#modalInicioSesion").modal("hide")

                // Recargar la página para evitar errores posteriores
                location.reload()
            } else {
                mensajeError =
                    "<p>" + (respuesta.error || "Error al hacer login") + "</p>"
                $(".errorLogin").append(mensajeError).removeClass("visually-hidden")
            }
        },
        error: function () {
            mensajeError = "<p>Error al cargar el login</p>"
            $(".errorLogin").append(mensajeError).removeClass("visually-hidden")
        },
    })
}

//Función para comprobar el tipo de usuario y mostrar el dropdown con las opciones personalizadas
function usuarioLogueadoCorrecto(objetoUsuario) {

    //Añadir como atributo data el id de usuario al btn-saludo
    let idUsuario = `${objetoUsuario.idUsuario}`
    $(".btn-saludo").data("id", idUsuario)

    //Comprobar si el usuario es admin para no mostrar opción del perfil
    if (objetoUsuario.tipo == "admin") {
        $(".botonPerfil").addClass("visually-hidden")
    }
    
    //Ocultar el icono de persona y login
    $(".login").addClass("visually-hidden")
    //Mostrar el dropdown Logueado
    $(".logueado").removeClass("visually-hidden")
    cargarDatosPerfilUsuario(objetoUsuario)
}

//Función para crear una cuenta de usuario
function crearCuentaUsuario() {
    //Borrar mensajes de errores anteriores
    $(".errorRegistro").empty().addClass("visually-hidden")

    let mensajeError = ""

    //Validar todos los campos con HTML5 Form Validation API
    const form = $("#formRegistro")[0]
    if (!form.checkValidity()) {
        form.reportValidity()
        return
    }
    let email = $("#emailRegistro").val().trim()
    let contrasena = $("#passwordRegistro").val().trim()
    let confirmarContrasena = $("#passwordRegistroConfirmar").val().trim()
    let tipoUsuario = $("#selectTipoUsuario").val().trim()

    //Comprobar que las contraseñas coinciden
    if (contrasena != confirmarContrasena) {
        mensajeError = "<p>Las contraseñas no coinciden</p>"
        $(".errorRegistro").append(mensajeError).removeClass("visually-hidden")
        return
    }

    if (!$("#aceptarCondiciones").is(":checked")) {
        mensajeError =
            "<p>Debes marcar la casilla de las Condiciones y Política de Privacidad.</p>"
        $(".errorRegistro").append(mensajeError).removeClass("visually-hidden")
        return
    }

    let datos = {
        email: email,
        contrasena: contrasena,
        tipoUsuario: tipoUsuario,
    }

    $.ajax({
        url: "php/registro.php",
        type: "POST",
        data: datos,
        dataType: "json",
        success: function (respuesta) {
            if (respuesta.success) {
                mensajeError = `<p>${respuesta.success}</p>`
                $(".errorRegistro").append(mensajeError).removeClass("visually-hidden")
                //Mostrar el mensaje durante 5 segundos, ocultar el modal de registro y mostrar el modal de iniciar sesión
                setTimeout(function () {
                    $(".errorRegistro").addClass("visually-hidden").empty()
                    $("#modalRegistro").modal("hide")
                    $("#modalLogin").modal("show")
                }, 3000)
            } else if (respuesta.error) {
                mensajeError = `<p>${respuesta.error}</p>`
                $(".errorRegistro").append(mensajeError).removeClass("visually-hidden")
            } else {
                mensajeError = `<p>Se ha producido un error al crear la cuenta. Inténtalo de nuevo.</p>`
                $(".errorRegistro").append(mensajeError).removeClass("visually-hidden")
            }
        },
    })
}

//Función para cargar el formulario para completar perfil de manera dinámica
function cargarFormularioPerfilUsuario(objetoUsuario) {
    //Cargar la página con el formulario del perfil
    $.ajax({
        url: "perfilUsuario.html",
        type: "GET",
        success: function (respuesta) {
            //Ocultar sección principal
            $("#principal").addClass("visually-hidden")
            //Mostrar la sección dinámica
            $("#seccionDinamica").removeClass("visually-hidden").html(respuesta)
        },
        error: function () {
            console.log("Error al cargar el formulario para completar perfil")
        },
    })
}

function actualizarImagenPerfil(imagen, tipo) {
    let imagenSrc = "images/Perfil/"
    if (!imagen) {
        switch (tipo) {
            case "artista":
                imagenSrc += "perfilArtistaDefecto.png"
                break
            case "coleccionista":
                imagenSrc += "perfilColeccionistaDefecto.png"
                break
            case "galeria":
                imagenSrc += "perfilGaleriaDefecto.png"
                break
            case "admin":
                imagenSrc += "perfilAdminDefecto.png"
                break
            default:
                console.warn(
                    `Tipo de usuario desconocido: ${tipo}. Usando imagen por defecto.`
                )
                imagenSrc += "porDefecto.png"
        }
    } else {
        if(tipo=="galeria"){
            imagenSrc = `images/Galerías/${imagen}`
        }else{
            imagenSrc += `${imagen}`
        }
        
    }
    return imagenSrc
}

function cargarDatosPerfilUsuario(objetoUsuario) {
    // Si el perfil está completo, obtener datos existentes

    $.ajax({
        url: "php/obtenerPerfil.php",
        type: "POST",
        data: { idUsuario: objetoUsuario.idUsuario, tipo: objetoUsuario.tipo},
        dataType: "json",
        success: function (respuesta) {
            if (respuesta.success) {
                const usuario = respuesta.data
                let imagenPerfil = ""

                imagenPerfil = actualizarImagenPerfil(usuario.imagen, objetoUsuario.tipo)

                // Actualizar el texto del botón
                $(".btn-saludo").html(`
                    <span class="d-none d-md-inline">Hola, ${usuario.nombre}</span>
                `)
                $(".logueado .imgPerfil").attr("src", imagenPerfil)
                //Mostrar el botón de configuración
                $(".configuracion").removeClass("visually-hidden")
            } else {
                // Mostrar la imagen por defecto para los usuarios que no tienen perfil completado
                imagenPerfil = actualizarImagenPerfil(null, objetoUsuario.tipo)

                //Crear alerta en el botón de perfil
                $(".botonPerfil i").attr(
                    "class",
                    "bi bi-exclamation-circle me-2 text-danger"
                )
                //Ocultar el botón de configuración
                $(".configuracion").addClass("visually-hidden")
                $(".logueado .imgPerfil").attr("src", imagenPerfil)
                console.error("Error al obtener datos del perfil:", respuesta.error)
            }
        },
        error: function () {
            console.error("Error en la solicitud AJAX para obtener perfil")
        },
    })
}

// Función para cargar la página dinámica según la sección del navegador seleccionada
function cargarPaginaNavegadorSecciones(seccion) {
    
    // Si se pide la sección "inicio", mostrar el contenedor principal
    if (seccion == "inicio") {
        // Ocultar la sección dinámica (y vaciar su contenido) y mostrar el principal
        $("#seccionDinamica").addClass("visually-hidden").empty();
        $("#principal").removeClass("visually-hidden");
        // Desplazar al inicio
        $("html, body").animate({ scrollTop: 0 }, 400);
        return;
    }
    // Mapeo de secciones a sus archivos HTML y scripts
    const secciones = {
        artistas: { html: "artistas.html", script: "js/scriptArtistas.js" },
        pintura: { html: "pintura.html", script: "js/scriptObras.js" },
        fotografia: { html: "fotografia.html", script: "js/scriptObras.js" },
        escultura: { html: "escultura.html", script: "js/scriptObras.js" },
        dibujo: { html: "dibujo.html", script: "js/scriptObras.js" },
        exposiciones: { html: "exposiciones.html", script: "js/scriptExposiciones.js" },
        about: { html: "about.html", script: "js/scriptAbout.js" },
    };

    // Comprobar si la sección existe en el mapeo
    if (secciones[seccion]) {
        const { html, script } = secciones[seccion];

        // Ocultar la sección principal
        $("#principal").addClass("visually-hidden");

        // Cargar la sección dinámica
        $("#seccionDinamica").removeClass("visually-hidden").load(html, function () {
            $.getScript(script); // Cargar el script correspondiente
        });
    } else {
        console.warn(`Sección desconocida: ${seccion}`);
    }
}


function suscribirseNewsletter(email) {
    $("#mensajeNewsletter").addClass("visually-hidden text-dark").text("")
    $.ajax({
        url: "php/suscribirNewsletter.php",
        type: "POST",
        data: { email: email },
        dataType: "json",
        success: function (respuesta) {
            if (respuesta.success) {
                $("#mensajeNewsletter").removeClass("visually-hidden text-dark").text(`${respuesta.mensaje}`)
                $("#emailNewsletter").val("")
                // Ocultar el mensaje después de 3 segundos
                setTimeout(function () {
                    $("#mensajeNewsletter").addClass("visually-hidden text-dark").text("")
                }, 3000)
            } else {
                $("#mensajeNewsletter")
                    .removeClass("visually-hidden text-dark")
                    .text(respuesta.mensaje || "Hubo un error al procesar tu solicitud. Inténtalo de nuevo.")
            }
        },
        error: function (error) {
            console.error("Error en la solicitud AJAX:", error)
            $("#mensajeNewsletter").removeClass("visually-hidden text-dark").text("Hubo un error al conectar con el servidor. Inténtalo más tarde.")
        },
    })
}

function cargarSobreNosotros(seccion){
    //Ocultar sección principal
    $("#principal").addClass("visually-hidden")
    // Cargar about.html dinámicamente
    $("#seccionDinamica").load("about.html", function (response, status, xhr) {
        if (status == "error") {
            console.error("Error al cargar about.html:", xhr.status, xhr.statusText);
            $("#seccionDinamica").removeClass("visually-hidden").html("<p>Error al cargar la página.</p>");
        } else {
            // Cargar el script específico para about.html
            $.getScript("js/scriptAbout.js")
                .done(function () {
                    // Desplazarse a la sección específica (si se especificó)
                    if (seccion) {
                        const target = $("#" + seccion);
                        if (target.length) {
                            $("html, body").animate({
                                scrollTop: target.offset().top
                            }, 800); // Animación de desplazamiento
                        }
                    }
                })
                .fail(function (jqxhr, settings, exception) {
                    console.error("Error al cargar scriptAbout.js:", exception);
                })
        }
    })
}

function mostrarCesta(idObra) {
    $.ajax({
        url: "php/obtenerObraPorId.php", // Archivo PHP que devuelve los datos de la obra
        type: "POST",
        data: { idObra: idObra },
        dataType: "json",
        success: function (obra) {
            if (obra.success && obra.data) {
                const obraHTML = `
                <div class="card mb-2" id="obra-${obra.data.idObra}">
                    <div class="row g-2">
                        <div class="col-3 align-self-center">
                            <img src="images/Obras/${obra.data.imagenObra}" class="img-fluid rounded-start" alt="${obra.data.nombreObra}">
                        </div>
                        <div class="col-7">
                            <div class="card-body p-2 d-flex justify-content-between align-content-center">
                                <div class="card-body d-flex flex-column">
                                    <h6 class="card-title m-0 p-0">${obra.data.nombreObra}</h6>
                                    <p class="card-text small m-0 p-0">${obra.data.nombreArtista} ${obra.data.apellidos}</p>
                                    <p class="card-text small fw-bold m-0 p-0">${obra.data.precioVenta}€</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-2 align-self-center">
                            <button class="btnDel eliminarObra" data-id="${obra.data.idObra}">
                                <i class="bi bi-trash3 text-black"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
                $("#offcanvasRight .offcanvas-body").append(obraHTML);
            } else {
                console.error("Error al obtener los datos de la obra:", obra.error || "Datos incompletos");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener la obra:", error);
        }
    });
}


function cargarCategorias() {
    $.ajax({
        url: "php/cargarCategorias.php", 
        type: "GET",
        dataType: "json",
        success: function (response) {
            if (response.success) {
                const categorias = response.data
                const gridCategorias = $("#gridCategorias")
                gridCategorias.empty() // Vaciar el contenido previo

                categorias.forEach((categoria) => {
                    const categoriaHTML = `
                        <div class="col-md-4">
                            <div class="categoria-card position-relative overflow-hidden" data-id="${categoria.idCategoria}" style="background-image: url('images/Categorias/${categoria.imagen}');">
                                <div class="categoria-overlay d-flex align-items-center justify-content-center">
                                    <h3 class="categoria-titulo text-white text-center">${categoria.nombre}</h3>
                                </div>
                            </div>
                        </div>
                    `;
                    gridCategorias.append(categoriaHTML);
                });
            } else {
                console.error("Error al cargar las categorías:", response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar las categorías:", error);
        }
    });
}

//Función para cargar la sección Novedades
function cargarNovedades() {
    $.ajax({
        url: "php/cargarNovedades.php", // Archivo PHP para cargar las novedades
        type: "GET",
        dataType: "json",
        success: function (response) {
            if (response.success) {
                const artistas = response.data;
                const contenedor = $("#novedadesArtistas")
                contenedor.empty()

                artistas.forEach((artista) => {
                    const cardHTML = `
                        <div class="col-md-3 mt-4">
                            <div class="card profile-card-5">
                                <div class="card-img-block">
                                    <img class="card-img-top imgObra" src="images/Perfil/${artista.imagen}" alt="foto de perfil de ${artista.nombre}${artista.apellidos}">
                                </div>
                                <div class="card-body pt-0">
                                    <h5 class="card-title text-center">${artista.nombre} ${artista.apellidos}</h5>
                                    <p class="card-text text-center">${artista.pais}</p>
                                    <p class="card-text text-center">${artista.totalObras} obras</p>
                                </div>
                                <div class="icon-block text-center mb-2">
                                    <a class="me-3" href="https://www.facebook.com/"><i class="bi bi-facebook colorIcono fs-5"></i></a>
                                    <a class="me-3" href="https://www.instagram.com"><i class="bi bi-instagram colorIcono fs-5"></i></a>
                                    <a href="https://mastodon.social"><i class="bi bi-mastodon colorIcono fs-5"></i></a>
                                </div>
                            </div>
                        </div>
                    `;
                    contenedor.append(cardHTML)
                });
            } else {
                console.error("Error al cargar los artistas:", response.error)
            }
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar los artistas:", error)
        }
    });
}

function cargarGalerias() {
    $.ajax({
        url: "php/cargarGalerias.php", // Archivo PHP para cargar las galerías
        type: "GET",
        dataType: "json",
        success: function (response) {
            if (response.success) {
                const galerias = response.data;
                const contenedor = $("#exposiciones");
                contenedor.empty(); // Limpiar contenido previo

                galerias.forEach((galeria) => {
                    const cardHTML = `
                        <div class="col-md-4 mt-4">
                            <div class="card">
                                <img class="card-img-top" src="images/Galerías/${galeria.imagen}" alt="${galeria.nombre}" style="max-height: 250px;">
                                <div class="card-body">
                                    <h5 class="card-title"><strong>Galería ${galeria.nombre}</strong></h5>
                                    <p><i class="bi bi-geo-alt-fill colorIcono me-2"></i>${galeria.ciudad}</p> 
                                    <p><i class="bi bi-envelope-at-fill colorIcono me-2"></i> ${galeria.email}</p>
                                    <p><i class="bi bi-telephone-fill colorIcono me-2"></i>${galeria.telefono}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    contenedor.append(cardHTML); // Agregar la card al contenedor
                });
            } else {
                console.error("Error al cargar las galerías:", response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar las galerías:", error);
        }
    });
}

function cargarConfiguracion(objetoUsuario) {
    const idUsuario = objetoUsuario.idUsuario; // Obtener el ID del usuario desde el objetoUsuario

    switch (objetoUsuario.tipo) {
        case "artista":
            $("#principal").addClass("visually-hidden");
            $("#seccionDinamica")
                .attr("data-id-artista", idUsuario) // Agregar el ID del artista como atributo data
                .removeClass("visually-hidden")
                .load("configuracionArtista.html");
            break;
        case "coleccionista":
            $("#principal").addClass("visually-hidden");
            $("#seccionDinamica")
                .attr("data-id-coleccionista", idUsuario) // Agregar el ID del coleccionista como atributo data
                .removeClass("visually-hidden")
                .load("configuracionColeccionista.html");
            break;
        case "galeria":
            $("#principal").addClass("visually-hidden");
            $("#seccionDinamica")
                .attr("data-id-galeria", idUsuario) // Agregar el ID de la galería como atributo data
                .removeClass("visually-hidden")
                .load("configuracionGaleria.html");
            break;
        case "admin":
            $("#principal").addClass("visually-hidden");
            $("#seccionDinamica")
                .removeClass("visually-hidden")
                .load("configuracionAdmin.html");
            break;
        default:
            console.error("Tipo de usuario no válido");
    }
}

// Función para actualizar el total del carrito
function actualizarTotalCarrito() {
    let total = carrito.reduce((sum, item) => sum + item.precioVenta, 0); 
    $("#totalCarrito").text(`${total.toFixed(2)} €`); 
}

// Función para actualizar el badge del carrito
function actualizarBadgeCarrito(cantidad) {
    const $badgeCarrito = $("#badgeCarrito");

    if (cantidad > 0) {
        $badgeCarrito.text(cantidad); // Actualiza el número en el badge
        $badgeCarrito.removeClass("visually-hidden"); // Muestra el badge
    } else {
        $badgeCarrito.addClass("visually-hidden"); // Oculta el badge si no hay obras
    }
}