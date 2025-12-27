import Fintech from '../Fintech.js';
import Cliente from '../Client.js';
import Cuenta from '../Account.js';

describe('Fintech', () => {
    describe('Constructor', () => {
        test('debe crear una instancia de Fintech con nombre y código', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');

            expect(fintech.getNombre()).toBe('MiBanco');
            expect(fintech.getCodigo()).toBe('BANK001');
            expect(fintech.getClientes()).toEqual([]);
            expect(fintech.getCuentas()).toEqual([]);
            expect(fintech.getTransacciones()).toEqual([]);
        });
    });

    describe('Gestión de clientes', () => {
        test('debe registrar un nuevo cliente', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123', 'Juan', 'Pérez');

            fintech.registrarCliente(cliente);

            expect(fintech.getClientes()).toHaveLength(1);
            expect(fintech.getClientes()[0]).toBe(cliente);
        });

        test('debe lanzar error al registrar cliente con email duplicado', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente1 = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cliente2 = new Cliente('CLI002', 'test@example.com', 'pass456');

            fintech.registrarCliente(cliente1);

            expect(() => {
                fintech.registrarCliente(cliente2);
            }).toThrow('Ya existe un cliente con ese email');
        });

        test('debe buscar cliente por ID', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            fintech.registrarCliente(cliente);

            const encontrado = fintech.buscarCliente('CLI001');

            expect(encontrado).toBe(cliente);
        });

        test('debe buscar cliente por email', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            fintech.registrarCliente(cliente);

            const encontrado = fintech.buscarClientePorEmail('test@example.com');

            expect(encontrado).toBe(cliente);
        });

        test('debe eliminar un cliente sin cuentas activas', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            fintech.registrarCliente(cliente);

            const resultado = fintech.eliminarCliente('CLI001');

            expect(resultado).toBe(true);
            expect(fintech.getClientes()).toHaveLength(0);
        });

        test('debe lanzar error al eliminar cliente con cuentas activas', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            
            fintech.registrarCliente(cliente);
            fintech.abrirCuenta(cuenta);

            expect(() => {
                fintech.eliminarCliente('CLI001');
            }).toThrow('No se puede eliminar un cliente con cuentas activas');
        });
    });

    describe('Gestión de cuentas', () => {
        test('debe abrir una cuenta para un cliente existente', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            fintech.registrarCliente(cliente);
            fintech.abrirCuenta(cuenta);

            expect(fintech.getCuentas()).toHaveLength(1);
            expect(cliente.getCuentas()).toHaveLength(1);
        });

        test('debe lanzar error al abrir cuenta para cliente inexistente', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cuenta = new Cuenta('ACC001', 'CLI999', 'AHORRO', 1000);

            expect(() => {
                fintech.abrirCuenta(cuenta);
            }).toThrow('Cliente no encontrado');
        });

        test('debe buscar cuenta por ID', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            fintech.registrarCliente(cliente);
            fintech.abrirCuenta(cuenta);

            const encontrada = fintech.buscarCuenta('ACC001');

            expect(encontrada).toBe(cuenta);
        });

        test('debe obtener cuentas por cliente', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta1 = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            const cuenta2 = new Cuenta('ACC002', 'CLI001', 'CORRIENTE', 500);

            fintech.registrarCliente(cliente);
            fintech.abrirCuenta(cuenta1);
            fintech.abrirCuenta(cuenta2);

            const cuentasCliente = fintech.getCuentasPorCliente('CLI001');

            expect(cuentasCliente).toHaveLength(2);
        });

        test('debe cerrar una cuenta', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 0);

            fintech.registrarCliente(cliente);
            fintech.abrirCuenta(cuenta);

            fintech.cerrarCuenta('ACC001');

            expect(cuenta.getEstado()).toBe('CERRADA');
        });
    });

    describe('Operaciones bancarias', () => {
        test('debe realizar un depósito', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            fintech.registrarCliente(cliente);
            fintech.abrirCuenta(cuenta);

            const transaccion = fintech.realizarDeposito('ACC001', 500, 'Depósito');

            expect(cuenta.getSaldo()).toBe(1500);
            expect(transaccion.tipo).toBe('DEPOSITO');
            expect(fintech.getTransacciones()).toHaveLength(1);
        });

        test('debe realizar un retiro', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            fintech.registrarCliente(cliente);
            fintech.abrirCuenta(cuenta);

            const transaccion = fintech.realizarRetiro('ACC001', 300, 'Retiro');

            expect(cuenta.getSaldo()).toBe(700);
            expect(transaccion.tipo).toBe('RETIRO');
            expect(fintech.getTransacciones()).toHaveLength(1);
        });

        test('debe realizar una transferencia entre cuentas', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente1 = new Cliente('CLI001', 'test1@example.com', 'pass123');
            const cliente2 = new Cliente('CLI002', 'test2@example.com', 'pass456');
            const cuenta1 = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            const cuenta2 = new Cuenta('ACC002', 'CLI002', 'CORRIENTE', 500);

            fintech.registrarCliente(cliente1);
            fintech.registrarCliente(cliente2);
            fintech.abrirCuenta(cuenta1);
            fintech.abrirCuenta(cuenta2);

            const resultado = fintech.realizarTransferencia('ACC001', 'ACC002', 300, 'Transferencia');

            expect(cuenta1.getSaldo()).toBe(700);
            expect(cuenta2.getSaldo()).toBe(800);
            expect(resultado.envio.tipo).toBe('TRANSFERENCIA_ENVIADA');
            expect(resultado.recepcion.tipo).toBe('TRANSFERENCIA_RECIBIDA');
            expect(fintech.getTransacciones()).toHaveLength(2);
        });

        test('debe lanzar error al operar en cuenta inexistente', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');

            expect(() => {
                fintech.realizarDeposito('ACC999', 500);
            }).toThrow('Cuenta no encontrada');
        });
    });

    describe('Reportes y estadísticas', () => {
        test('debe retornar el total de clientes', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente1 = new Cliente('CLI001', 'test1@example.com', 'pass123');
            const cliente2 = new Cliente('CLI002', 'test2@example.com', 'pass456');

            fintech.registrarCliente(cliente1);
            fintech.registrarCliente(cliente2);

            expect(fintech.getTotalClientes()).toBe(2);
        });

        test('debe retornar el total de cuentas', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta1 = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            const cuenta2 = new Cuenta('ACC002', 'CLI001', 'CORRIENTE', 500);

            fintech.registrarCliente(cliente);
            fintech.abrirCuenta(cuenta1);
            fintech.abrirCuenta(cuenta2);

            expect(fintech.getTotalCuentas()).toBe(2);
        });

        test('debe retornar el total de cuentas activas', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta1 = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            const cuenta2 = new Cuenta('ACC002', 'CLI001', 'CORRIENTE', 0);

            fintech.registrarCliente(cliente);
            fintech.abrirCuenta(cuenta1);
            fintech.abrirCuenta(cuenta2);
            
            cuenta2.cerrar();

            expect(fintech.getTotalCuentasActivas()).toBe(1);
        });

        test('debe retornar el saldo total del sistema', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta1 = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            const cuenta2 = new Cuenta('ACC002', 'CLI001', 'CORRIENTE', 500);

            fintech.registrarCliente(cliente);
            fintech.abrirCuenta(cuenta1);
            fintech.abrirCuenta(cuenta2);

            expect(fintech.getSaldoTotalSistema()).toBe(1500);
        });

        test('debe retornar estadísticas completas', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            fintech.registrarCliente(cliente);
            fintech.abrirCuenta(cuenta);
            fintech.realizarDeposito('ACC001', 500);

            const estadisticas = fintech.getEstadisticas();

            expect(estadisticas.totalClientes).toBe(1);
            expect(estadisticas.totalCuentas).toBe(1);
            expect(estadisticas.cuentasActivas).toBe(1);
            expect(estadisticas.saldoTotal).toBe(1500);
            expect(estadisticas.totalTransacciones).toBe(1);
        });
    });

    describe('Autenticación', () => {
        test('debe autenticar cliente con credenciales correctas', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');

            fintech.registrarCliente(cliente);

            const autenticado = fintech.autenticarCliente('test@example.com', 'pass123');

            expect(autenticado).toBe(cliente);
        });

        test('debe retornar null con credenciales incorrectas', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');

            fintech.registrarCliente(cliente);

            const autenticado = fintech.autenticarCliente('test@example.com', 'wrongpass');

            expect(autenticado).toBe(null);
        });

        test('debe retornar null con email inexistente', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');

            const autenticado = fintech.autenticarCliente('noexiste@example.com', 'pass123');

            expect(autenticado).toBe(null);
        });
    });

    describe('Integración completa', () => {
        test('debe manejar flujo completo de operaciones', () => {
            const fintech = new Fintech('MiBanco', 'BANK001');
            
            // Registrar clientes
            const cliente1 = new Cliente('CLI001', 'juan@example.com', 'pass123', 'Juan', 'Pérez');
            const cliente2 = new Cliente('CLI002', 'maria@example.com', 'pass456', 'María', 'García');
            fintech.registrarCliente(cliente1);
            fintech.registrarCliente(cliente2);

            // Abrir cuentas
            const cuenta1 = new Cuenta('ACC001', 'CLI001', 'AHORRO', 5000);
            const cuenta2 = new Cuenta('ACC002', 'CLI002', 'CORRIENTE', 3000);
            fintech.abrirCuenta(cuenta1);
            fintech.abrirCuenta(cuenta2);

            // Realizar operaciones
            fintech.realizarDeposito('ACC001', 1000);
            fintech.realizarRetiro('ACC002', 500);
            fintech.realizarTransferencia('ACC001', 'ACC002', 2000);

            // Verificar estado final
            expect(fintech.getTotalClientes()).toBe(2);
            expect(fintech.getTotalCuentas()).toBe(2);
            expect(fintech.getTotalTransacciones()).toBe(4); // deposito + retiro + 2 de transferencia
            expect(cuenta1.getSaldo()).toBe(4000); // 5000 + 1000 - 2000
            expect(cuenta2.getSaldo()).toBe(4500); // 3000 - 500 + 2000
            expect(fintech.getSaldoTotalSistema()).toBe(8500);
        });
    });
});
