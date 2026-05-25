const axios = require('axios');

// Configuraciones de nuestra Caja Fuerte (Vault)
// Como estamos ejecutando Node en tu Codespace, usamos localhost
const VAULT_URL = 'http://localhost:8200/v1/transit';
const VAULT_TOKEN = 'llave-maestra-vault'; 
const KEY_NAME = 'llave-sistemas'; // La llave AES-256 que creamos hace un rato

/**
 * Función para cifrar texto usando Vault KMS
 */
async function cifrarDato(textoPlano) {
    // 1. Vault requiere que los datos se envíen en formato Base64 (un estándar de internet)
    const datoBase64 = Buffer.from(textoPlano).toString('base64');
    
    try {
        // 2. Hacemos la petición HTTP a la caja fuerte
        const respuesta = await axios.post(`${VAULT_URL}/encrypt/${KEY_NAME}`, {
            plaintext: datoBase64
        }, {
            headers: { 'X-Vault-Token': VAULT_TOKEN }
        });

        // 3. Vault nos devuelve el texto ilegible (Ej: vault:v1:ad823...)
        return respuesta.data.data.ciphertext;
    } catch (error) {
        console.error("Error al cifrar en Vault:", error.message);
        throw new Error("Fallo en el servicio KMS");
    }
}

module.exports = { cifrarDato };