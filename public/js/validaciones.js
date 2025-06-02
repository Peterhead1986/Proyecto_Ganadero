// public/js/validaciones.js - Sistema de validaciones para formularios

class FormValidator {
    constructor() {
        this.rules = new Map();
        this.messages = new Map();
        this.debounceTimers = new Map();
        this.init();
    }

    init() {
        this.setupDefaultRules();
        this.setupDefaultMessages();
    }

    setupDefaultRules() {
        // Reglas de validación por defecto
        this.rules.set('required', (value) => value && value.trim().length > 0);
        this.rules.set('email', (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
        this.rules.set('minLength', (value, min) => value.length >= min);
        this.rules.set('maxLength', (value, max) => value.length <= max);
        this.rules.set('numeric', (value) => /^\d+$/.test(value));
        this.rules.set('alphanumeric', (value) => /^[a-zA-Z0-9]+$/.test(value));
        this.rules.set('username', (value) => /^[a-zA-Z0-9_]{3,50}$/.test(value));
        this.rules.set('password', (value) => value.length >= 6);
        this.rules.set('strongPassword', (value) => {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value) && value.length >= 6;
        });
        this.rules.set('venezuelanDocument', (value) => {
            // Validar cédula venezolana (8 dígitos) o RIF (J-12345678-9)
            return /^\d{7,8}$/.test(value) || /^[JVEPGjvepg]-?\d{8}-?\d$/.test(value);
        });
        this.rules.set('coordinates', (value, min, max) => {
            const num = parseFloat(value);
            return !isNaN(num) && num >= min && num <= max;
        });
    }

    setupDefaultMessages() {
        // Mensajes de error por defecto
        this.messages.set('required', 'Este campo es obligatorio');
        this.messages.set('email', 'Ingrese un correo electrónico válido');
        this.messages.set('minLength', 'Debe tener al menos {min} caracteres');
        this.messages.set('maxLength', 'No puede exceder {max} caracteres');
        this.messages.set('numeric', 'Solo se permiten números');
        this.messages.set('alphanumeric', 'Solo se permiten letras y números');
        this.messages.set('username', 'El nombre de usuario debe tener entre 3-50 caracteres y solo contener letras, números y guiones bajos');
        this.messages.set('password', 'La contraseña debe tener al menos 6 caracteres');
        this.messages.set('strongPassword', 'La contraseña debe contener al menos 1 minúscula, 1 mayúscula y 1 número');
        this.messages.set('venezuelanDocument', 'Ingrese un número de documento válido (cédula o RIF)');
        this.messages.set('coordinates', 'Las coordenadas deben estar entre {min} y {max}');
    }

    // Validar un campo específico
    validateField(fieldName, value, rules) {
        const errors = [];

        for (const rule of rules) {
            let ruleName, ruleParams = [];

            if (typeof rule === 'string') {
                ruleName = rule;
            } else if (Array.isArray(rule)) {
                ruleName = rule[0];
                ruleParams = rule.slice(1);
            } else if (typeof rule === 'object') {
                ruleName = rule.name;
                ruleParams = rule.params || [];
            }

            const validator = this.rules.get(ruleName);
            if (!validator) {
                console.warn(`Regla de validación '${ruleName}' no encontrada`);
                continue;
            }

            if (!validator(value, ...ruleParams)) {
                let message = this.messages.get(ruleName) || `Error en regla ${ruleName}`;
                
                // Reemplazar parámetros en el mensaje
                ruleParams.forEach((param, index) => {
                    const paramNames = ['min', 'max', 'length'];
                    const paramName = paramNames[index] || `param${index + 1}`;
                    message = message.replace(`{${paramName}}`, param);
                });

                errors.push(message);
            }
        }

        return errors;
    }

    // Mostrar errores en el DOM
    showErrors(fieldName, errors) {
        const field = document.getElementById(fieldName);
        if (!field) return;

        // Remover errores anteriores
        this.clearErrors(fieldName);

        if (errors.length > 0) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');

            // Crear contenedor de errores
            const errorContainer = document.createElement('div');
            errorContainer.className = 'validation-errors';
            errorContainer.innerHTML = errors.map(error => 
                `<div class="validation-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    ${error}
                </div>`
            ).join('');

            // Insertar después del campo
            field.parentNode.insertBefore(errorContainer, field.nextSibling);
        } else {
            field.classList.add('is-valid');
            field.classList.remove('is-invalid');
        }
    }

