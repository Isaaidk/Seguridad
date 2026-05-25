# Product Backlog: Arquitectura Segura DevSecOps

## Épica 1: Autenticación y Control de Acceso (Zero Trust)
Como Arquitecto de Seguridad, quiero implementar un sistema de gestión de identidades centralizado para asegurar que solo los usuarios autorizados accedan a los microservicios.

* **Historia de Usuario 1.1: Inicio de Sesión Centralizado (SSO)**
  * **Descripción:** Como usuario, quiero iniciar sesión utilizando un flujo de Single Sign-On (SSO) para no tener que crear cuentas separadas en cada sistema.
  * **Criterios de Aceptación:** * El sistema debe utilizar Keycloak como Identity Provider.
    * El frontend en React debe redirigir automáticamente al login de Keycloak si no hay sesión activa.
* **Historia de Usuario 1.2: Autenticación Multifactor (MFA/OTP)**
  * **Descripción:** Como administrador de seguridad, quiero requerir un segundo factor de autenticación obligatorio para prevenir ataques de robo de credenciales.
  * **Criterios de Aceptación:** * El usuario debe escanear un código QR con Google Authenticator/Authy.
    * Keycloak debe validar el token de 6 dígitos antes de emitir el JWT.

## Épica 2: Criptografía y Protección de Datos (KMS)
Como Oficial de Seguridad, quiero que la información sensible viaje cifrada entre los microservicios utilizando estándares de grado militar.

* **Historia de Usuario 2.1: Cifrado en Origen (Sistema A)**
  * **Descripción:** Como Sistema A, quiero cifrar los textos sensibles utilizando un motor KMS externo antes de enviarlos por la red.
  * **Criterios de Aceptación:** * Integración con HashiCorp Vault (Transit Secrets Engine).
    * Algoritmo de cifrado AES-256-GCM.
    * El Sistema A no debe almacenar la llave de cifrado localmente.
* **Historia de Usuario 2.2: Descifrado Seguro (Sistema B)**
  * **Descripción:** Como Sistema B, quiero recibir criptogramas y solicitar su descifrado de forma segura para procesar la información.
  * **Criterios de Aceptación:** * El Sistema B debe recibir el formato `vault:v1:...` y devolver el texto en claro exitosamente.

## Épica 3: Auditoría Continua y Código Seguro (SAST)
Como Ingeniero DevSecOps, quiero auditar el código fuente para garantizar que cumple con los estándares de ciberseguridad.

* **Historia de Usuario 3.1: Análisis Estático de Código**
  * **Descripción:** Como desarrollador, quiero escanear mi código en busca de vulnerabilidades y *Code Smells*.
  * **Criterios de Aceptación:** * Implementación de SonarQube mediante Docker.
    * El proyecto debe obtener un estado "Aprobado" (Passed) con 0 vulnerabilidades (Calificación A).