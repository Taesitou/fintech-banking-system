class Cliente {
    constructor(id, email, password, nombre = '', apellido = '') {
        this.id = id;
        this.email = email;
        this.password = password;
        this.nombre = nombre;
        this.apellido = apellido;
        this.cuentas = [];
        this.fechaCreacion = new Date();
    }

    // Getters
    getId() {
        return this.id;
    }

    getEmail() {
        return this.email;
    }

    getNombreCompleto() {
        return `${this.nombre} ${this.apellido}`.trim();
    }

    getCuentas() {
        return [...this.cuentas];
    }

    // Setters
    setNombre(nombre) {
        this.nombre = nombre;
    }

    setApellido(apellido) {
        this.apellido = apellido;
    }

    setEmail(email) {
        this.email = email;
    }

    cambiarPassword(passwordActual, passwordNuevo) {
        if (this.password === passwordActual) {
            this.password = passwordNuevo;
            return true;
        }
        return false;
    }

    // Gestión de cuentas
    agregarCuenta(cuenta) {
        if (!this.cuentas.find(c => c.getId() === cuenta.getId())) {
            this.cuentas.push(cuenta);
            return true;
        }
        return false;
    }

    eliminarCuenta(cuentaId) {
        const index = this.cuentas.findIndex(c => c.getId() === cuentaId);
        if (index !== -1) {
            this.cuentas.splice(index, 1);
            return true;
        }
        return false;
    }

    buscarCuenta(cuentaId) {
        return this.cuentas.find(c => c.getId() === cuentaId);
    }

    // Información financiera
    getSaldoTotal() {
        return this.cuentas.reduce((total, cuenta) => {
            return total + cuenta.getSaldo();
        }, 0);
    }

    getHistorialCompleto() {
        return this.cuentas.reduce((historial, cuenta) => {
            return historial.concat(cuenta.getTransacciones());
        }, []);
    }

    // Validación
    verificarPassword(password) {
        return this.password === password;
    }

    // Serialización
    toJSON() {
        return {
            id: this.id,
            email: this.email,
            nombre: this.nombre,
            apellido: this.apellido,
            cuentas: this.cuentas.map(c => c.toJSON()),
            fechaCreacion: this.fechaCreacion
        };
    }
}

export default Cliente;