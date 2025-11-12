/// <reference types="jquery" />
///npm install @types/jquery --save-dev

$(function () {
    // Datos de los asistentes
    const asistentes = [
        {
            nombre: "Silvia Donoso",
            descripcion: "Especialista en asesoría a artistas emergentes.",
            imagenPerfil: "images/Asistentes/asistenta1.jpg",
        },
        {
            nombre: "Francisco Sánchez",
            descripcion: "Responsable de exposiciones internacionales.",
            imagenPerfil: "images/Asistentes/asistente1.jpg",
            
        },
        {
            nombre: "Joaquín García",
            descripcion: "Responsable de arte contemporáneo.",
            imagenPerfil: "images/Asistentes/asistente4.jpg",
        },
        {
            nombre: "Israel Delgado",
            descripcion: "Especialista en arte moderno.",
            imagenPerfil: "images/Asistentes/asistente2.jpg",
        },
        {
            nombre: "Pedro Domínguez",
            descripcion: "Experto en arte digital.",
            imagenPerfil: "images/Asistentes/asistente3.jpg",
        },
        {
            nombre: "Paula Filomeno",
            descripcion: "Gestora cultural y promotora de arte.",
            imagenPerfil: "images/Asistentes/asistenta3.jpg",
        }
    ];

    generarCardsAsistentes(asistentes);
});

// Función para generar las cards de asistentes
function generarCardsAsistentes(asistentes) {
    const contenedor = $(".cardAsistentes"); // Selecciona el contenedor donde se agregarán las cards
    contenedor.empty(); // Limpia el contenido previo (si es necesario)

    asistentes.forEach((asistente) => {
        const cardHTML = `
            <div class="col-md-4 mt-4">
                <div class="card profile-card-5">
                    <div class="card-img-block">
                        <img class="card-img-top imgObra" src="${asistente.imagenPerfil}" alt="foto de perfil de ${asistente.nombre}">
                    </div>
                    <div class="card-body pt-0">
                        <h5 class="card-title text-center">${asistente.nombre}</h5>
                        <p class="card-text text-center">${asistente.descripcion}</p>
                    </div>
                    <div class="icon-block text-center mb-2">
                        <a class="me-3" href="https://www.facebook.com/"><i class="bi bi-facebook colorIcono fs-5"></i></a>
                        <a class="me-3" href="https://www.instagram.com"><i class="bi bi-instagram colorIcono fs-5"></i></a>
                        <a href="https://mastodon.social"><i class="bi bi-mastodon colorIcono fs-5"></i></i></a>
                    </div>
                </div>
            </div>
        `;
        contenedor.append(cardHTML); // Agrega la card al contenedor
    });
}