    // Limpiar errores
    clearErrors(fieldName) {
        const field = document.getElementById(fieldName);
        if (!field) return;

        field.classList.remove('is-invalid', 'is-valid');
        
        // Remover contenedores de errores
        const errorContainers = field.parentNode.querySelectorAll('.validation-errors');
        errorContainers.forEach(container => container.remove());
    }

    // Validar formulario completo
    validateForm(formId, validationRules) {
        const form = document.getElementById(formId);
        if (!form) return { valid: false, errors: ['Formulario no encontrado'] };

        let isValid = true;
        const allErrors = {};

        for (const [fieldName, rules] of Object.entries(validationRules)) {
            const field = document.getElementById(fieldName);
            if (!field) continue;

            const value = field.value;
            const errors = this.validateField(fieldName, value, rules);

            if (errors.length > 0) {
                isValid = false;
                allErrors[fieldName] = errors;
            }

            this.showErrors(fieldName, errors);
        }

        return { valid: isValid, errors: allErrors };
    }

    // Validación en tiempo real con debounce
    setupRealTimeValidation(fieldName, rules, delay = 500) {
        const field = document.getElementById(fieldName);
        if (!field) return;

        field.addEventListener('input', (e) => {
            const value = e.target.value;
            
            // Limpiar timer anterior
            if (this.debounceTimers.has(fieldName)) {
                clearTimeout(this.debounceTimers.get(fieldName));
            }

            // Crear nuevo timer
            const timer = setTimeout(() => {
                const errors = this.validateField(fieldName, value, rules);
                this.showErrors(fieldName, errors);
            }, delay);

            this.debounceTimers.set(fieldName, timer);
        });

        // Validación inmediata al perder el foco
        field.addEventListener('blur', (e) => {
            const value = e.target.value;
            const errors = this.validateField(fieldName, value, rules);
            this.showErrors(fieldName, errors);
        });
    }

    // Validación de confirmación de contraseña
    setupPasswordConfirmation(passwordField, confirmField) {
        const password = document.getElementById(passwordField);
        const confirm = document.getElementById(confirmField);

        if (!password || !confirm) return;

        const validateConfirmation = () => {
            const passwordValue = password.value;
            const confirmValue = confirm.value;

            if (confirmValue && passwordValue !== confirmValue) {
                this.showErrors(confirmField, ['Las contraseñas no coinciden']);
            } else if (confirmValue) {
                this.showErrors(confirmField, []);
            }
        };

        password.addEventListener('input', validateConfirmation);
        confirm.addEventListener('input', validateConfirmation);
        confirm.addEventListener('blur', validateConfirmation);
    }

    // Medidor de fuerza de contraseña
    setupPasswordStrength(fieldName, containerId) {
        const field = document.getElementById(fieldName);
        const container = document.getElementById(containerId);

        if (!field || !container) return;

        field.addEventListener('input', (e) => {
            const password = e.target.value;
            const strength = this.calculatePasswordStrength(password);
            
            container.innerHTML = `
                <div class="strength-meter">
                    <div class="strength-bar strength-${strength.level}" style="width: ${strength.percentage}%"></div>
                </div>
                <div class="strength-info">
                    <span class="strength-text strength-${strength.level}">${strength.text}</span>
                    <div class="strength-requirements">
                        ${strength.requirements.map(req => 
                            `<div class="requirement ${req.met ? 'met' : 'unmet'}">
                                <i class="fas ${req.met ? 'fa-check' : 'fa-times'}"></i>
                                ${req.text}
                            </div>`
                        ).join('')}
                    </div>
                </div>
            `;
        });
    }

    // Calcular fuerza de contraseña
    calculatePasswordStrength(password) {
        const requirements = [
            { text: 'Al menos 6 caracteres', met: password.length >= 6 },
            { text: 'Al menos 8 caracteres', met: password.length >= 8 },
            { text: 'Contiene minúsculas', met: /[a-z]/.test(password) },
            { text: 'Contiene mayúsculas', met: /[A-Z]/.test(password) },
            { text: 'Contiene números', met: /\d/.test(password) },
            { text: 'Contiene símbolos', met: /[^A-Za-z0-9]/.test(password) }
        ];

        const metCount = requirements.filter(req => req.met).length;
        const percentage = Math.min((metCount / requirements.length) * 100, 100);

        let level, text;
        if (metCount <= 2) {
            level = 'weak';
            text = 'Débil';
        } else if (metCount <= 4) {
            level = 'medium';
            text = 'Moderada';
        } else {
            level = 'strong';
            text = 'Fuerte';
        }

        return { level, text, percentage, requirements };
    }

