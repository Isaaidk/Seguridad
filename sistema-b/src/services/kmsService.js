const axios = require('axios');

const VAULT_URL = 'http://localhost:8200/v1/transit';
const VAULT_TOKEN = 'llave-maestra-vault'; 
const KEY_NAME = 'llave-sistemas'; // La misma llave que usa el Sistema A

/**
 * Función para descifrar texto usando Vault KMS
 */
async function descifrarDato(textoCifrado) {
    try {
        const respuesta = await axios.post(`${VAULT_URL}/decrypt/${KEY_NAME}`, {
            ciphertext: textoCifrado // Le enviamos el texto de tipo vault:v1:...
        }, {
            headers: { 'X-Vault-Token': VAULT_TOKEN }
        });

        // Vault nos devuelve el dato en Base64. Lo traducimos a texto normal.
        const textoPlano = Buffer.from(respuesta.data.data.plaintext, 'base64').toString('utf-8');
        return textoPlano;
    } catch (error) {
        console.error("Error al descifrar en Vault:", error.message);
        throw new Error("Fallo en el servicio KMS de descifrado");
    }
}

module.exports = { descifrarDato };