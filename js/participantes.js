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
			const errorMsg = document.querySelector(".alerta2");
			errorMsg.textContent = "El nombre no puede estar vacio";
			setTimeout(() => { errorMsg.textContent = ""; }, 3000);
			return;
		}

		agregarParticipante(nombre);

		let participantes = JSON.parse(localStorage.getItem("participantes")) || [];

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