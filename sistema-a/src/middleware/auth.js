const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// 1. Le decimos al guardia dónde encontrar las "firmas públicas" del Rey (Keycloak)
// Nota: Usamos la IP interna de Docker 'keycloak' pero como estamos desde Node local, usamos localhost
const client = jwksClient({
  jwksUri: 'http://localhost:8080/realms/software-seguro/protocol/openid-connect/certs'
});

// 2. Función para leer la llave pública de Keycloak
function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
        console.error("Error obteniendo la llave de Keycloak:", err);
        return callback(err, null);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// 3. El Guardia de Seguridad (El Middleware en sí)
const verificarToken = (req, res, next) => {
  // A. Revisar si la persona trae la cabecera "Authorization"
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
        error: '¡Alto ahí! Necesitas un Token JWT válido para entrar.' 
    });
  }

  // B. Extraer el token (quitando la palabra "Bearer ")
  const token = authHeader.split(' ')[1];

  // C. Verificar matemáticamente que el token es auténtico y no está expirado
  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
          error: 'Tu pasaporte es falso o ya expiró. Acceso denegado.' 
      });
    }

    // D. Si es válido, guardamos los datos del usuario y le abrimos la puerta (next)
    req.user = decoded;
    next();
  });
};

module.exports = verificarToken;