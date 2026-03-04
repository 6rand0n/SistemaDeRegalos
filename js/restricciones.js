function inicializarExclusiones() {

	const btnNo = document.getElementById("btnNoExclusiones");
	const btnSi = document.getElementById("btnExclusiones");
	const panel = document.getElementById("panelExclusiones");

	btnNo.addEventListener("click", () => {
		panel.classList.add("hidden");
		localStorage.removeItem("exclusiones");
			cambiarEstadoBoton(btnNo, true); 
			cambiarEstadoBoton(btnSi, false);
	});		

	btnSi.addEventListener("click", () => {
		panel.classList.remove("hidden");
		generarPanelExclusiones();
			cambiarEstadoBoton(btnSi, true); 
			cambiarEstadoBoton(btnNo, false);
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
		titulo.className = "text-gray-700 dark:text-white";
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