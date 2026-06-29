const checkGroup = (grupoRequerido) => {
    return (req, res, next) => {
        // 'grupos' es el nombre que le pusimos al mapeo en Keycloak
        const gruposUsuario = req.user.grupos || []; 
        
        if (gruposUsuario.includes(grupoRequerido)) {
            next(); // Tiene permiso, pasa al castillo
        } else {
            res.status(403).json({ error: "Acceso denegado: No perteneces al grupo autorizado para este sistema." });
        }
    };
};
module.exports = checkGroup;