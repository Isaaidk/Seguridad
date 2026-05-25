const express = require('express');
const cors = require('cors');
const { descifrarDato } = require('./services/kmsService');

const app = express();
const PORT = 3002; // El Sistema B vive en el puerto 3002

app.use(express.json());
app.use(cors());

// --- PUERTA DE RECEPCIÓN DE DATOS ---
app.post('/api/recibir', async (req, res) => {
    try {
        // Recibimos el dato cifrado que nos mandó el Sistema A
        const { datoCifrado } = req.body;

        if (!datoCifrado) {
            return res.status(400).json({ error: 'Falta el dato cifrado' });
        }

        console.log("🔒 Recibido dato cifrado:", datoCifrado);

        // Le pedimos a Vault que lo abra
        const datoDescifrado = await descifrarDato(datoCifrado);

        console.log("🔓 Dato abierto con éxito:", datoDescifrado);

        res.json({
            estado: 'Exitoso',
            mensaje: 'El Sistema B recibió y descifró el mensaje correctamente',
            contenidoSecreto: datoDescifrado
        });
    } catch (error) {
        res.status(500).json({ error: 'Error procesando la información' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Sistema B encendido en el puerto ${PORT}`);
});