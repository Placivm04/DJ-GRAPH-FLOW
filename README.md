# 🎵 DJ Graph Flow

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Alpha-orange.svg)
![Tech](https://img.shields.io/badge/stack-React_|_NestJS_|_SQLite-green.svg)

> **Tu GPS para mezclas armónicas.** Deja de adivinar qué canción poner a continuación y empieza a navegar por tu música.

## 💡 El Concepto

La mayoría de los softwares de DJ te muestran una lista plana de canciones. **DJ Graph Flow** es diferente: visualiza tu biblioteca como un **Grafo Dirigido**.

[Image of graph database nodes and edges]

* **Nodos (Canciones):** Cada punto es una pista con sus datos (BPM, Key, Energía).
* **Enlaces (Transiciones):** Las líneas conectan canciones que *sabes* que funcionan bien juntas.

Si estás pinchando la **Canción A**, el sistema te muestra instantáneamente todos los caminos posibles hacia la **Canción B**, basándose en compatibilidad armónica (Camelot Wheel) y tus experiencias previas.

[Image of camelot wheel harmonic mixing]

## ✨ Características Principales

* **⚡ Local-First & Offline:** Tus datos son tuyos. Todo se guarda en un archivo `dj-graph.db` en tu ordenador. No necesita internet ni servidores complejos.
* **🧠 Recomendación Armónica:** Sugerencias automáticas basadas en BPM y Tonalidad.
* **🎛️ Interfaz de Alto Contraste:** Diseñada para ser legible en cabinas oscuras.
* **🚀 Cero Latencia:** Al ejecutarse en local, las búsquedas son instantáneas.

## 🛠️ Stack Tecnológico

Este proyecto utiliza una arquitectura moderna y robusta:

* **Frontend:** React + Vite + TailwindCSS (Interfaz rápida y reactiva).
* **Backend:** NestJS (Framework de Node.js escalable).
* **Base de Datos:** SQLite (Portabilidad total sin instalación de servidores).

## 🚀 Instalación y Uso

¡Es muy fácil! No necesitas instalar Docker ni configurar bases de datos. Solo necesitas tener [Node.js](https://nodejs.org/) y Git instalados.

### 1. Clonar el repositorio
Abre tu terminal y descarga el código:

```bash
git clone [https://github.com/TU-USUARIO/DJ-GRAPH-FLOW.git](https://github.com/TU-USUARIO/DJ-GRAPH-FLOW.git)
cd DJ-GRAPH-FLOW
