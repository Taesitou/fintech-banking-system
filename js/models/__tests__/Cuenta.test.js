import Cuenta from '../Account.js';

describe('Cuenta', () => {
    describe('Constructor', () => {
        test('debe crear una cuenta con los parámetros correctos', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            expect(cuenta.getId()).toBe('ACC001');
            expect(cuenta.getClienteId()).toBe('CLI001');
            expect(cuenta.getTipoCuenta()).toBe('AHORRO');
            expect(cuenta.getSaldo()).toBe(1000);
            expect(cuenta.getEstado()).toBe('ACTIVA');
            expect(cuenta.getTransacciones()).toEqual([]);
        });

        test('debe crear una cuenta con valores por defecto', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001');

            expect(cuenta.getTipoCuenta()).toBe('AHORRO');
            expect(cuenta.getSaldo()).toBe(0);
            expect(cuenta.getEstado()).toBe('ACTIVA');
        });

        test('debe crear una cuenta de tipo CORRIENTE', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'CORRIENTE', 500);

            expect(cuenta.getTipoCuenta()).toBe('CORRIENTE');
            expect(cuenta.getSaldo()).toBe(500);
        });
    });

    describe('depositar', () => {
        test('debe aumentar el saldo al depositar', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            cuenta.depositar(500, 'Depósito inicial');

            expect(cuenta.getSaldo()).toBe(1500);
        });

        test('debe crear una transacción al depositar', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            cuenta.depositar(500);

            const transacciones = cuenta.getTransacciones();
            expect(transacciones).toHaveLength(1);
            expect(transacciones[0].tipo).toBe('DEPOSITO');
            expect(transacciones[0].monto).toBe(500);
        });

        test('debe lanzar error al depositar monto negativo', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            expect(() => {
                cuenta.depositar(-100);
            }).toThrow('El monto debe ser mayor a cero');
        });

        test('debe lanzar error al depositar en cuenta bloqueada', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            cuenta.bloquear();

            expect(() => {
                cuenta.depositar(500);
            }).toThrow('La cuenta no está activa');
        });
    });

    describe('retirar', () => {
        test('debe disminuir el saldo al retirar', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            cuenta.retirar(300);

            expect(cuenta.getSaldo()).toBe(700);
        });

        test('debe crear una transacción al retirar', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            cuenta.retirar(300, 'Retiro ATM');

            const transacciones = cuenta.getTransacciones();
            expect(transacciones).toHaveLength(1);
            expect(transacciones[0].tipo).toBe('RETIRO');
            expect(transacciones[0].monto).toBe(300);
        });

        test('debe lanzar error al retirar más del saldo disponible', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            expect(() => {
                cuenta.retirar(1500);
            }).toThrow('Saldo insuficiente');
        });

        test('debe lanzar error al retirar monto negativo', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            expect(() => {
                cuenta.retirar(-100);
            }).toThrow('El monto debe ser mayor a cero');
        });

        test('debe lanzar error al retirar de cuenta bloqueada', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            cuenta.bloquear();

            expect(() => {
                cuenta.retirar(100);
            }).toThrow('La cuenta no está activa');
        });
    });

    describe('transferir', () => {
        test('debe transferir dinero entre cuentas', () => {
            const cuentaOrigen = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            const cuentaDestino = new Cuenta('ACC002', 'CLI002', 'CORRIENTE', 500);

            cuentaOrigen.transferir(cuentaDestino, 300);

            expect(cuentaOrigen.getSaldo()).toBe(700);
            expect(cuentaDestino.getSaldo()).toBe(800);
        });

        test('debe crear transacciones en ambas cuentas', () => {
            const cuentaOrigen = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            const cuentaDestino = new Cuenta('ACC002', 'CLI002', 'CORRIENTE', 500);

            cuentaOrigen.transferir(cuentaDestino, 300, 'Pago servicios');

            expect(cuentaOrigen.getTransacciones()).toHaveLength(1);
            expect(cuentaOrigen.getTransacciones()[0].tipo).toBe('TRANSFERENCIA_ENVIADA');
            expect(cuentaDestino.getTransacciones()).toHaveLength(1);
            expect(cuentaDestino.getTransacciones()[0].tipo).toBe('TRANSFERENCIA_RECIBIDA');
        });

        test('debe lanzar error al transferir más del saldo disponible', () => {
            const cuentaOrigen = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            const cuentaDestino = new Cuenta('ACC002', 'CLI002', 'CORRIENTE', 500);

            expect(() => {
                cuentaOrigen.transferir(cuentaDestino, 1500);
            }).toThrow('Saldo insuficiente');
        });
    });

    describe('Gestión de estado', () => {
        test('debe bloquear una cuenta', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            cuenta.bloquear();

            expect(cuenta.getEstado()).toBe('BLOQUEADA');
        });

        test('debe activar una cuenta bloqueada', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            cuenta.bloquear();

            cuenta.activar();

            expect(cuenta.getEstado()).toBe('ACTIVA');
        });

        test('debe cerrar una cuenta con saldo cero', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 0);

            cuenta.cerrar();

            expect(cuenta.getEstado()).toBe('CERRADA');
        });

        test('debe lanzar error al cerrar cuenta con saldo', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            expect(() => {
                cuenta.cerrar();
            }).toThrow('No se puede cerrar una cuenta con saldo diferente a cero');
        });
    });

    describe('getHistorialTransacciones', () => {
        test('debe retornar historial vacío para cuenta nueva', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            expect(cuenta.getHistorialTransacciones()).toEqual([]);
        });

        test('debe retornar transacciones en orden inverso', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            cuenta.depositar(100);
            cuenta.retirar(50);
            cuenta.depositar(200);

            const historial = cuenta.getHistorialTransacciones();
            expect(historial).toHaveLength(3);
            expect(historial[0].tipo).toBe('DEPOSITO');
            expect(historial[0].monto).toBe(200);
            expect(historial[2].tipo).toBe('DEPOSITO');
            expect(historial[2].monto).toBe(100);
        });

        test('debe limitar el historial cuando se especifica', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            cuenta.depositar(100);
            cuenta.depositar(200);
            cuenta.depositar(300);

            const historial = cuenta.getHistorialTransacciones(2);
            expect(historial).toHaveLength(2);
        });
    });

    describe('Métodos utilitarios', () => {
        test('puedeRetirar debe retornar true con saldo suficiente', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            expect(cuenta.puedeRetirar(500)).toBe(true);
        });

        test('puedeRetirar debe retornar false sin saldo suficiente', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);

            expect(cuenta.puedeRetirar(1500)).toBe(false);
        });

        test('puedeRetirar debe retornar false si cuenta está bloqueada', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 1000);
            cuenta.bloquear();

            expect(cuenta.puedeRetirar(500)).toBe(false);
        });
    });

    describe('Integración completa', () => {
        test('debe manejar flujo completo de operaciones bancarias', () => {
            const cuenta = new Cuenta('ACC001', 'CLI001', 'AHORRO', 5000);

            cuenta.depositar(1000, 'Depósito salario');
            cuenta.retirar(500, 'Retiro ATM');
            cuenta.depositar(200, 'Transferencia recibida');
            cuenta.retirar(300, 'Pago tarjeta');

            expect(cuenta.getSaldo()).toBe(5400);
            expect(cuenta.getTransacciones()).toHaveLength(4);
            expect(cuenta.getEstado()).toBe('ACTIVA');
        });
    });
});
