/// <reference types="jquery" />
///npm install @types/jquery --save-dev

$(function () {
    //Comprobar si existen una sesión iniciada
    let objetoUsuario = JSON.parse(localStorage.getItem("usuario"))
    console.log("Objeto usuario en scriptPerfilUsuario.js:", objetoUsuario)
    if (!objetoUsuario) {
        console.error("No se encontró un usuario en localStorage")
        window.location.href = "index.html"
        return
    }

    //Cambiar el título del formulario dinámicamente
    $(".tituloPerfilUsuario").text(objetoUsuario.perfilCompletado == 0 ? "Completa tu perfil" : "Modificar perfil")
    
    //Mostrar campos según el tipo de usuario
    completarFormularioSegunTipoUsuario(objetoUsuario.tipo)

    // Si el perfil está completo, obtener datos existentes
    if (objetoUsuario.perfilCompletado == 1) {
        $.ajax({
            url: "php/obtenerPerfil.php",
            type: "POST",
            data: { idUsuario: objetoUsuario.idUsuario, tipo: objetoUsuario.tipo },
            dataType: "json",
            success: function (respuesta) {
                if (respuesta.success) {
                    cargarDatosPerfil(respuesta.data)
                } else {
                    console.error("Error al obtener datos del perfil:", respuesta.error)
                }
            },
            error: function () {
                console.error("Error en la solicitud AJAX para obtener perfil")
            }
        })
    }

    mostrarImagenPerfilUsuario()

    actualizarPerfil(objetoUsuario)
})

function cargarDatosPerfil(usuario) {
    //Cargar campos comunes
    $("#nombre").val(usuario.nombre || "")
    $("#direccion").val(usuario.direccion || "")
    $("#ciudad").val(usuario.ciudad || "")
    $("#codigoPostal").val(usuario.codigoPostal || "")
    $("#pais").val(usuario.pais || "")
    $("#telefono").val(usuario.telefono || "")

    //Cargar campos específicos según tipo de usuario
    if (usuario.tipo == "artista" || usuario.tipo == "coleccionista") {
        $("#apellidos").val(usuario.apellidos || "")
        $("#genero").val(usuario.genero || "")
    }
    if (usuario.tipo == "artista") {
        $("#fechaNacimiento").val(usuario.fechaNacimiento || "")
    }
    if (usuario.tipo == "galeria") {
        $("#metrosCuadrados").val(usuario.metrosCuadrados || "")
    }

    //Si hay una imagen de perfil, mostrarla
    if (usuario.imagen) {
        const rutaImagen = "images/Perfil/" + usuario.imagen
        $("#vistaPreviaImagen").attr("src", rutaImagen).show()
        $("#imagenPerfilUsuario").removeClass("visually-hidden")
    }else{
        $("#vistaPreviaImagen").hide()
    }
}

