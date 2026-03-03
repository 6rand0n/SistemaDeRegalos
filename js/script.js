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
		.catch(error => console.error("Error al continuar con la operacion"))
};

function inicializacion(vista) {
	if (vista === "inicio") {
		leerNombre();
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

// Eventos ===========================================================================================
