function iniciarSorteo() {
    const btnSortear = document.getElementById("btnSortear");
    const infoDiv = document.getElementById("infoEvento");
    const resultadosDiv = document.getElementById("resultados");

    // Mostrar info del evento 
    const evento = {
        nombre: localStorage.getItem("evento") || "Sin nombre",
        participantes: JSON.parse(localStorage.getItem("participantes")) || [],
        exclusiones: JSON.parse(localStorage.getItem("exclusiones")) || {},
        presupuesto: localStorage.getItem("presupuesto") || "No definido",
        fecha: localStorage.getItem("fecha") || "No definida"
    };

    const filasExclusiones = Object.keys(evento.exclusiones).length === 0
	? `<tr>
			<td colspan="2" class="px-4 py-2 text-center text-slate-500">
				No hay exclusiones registradas
			</td>
		</tr>`
	: Object.keys(evento.exclusiones).sort().map(persona => `
		<tr class="border-t border-slate-300 dark:border-slate-600">
			<td class="px-4 py-2 text-slate-800 dark:text-white">
				${persona}
			</td>
			<td class="px-4 py-2 text-slate-700 dark:text-slate-300">
				${evento.exclusiones[persona].join(", ")}
			</td>
		</tr>
	`).join("");

    // mensaje que se muestre los datos 
    infoDiv.innerHTML = `
        <h2 class="mb-4 text-4xl font-bold text-slate-800 dark:text-white">
            Sorteo para "${evento.nombre}"
        </h2>

        <h3 class="mb-4 text-2xl text-slate-800 dark:text-white">
            Organizador: ${JSON.parse(localStorage.getItem("usuario")).nombre}
        </h3>

        <p class="text-lg text-slate-700 dark:text-slate-300">
            <strong>Presupuesto:</strong> ${evento.presupuesto}
        </p>

        <p class="text-lg text-slate-700 dark:text-slate-300">
            <strong>Fecha:</strong> ${evento.fecha}
        </p>

        <h3 class="mt-6 text-xl text-slate-800 dark:text-white">
            Participantes
        </h3>

        <ul class="flex flex-col items-center gap-2 mt-3">
            ${evento.participantes.map(p => `
                <li class="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow text-slate-700 dark:text-slate-300">
                    ${p}
                </li>
            `).join("")}
        </ul>

        <h4 class="mb-4 text-4xl text-slate-800 dark:text-white">
            Exclusiones
        </h4>

        <div class="mt-3 overflow-x-auto flex flex-col items-center gap-2 mt-3">
	        <table class="min-w-[300px] border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
	    	        <thead class="bg-slate-200 dark:bg-slate-700">
	    	        	<tr>
	    	        		<th class="px-4 py-2 text-left text-slate-800 dark:text-white">
	    	        			Participante
	    	        		</th>
	    	        		<th class="px-4 py-2 text-left text-slate-800 dark:text-white">
	    	        			No puede sacar a
	    	        		</th>
	    	        	</tr>
	    	        </thead>
	    	        <tbody class="bg-white dark:bg-slate-800">
	    	        	${filasExclusiones}
	    	    </tbody>
	        </table>
        </div>
    `;

    // accion para hacer el sortear 
    btnSortear.addEventListener("click", () => {

        const asignaciones = generarSorteo(evento.participantes, evento.exclusiones);
        btnSortear.textContent = "Sortear de Nuevo";

        if (!asignaciones) {
            resultadosDiv.innerHTML = `
                <p class="text-red-500 font-semibold">
                    No se pudo generar un sorteo válido. Revisa las exclusiones.
                </p>`;
            return;
        }

        // Guardar evento completo con sorteo
        evento.sorteo = asignaciones;

        let eventos = JSON.parse(localStorage.getItem("eventos")) || [];
        eventos.push(evento);
        localStorage.setItem("eventos", JSON.stringify(eventos));
        infoDiv.innerHTML = "";
        resultadosDiv.innerHTML = "";

        Object.entries(asignaciones).forEach(([dador, receptor]) => {

            const fila = document.createElement("div");

            fila.className =
                "flex items-center justify-center gap-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md animate-fade";

            fila.innerHTML = `
                <span class="flex items-center justify-center px-4 py-2 rounded-full bg-blue-500 text-white font-semibold">
                    ${dador}
                </span>

                <span class="fa-solid fa-gift text-yellow-500 text-xl"></span>

                <svg xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                    <path stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"/>
                </svg>

                <span class="flex items-center justify-center px-4 py-2 rounded-full bg-emerald-500 text-white font-semibold">
                    ${receptor}
                </span>
            `;

            resultadosDiv.appendChild(fila);
        });

        const btnFinalizar = document.createElement("button");

        btnFinalizar.textContent = "Finalizar";

        btnFinalizar.className =
            "mt-6 px-8 py-3 rounded-full bg-red-500 text-white font-semibold shadow-lg hover:bg-red-600 hover:scale-105 transition";

        resultadosDiv.appendChild(btnFinalizar);

        btnFinalizar.addEventListener("click", () => {

            localStorage.removeItem("fecha");
            localStorage.removeItem("participantes");
            localStorage.removeItem("presupuesto");
            localStorage.removeItem("usuario");
            localStorage.removeItem("evento");

            restaurarLayout();
            cargarPantalla("inicio");
        });
    });
}


// Algoritmo simple: intenta barajar hasta que cumpla exclusiones
function generarSorteo(participantes, exclusiones) {

    const maxIntentos = 1000;

    for (let intento = 0; intento < maxIntentos; intento++) {

        const receptores = mezclar(participantes);
        const asignaciones = {};

        let valido = true;

        for (let i = 0; i < participantes.length; i++) {

            const dador = participantes[i];
            const receptor = receptores[i];

            if (dador === receptor) {
                valido = false;
                break;
            }

            if (exclusiones[dador] && exclusiones[dador].includes(receptor)) {
                valido = false;
                break;
            }

            asignaciones[dador] = receptor;
        }

        if (valido) return asignaciones;
    }

    return null;
}


function restaurarLayout() {

    const principal = document.getElementById("principal");
    const info = document.getElementById("seccionInfo");
    const footer = document.getElementById("footerPagina");

    info.classList.remove("hidden");
    footer.classList.remove("hidden");

    principal.classList.remove("flex", "w-full", "p-0", "fondo-sorteo", "flex-1");

    principal.classList.add(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "fondo-normal"
    );
}

// funcion para mezclar de manera correcta 
function mezclar(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}