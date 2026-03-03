function inicializarOpciones(config) {

	const {
		botones,
		botonPersonalizado,
		panelId,
		storageKey,
		labelTexto,
		placeholderTexto
	} = config;

	const panel = document.getElementById(panelId);

	// Botones normales
	botones.forEach(boton => {
		const btn = document.getElementById(boton.id);

		btn.addEventListener("click", () => {

			if (!panel.classList.contains("hidden")) {
				panel.classList.add("hidden");
			}

			localStorage.setItem(storageKey, boton.valor);
		});
	});

	// Boton personalizado
	const btnPersonal = document.getElementById(botonPersonalizado);

	btnPersonal.addEventListener("click", () => {

		panel.classList.remove("hidden");
		panel.innerHTML = "";

		const label = document.createElement("label");
		label.textContent = labelTexto;
		label.className = "block text-gray-700 dark:text-white mb-2";

		const input = document.createElement("input");
		input.type = "text";
		input.placeholder = placeholderTexto;
		input.className = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white";

		input.addEventListener("input", () => {
			localStorage.setItem(storageKey, input.value);
		});

		panel.appendChild(label);
		panel.appendChild(input);
	});
}

function inicializarEvento() {

	inicializarOpciones({
		botones: [
			{ id: "btn14Feb", valor: "14 de Febrero" },
			{ id: "btnNavidad", valor: "Navidad" },
			{ id: "btnDiaDelNino", valor: "Día del Niño" }
		],
		botonPersonalizado: "btnPersonalizado",
		panelId: "txtPersonalizado",
		storageKey: "evento",
		labelTexto: "Nombre del evento:",
		placeholderTexto: "Evento a festejar"
	});
}

function inicializarPresupuesto() {

	inicializarOpciones({
		botones: [
			{ id: "btn100", valor: "100" },
			{ id: "btn200", valor: "200" },
			{ id: "btn500", valor: "500" }
		],
		botonPersonalizado: "btnPersonalizado2",
		panelId: "txtPersonalizado2",
		storageKey: "presupuesto",
		labelTexto: "Presupuesto personalizado:",
		placeholderTexto: "Cantidad personalizada"
	});
}