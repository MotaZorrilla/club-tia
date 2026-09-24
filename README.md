# 🤖 Club T.I.A. (Tecnologías de la Información & Inteligencia Artificial) 🚀

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> **Portal Educativo Gamificado y Plataforma de Living Lab Escolar**  
> **U. E. Colegio Monte Carmelo · Puerto Ordaz, Estado Bolívar, Venezuela**  
> **Facilitador / Diseñador de Software:** Ing. Héctor Mota Zorrilla  
> **🌐 Producción en Vivo:** [https://aula.motazorrilla.com/club-tia/](https://aula.motazorrilla.com/club-tia/)

---

## 📖 Acerca del Proyecto

El **Club T.I.A.** es un programa formativo escolar de vanguardia diseñado para estudiantes de Primaria Superior (4.° a 6.° grado) y Media General (1.° a 5.° año). Su objetivo es transformar a niños y jóvenes de meros consumidores pasivos de tecnología en **creadores de software, entrenadores de algoritmos y pensadores críticos**.

El proyecto opera bajo una filosofía estricta de **Presupuesto Base US$ 0 en hardware adicional**, aprovechando la infraestructura existente de computadoras y cámaras web en conjunto con tecnologías web de código abierto.

---

## 🎮 Características Principales

### 1. Las 5 Islas de Aventura (Ruta de Aprendizaje)
* **🚀 Isla 01: El Despegue de la IA (¡Activa & Jugable!):** Misión interactiva con ciclo pedagógico ERCA (Experiencia, Reflexión, Conceptualización y Aplicación). Incluye el minijuego *"¿IA o Humano?"*, comparador analítico *Reglas Fijas vs Machine Learning*, glosario de términos clave, simulador en vivo de predicción con IA y recompensa de **+100 XP** e insignia digital.
* **🔍 Isla 02: El Detective de Libros:** Laboratorio RAG con **Google NotebookLM** para el Plan Lector con citas textuales verificadas y cero alucinaciones.
* **🌐 Isla 03: Los Secretos de la Web:** Desarrollo colaborativo en HTML5 y CSS3 donde los estudiantes expanden el propio portal del club.
* **🧠 Isla 04: El Gimnasio Matemático:** Algoritmia, descomposición lógica y preparación de retos para la **Olimpiada Canguro Matemático**.
* **🐾 Isla 05: Entrena a tu Mascota Robot:** Visión artificial con cámara web usando **Google Teachable Machine** y TensorFlow.js sin costo de hardware.

### 2. Módulo de Votación en Vivo (Live Polling)
* Permite al facilitador proyectar encuestas interactivas en pantalla gigante y recibir votos de los estudiantes desde sus dispositivos en tiempo real.
* Actualización visual dinámica vía AJAX y auto-polling cada 5 segundos.
* Asignación inmediata de **+15 XP** al perfil de cada alumno votante.
* Botón administrativo de reinicio para múltiples rondas de demostración.

### 3. Gamificación y UI/UX Arcade
* Paleta cromática vibrante de alto contraste (púrpura neón, cian, amarillo arcade y esmeralda).
* Botones táctiles 3D (`btn-arcade`).
* Efectos de sonido procedurales mediante la **Web Audio API** (cero dependencias de archivos de audio externos).
* Ráfagas dinámicas de confeti con **Canvas-Confetti**.
* Modal de selección rápida de roles (Facilitador, Coordinación, Alumnos de Primaria y Bachillerato) y registro express de estudiantes en 10 segundos.

---

## 🛠️ Stack Tecnológico

* **Backend:** Laravel 12 (PHP 8.2+) con soporte reverse-proxy `trustProxies(at: '*')`.
* **Base de Datos:** SQLite (`database/database.sqlite`), ligera y portable.
* **Frontend:** Blade Templates, Tailwind CSS (CDN), Google Fonts (Fredoka + Plus Jakarta Sans + JetBrains Mono).
* **Audio & Efectos:** Web Audio API nativa + Canvas-Confetti.
* **Infraestructura de Producción:** Contenedor Docker en servidor Ubuntu Homelab (`192.168.1.117:8093`), enrutado a través de Nginx (`aula-gateway`) y Cloudflare Tunnels hacia `https://aula.motazorrilla.com/club-tia/`.

---

## 🚀 Instalación y Puesta en Marcha Local

### Prerrequisitos
* PHP 8.2 o superior (con extensiones `pdo_sqlite`, `mbstring`, `openssl`).
* Composer 2.x.

### Pasos
```bash
# 1. Clonar el repositorio
git clone https://github.com/MotaZorrilla/club-tia.git
cd club-tia

# 2. Instalar dependencias de PHP
composer install

# 3. Configurar el archivo de entorno
cp .env.example .env
php artisan key:generate

# 4. Crear la base de datos SQLite y ejecutar migraciones con seeders
touch database/database.sqlite
php artisan migrate --seed

# 5. Iniciar el servidor local de desarrollo
php artisan serve
```

La aplicación estará disponible inmediatamente en `http://localhost:8000`.

---

## 🧪 Pruebas Automatizadas

El proyecto incluye pruebas de integración y de características con PHPUnit:
```bash
php artisan test
```

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

---

## 👨‍💻 Autor y Facilitador

**Ing. Héctor Mota Zorrilla**  
*Ingeniero Civil, Docente Universitario e Investigador en Innovación Educativa, ConTech e Inteligencia Artificial.*  
* **Sitio Web:** [https://motazorrilla.com](https://motazorrilla.com)  
* **Aula Virtual:** [https://aula.motazorrilla.com](https://aula.motazorrilla.com)  
* **GitHub:** [@MotaZorrilla](https://github.com/MotaZorrilla)  
