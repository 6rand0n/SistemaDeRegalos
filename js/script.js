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

// eliminar loe eventos 
function eliminarEvento(index) {
    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    eventos.splice(index, 1); 
    localStorage.setItem("eventos", JSON.stringify(eventos));
    mostrarEventosInicio(); 
}

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

	if (vista === "evento") {
		inicializarEvento();
	}

	if (vista === "presupuesto") {
		inicializarPresupuesto();
	}

	if (vista === "fecha") {
		inicializarFecha();
	}
	if (vista === "sorteo") {

		const principal = document.getElementById("principal");
		const info = document.getElementById("seccionInfo");
		const footer = document.getElementById("footerPagina");

		info.classList.add("hidden");
		footer.classList.add("hidden");

		principal.classList.remove("flex-col", "items-center", "justify-center", "fondo-normal");
		principal.classList.add("flex", "w-full", "flex-1", "p-0", "fondo-sorteo");

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
		boton.classList.remove("bg-white", "text-black", "dark:bg-blue-900", "dark:text-white",
			"bg-gray-200", "text-blue-600", "dark:bg-gray-700", "dark:text-blue-300");
		boton.classList.add("bg-black", "text-white", "dark:bg-blue-300", "dark:text-black");
	} else {
		boton.classList.remove("bg-black", "text-white", "dark:bg-blue-300", "dark:text-black");
		boton.classList.add("bg-white", "text-black", "dark:bg-blue-900", "dark:text-white",
			"bg-gray-200", "text-blue-600", "dark:bg-gray-700", "dark:text-blue-300");
	}
}


// Funcion para mostrar los eventos
function mostrarEventosInicio() {
	const contenedor = document.getElementById("eventos");
	const eventosGuardados = JSON.parse(localStorage.getItem("eventos")) || [];

	if (eventosGuardados.length === 0) {
		contenedor.innerHTML = "<p class='text-slate-500 text-center'>No hay eventos guardados.</p>";
		return;
	}

	contenedor.innerHTML = eventosGuardados.map((evento, index) => `
		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden mb-6 border border-slate-200 dark:border-slate-700">
			<button class="w-full flex justify-between items-center px-6 py-4 text-left bg-gradient-to-r from-violet-700 to-purple-700 text-white font-semibold text-lg hover:brightness-110 transition" onclick="toggleAccordion(this)">
					<span class="flex items-center gap-2">
						<i class="fa-solid fa-calendar text-violet-200"></i>
						${evento.nombre}
						<span class="text-sm opacity-90">(${evento.fecha})</span>
					</span>
				<i class="fas fa-chevron-down transition-transform duration-300"></i>
			</button>

		<div class="hidden p-6 space-y-6">

		<p class="flex items-center gap-2 text-slate-700 dark:text-slate-300">
			<i class="fa-solid fa-money-bill-wave text-violet-400"></i>
			<strong>Presupuesto:</strong> ${evento.presupuesto}
		</p>

		<div>
			<h4 class="flex items-center gap-2 font-semibold text-slate-800 dark:text-white mb-2">
			<i class="fa-solid fa-users text-violet-400"></i>
				Participantes
		</h4>

		<div class="flex flex-wrap gap-2">
		${evento.participantes.map(p => `
		<span class="px-3 py-1 rounded-full bg-violet-600 text-white text-sm shadow">
		${p}
		</span>
		`).join("")}
		</div>
		</div>

		<div>
		<h4 class="flex items-center gap-2 font-semibold text-slate-800 dark:text-white mb-3">
		<i class="fa-solid fa-gift text-violet-400"></i>
		Resultado del sorteo
		</h4>

		<div class="space-y-2">
		${Object.entries(evento.sorteo).map(([dador, receptor]) => `
		<div class="flex items-center justify-center gap-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-700 shadow-sm">
		<span class="px-3 py-1 rounded-full bg-violet-600 text-white text-sm">
		${dador}
		</span>
		<i class="fa-solid fa-gift text-violet-300"></i>
		<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
		</svg>
		<span class="px-3 py-1 rounded-full bg-purple-700 text-white text-sm">
		${receptor}
		</span>
		</div>
		`).join("")}
		</div>
		</div>

		<div class="flex justify-end">
		<button onclick="eliminarEvento(${index})" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition">
		<i class="fa-solid fa-trash"></i>
		Eliminar
		</button>
		</div>

		</div>
		</div>

`).join("");
}

function toggleAccordion(button) {
	const content = button.nextElementSibling;
	content.classList.toggle("hidden");
	const icon = button.querySelector("i:last-child");
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
