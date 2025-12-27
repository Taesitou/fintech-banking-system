class Fintech {
    constructor(nombre, codigo) {
        this.nombre = nombre;
        this.codigo = codigo;
        this.clientes = [];
        this.cuentas = [];
        this.transacciones = [];
        this.fechaCreacion = new Date();
    }

    // Getters
    getNombre() {
        return this.nombre;
    }

    getCodigo() {
        return this.codigo;
    }

    getClientes() {
        return [...this.clientes];
    }

    getCuentas() {
        return [...this.cuentas];
    }

    getTransacciones() {
        return [...this.transacciones];
    }

    // Gestión de clientes
    registrarCliente(cliente) {
        if (this.buscarClientePorEmail(cliente.getEmail())) {
            throw new Error('Ya existe un cliente con ese email');
        }
        this.clientes.push(cliente);
        return cliente;
    }

    eliminarCliente(clienteId) {
        const cliente = this.buscarCliente(clienteId);
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }
        
        // Verificar que no tenga cuentas activas
        const cuentasCliente = this.getCuentasPorCliente(clienteId);
        if (cuentasCliente.some(c => c.getEstado() === 'ACTIVA')) {
            throw new Error('No se puede eliminar un cliente con cuentas activas');
        }

        const index = this.clientes.findIndex(c => c.getId() === clienteId);
        if (index !== -1) {
            this.clientes.splice(index, 1);
            return true;
        }
        return false;
    }

    buscarCliente(clienteId) {
        return this.clientes.find(c => c.getId() === clienteId);
    }

    buscarClientePorEmail(email) {
        return this.clientes.find(c => c.getEmail() === email);
    }

    // Gestión de cuentas
    abrirCuenta(cuenta) {
        const cliente = this.buscarCliente(cuenta.getClienteId());
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }
        
        this.cuentas.push(cuenta);
        cliente.agregarCuenta(cuenta);
        return cuenta;
    }

    cerrarCuenta(cuentaId) {
        const cuenta = this.buscarCuenta(cuentaId);
        if (!cuenta) {
            throw new Error('Cuenta no encontrada');
        }
        
        cuenta.cerrar();
        return true;
    }

    buscarCuenta(cuentaId) {
        return this.cuentas.find(c => c.getId() === cuentaId);
    }

    getCuentasPorCliente(clienteId) {
        return this.cuentas.filter(c => c.getClienteId() === clienteId);
    }

    // Operaciones bancarias
    realizarDeposito(cuentaId, monto, descripcion) {
        const cuenta = this.buscarCuenta(cuentaId);
        if (!cuenta) {
            throw new Error('Cuenta no encontrada');
        }
        
        const transaccion = cuenta.depositar(monto, descripcion);
        this.transacciones.push(transaccion);
        return transaccion;
    }

    realizarRetiro(cuentaId, monto, descripcion) {
        const cuenta = this.buscarCuenta(cuentaId);
        if (!cuenta) {
            throw new Error('Cuenta no encontrada');
        }
        
        const transaccion = cuenta.retirar(monto, descripcion);
        this.transacciones.push(transaccion);
        return transaccion;
    }

    realizarTransferencia(cuentaOrigenId, cuentaDestinoId, monto, descripcion) {
        const cuentaOrigen = this.buscarCuenta(cuentaOrigenId);
        const cuentaDestino = this.buscarCuenta(cuentaDestinoId);
        
        if (!cuentaOrigen || !cuentaDestino) {
            throw new Error('Una o ambas cuentas no existen');
        }
        
        const transaccionSalida = cuentaOrigen.transferir(cuentaDestino, monto, descripcion);
        const transacciones = cuentaDestino.getTransacciones();
        const transaccionEntrada = transacciones[transacciones.length - 1];
        
        this.transacciones.push(transaccionSalida);
        this.transacciones.push(transaccionEntrada);
        
        return { envio: transaccionSalida, recepcion: transaccionEntrada };
    }

    // Reportes y estadísticas
    getTotalClientes() {
        return this.clientes.length;
    }

    getTotalCuentas() {
        return this.cuentas.length;
    }

    getTotalCuentasActivas() {
        return this.cuentas.filter(c => c.getEstado() === 'ACTIVA').length;
    }

    getSaldoTotalSistema() {
        return this.cuentas.reduce((total, cuenta) => {
            return total + cuenta.getSaldo();
        }, 0);
    }

    getTotalTransacciones() {
        return this.transacciones.length;
    }

    getTransaccionesPorPeriodo(fechaInicio, fechaFin) {
        return this.transacciones.filter(t => {
            return t.fecha >= fechaInicio && t.fecha <= fechaFin;
        });
    }

    getEstadisticas() {
        return {
            totalClientes: this.getTotalClientes(),
            totalCuentas: this.getTotalCuentas(),
            cuentasActivas: this.getTotalCuentasActivas(),
            saldoTotal: this.getSaldoTotalSistema(),
            totalTransacciones: this.getTotalTransacciones(),
            fechaCreacion: this.fechaCreacion
        };
    }

    // Autenticación
    autenticarCliente(email, password) {
        const cliente = this.buscarClientePorEmail(email);
        if (!cliente) {
            return null;
        }
        
        return cliente.verificarPassword(password) ? cliente : null;
    }

    // Serialización
    toJSON() {
        return {
            nombre: this.nombre,
            codigo: this.codigo,
            clientes: this.clientes.map(c => c.toJSON()),
            cuentas: this.cuentas.map(c => c.toJSON()),
            estadisticas: this.getEstadisticas(),
            fechaCreacion: this.fechaCreacion
        };
    }
}

export default Fintech;
