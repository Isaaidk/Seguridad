# Plan del Sprint (Sprint Planning)

**Nombre del Sprint:** Sprint 1 - Fundamentos de Arquitectura Zero Trust
**Duración:** 1 Semana
**Objetivo del Sprint:** Desplegar una infraestructura base segura que permita la comunicación cifrada entre dos microservicios, protegida por autenticación multifactor y validada por un análisis estático de código.

---

## Tareas Seleccionadas (Sprint Backlog)

### 1. Despliegue de Infraestructura Base (DevOps)
* **Tarea:** Crear el archivo `docker-compose.yml` para levantar Keycloak, Vault y SonarQube en contenedores aislados.
* **Estado:** ✅ Completado.

### 2. Configuración del Guardián de Identidad (Keycloak)
* **Tarea:** Configurar el Realm `software-seguro`, crear el cliente para React con PKCE habilitado y forzar el flujo OTP (MFA) mediante código QR.
* **Estado:** ✅ Completado.

### 3. Configuración del Motor Criptográfico (Vault)
* **Tarea:** Iniciar sesión en la bóveda, habilitar el motor `transit` y generar la llave maestra AES-256 (`llave-sistemas`).
* **Estado:** ✅ Completado.

### 4. Desarrollo de Microservicios Node.js (Sistema A y B)
* **Tarea:** Programar el Sistema A (interfaz de cifrado) y Sistema B (interfaz de descifrado) usando Express. Implementar middleware de validación JWT (Pasaportes).
* **Estado:** ✅ Completado.

### 5. Integración del Panel Web (React)
* **Tarea:** Crear interfaz con Vite, conectar `keycloak-js` para SSO y armar el formulario para enviar mensajes secretos hacia el Sistema A.
* **Estado:** ✅ Completado.

### 6. Auditoría de Seguridad (SAST - SonarQube)
* **Tarea:** Configurar `sonar-project.properties` y ejecutar el escáner local para validar la seguridad del código desarrollado.
* **Estado:** ✅ Completado.

---

## Definition of Done (Definición de "Terminado")
Para que este proyecto se considere finalizado y listo para entrega, debe cumplir con lo siguiente:
- [x] Todos los contenedores de Docker levantan correctamente.
- [x] El inicio de sesión bloquea accesos sin un segundo factor (Google Authenticator/Authy).
- [x] Los mensajes en la red se envían en formato `vault:v1:...` y nunca en texto plano.
- [x] SonarQube reporta un Quality Gate "Aprobado" (Calificación A en Vulnerabilidades).
- [x] El código fuente no contiene contraseñas quemadas (*Hardcoded Secrets*).