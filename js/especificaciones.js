function inicializarEspecificaciones() {

	const btn14Feb = document.getElementById("btn14Feb");
	const btnNavidad = document.getElementById("btnNavidad");
	const btnDiaDelNino = document.getElementById("btnDiaDelNino");
    const btnPersonalizado = document.getElementById("btnPersonalizado");
    const panel = document.getElementById("txtPersonalizado");

    btn14Feb.addEventListener("click", () => {
        if (!panel.classList.contains("hidden")) {
            panel.classList.add("hidden");
        }
        localStorage.setItem("evento", "14 de Febrero");
	});

    btnNavidad.addEventListener("click", () => {
        if (!panel.classList.contains("hidden")) {
            panel.classList.add("hidden");
        }
        localStorage.setItem("evento", "Navidad");
    });

    btnDiaDelNino.addEventListener("click", () => {
        if (!panel.classList.contains("hidden")) {
            panel.classList.add("hidden");
        }
        localStorage.setItem("evento", "Día del Niño");
    }); 

	btnPersonalizado.addEventListener("click", () => {
        if(panel.classList.contains("hidden")){
		    panel.classList.remove("hidden");
        }
		generarTextbox();
	});
}

function generarTextbox() {

    const panel = document.getElementById("txtPersonalizado");
    panel.innerHTML = "";

    const label = document.createElement("label");
    label.textContent = "Nombre del evento:";
    label.className = "block text-gray-700 dark:text-white mb-2";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white";
    input.placeholder = "Evento a festejar";
    
    input.addEventListener("input", () => {
        localStorage.setItem("evento", input.value);
    });

    panel.appendChild(label);
    panel.appendChild(input);
}