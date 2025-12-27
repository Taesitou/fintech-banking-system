import Cliente from '../Client.js';
import Cuenta from '../Account.js';

describe('Cliente', () => {
    describe('Constructor', () => {
        test('debe crear un cliente con id, email, password y datos opcionales', () => {
            const id = 'CLI001';
            const email = 'test@example.com';
            const password = 'password123';
            const nombre = 'Juan';
            const apellido = 'Pérez';
            
            const cliente = new Cliente(id, email, password, nombre, apellido);

            expect(cliente.getId()).toBe(id);
            expect(cliente.getEmail()).toBe(email);
            expect(cliente.getNombreCompleto()).toBe('Juan Pérez');
            expect(cliente.getCuentas()).toEqual([]);
        });

        test('debe inicializar cuentas como un array vacío', () => {
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            
            expect(Array.isArray(cliente.getCuentas())).toBe(true);
            expect(cliente.getCuentas()).toHaveLength(0);
        });
    });

    describe('agregarCuenta', () => {
        test('debe agregar una cuenta al array de cuentas', () => {
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            cliente.agregarCuenta(cuenta);

            expect(cliente.getCuentas()).toHaveLength(1);
            expect(cliente.getCuentas()[0]).toBe(cuenta);
        });

        test('debe agregar múltiples cuentas', () => {
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta1 = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            const cuenta2 = new Cuenta('ACC002', 'CLI001', 'CORRIENTE', 2000);

            cliente.agregarCuenta(cuenta1);
            cliente.agregarCuenta(cuenta2);

            expect(cliente.getCuentas()).toHaveLength(2);
            expect(cliente.getCuentas()[0]).toBe(cuenta1);
            expect(cliente.getCuentas()[1]).toBe(cuenta2);
        });

        test('no debe agregar cuenta duplicada', () => {
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            cliente.agregarCuenta(cuenta);
            const resultado = cliente.agregarCuenta(cuenta);

            expect(resultado).toBe(false);
            expect(cliente.getCuentas()).toHaveLength(1);
        });
    });

    describe('getHistorialCompleto', () => {
        test('debe retornar un array vacío si no hay cuentas', () => {
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');

            const historial = cliente.getHistorialCompleto();

            expect(historial).toEqual([]);
        });

        test('debe retornar todas las transacciones de una cuenta', () => {
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            
            cuenta.depositar(500);
            cuenta.retirar(200);
            cliente.agregarCuenta(cuenta);

            const historial = cliente.getHistorialCompleto();

            expect(historial).toHaveLength(2);
            expect(historial[0].tipo).toBe('DEPOSITO');
            expect(historial[0].monto).toBe(500);
            expect(historial[1].tipo).toBe('RETIRO');
            expect(historial[1].monto).toBe(200);
        });

        test('debe retornar transacciones de múltiples cuentas', () => {
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta1 = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            const cuenta2 = new Cuenta('ACC002', 'CLI001', 'CORRIENTE', 2000);

            cliente.agregarCuenta(cuenta1);
            cliente.agregarCuenta(cuenta2);

            cuenta1.depositar(300);
            cuenta2.depositar(500);
            cuenta1.retirar(100);

            const historial = cliente.getHistorialCompleto();

            expect(historial).toHaveLength(3);
            expect(historial[0].tipo).toBe('DEPOSITO');
            expect(historial[0].monto).toBe(300);
            expect(historial[1].tipo).toBe('RETIRO');
            expect(historial[1].monto).toBe(100);
            expect(historial[2].tipo).toBe('DEPOSITO');
            expect(historial[2].monto).toBe(500);
        });
    });

    describe('getSaldoTotal', () => {
        test('debe retornar 0 si no hay cuentas', () => {
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');

            expect(cliente.getSaldoTotal()).toBe(0);
        });

        test('debe retornar el saldo total de todas las cuentas', () => {
            const cliente = new Cliente('CLI001', 'test@example.com', 'pass123');
            const cuenta1 = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            const cuenta2 = new Cuenta('ACC002', 'CLI001', 'CORRIENTE', 2000);

            cliente.agregarCuenta(cuenta1);
            cliente.agregarCuenta(cuenta2);

            expect(cliente.getSaldoTotal()).toBe(3000);
        });
    });

    describe('Integración completa', () => {
        test('debe manejar flujo completo de cliente con múltiples cuentas y transacciones', () => {
            const cliente = new Cliente('CLI001', 'john.doe@bank.com', 'securePass123', 'John', 'Doe');
            
            const cuentaAhorro = new Cuenta('SAV001', 'CLI001', 'AHORRO', 5000);
            const cuentaCorriente = new Cuenta('CHK001', 'CLI001', 'CORRIENTE', 1000);
            
            cliente.agregarCuenta(cuentaAhorro);
            cliente.agregarCuenta(cuentaCorriente);

            cuentaAhorro.depositar(1500);
            cuentaCorriente.retirar(300);
            cuentaAhorro.retirar(500);
            cuentaCorriente.depositar(200);

            expect(cliente.getCuentas()).toHaveLength(2);
            expect(cuentaAhorro.getSaldo()).toBe(6000);
            expect(cuentaCorriente.getSaldo()).toBe(900);

            const historial = cliente.getHistorialCompleto();
            expect(historial).toHaveLength(4);
            expect(cliente.getSaldoTotal()).toBe(6900);
        });
    });
});
