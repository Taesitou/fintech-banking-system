class Cuenta {
    constructor(id, clienteId, tipoCuenta = 'AHORRO', saldoInicial = 0) {
        this.id = id;
        this.clienteId = clienteId;
        this.tipoCuenta = tipoCuenta; // 'AHORRO', 'CORRIENTE', 'INVERSION'
        this.saldo = saldoInicial;
        this.transacciones = [];
        this.estado = 'ACTIVA'; // 'ACTIVA', 'BLOQUEADA', 'CERRADA'
        this.fechaCreacion = new Date();
    }

    // Getters
    getId() {
        return this.id;
    }

    getClienteId() {
        return this.clienteId;
    }

    getTipoCuenta() {
        return this.tipoCuenta;
    }

    getSaldo() {
        return this.saldo;
    }

    getEstado() {
        return this.estado;
    }

    getTransacciones() {
        return [...this.transacciones];
    }

    // Operaciones bancarias
    depositar(monto, descripcion = 'Depósito') {
        if (monto <= 0) {
            throw new Error('El monto debe ser mayor a cero');
        }
        if (this.estado !== 'ACTIVA') {
            throw new Error('La cuenta no está activa');
        }

        this.saldo += monto;
        const transaccion = this.crearTransaccion('DEPOSITO', monto, descripcion);
        return transaccion;
    }

    retirar(monto, descripcion = 'Retiro') {
        if (monto <= 0) {
            throw new Error('El monto debe ser mayor a cero');
        }
        if (this.estado !== 'ACTIVA') {
            throw new Error('La cuenta no está activa');
        }
        if (this.saldo < monto) {
            throw new Error('Saldo insuficiente');
        }

        this.saldo -= monto;
        const transaccion = this.crearTransaccion('RETIRO', monto, descripcion);
        return transaccion;
    }

    transferir(cuentaDestino, monto, descripcion = 'Transferencia') {
        if (monto <= 0) {
            throw new Error('El monto debe ser mayor a cero');
        }
        if (this.estado !== 'ACTIVA') {
            throw new Error('La cuenta no está activa');
        }
        if (this.saldo < monto) {
            throw new Error('Saldo insuficiente');
        }

        this.saldo -= monto;
        const transaccionSalida = this.crearTransaccion(
            'TRANSFERENCIA_ENVIADA',
            monto,
            `${descripcion} a cuenta ${cuentaDestino.getId()}`
        );

        cuentaDestino.recibirTransferencia(monto, this.id, descripcion);
        
        return transaccionSalida;
    }

    recibirTransferencia(monto, cuentaOrigenId, descripcion = 'Transferencia') {
        this.saldo += monto;
        const transaccion = this.crearTransaccion(
            'TRANSFERENCIA_RECIBIDA',
            monto,
            `${descripcion} de cuenta ${cuentaOrigenId}`
        );
        return transaccion;
    }

    // Gestión de transacciones
    crearTransaccion(tipo, monto, descripcion) {
        const transaccion = {
            id: this.generarIdTransaccion(),
            cuentaId: this.id,
            tipo: tipo,
            monto: monto,
            descripcion: descripcion,
            saldoDespues: this.saldo,
            fecha: new Date(),
            toJSON() {
                return {
                    id: this.id,
                    cuentaId: this.cuentaId,
                    tipo: this.tipo,
                    monto: this.monto,
                    descripcion: this.descripcion,
                    saldoDespues: this.saldoDespues,
                    fecha: this.fecha
                };
            }
        };
        
        this.transacciones.push(transaccion);
        return transaccion;
    }

    getHistorialTransacciones(limite = null) {
        const historial = [...this.transacciones].reverse();
        return limite ? historial.slice(0, limite) : historial;
    }

    getTransaccionesPorTipo(tipo) {
        return this.transacciones.filter(t => t.tipo === tipo);
    }

    getTransaccionesPorFecha(fechaInicio, fechaFin) {
        return this.transacciones.filter(t => {
            return t.fecha >= fechaInicio && t.fecha <= fechaFin;
        });
    }

    // Gestión de estado
    bloquear() {
        this.estado = 'BLOQUEADA';
    }

    activar() {
        this.estado = 'ACTIVA';
    }

    cerrar() {
        if (this.saldo !== 0) {
            throw new Error('No se puede cerrar una cuenta con saldo diferente a cero');
        }
        this.estado = 'CERRADA';
    }

    // Utilidades
    generarIdTransaccion() {
        return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    puedeRetirar(monto) {
        return this.estado === 'ACTIVA' && this.saldo >= monto;
    }

    // Serialización
    toJSON() {
        return {
            id: this.id,
            clienteId: this.clienteId,
            tipoCuenta: this.tipoCuenta,
            saldo: this.saldo,
            estado: this.estado,
            transacciones: this.transacciones.map(t => t.toJSON()),
            fechaCreacion: this.fechaCreacion
        };
    }
}

export default Cuenta;