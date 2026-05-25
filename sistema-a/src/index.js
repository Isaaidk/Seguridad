const express = require('express');
const cors = require('cors');
const verificarToken = require('./middleware/auth');
const { cifrarDato } = require('./services/kmsService');
const axios = require('axios');

// Inicializamos la aplicación
const app = express();
const PORT = 3001; // Elegimos el puerto 3001 para el Sistema A

// --- MIDDLEWARES BÁSICOS ---
// Los middlewares son como "porteros" que revisan todo lo que entra al castillo.

// 1. Permite que nuestra app entienda información en formato JSON (el idioma de internet)
app.use(express.json()); 

// 2. Permite que otras páginas (como nuestro futuro Frontend en React) puedan hacerle peticiones
app.use(cors()); 

// --- RUTAS (Endpoints) ---
// Aquí definimos las puertas de nuestro castillo.

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
        // Obtenemos el texto que el usuario quiere cifrar desde el cuerpo de la petición
        const { textoSecreto } = req.body;

        if (!textoSecreto) {
            return res.status(400).json({ error: 'Debes enviar un textoSecreto' });
        }

        // Llamamos a nuestro ayudante KMS
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
        
        // El Sistema A se convierte en cliente y llama al Sistema B (que está en el puerto 3002)
        const respuestaDeB = await axios.post('http://localhost:3002/api/recibir', {
            datoCifrado: textoCifrado
        });

        console.log("3. Sistema A: El Sistema B respondió correctamente.");

        // Le devolvemos al usuario el resumen de toda la operación
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
        res.status(500).json({ error: 'Error en la comunicación entre microservicios' });
    }
});


// --- ENCENDIDO DEL SERVIDOR ---
app.listen(PORT, () => {
    console.log(`🚀 Sistema A encendido y escuchando en el puerto ${PORT}`);
    console.log(`👉 Prueba la ruta en: http://localhost:${PORT}/api/ping`);
});