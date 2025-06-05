// config/multer.js - Configuración para manejo de archivos
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Crear directorios de upload si no existen
const uploadPath = process.env.UPLOAD_PATH || './public/uploads';
const profilesPath = path.join(uploadPath, 'profiles');
const logosPath = path.join(uploadPath, 'logos');

[uploadPath, profilesPath, logosPath].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁  Directorio creado: ${dir}`);
    }
});

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadDir = uploadPath;
        if (file.fieldname === 'foto_perfil') {
            uploadDir = profilesPath;
        } else if (file.fieldname === 'logo_finca') {
            uploadDir = logosPath;
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const baseName = file.fieldname;
        const fileName = `${baseName}_${uniqueSuffix}${extension}`;
        cb(null, fileName);
    }
});

// Filtros de archivos permitidos
function fileFilter(req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo imágenes.'), false);
    }
}

// Middlewares de subida
const uploadProfile = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('foto_perfil');

const uploadLogo = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('logo_finca');

// Middleware para manejar errores de multer
function handleMulterError(err, req, res, next) {
    if (err instanceof multer.MulterError || err) {
        req.session.error = err.message || 'Error al subir archivo';
        // Redirección segura según Express 5.x
        const redirectTo = req.get('Referrer') || '/';
        return res.redirect(redirectTo);
    }
    next();
}

module.exports = {
    uploadProfile,
    uploadLogo,
    handleMulterError
};