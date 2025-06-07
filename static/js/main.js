// Función que obtiene los datos de la API y crea las cards
function obtenerDatos() {
    fetch('https://eduteca-b48db-default-rtdb.firebaseio.com/cursos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const cardDeck = document.getElementById('card-deck');
            cardDeck.innerHTML = ''; // Limpiar el contenedor de cards
            for (let key in data) {
                const objeto = data[key];
                // Crear los elementos HTML para la card
                const card = document.createElement('div');
                card.classList.add('card');
                const imagen = document.createElement('img');
                imagen.classList.add('card-img-top');
                imagen.src = objeto.imagen; // Asegúrate de que esto sea una URL válida o base64
                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
                const titulo = document.createElement('h5');
                titulo.classList.add('card-title');
                titulo.textContent = objeto.titulo; // Cambiado a 'titulo'
                const duracion = document.createElement('p');
                duracion.classList.add('card-text');
                duracion.textContent = 'Duración: ' + objeto.duracion + ' horas';
                const valor = document.createElement('p');
                valor.classList.add('card-text');
                valor.textContent = 'Valor: $' + objeto.valor;
                const botonDetalle = document.createElement('button');
                botonDetalle.classList.add('btn', 'btn-primary');
                botonDetalle.textContent = 'Detalle';
                botonDetalle.addEventListener('click', function() {
                    window.location.href = 'otra_pagina?id=' + key; // Cambiar a la ruta correcta
                });
                
                // Agregar los elementos a la card
                cardBody.appendChild(titulo);
                cardBody.appendChild(duracion);
                cardBody.appendChild(valor);
                cardBody.appendChild(botonDetalle);
                card.appendChild(imagen);
                card.appendChild(cardBody);
                cardDeck.appendChild(card);
            }
        })
        .catch(error => {
            console.error('Hubo un problema al obtener los datos:', error);
            alert('No se pudieron cargar los cursos. Intenta de nuevo más tarde.');
        });
}


// Función que obtiene los detalles del curso en otra_pagina.html
function obtenerDetallesCurso() {
    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('id');

    if (!cursoId) {
        console.error('No se proporcionó un ID de curso.');
        alert('ID de curso no válido.');
        return;
    }

    fetch(`https://eduteca-b48db-default-rtdb.firebaseio.com/cursos/${cursoId}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta: ' + response.statusText);
            }
            return response.json();
        })
        .then(cursos => {
            if (!cursos) {
                console.error('No se encontraron detalles para el curso con ID:', cursoId);
                alert('No se encontraron detalles para este curso.');
                return;
            }
            const descripcionContainer = document.getElementById('descripcion-container');
            // Crear elementos HTML para mostrar los detalles del curso
            const nombre = document.createElement('h2');
            nombre.textContent = cursos.titulo; // Cambiado a 'titulo'
            const duracion = document.createElement('p');
            duracion.textContent = 'Duración: ' + cursos.duracion + ' horas';
            const valor = document.createElement('p');
            valor.textContent = 'Valor: $' + cursos.valor;
            const imagen = document.createElement('img');
            imagen.src = cursos.imagen; // Asegúrate de que esto sea una URL válida o base64
            imagen.style.maxWidth = '400px'; // Establecer un ancho máximo para la imagen
            
            // Limpiar el contenedor antes de agregar nuevos elementos
            descripcionContainer.innerHTML = '';
            
            descripcionContainer.appendChild(nombre);
            descripcionContainer.appendChild(duracion);
            descripcionContainer.appendChild(valor);
            descripcionContainer.appendChild(imagen);
        })
        .catch(error => {
            console.error('Hubo un problema al obtener los detalles del curso:', error);
        });
}


// Agregar un evento al formulario para enviar los datos a la API
const formCurso = document.getElementById('form-curso');
if (formCurso) {
    formCurso.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que la página se recargue al enviar el formulario
        // Obtener la imagen seleccionada
        const imagenInput = document.getElementById('imagen');
        const imagenFile = imagenInput.files[0];
        const reader = new FileReader();
        // Convertir la imagen a base64
        reader.onload = (event) => {
            const imagenBase64 = event.target.result;
            // Obtener los valores del formulario
            const nombreCurso = document.getElementById('nombrecurso').value;
            const duracion = document.getElementById('duracion').value;
            const valor = document.getElementById('valor').value;
            const descripcion = document.getElementById('descripcion').value;
            const requisito1 = document.getElementById('requisito1').value;
            const requisito2 = document.getElementById('requisito2').value;
            // Enviar los datos a la API
            fetch('https://eduteca-b48db-default-rtdb.firebaseio.com/cursos.json', {
                method: 'POST',
                body: JSON.stringify({
                    nombrecurso: nombreCurso,
                    duracion: duracion,
                    valor: valor,
                    imagen: imagenBase64,
                    descripcion: descripcion,
                    requisito1: requisito1,
                    requisito2: requisito2,
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red: ' + response.statusText);
                }
                alert('El curso ha sido agregado con éxito');
                obtenerDatos(); // Actualizar la lista de cursos
            })
            .catch(error => console.error('Hubo un problema al agregar el curso:', error));
        };
        reader.readAsDataURL(imagenFile);
    });
}

// Ejecutar las funciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('card-deck')) {
        obtenerDatos(); // Cargar los datos al inicio
        setInterval(obtenerDatos, 5000); // Actualizar cada 5 segundos
    }
    // Ejecutar la función obtenerDetallesCurso si estamos en otra_pagina.html
    if (document.getElementById('descripcion-container')) {
        obtenerDetallesCurso();
    }
});
