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

function inicializarExclusiones() {

	const btnNo = document.getElementById("btnNoExclusiones");
	const btnSi = document.getElementById("btnExclusiones");
	const panel = document.getElementById("panelExclusiones");

	btnNo.addEventListener("click", () => {
		panel.classList.add("hidden");
	});

	btnSi.addEventListener("click", () => {
		panel.classList.remove("hidden");
		generarPanelExclusiones();
	});
}

function generarPanelExclusiones() {

	const contenedor = document.getElementById("divExclusiones");
	const participantes = JSON.parse(localStorage.getItem("participantes")) || [];
	const exclusionesGuardadas = JSON.parse(localStorage.getItem("exclusiones")) || {};
	contenedor.innerHTML = "";

	participantes.forEach(nombre => {

		const wrapper = document.createElement("div");
		wrapper.className = "bg-gray-100 dark:bg-gray-700 p-4 rounded-xl space-y-3";

		const titulo = document.createElement("p");
		titulo.className = "font-semibold text-gray-700 dark:text-white";
		titulo.textContent = nombre;

		const divSeleccion = document.createElement("div");
		divSeleccion.className = "space-y-2";
		divSeleccion.dataset.nombre = nombre;

		wrapper.appendChild(titulo);
		wrapper.appendChild(divSeleccion);
		contenedor.appendChild(wrapper);

		const exclusiones = exclusionesGuardadas[nombre] || [];

		if (exclusiones.length > 0) {
			exclusiones.forEach(valor => {
				crearSelect(nombre, participantes, divSeleccion, valor);
			});
		}

		crearSelect(nombre, participantes, divSeleccion);
	});
}

function crearSelect(nombre, participantes, contenedor, valorSeleccionado = "") {

	const otros = participantes.filter(p => p !== nombre);

	const selectWrapper = document.createElement("div");
	selectWrapper.className = "flex gap-2 items-center";

	const select = document.createElement("select");
	select.className = "w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400";

	const opcionesSeleccionadas = Array.from(contenedor.querySelectorAll("select")).map(s => s.value).filter(v => v !== "");

	select.innerHTML = `
		<option value="">Selecciona participante</option>
		${otros.map(p => `
			<option value="${p}" 
				${p === valorSeleccionado ? "selected" : ""} 
				${opcionesSeleccionadas.includes(p) && p !== valorSeleccionado ? "disabled" : ""}
			>
				${p}
			</option>
		`).join("")}
	`;

	const btnEliminar = document.createElement("button");
	btnEliminar.textContent = "✕";
	btnEliminar.className = "text-red-400 font-bold text-lg";

	selectWrapper.appendChild(select);
	selectWrapper.appendChild(btnEliminar);
	contenedor.appendChild(selectWrapper);

	select.addEventListener("change", () => {
		actualizarOpciones(contenedor);
		guardarExclusiones();
		if (select.value !== "" && contenedor.lastChild === selectWrapper) {
			crearSelect(nombre, participantes, contenedor);
		}
	});

	btnEliminar.addEventListener("click", () => {
		const totalSelects = contenedor.querySelectorAll("select").length;

		if (totalSelects > 1) {
			selectWrapper.remove();
			actualizarOpciones(contenedor);
			guardarExclusiones();
		}
	});
}

function actualizarOpciones(contenedor) {

	const selects = Array.from(contenedor.querySelectorAll("select"));
	const valoresSeleccionados = selects.map(s => s.value).filter(v => v !== "");

	selects.forEach(select => {
		Array.from(select.options).forEach(option => {
			if (option.value === "") return;

			if (
				valoresSeleccionados.includes(option.value) &&
				select.value !== option.value
			) {
				option.disabled = true;
			} else {
				option.disabled = false;
			}
		});
	});
}

function guardarExclusiones() {
	const resultado = {};

	document.querySelectorAll("#divExclusiones > div").forEach(bloque => {
		const nombre = bloque.querySelector("p").textContent;
		const selects = bloque.querySelectorAll("select");

		const valores = Array.from(selects).map(s => s.value).filter(v => v !== "");

		if (valores.length > 0) {
			resultado[nombre] = valores;
		}
	});

	localStorage.setItem("exclusiones", JSON.stringify(resultado));
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
