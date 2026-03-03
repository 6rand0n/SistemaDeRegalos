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