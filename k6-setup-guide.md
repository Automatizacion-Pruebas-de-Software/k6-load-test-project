# Paso 1: Instalación de Herramientas y Entorno

Instalamos todo lo necesario. El "porqué": Para un entorno limpio, usamos gestores de paquetes oficiales para evitar conflictos.

## 1.1 Instalar Node.js (v18+ LTS recomendado)

**Por qué:** Node.js gestiona el proyecto como un paquete npm, permitiendo scripts de build/test y dependencias (aunque k6 es standalone).

**Acciones:**

1. Ve a [nodejs.org](https://nodejs.org) y descarga la versión LTS (e.g., 20.x en noviembre 2025).
2. Instala ejecutando el instalador.
3. Verifica: Abre una terminal y ejecuta `node --version` y `npm --version`. Deberías ver algo como `v20.10.0` y `10.2.0`.

## 1.2 Instalar VSCode

**Por qué:** Soporta extensiones para JS y k6, con IntelliSense para autocompletado.

**Acciones:**

1. Descarga de [code.visualstudio.com](https://code.visualstudio.com).
2. Instala y abre.
3. Instala extensiones clave:
   - Busca en Extensions (Ctrl+Shift+X): "k6" (de LoadForge para snippets y sintaxis).
   - "ES7+ React/Redux/React-Native snippets" para JS general.
   - "Thunder Client" para probar APIs manualmente.

## 1.3 Instalar k6

**Por qué:** k6 es la herramienta core para ejecutar pruebas.

**Acciones (elige según tu OS):**

- **macOS:** `brew install k6` (instala Homebrew primero si no lo tienes: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`).
- **Windows:** Descarga el `.exe` de [k6.io/downloads](https://k6.io/downloads) y agrégalo al PATH.
- **Linux:** `sudo apt-get install k6` (Ubuntu) o descarga binario.
- **Verifica:** `k6 version` (debería mostrar v0.47+ en 2025).

## 1.4 Instalar Docker (para InfluxDB y Grafana)

**Por qué:** Docker simplifica la instalación de InfluxDB/Grafana sin contaminar tu máquina. Es la mejor práctica para entornos de dev.

**Acciones:**

1. Descarga de [docker.com](https://docker.com).
2. Instala y ejecuta `docker --version`.
3. Verifica que Docker Desktop esté corriendo (ícono en barra de tareas).

## 1.5 Instalar Paquetes Node.js para el Proyecto

**Por qué:** Usaremos npm para inicializar el proyecto y agregar scripts (e.g., para correr k6 via `npm run`).

No hay paquetes extras necesarios para k6 (es standalone), pero agregaremos `@types/k6` para TypeScript-like en JS (mejor práctica para tipado).