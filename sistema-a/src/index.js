const express = require('express');
const cors = require('cors');
const verificarToken = require('./middleware/auth');
const { cifrarDato } = require('./services/kmsService');
const axios = require('axios');

// Inicializamos la aplicación
const app = express();
const PORT = 3001; // Elegimos el puerto 3001 para el Sistema A

// --- MIDDLEWARES BÁSICOS ---
app.use(express.json()); 
app.use(cors()); 

// --- 1. NUEVA VARIABLE PARA GUARDAR EL HISTORIAL DEL SISTEMA A ---
const historialLogsA = [];

// --- RUTAS (Endpoints) ---

// Puerta de prueba: Para verificar que el servidor está vivo
app.get('/api/ping', (req, res) => {
    res.json({ 
        estado: 'Exitoso',
        mensaje: '¡El Castillo A (Sistema A) está funcionando y protegido!' 
    });
});

app.get('/api/secreto', verificarToken, (req, res) => {
    res.json({
        estado: 'Exitoso',
        mensaje: '¡Bienvenido al área VIP del Castillo A!',
        usuario: req.user.preferred_username // Extraemos el nombre del token
    });
});

// --- PUERTA DE CIFRADO (Prueba KMS) ---
app.post('/api/cifrar-prueba', async (req, res) => {
    try {
        const { textoSecreto } = req.body;

        if (!textoSecreto) {
            return res.status(400).json({ error: 'Debes enviar un textoSecreto' });
        }

        const textoCifrado = await cifrarDato(textoSecreto);

        res.json({
            estado: 'Exitoso',
            original: textoSecreto,
            cifrado: textoCifrado,
            mensaje: 'Dato cifrado exitosamente por Vault KMS'
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno de cifrado' });
    }
});

// --- PUERTA DE INTEGRACIÓN (Sistema A -> Sistema B) ---
app.post('/api/enviar-a-b', async (req, res) => {
    try {
        const { textoSecreto } = req.body;

        if (!textoSecreto) {
            return res.status(400).json({ error: 'Debes enviar un textoSecreto' });
        }

        console.log("1. Sistema A: Recibí el texto. Cifrando con Vault...");
        const textoCifrado = await cifrarDato(textoSecreto);

        console.log("2. Sistema A: Texto cifrado exitosamente. Enviando al Sistema B...");
        
        // El Sistema A se convierte en cliente y llama al Sistema B
        const respuestaDeB = await axios.post('https://friendly-capybara-pxg99r4vv4jc7jrv-3002.app.github.dev/api/recibir', {
            datoCifrado: textoCifrado
        });

        console.log("3. Sistema A: El Sistema B respondió correctamente.");

        // --- 2. GUARDAMOS EL LOG PARA QUE EL FRONTEND LO VEA ---
        // Generamos un log bonito para la tabla de auditoría del Frontend A
        historialLogsA.unshift({
            id: Date.now().toString().slice(-4), // Un ID rápido de 4 números
            fecha: new Date().toLocaleTimeString(),
            accion: 'Cifrado (KMS) y Envío',
            estado: 'Exitoso',
            detalle: `Secreto cifrado exitosamente: ${textoCifrado.substring(0, 35)}...` // Mostramos solo un pedacito del texto cifrado
        });

        // Le devolvemos al usuario el resumen
        res.json({
            estado: 'Operación Completa',
            flujo: [
                "Sistema A recibió el texto original",
                "Sistema A cifró el dato en KMS Vault",
                "Sistema A envió el criptograma al Sistema B",
                "Sistema B descifró el mensaje exitosamente"
            ],
            respuestaDelSistemaB: respuestaDeB.data
        });

    } catch (error) {
        console.error("Error en la comunicación A -> B:", error.message);
        
        // --- GUARDAMOS EL ERROR EN EL LOG SI ALGO FALLA ---
        historialLogsA.unshift({
            id: Date.now().toString().slice(-4),
            fecha: new Date().toLocaleTimeString(),
            accion: 'Fallo de Conexión/Cifrado',
            estado: 'Error',
            detalle: error.message
        });

        res.status(500).json({ error: 'Error en la comunicación entre microservicios' });
    }
});

// --- 3. NUEVA PUERTA EXCLUSIVA PARA EL FRONTEND DE AUDITORÍA ---
app.get('/api/logs', (req, res) => {
    // Cuando el Frontend A pida los logs, le devolvemos nuestra lista
    res.json(historialLogsA);
});

// --- ENCENDIDO DEL SERVIDOR ---
app.listen(PORT, () => {
    console.log(`🚀 Sistema A encendido y escuchando en el puerto ${PORT}`);
    console.log(`👉 Prueba la ruta en: http://localhost:${PORT}/api/ping`);
});