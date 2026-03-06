# Sistema de regalos | Proyecto de Tecnologias web

Proyecto escolar que implementa un sistema web para organizar intercambios de regalos.

La aplicación permite registrar participantes, definir restricciones entre ellos, y realizar un sorteo automático para asignar a quién debe regalar cada persona.

---

## Arquitectura del Proyecto

El sistema está desarrollado como una aplicación web del lado del cliente, utilizando JavaScript para manejar la lógica de la aplicación.

| Componente | Tecnología Principal |
| :--- | :--- |
| **Frontend** | JavaScript, HTML5, CSS3 |
| **Estilos** | TailwindCSS |

---

## Funcionalidades Principales

### Registro de Participantes
Permite agregar participantes al intercambio de regalos mediante un formulario dinámico.

### Visualización en Tiempo Real
Los participantes agregados se muestran inmediatamente en la lista utilizando manipulación del DOM.

### Eliminación mediante Drag & Drop
Los participantes pueden eliminarse arrastrándolos a una zona de eliminación.

### Sistema de Exclusiones
Permite definir restricciones entre participantes para evitar asignaciones específicas (por ejemplo, evitar que dos personas se regalen entre sí).

### Sorteo Automático
El sistema genera automáticamente las asignaciones respetando las restricciones establecidas.

### Persistencia de Datos
Los datos de participantes y exclusiones se almacenan en **LocalStorage**, permitiendo mantener la información entre recargas de la página.

---

## 🧑‍💻 Desarrolladores

| Nombre | Contacto |
| :--- | :--- |
| Javier | [] |
| Brandon | [www.linkedin.com/in/brandon-dávila-0a2603199] |
