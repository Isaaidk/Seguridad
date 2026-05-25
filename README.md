# 🛡️ Sistema Seguro DevSecOps: Arquitectura Zero Trust & KMS

> Un ecosistema de microservicios ultra-seguro construido con principios de DevSecOps, integrando Autenticación Multifactor (MFA), Cifrado de Grado Militar (AES-256) y Análisis de Código Estático (SAST).

---

## 📖 ¿De qué va este proyecto?

Este proyecto es una demostración técnica de nivel de Arquitectura Empresarial. Simula una infraestructura de confianza cero (**Zero Trust**) donde dos microservicios necesitan comunicarse entre sí de forma 100% segura por internet.

**El flujo de seguridad funciona así:**
1. **Acceso Restringido:** El usuario solo puede acceder a la interfaz web si supera un inicio de sesión centralizado (SSO) que exige un código temporal de su celular (MFA OTP).
2. **Cifrado en Origen:** El usuario envía un mensaje al **Sistema A**. Este sistema se conecta a una bóveda criptográfica externa, cifra el mensaje y se olvida de la llave.
3. **Tránsito Blindado:** El Sistema A envía el texto cifrado (`vault:v1:...`) al **Sistema B**. Si alguien intercepta la red, solo verá basura matemática.
4. **Descifrado Autorizado:** El Sistema B recibe el criptograma, demuestra su identidad ante la bóveda, y esta le devuelve el texto original para poder procesarlo.

---

## 🛠️ Herramientas y Tecnologías Utilizadas

Para lograr esta arquitectura, integramos las mejores herramientas de la industria:

* **🐳 Docker & Docker Compose:** Contenerización de la infraestructura.
* **🗝️ Keycloak (Identity Provider):** Gestión de usuarios, Single Sign-On (SSO) y MFA (Autenticador de Google/Authy) mediante protocolo OAuth2/PKCE.
* **🔐 HashiCorp Vault (KMS):** Motor de gestión de secretos (`transit`) para cifrado y descifrado as-a-service (AES-256-GCM).
* **🟢 Node.js & Express:** Desarrollo de los microservicios backend (Sistema A y Sistema B).
* **⚛️ React & Vite:** Interfaz de usuario (Frontend) de alta velocidad.
* **🕵️‍♂️ SonarQube (SAST):** Análisis estático continuo para garantizar un código limpio y libre de vulnerabilidades.

---

## 🚀 Guía Rápida para Correr el Proyecto Localmente

Si clonaste este repositorio y quieres ejecutarlo en tu propia computadora, sigue estos pasos exactos. 

### Requisitos Previos
* **Docker Desktop** (o Docker Engine)
* **Node.js** (v18+)
* **Git**
* Una app de autenticación en tu celular (Authy, Google Authenticator).

### Paso 1: Encender la Infraestructura (Docker)
En la raíz del proyecto, levanta los servidores de seguridad perimetral:
```bash
docker compose up -d

### Paso 2: Configurar la Bóveda Criptográfica (Vault)
Abre tu terminal y ejecuta estos comandos uno por uno para encender el motor de encriptación
1.-Iniciar sesión:
docker compose exec -e VAULT_ADDR=[http://127.0.0.1:8200](http://127.0.0.1:8200) vault vault login llave-maestra-vault

2.-Habilitar el motor "Transit":
docker compose exec -e VAULT_ADDR=[http://127.0.0.1:8200](http://127.0.0.1:8200) vault vault secrets enable transit
3.-Crear la llave AES-256 maestra:
docker compose exec -e VAULT_ADDR=[http://127.0.0.1:8200](http://127.0.0.1:8200) vault vault write -f transit/keys/llave-sistemas


Paso 3:
Configurar el Guardián de Identidades (Keycloak)
Entra a http://localhost:8080 (Usuario: admin | Clave: admin).

Crea un Realm llamado software-seguro.

Crea un Client llamado sistema-a-client.

En la configuración del cliente, apaga el switch Client authentication.

En Valid redirect URIs escribe: *

En Web Origins escribe: *

Guarda los cambios.

En la pestaña Authentication (menú izquierdo) -> Required Actions, asegúrate de que Configure OTP esté activado como "Default Action".

Crea un nuevo usuario en Users y asígnale una contraseña en su pestaña Credentials (apaga el switch "Temporary").


Paso 4:
Ajustar el Frontend para entorno Local
Abre el archivo frontend/src/App.jsx y asegúrate de que las URLs apunten a localhost:

Línea ~20 (Keycloak): url: 'http://localhost:8080'

Línea ~44 (Sistema A): axios.post('http://localhost:3001/api/enviar-a-b', ...)

Paso 5:
Encender los Sistemas

Terminal 1 (Sistema A):
cd sistema-a
npm install
npm start

Terminal 2 (Sistema B):

cd sistema-b
npm install
npm start

Terminal 3 (Frontend React):

cd frontend
npm install
npm run dev

Paso 6:
Probar
Entra a http://localhost:5173 en tu navegador.

Inicia sesión con el usuario que creaste y escanea el código QR con tu celular.

Escribe un mensaje secreto en el panel DevSecOps.

Presiona enviar y observa el recibo criptográfico viajar y ser descifrado en tiempo real.


Paso 7:
📊 Auditoría SAST (SonarQube)
Para comprobar que el código tiene Calificación A (0 Vulnerabilidades), entra a http://localhost:9000 (admin/admin), cambia la clave, y ejecuta en la terminal raíz:

npx sonarqube-scanner