    // Validación de archivos
    validateFile(file, options = {}) {
        const errors = [];
        
        if (!file) {
            if (options.required) {
                errors.push('Debe seleccionar un archivo');
            }
            return errors;
        }

        // Validar tamaño
        if (options.maxSize && file.size > options.maxSize) {
            const maxSizeMB = (options.maxSize / 1024 / 1024).toFixed(1);
            errors.push(`El archivo no puede exceder ${maxSizeMB}MB`);
        }

        // Validar tipo
        if (options.allowedTypes) {
            const isAllowed = options.allowedTypes.some(type => {
                if (type.startsWith('.')) {
                    return file.name.toLowerCase().endsWith(type.toLowerCase());
                }
                return file.type.includes(type);
            });

            if (!isAllowed) {
                errors.push(`Tipo de archivo no permitido. Permitidos: ${options.allowedTypes.join(', ')}`);
            }
        }

        // Validar dimensiones de imagen (si es imagen)
        if (file.type.startsWith('image/') && (options.maxWidth || options.maxHeight || options.minWidth || options.minHeight)) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    if (options.maxWidth && img.width > options.maxWidth) {
                        errors.push(`Ancho máximo: ${options.maxWidth}px`);
                    }
                    if (options.maxHeight && img.height > options.maxHeight) {
                        errors.push(`Alto máximo: ${options.maxHeight}px`);
                    }
                    if (options.minWidth && img.width < options.minWidth) {
                        errors.push(`Ancho mínimo: ${options.minWidth}px`);
                    }
                    if (options.minHeight && img.height < options.minHeight) {
                        errors.push(`Alto mínimo: ${options.minHeight}px`);
                    }
                    resolve(errors);
                };
                img.src = URL.createObjectURL(file);
            });
        }

        return errors;
    }

    // Validación asíncrona (para APIs)
    async validateAsync(fieldName, value, url, additionalData = {}) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    campo: fieldName,
                    valor: value,
                    ...additionalData
                })
            });

            const result = await response.json();
            
            if (result.success) {
                const errors = result.existe ? [result.mensaje] : [];
                this.showErrors(fieldName, errors);
                return { valid: !result.existe, message: result.mensaje };
            } else {
                throw new Error(result.message || 'Error en validación');
            }
        } catch (error) {
            console.error('Error en validación asíncrona:', error);
            return { valid: false, message: 'Error validando campo' };
        }
    }

    // Configurar validación de formulario completo
    setupFormValidation(formId, rules, options = {}) {
        const form = document.getElementById(formId);
        if (!form) return;

        // Configurar validación en tiempo real para cada campo
        Object.entries(rules).forEach(([fieldName, fieldRules]) => {
            this.setupRealTimeValidation(fieldName, fieldRules, options.debounceDelay);
        });

        // Validar al enviar el formulario
        form.addEventListener('submit', (e) => {
            const validation = this.validateForm(formId, rules);
            
            if (!validation.valid) {
                e.preventDefault();
                
                // Enfocar en el primer campo con error
                const firstErrorField = Object.keys(validation.errors)[0];
                if (firstErrorField) {
                    document.getElementById(firstErrorField)?.focus();
                }
                
                // Mostrar mensaje general de error
                if (options.showGeneralError) {
                    this.showGeneralError('Por favor corrija los errores antes de continuar');
                }
            }
        });
    }

    // Mostrar mensaje general de error
    showGeneralError(message) {
        // Remover mensajes anteriores
        const existingError = document.querySelector('.form-general-error');
        if (existingError) {
            existingError.remove();
        }

        // Crear nuevo mensaje
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-general-error alert alert-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            ${message}
        `;

        // Insertar al inicio del formulario
        const form = document.querySelector('form');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
            errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Limpiar todas las validaciones del formulario
    clearFormValidation(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        // Limpiar todos los campos con errores
        const fieldsWithErrors = form.querySelectorAll('.is-invalid, .is-valid');
        fieldsWithErrors.forEach(field => {
            field.classList.remove('is-invalid', 'is-valid');
        });

        // Remover todos los mensajes de error
        const errorMessages = form.querySelectorAll('.validation-errors, .form-general-error');
        errorMessages.forEach(message => message.remove());
    }

    // Agregar regla personalizada
    addRule(name, validator, message) {
        this.rules.set(name, validator);
        this.messages.set(name, message);
    }

    // Agregar mensaje personalizado
    addMessage(ruleName, message) {
        this.messages.set(ruleName, message);
    }
}

// Instancia global del validador
let formValidator;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    formValidator = new FormValidator();
});

// Funciones globales para usar en formularios específicos
window.ValidationUtils = {
    getValidator: () => formValidator,
    
    // Configurar validación de registro de usuario
    setupUserRegistration: () => {
        if (!formValidator) return;

        const rules = {
            nombre: ['required', ['minLength', 2], ['maxLength', 100]],
            apellido: ['required', ['minLength', 2], ['maxLength', 100]],
            correo: ['required', 'email'],
            tipo_documento: ['required'],
            numero_documento: ['required', 'venezuelanDocument'],
            estado_id: ['required'],
            nombre_usuario: ['required', 'username'],
            password: ['required', 'strongPassword'],
            password_confirmar: ['required']
        };

        formValidator.setupFormValidation('registroForm', rules, {
            debounceDelay: 300,
            showGeneralError: true
        });

        // Configurar validación de confirmación de contraseña
        formValidator.setupPasswordConfirmation('password', 'password_confirmar');

        // Configurar medidor de fuerza de contraseña
        formValidator.setupPasswordStrength('password', 'password-strength');

        // Validaciones asíncronas
        formValidator.setupRealTimeValidation('correo', ['required', 'email']);
        formValidator.setupRealTimeValidation('nombre_usuario', ['required', 'username']);
        formValidator.setupRealTimeValidation('numero_documento', ['required', 'venezuelanDocument']);
    },

    // Configurar validación de registro de finca
    setupFarmRegistration: () => {
        if (!formValidator) return;

        const rules = {
            nombre_finca: ['required', ['minLength', 2], ['maxLength', 150]],
            direccion_finca: [['maxLength', 500]],
            estado_id: ['required'],
            latitud: [['coordinates', -90, 90]],
            longitud: [['coordinates', -180, 180]]
        };

        formValidator.setupFormValidation('fincaForm', rules, {
            debounceDelay: 500,
            showGeneralError: true
        });
    },

    // Validar archivo de imagen
    validateImageFile: (file, options = {}) => {
        const defaultOptions = {
            maxSize: 5 * 1024 * 1024, // 5MB
            allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
            maxWidth: 2000,
            maxHeight: 2000,
            minWidth: 100,
            minHeight: 100
        };

        return formValidator.validateFile(file, { ...defaultOptions, ...options });
    },

    // Validar coordenadas
    validateCoordinates: (lat, lng) => {
        const latErrors = formValidator.validateField('latitud', lat, [['coordinates', -90, 90]]);
        const lngErrors = formValidator.validateField('longitud', lng, [['coordinates', -180, 180]]);
        
        return {
            valid: latErrors.length === 0 && lngErrors.length === 0,
            errors: { latitud: latErrors, longitud: lngErrors }
        };
    },

    // Validar documento venezolano
    validateVenezuelanDocument: (document, type) => {
        let pattern;
        let message;

        if (type === 'cedula') {
            pattern = /^\d{7,8}$/;
            message = 'La cédula debe tener entre 7 y 8 dígitos';
        } else if (type === 'rif_juridico') {
            pattern = /^[JVEPGjvepg]-?\d{8}-?\d$/;
            message = 'El RIF debe tener el formato J-12345678-9';
        } else {
            pattern = /^(\d{7,8}|[JVEPGjvepg]-?\d{8}-?\d)$/;
            message = 'Documento inválido';
        }

        return {
            valid: pattern.test(document),
            message: pattern.test(document) ? 'Documento válido' : message
        };
    }
};

// Estilos CSS para validaciones (se pueden mover a un archivo CSS)
const validationStyles = `
<style>
.validation-errors {
    margin-top: 0.5rem;
}

.validation-error {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--error);
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
}

.form-general-error {
    margin-bottom: 1rem;
    animation: slideInDown 0.3s ease;
}

@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.strength-meter {
    height: 4px;
    background: #e0e0e0;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.strength-bar {
    height: 100%;
    transition: all 0.3s ease;
    border-radius: 2px;
}

.strength-requirements {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.25rem;
    margin-top: 0.5rem;
}

.requirement {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.8rem;
}

.requirement.met {
    color: var(--success);
}

.requirement.unmet {
    color: var(--gray);
}

.strength-weak { color: var(--error); }
.strength-medium { color: var(--warning); }
.strength-strong { color: var(--success); }
</style>
`;

// Insertar estilos si no existen
if (!document.querySelector('#validation-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'validation-styles';
    styleElement.innerHTML = validationStyles;
    document.head.appendChild(styleElement);
}
