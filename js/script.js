// Apartado para cosas al cargar la pagina del local storage =========================================
document.addEventListener("DOMContentLoaded", () => {
	// carga la conf de preferencia
	if (localStorage.getItem('theme') === 'dark') {
		document.documentElement.classList.add('dark');
	}
	// boton hamburgesa
	document.getElementById("menuBtn")
		.addEventListener("click", () => {
			document.getElementById("navHid")
				.classList.toggle("hidden");
		});

	// Asignar evento al botón
	const btnOscuro = document.getElementById("BtnOscuro");
	if (btnOscuro) {
		btnOscuro.addEventListener("click", toggleDarkMode);
	}

	// Eliminar todo en caso de recarga la pagina
	localStorage.removeItem("fecha");
    localStorage.removeItem("participantes");
	localStorage.removeItem("presupuesto");
    localStorage.removeItem("usuario");
    localStorage.removeItem("evento");
	// carga pantalla inicial
	cargarPantalla('inicio');
});

// revisar el estado de los sorteos y mostrar los activos (si es que hay)


// Funciones =========================================================================================
function cargarPantalla(vista) {

	if (!verificaciones(vista)) {
		return;
	}

	fetch("./html/" + vista + ".html")
		.then(response => response.text())
		.then(html => {
			document.getElementById("principal").innerHTML = html;
			inicializacion(vista);
		})
		.catch(error => console.error("Error al continuar con la operacion", error))
};

function inicializacion(vista) {
	if (vista === "inicio") {
		leerNombre();
		mostrarEventosInicio();
	}

	if (vista === "participantes") {
		inicializarParticipantes();
		inicializarDragAndDrop();
	}

	if (vista === "restricciones") {
		inicializarExclusiones();
	}

	if(vista === "evento"){
		inicializarEvento();
	}

	if(vista === "presupuesto"){
		inicializarPresupuesto();
	}

	if(vista === "fecha"){
		inicializarFecha();
	}
	if (vista === "sorteo") { 

    	const principal = document.getElementById("principal");
    	const info = document.getElementById("seccionInfo");
    	const footer = document.getElementById("footerPagina");

    	info.classList.add("hidden");
    	footer.classList.add("hidden");
		
    	principal.classList.remove("flex-col","items-center","justify-center","fondo-normal");
    	principal.classList.add("flex","w-full","flex-1","p-0","fondo-sorteo");

		iniciarSorteo(); 
	} 
}

function verificaciones(vista) {

	// Al tratar de continuar de la pagina participantes
	if (vista === "restricciones") {

		const participantes = localStorage.getItem("participantes");

		// Verificamos si participantes existe en local storage  o si cumple la cantidad minima
		if (JSON.parse(participantes).length < 2 || !participantes) {
			error("Es necesario al menos 2 participantes para continuar!");
			return false;
		}

		return true;
	}

	// Al tratar de continuar de la pagina evento
	if (vista === "presupuesto") {

		// Verificamos si participantes existe en local storage 
		const eventoGuardado = localStorage.getItem("evento");

		if (!eventoGuardado || eventoGuardado === "null") {
			error("Es necesario seleccionar algun evento!");
			return false;
		}

		return true;
	}

	// Al tratar de continuar de la pagina presupuesto
	if (vista === "fecha") {

		// Verificamos si se selecciono un presupuesto
		const presupuestoGuardado = localStorage.getItem("presupuesto");

		if (!presupuestoGuardado || presupuestoGuardado === "null") {
			error("Es necesario seleccionar un presupuesto!");
			return false;
		}

		return true;
	}

	// Al tratar de continuar de la pagina fecha
	if (vista === "sorteo") {

		// Verificamos si se selecciono una fecha
		const fecha = localStorage.getItem("fecha");

		if (!fecha || fecha === "null") {
			error("Es necesario seleccionar una fecha!");
			return false;
		}

		return true;
	}

	// Si la pagina no requiere verificaciones, continua normalmente
	return true;
}

function error(mensaje) {
	const errorMsg = document.querySelector(".alerta");
	errorMsg.textContent = mensaje;
	setTimeout(() => { errorMsg.textContent = ""; }, 3000);
}
// Cambiar el color del boton presionado
function cambiarEstadoBoton(boton, activo) {
    if (activo) {
        boton.classList.remove("bg-white","text-black","dark:bg-blue-900","dark:text-white",
                               "bg-gray-200","text-blue-600","dark:bg-gray-700","dark:text-blue-300");
        boton.classList.add("bg-black","text-white","dark:bg-blue-300","dark:text-black");
    } else {
        boton.classList.remove("bg-black","text-white","dark:bg-blue-300","dark:text-black");
        boton.classList.add("bg-white","text-black","dark:bg-blue-900","dark:text-white",
                            "bg-gray-200","text-blue-600","dark:bg-gray-700","dark:text-blue-300");
    }
}


// Funcion para mostrar los eventos
function mostrarEventosInicio() {
    const contenedor = document.getElementById("eventos");
    const eventosGuardados = JSON.parse(localStorage.getItem("eventos")) || [];

    if (eventosGuardados.length === 0) {
        contenedor.innerHTML = "<p class='text-gray-500'>No hay eventos guardados.</p>";
        return;
    }

    contenedor.innerHTML = eventosGuardados.map((evento, index) => `
        <div class="border rounded-lg overflow-hidden shadow mb-4">
            <button class="w-full flex justify-between items-center bg-blue-600 text-white px-4 py-2 focus:outline-none"
                    onclick="toggleAccordion(this)">
                <span>${evento.nombre} Se celebrara el: (${evento.fecha})</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="hidden bg-white dark:bg-gray-700 p-4 space-y-2">
                <p><strong>Presupuesto:</strong> ${evento.presupuesto}</p>
                <h4 class="font-semibold">Participantes:</h4>
                <ul class="list-disc pl-6">
                    ${evento.participantes.map(p => `<li>${p}</li>`).join("")}
                </ul>
                <h4 class="font-semibold">Sorteo:</h4>
                <ul class="list-disc pl-6">
                    ${Object.entries(evento.sorteo).map(
                        ([dador, receptor]) => `<li>${dador} Regala a ${receptor}</li>`
                    ).join("")}
                </ul>
            </div>
        </div>
    `).join("");
}


// Función para abrir/cerrar acordeón
function toggleAccordion(button) {
    const content = button.nextElementSibling;
    content.classList.toggle("hidden");

    // Rotar el ícono
    const icon = button.querySelector("i");
    icon.classList.toggle("rotate-180");
}



// Declaracion de variables ==========================================================================
// Ayuda a detectar el cambio para la etiqueta main de cualquier evento debido a la inyeccion de codigo

document.getElementById("principal").addEventListener("click", (e) => {
	const action = e.target.dataset.action;
	if (!action) return;
	if (action === "cambiarVista") {
		cargarPantalla(e.target.dataset.vista);
	}
});

// Guardado de elementos en local storage ============================================================
// guarda la conf actual de la vista 

function toggleDarkMode() {
	const html = document.documentElement;

	html.classList.toggle('dark');
	if (html.classList.contains('dark')) {
		localStorage.setItem('theme', 'dark');
	} else {
		localStorage.setItem('theme', 'light');
	}
}
