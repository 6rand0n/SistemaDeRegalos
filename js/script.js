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
		})
		.catch(error => console.error("Error al continuar con la operacion"))
};

function leerNombre() {
	const form = document.getElementById("formUsuario");

	if (form) {
		form.addEventListener("submit", function (e) {
			e.preventDefault();

			if (!form.checkValidity()) {
				form.reportValidity();
				return;
			}

			const nombre = document.getElementById("nombre").value;
			const participa = document.getElementById("participa").checked;

			const usuario = {
				nombre: nombre,
				participa: participa
			};

			localStorage.setItem("usuario", JSON.stringify(usuario));
			if (participa) {
				localStorage.setItem("participantes", JSON.stringify([nombre]));
			} else {
				localStorage.setItem("participantes", JSON.stringify([]));
			}

			cargarPantalla("participantes");
		});
	}
}

function inicializarParticipantes() {
	const btn = document.getElementById("btnAgregar");
	const input = document.getElementById("nuevoParticipante");

	const participantes = JSON.parse(localStorage.getItem("participantes")) || [];

	participantes.forEach(nombre => {
		agregarParticipante(nombre);
	});

	btn.addEventListener("click", () => {
		const nombre = input.value.trim();

		if (nombre === "") {
			const errorMsg = document.querySelector(".alerta");
			errorMsg.textContent = "El nombre no puede estar vacio";
			setTimeout(() => { errorMsg.textContent = ""; }, 3000);
			return;
		}

		agregarParticipante(nombre);

		participantes.push(nombre);
		localStorage.setItem("participantes", JSON.stringify(participantes));

		input.value = "";
	});
}

function agregarParticipante(nombre) {
	const lista = document.getElementById("listaParticipantes");
	const li = document.createElement("li");
	const idUnico = "p_" + Date.now();
	li.id = idUnico;

	li.className = "relative flex items-center justify-center w-24 h-24 rounded-full bg-gray-600 text-white shadow border border-gray-200 overflow-hidden text-center";
	li.textContent = nombre;
	li.draggable = true;

	const iconoRegalo = document.createElement("i");
	iconoRegalo.className = "fa-solid fa-gift absolute inset-0 flex items-center justify-center text-7xl text-red-500 opacity-30";
	li.appendChild(iconoRegalo);

	li.addEventListener("dragstart", (e) => {
		e.dataTransfer.setData("text/plain", li.id);
	});

	lista.appendChild(li);
}

function inicializarDragAndDrop() {
	const zonaEliminar = document.getElementById("eliminarParticipante");

	zonaEliminar.addEventListener("dragover", (e) => {
		e.preventDefault();
		zonaEliminar.classList.add("bg-red-100");
	});

	zonaEliminar.addEventListener("dragleave", () => {
		zonaEliminar.classList.remove("bg-red-100");
	});

	zonaEliminar.addEventListener("drop", (e) => {
		e.preventDefault();

		const id = e.dataTransfer.getData("text/plain");
		const elemento = document.getElementById(id);

		if (elemento) {
			eliminarParticipante(elemento.textContent);
			elemento.remove();
		}

		zonaEliminar.classList.remove("bg-red-100");
	});
}

function eliminarParticipante(nombre) {
	let participantes = JSON.parse(localStorage.getItem("participantes")) || [];

	participantes = participantes.filter(p => p !== nombre);

	localStorage.setItem("participantes", JSON.stringify(participantes));
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
