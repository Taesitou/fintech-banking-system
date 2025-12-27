class Transaccion {
    constructor(id, cuentaId, tipo, monto, descripcion = '') {
        this.id = id;
        this.cuentaId = cuentaId;
        this.tipo = tipo; // 'DEPOSITO', 'RETIRO', 'TRANSFERENCIA_ENVIADA', 'TRANSFERENCIA_RECIBIDA'
        this.monto = monto;
        this.descripcion = descripcion;
        this.estado = 'COMPLETADA'; // 'PENDIENTE', 'COMPLETADA', 'FALLIDA', 'CANCELADA'
        this.fecha = new Date();
        this.metadatos = {};
    }

    // Getters
    getId() {
        return this.id;
    }

    getCuentaId() {
        return this.cuentaId;
    }

    getTipo() {
        return this.tipo;
    }

    getMonto() {
        return this.monto;
    }

    getDescripcion() {
        return this.descripcion;
    }

    getEstado() {
        return this.estado;
    }

    getFecha() {
        return this.fecha;
    }

    getMetadatos() {
        return { ...this.metadatos };
    }

    // Setters
    setEstado(estado) {
        this.estado = estado;
    }

    setDescripcion(descripcion) {
        this.descripcion = descripcion;
    }

    agregarMetadato(clave, valor) {
        this.metadatos[clave] = valor;
    }

    // Verificaciones de tipo
    esDeposito() {
        return this.tipo === 'DEPOSITO';
    }

    esRetiro() {
        return this.tipo === 'RETIRO';
    }

    esTransferencia() {
        return this.tipo === 'TRANSFERENCIA_ENVIADA' || this.tipo === 'TRANSFERENCIA_RECIBIDA';
    }

    esCompletada() {
        return this.estado === 'COMPLETADA';
    }

    esPendiente() {
        return this.estado === 'PENDIENTE';
    }

    // Formato y presentación
    getMontoFormateado() {
        const signo = this.tipo === 'RETIRO' || this.tipo === 'TRANSFERENCIA_ENVIADA' ? '-' : '+';
        return `${signo}$${this.monto.toFixed(2)}`;
    }

    getFechaFormateada() {
        return this.fecha.toLocaleString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getResumen() {
        return `${this.tipo}: $${this.monto.toFixed(2)} - ${this.descripcion} (${this.getFechaFormateada()})`;
    }

    // Validación
    validar() {
        if (!this.id || !this.cuentaId) {
            throw new Error('La transacción debe tener un ID y un ID de cuenta');
        }
        if (this.monto <= 0) {
            throw new Error('El monto debe ser mayor a cero');
        }
        if (!['DEPOSITO', 'RETIRO', 'TRANSFERENCIA_ENVIADA', 'TRANSFERENCIA_RECIBIDA'].includes(this.tipo)) {
            throw new Error('Tipo de transacción inválido');
        }
        return true;
    }

    // Serialización
    toJSON() {
        return {
            id: this.id,
            cuentaId: this.cuentaId,
            tipo: this.tipo,
            monto: this.monto,
            descripcion: this.descripcion,
            estado: this.estado,
            fecha: this.fecha,
            metadatos: this.metadatos
        };
    }

    // Métodos estáticos de fábrica
    static crearDeposito(id, cuentaId, monto, descripcion) {
        return new Transaccion(id, cuentaId, 'DEPOSITO', monto, descripcion);
    }

    static crearRetiro(id, cuentaId, monto, descripcion) {
        return new Transaccion(id, cuentaId, 'RETIRO', monto, descripcion);
    }

    static crearTransferenciaEnviada(id, cuentaId, monto, cuentaDestinoId, descripcion) {
        const transaccion = new Transaccion(id, cuentaId, 'TRANSFERENCIA_ENVIADA', monto, descripcion);
        transaccion.agregarMetadato('cuentaDestinoId', cuentaDestinoId);
        return transaccion;
    }

    static crearTransferenciaRecibida(id, cuentaId, monto, cuentaOrigenId, descripcion) {
        const transaccion = new Transaccion(id, cuentaId, 'TRANSFERENCIA_RECIBIDA', monto, descripcion);
        transaccion.agregarMetadato('cuentaOrigenId', cuentaOrigenId);
        return transaccion;
    }
}

export default Transaccion;