//Función para actualizar los datos del perfil de usuario previamente registrado y logueado.
function actualizarPerfil(objetoUsuario){

    $("#formPerfilUsuario").on("submit", function (e) {
        e.preventDefault()

        const formPerfilUsuario = this

        //Limpiar mensajes de error anteriores
        $(".errorPerfil").empty().addClass("visually-hidden")


        // Validaciones adicionales en el cliente
        let mensajeError = ""
        let nombre = $("#nombre").val().trim()
        let direccion = $("#direccion").val().trim()
        let ciudad = $("#ciudad").val().trim()
        let codigoPostal = $("#codigoPostal").val().trim() 
        let pais = $("#pais").val().trim()
        let telefono = $("#telefono").val().trim()

        if (!nombre || !direccion || !ciudad || !codigoPostal || !pais || !telefono) {
            mensajeError = "<p>Todos los campos obligatorios deben estar completos.</p>"
            $(".errorPerfil").append(mensajeError).removeClass("visually-hidden")
            return
        }

        // Validaciones específicas por tipo de usuario
        if (objetoUsuario.tipo == "artista" || objetoUsuario.tipo == "coleccionista") {
            let apellidos = $("#apellidos").val().trim()
            let genero = $("#genero").val()
            if (!apellidos || !genero) {
                mensajeError = "<p>Los campos obligatorios deben estar completos.</p>"
                $(".errorPerfil").append(mensajeError).removeClass("visually-hidden")
                return
            }
        }

        //Validar que el usuario tenga al menos 18 años
        if (objetoUsuario.tipo == "artista") {
            let fechaNacimiento = $("#fechaNacimiento").val();
            if (!fechaNacimiento) {
                mensajeError = "<p>La fecha de nacimiento es obligatoria.</p>"
                $(".errorPerfil").append(mensajeError).removeClass("visually-hidden")
                return
            }
            let today = new Date();
            let birthDate = new Date(fechaNacimiento);
            if (birthDate > today) {
                mensajeError = "<p>La fecha de nacimiento no puede ser futura.</p>"
                $(".errorPerfil").append(mensajeError).removeClass("visually-hidden")
                return
            }
            let age = today.getFullYear() - birthDate.getFullYear()
            let monthDiff = today.getMonth() - birthDate.getMonth()
            if (monthDiff < 0 || (monthDiff == 0 && today.getDate() < birthDate.getDate())) {
                age--
            }
            if (age < 18) {
                mensajeError = "<p>Debes tener al menos 18 años para registrarte.</p>"
                $(".errorPerfil").append(mensajeError).removeClass("visually-hidden")
                return
            }
        }

        //Preparar los datos para enviarlos al servidor
        const formData = new FormData(formPerfilUsuario)
        //Añadir idUsuario, email y tipo con los datos de "objetoUsuario"
        formData.append("idUsuario", objetoUsuario.idUsuario)
        formData.append("email", objetoUsuario.email)
        formData.append("tipo", objetoUsuario.tipo)
        formData.append("perfilCompletado", objetoUsuario.perfilCompletado)

        // Log de datos enviados
        console.log("Datos enviados en FormData:")
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1])
        }

        $.ajax({
            url: "php/perfilUsuario.php",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (respuesta) {
                console.log("Respuesta de perfilUsuario.php:", respuesta)
                if (respuesta.success) {

                    //Mostrar mensaje de éxito
                    $(".errorPerfil").append(`<p>${respuesta.success}</p>`).removeClass("visually-hidden")
                    objetoUsuario.perfilCompletado = 1
                    //Actualizar localStorage
                    localStorage.setItem("usuario", JSON.stringify(objetoUsuario))

                    //Redirigir después de 3 segundos
                    setTimeout(function () {
                        $(".errorPerfil").addClass("visually-hidden").empty()
                        window.location.href = "index.html"
                    }, 3000);
                } else {
                    $(".errorPerfil").append(`<p>Error: ${respuesta.error || "No se pudo guardar el perfil"}</p>`).removeClass("visually-hidden")
                }
            },
            error: function (xhr, status, error) {
                console.error("Error en AJAX:", status, error)
                $(".errorPerfil").append(`<p>Error al guardar el perfil: ${error}</p>`).removeClass("visually-hidden")
            },
        })
    })
}

//Función que completa los campos del formulario según el tipo de usuario logueado
function completarFormularioSegunTipoUsuario(tipoUsuario) {
    console.log("Tipo de usuario recibido en completarFormulario:", tipoUsuario)
    // Ocultar todos los campos
    $(".campoArtista, .campoColeccionista, .campoGaleria").hide().find(":input").prop("required", false);

    // Mostrar campos según tipo de usuario
    switch (tipoUsuario) {
        case "artista":
            $(".campoArtista").show().find(":input").prop("required", true)
            break
        case "coleccionista":
            $(".campoColeccionista").show().find(":input").prop("required", true)
            break
        case "galeria":
            $(".campoGaleria").show().find(":input").prop("required", true)
            break
        default:
            alert("Tipo de usuario desconocido. Contacta con un administrador.")
    }
}

function mostrarImagenPerfilUsuario(){
        //Manejar cambio en la imagen de perfil
        $("#imagen").on("change", function (e) {
            const file = e.target.files[0]
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]

            //Validad el tipo de archivo
            if (file && !allowedTypes.includes(file.type)) {
                alert("Por favor, selecciona una imagen válida (JPEG, JPG, PNG, GIF).")
                $(this).val("")
                $("#vistaPreviaNuevaImagen").attr("src", "").hide()
                return
            }

            //Mostrar vista previa de la imagen
            if (file) {
                const reader = new FileReader()
                reader.onload = function (event) {
                    $("#vistaPreviaImagen").attr("src", event.target.result).show()
                    $("#imagenPerfilUsuario").removeClass("visually-hidden")
                }
                reader.readAsDataURL(file)
            } else {
                $("#vistaPreviaImagen").attr("src", "").hide()
                $("#imagenPerfilUsuario").addClass("visually-hidden")
            }
        })
}