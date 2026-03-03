function inicializarPresupuesto() {

    const btn100 = document.getElementById("btn100");
	const btn200 = document.getElementById("btn200");
	const btn500 = document.getElementById("btn500");
    const btnPersonalizado = document.getElementById("btnPersonalizado");
    const panel = document.getElementById("txtPersonalizado");

    btn100.addEventListener("click", () => {
        if (!panel.classList.contains("hidden")) {
            panel.classList.add("hidden");
        }
        localStorage.setItem("presupuesto", "100");
	});

    btn200.addEventListener("click", () => {
        if (!panel.classList.contains("hidden")) {
            panel.classList.add("hidden");
        }
        localStorage.setItem("presupuesto", "200");
	});

    btn500.addEventListener("click", () => {
        if (!panel.classList.contains("hidden")) {
            panel.classList.add("hidden");
        }
        localStorage.setItem("presupuesto", "500");
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
    input.placeholder = "Presupuesto personalizado";
    
    input.addEventListener("input", () => {
        localStorage.setItem("presupuesto", input.value);
    });

    panel.appendChild(label);
    panel.appendChild(input);
}