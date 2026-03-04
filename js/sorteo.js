function iniciarSorteo() {
    const btnSortear = document.getElementById("btnSortear");
    const infoDiv = document.getElementById("infoEvento");
    const resultadosDiv = document.getElementById("resultados");

    // Mostrar info del evento ANTES de sortear
    const evento = {
        nombre: localStorage.getItem("evento") || "Sin nombre",
        participantes: JSON.parse(localStorage.getItem("participantes")) || [],
        exclusiones: JSON.parse(localStorage.getItem("exclusiones")) || {},
        presupuesto: localStorage.getItem("presupuesto") || "No definido",
        fecha: localStorage.getItem("fecha") || "No definida"
    };

    // mensaje de los datos
    infoDiv.innerHTML = `
        <h2 class="text-xl mb-4">El sorteo para el evento de "${evento.nombre}"</h2>
        <p>Presupuesto:</strong> ${evento.presupuesto}</p>
        <p>Fecha:</> ${evento.fecha}</p>
        <h3 class="mt-4">Participantes:</h3>
        <ul class="bg-white text-black rounded flex items-center flex-col list-disc pl-6 m-3 p-4">
            ${evento.participantes.map(p => `<li>${p}</li>`).join("")}
        </ul>
    `;

    // Acción al presionar "Sortear"
    btnSortear.addEventListener("click", () => {
        const asignaciones = generarSorteo(evento.participantes, evento.exclusiones);
        btnSortear.textContent = "Sortear de Nuevo";


        if (!asignaciones) {
            resultadosDiv.innerHTML = `<p class="text-red-500 font-semibold">
                No se pudo generar un sorteo válido. Revisa las exclusiones.
            </p>`;
            return;
        }

        // Guardar evento completo con sorteo
        evento.sorteo = asignaciones;

        // Recuperar lista de eventos guardados
        let eventos = JSON.parse(localStorage.getItem("eventos")) || [];

        // Agregar el nuevo evento
        eventos.push(evento);

        // Guardar lista actualizada
        localStorage.setItem("eventos", JSON.stringify(eventos));

        // Ocultar info inicial
        infoDiv.innerHTML = "";

        // Mostrar resultados
        resultadosDiv.innerHTML = "";
        Object.entries(asignaciones).forEach(([dador, receptor]) => {
            const fila = document.createElement("div");
            fila.className = "flex flex-col md:flex-row justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-700 shadow";
            fila.innerHTML = `
                <span class="text-blue-600 dark:text-blue-300">${dador}</span>
                <span class="text-gray-700 dark:text-white"> Regala a
                 </span>
                <span class="text-green-600 dark:text-green-300">${receptor}</span>
            `;
            resultadosDiv.appendChild(fila);
        });

        // Crear botón "Finalizar"
        const btnFinalizar = document.createElement("button");
        btnFinalizar.textContent = "Finalizar";
        btnFinalizar.className = "mt-6 px-6 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition";
        resultadosDiv.appendChild(btnFinalizar);

        btnFinalizar.addEventListener("click", () => {
            localStorage.removeItem("fecha");
            localStorage.removeItem("participantes");
            localStorage.removeItem("presupuesto");
            localStorage.removeItem("usuario");
            localStorage.removeItem("evento");

            restaurarLayout();
            cargarPantalla("inicio"); // vuelve a inicio
        });
    });
}

// Algoritmo simple: intenta barajar hasta que cumpla exclusiones
function generarSorteo(participantes, exclusiones) {
    const maxIntentos = 1000;
    for (let intento = 0; intento < maxIntentos; intento++) {
        const receptores = [...participantes].sort(() => Math.random() - 0.5);
        const asignaciones = {};

        let valido = true;
        for (let i = 0; i < participantes.length; i++) {
            const dador = participantes[i];
            const receptor = receptores[i];

            // No puede darse a sí mismo
            if (dador === receptor) {
                valido = false;
                break;
            }

            // No puede darse a alguien en sus exclusiones
            if (exclusiones[dador] && exclusiones[dador].includes(receptor)) {
                valido = false;
                break;
            }

            asignaciones[dador] = receptor;
        }

        if (valido) return asignaciones;
    }
    return null; // si no se encontró solución
}

function restaurarLayout() {
    const principal = document.getElementById("principal");
    const info = document.getElementById("seccionInfo");
    const footer = document.getElementById("footerPagina");

    info.classList.remove("hidden");
    footer.classList.remove("hidden");

    principal.classList.remove("flex","w-full","p-0","fondo-sorteo","flex-1");

    principal.classList.add(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "fondo-normal"
    );
}