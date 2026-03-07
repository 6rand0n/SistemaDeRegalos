function inicializarFecha() {

	fechasSugeridas();

	const btnOtra = document.getElementById("btnOtraFecha");
	const panel = document.getElementById("panelFecha");
	const inputFecha = document.getElementById("inputFecha");

	btnOtra.addEventListener("click", () => {
		panel.classList.remove("hidden");
		document.querySelectorAll("#fechasSugeridas button").forEach(b => cambiarEstadoBoton(b, false));
		cambiarEstadoBoton(btnOtra, true);
	});

	inputFecha.addEventListener("change", () => {
		localStorage.setItem("fecha", inputFecha.value);
	});
}

function fechasSugeridas() {

	const contenedor = document.getElementById("fechasSugeridas");
	contenedor.innerHTML = "";

	const hoy = new Date();

	// Genera fechas cada 3 dias a partir de hoy
	for (let i = 1; i <= 3; i++) {

		let fecha = new Date();
		fecha.setDate(hoy.getDate() + (i * 3));

		let fechaTexto = fecha.toLocaleDateString("es-MX", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric"
		});

		const btn = document.createElement("button");
		btn.textContent = fechaTexto;
		// aplicar estilo base común y ancho fijo
		aplicarEstiloBase(btn);
		btn.classList.add("w-80");

		btn.addEventListener("click", () => {
			// Eliminamos la hora antes de guardar la fecha
			localStorage.setItem("fecha", fecha.toISOString().split("T")[0]);
			document.getElementById("panelFecha").classList.add("hidden");

			contenedor.querySelectorAll("button").forEach(b => cambiarEstadoBoton(b, false));
			cambiarEstadoBoton(btn, true);
			const btnOtra = document.getElementById("btnOtraFecha"); 
			cambiarEstadoBoton(btnOtra, false);
		});

		contenedor.appendChild(btn);
	}
}