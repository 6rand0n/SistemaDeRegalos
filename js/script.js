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
	fetch("./html/" + vista + ".html")
		.then(response => response.text())
		.then(html => {
			document.getElementById("principal").innerHTML = html;

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

			if(vista === "especificaciones"){
				inicializarEspecificaciones();
			}

			if(vista === "presupuesto"){
				inicializarPresupuesto();
			}
		})
		.catch(error => console.error("Error al continuar con la operacion"))
};

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
