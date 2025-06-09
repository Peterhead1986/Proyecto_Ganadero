// middleware/flash.js
// Middleware flash robusto para mensajes de una sola vez en Express

module.exports = function flashMiddleware(req, res, next) {
    // Inicializa res.locals.flash si no existe
    res.locals.flash = {};
    // Tipos de mensajes soportados
    const tipos = ['success', 'error', 'info', 'warning'];
    tipos.forEach(tipo => {
        if (req.session && req.session[tipo]) {
            res.locals.flash[tipo] = req.session[tipo];
            delete req.session[tipo];
        }
    });
    next();
};
