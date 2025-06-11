// public/js/ubicaciones.js - Manejo de selectores de ubicaciones venezolanas

class UbicacionesManager {
    constructor() {
        this.cache = new Map();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
    }

    setupEventListeners() {
        // Estado selector
        const estadoSelect = document.getElementById('estado_id');
        if (estadoSelect) {
            estadoSelect.addEventListener('change', (e) => {
                this.onEstadoChange(e.target.value);
            });
        }

        // Ciudad selector
        const ciudadSelect = document.getElementById('ciudad_id');
        if (ciudadSelect) {
            ciudadSelect.addEventListener('change', (e) => {
                this.onCiudadChange(e.target.value);
            });
        }
    }

    async loadInitialData() {
        // Si hay valores preseleccionados, cargar las dependencias
        const estadoId = document.getElementById('estado_id')?.value;
        const ciudadId = document.getElementById('ciudad_id')?.value;

        if (estadoId) {
            await this.loadCiudades(estadoId, ciudadId);
        }
    }

    async onEstadoChange(estadoId) {
        const ciudadSelect = document.getElementById('ciudad_id');

        // Limpiar selectores dependientes
        this.clearSelect(ciudadSelect, 'Seleccionar ciudad...');

        if (estadoId) {
            await this.loadCiudades(estadoId);
        }
    }

    async onCiudadChange(ciudadId) {
        // Lógica para manejar el cambio en el selector de ciudad si es necesario
    }

    async loadCiudades(estadoId, selectedCiudadId = null) {
        const ciudadSelect = document.getElementById('ciudad_id');
        if (!ciudadSelect) return;

        try {
            this.setLoadingState(ciudadSelect, 'Cargando ciudades...');
            
            const ciudades = await this.fetchUbicaciones('ciudades', estadoId);
            this.populateSelect(ciudadSelect, ciudades, 'Seleccionar ciudad...', selectedCiudadId);
            
        } catch (error) {
            console.error('Error cargando ciudades:', error);
            this.setErrorState(ciudadSelect, 'Error cargando ciudades');
        }
    }

    async fetchUbicaciones(tipo, parentId) {
        const cacheKey = `${tipo}_${parentId}`;
        
        // Verificar cache
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const response = await fetch(`/usuarios/ubicaciones/${tipo}/${parentId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Error obteniendo datos');
        }

        const ubicaciones = data[tipo] || [];
        
        // Guardar en cache
        this.cache.set(cacheKey, ubicaciones);
        
        return ubicaciones;
    }

    populateSelect(selectElement, options, placeholderText, selectedValue = null) {
        if (!selectElement) return;

        // Limpiar opciones existentes
        selectElement.innerHTML = '';

        // Agregar opción placeholder
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = placeholderText;
        selectElement.appendChild(placeholderOption);

        // Agregar opciones
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.id;
            optionElement.textContent = option.nombre;
            
            if (selectedValue && selectedValue == option.id) {
                optionElement.selected = true;
            }
            
            selectElement.appendChild(optionElement);
        });

        // Habilitar el selector
        selectElement.disabled = false;
        selectElement.classList.remove('loading', 'error');
    }

    clearSelect(selectElement, placeholderText) {
        if (!selectElement) return;

        selectElement.innerHTML = `<option value="">${placeholderText}</option>`;
        selectElement.disabled = false;
        selectElement.classList.remove('loading', 'error');
    }

    setLoadingState(selectElement, message) {
        if (!selectElement) return;

        selectElement.innerHTML = `<option value="">${message}</option>`;
        selectElement.disabled = true;
        selectElement.classList.add('loading');
        selectElement.classList.remove('error');
    }

    setErrorState(selectElement, message) {
        if (!selectElement) return;

        selectElement.innerHTML = `<option value="">${message}</option>`;
        selectElement.disabled = true;
        selectElement.classList.add('error');
        selectElement.classList.remove('loading');
    }

    // Método para obtener la ruta completa de ubicación
    getLocationPath() {
        const estado = document.getElementById('estado_id')?.selectedOptions[0]?.text;
        const ciudad = document.getElementById('ciudad_id')?.selectedOptions[0]?.text;

        const parts = [];
        if (estado && estado !== 'Seleccionar estado...') parts.push(estado);
        if (ciudad && ciudad !== 'Seleccionar ciudad...') parts.push(ciudad);

        return parts.join(' > ');
    }

    // Método para validar la selección de ubicaciones
    validateSelection() {
        const estado = document.getElementById('estado_id')?.value;
        const ciudad = document.getElementById('ciudad_id')?.value;

        const errors = [];

        if (!estado) {
            errors.push('Debe seleccionar un estado');
        }

        // Si hay ciudad seleccionada, debe tener estado
        if (ciudad && !estado) {
            errors.push('No puede seleccionar ciudad sin estado');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    // Método para resetear todos los selectores
    reset() {
        this.clearSelect(document.getElementById('estado_id'), 'Seleccionar estado...');
        this.clearSelect(document.getElementById('ciudad_id'), 'Seleccionar ciudad...');
    }

    // Método para precargar ubicaciones específicas
    async preloadLocation(estadoId, ciudadId = null) {
        try {
            // Seleccionar estado
            const estadoSelect = document.getElementById('estado_id');
            if (estadoSelect && estadoId) {
                estadoSelect.value = estadoId;
                await this.loadCiudades(estadoId, ciudadId);
            }

            // Seleccionar ciudad si está disponible
            if (ciudadId) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Pequeña pausa
                const ciudadSelect = document.getElementById('ciudad_id');
                if (ciudadSelect) {
                    ciudadSelect.value = ciudadId;
                }
            }

        } catch (error) {
            console.error('Error precargando ubicación:', error);
        }
    }

    // Método para obtener información de la ubicación seleccionada
    getSelectedLocationInfo() {
        const estadoSelect = document.getElementById('estado_id');
        const ciudadSelect = document.getElementById('ciudad_id');

        return {
            estado: {
                id: estadoSelect?.value || null,
                nombre: estadoSelect?.selectedOptions[0]?.text || null
            },
            ciudad: {
                id: ciudadSelect?.value || null,
                nombre: ciudadSelect?.selectedOptions[0]?.text || null
            }
        };
    }
}

// Inicializar el manager cuando el DOM esté listo
let ubicacionesManager;

document.addEventListener('DOMContentLoaded', function() {
    ubicacionesManager = new UbicacionesManager();
});

// Funciones globales para uso en otras partes
window.UbicacionesUtils = {
    getManager: () => ubicacionesManager,
    
    validateLocation: () => {
        return ubicacionesManager ? ubicacionesManager.validateSelection() : { valid: false, errors: ['Manager no inicializado'] };
    },
    
    getLocationPath: () => {
        return ubicacionesManager ? ubicacionesManager.getLocationPath() : '';
    },
    
    resetSelectors: () => {
        if (ubicacionesManager) {
            ubicacionesManager.reset();
        }
    },
    
    preloadLocation: (estadoId, ciudadId) => {
        if (ubicacionesManager) {
            return ubicacionesManager.preloadLocation(estadoId, ciudadId);
        }
    }
};
