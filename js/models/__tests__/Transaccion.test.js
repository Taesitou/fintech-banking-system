import Transaccion from '../Transaction.js';

describe('Transaccion', () => {
    describe('Constructor', () => {
        test('debe crear una transacción con los parámetros correctos', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'DEPOSITO', 500, 'Depósito inicial');

            expect(transaccion.getId()).toBe('TXN001');
            expect(transaccion.getCuentaId()).toBe('ACC001');
            expect(transaccion.getTipo()).toBe('DEPOSITO');
            expect(transaccion.getMonto()).toBe(500);
            expect(transaccion.getDescripcion()).toBe('Depósito inicial');
            expect(transaccion.getEstado()).toBe('COMPLETADA');
        });

        test('debe crear una transacción con descripción vacía por defecto', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'DEPOSITO', 500);

            expect(transaccion.getDescripcion()).toBe('');
        });
    });

    describe('Verificaciones de tipo', () => {
        test('esDeposito debe retornar true para depósitos', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'DEPOSITO', 500);

            expect(transaccion.esDeposito()).toBe(true);
            expect(transaccion.esRetiro()).toBe(false);
            expect(transaccion.esTransferencia()).toBe(false);
        });

        test('esRetiro debe retornar true para retiros', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'RETIRO', 300);

            expect(transaccion.esRetiro()).toBe(true);
            expect(transaccion.esDeposito()).toBe(false);
            expect(transaccion.esTransferencia()).toBe(false);
        });

        test('esTransferencia debe retornar true para transferencias', () => {
            const transaccion1 = new Transaccion('TXN001', 'ACC001', 'TRANSFERENCIA_ENVIADA', 200);
            const transaccion2 = new Transaccion('TXN002', 'ACC002', 'TRANSFERENCIA_RECIBIDA', 200);

            expect(transaccion1.esTransferencia()).toBe(true);
            expect(transaccion2.esTransferencia()).toBe(true);
        });
    });

    describe('Verificaciones de estado', () => {
        test('esCompletada debe retornar true por defecto', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'DEPOSITO', 500);

            expect(transaccion.esCompletada()).toBe(true);
        });

        test('esPendiente debe retornar true cuando se cambia el estado', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'DEPOSITO', 500);
            transaccion.setEstado('PENDIENTE');

            expect(transaccion.esPendiente()).toBe(true);
            expect(transaccion.esCompletada()).toBe(false);
        });
    });

    describe('Formato y presentación', () => {
        test('getMontoFormateado debe mostrar signo positivo para depósitos', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'DEPOSITO', 500);

            expect(transaccion.getMontoFormateado()).toBe('+$500.00');
        });

        test('getMontoFormateado debe mostrar signo negativo para retiros', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'RETIRO', 300);

            expect(transaccion.getMontoFormateado()).toBe('-$300.00');
        });

        test('getMontoFormateado debe mostrar signo negativo para transferencias enviadas', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'TRANSFERENCIA_ENVIADA', 200);

            expect(transaccion.getMontoFormateado()).toBe('-$200.00');
        });

        test('getMontoFormateado debe mostrar signo positivo para transferencias recibidas', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'TRANSFERENCIA_RECIBIDA', 200);

            expect(transaccion.getMontoFormateado()).toBe('+$200.00');
        });

        test('getFechaFormateada debe retornar fecha en formato español', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'DEPOSITO', 500);
            const fechaFormateada = transaccion.getFechaFormateada();

            expect(typeof fechaFormateada).toBe('string');
            expect(fechaFormateada.length).toBeGreaterThan(0);
        });

        test('getResumen debe retornar resumen de la transacción', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'DEPOSITO', 500, 'Depósito inicial');
            const resumen = transaccion.getResumen();

            expect(resumen).toContain('DEPOSITO');
            expect(resumen).toContain('500.00');
            expect(resumen).toContain('Depósito inicial');
        });
    });

    describe('Metadatos', () => {
        test('debe agregar metadatos correctamente', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'DEPOSITO', 500);

            transaccion.agregarMetadato('origen', 'web');
            transaccion.agregarMetadato('ubicacion', 'Buenos Aires');

            const metadatos = transaccion.getMetadatos();
            expect(metadatos.origen).toBe('web');
            expect(metadatos.ubicacion).toBe('Buenos Aires');
        });

        test('getMetadatos debe retornar copia de metadatos', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'DEPOSITO', 500);
            transaccion.agregarMetadato('test', 'value');

            const metadatos1 = transaccion.getMetadatos();
            const metadatos2 = transaccion.getMetadatos();

            expect(metadatos1).not.toBe(metadatos2);
            expect(metadatos1).toEqual(metadatos2);
        });
    });

    describe('Validación', () => {
        test('validar debe retornar true para transacción válida', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'DEPOSITO', 500);

            expect(transaccion.validar()).toBe(true);
        });

        test('validar debe lanzar error si falta ID', () => {
            const transaccion = new Transaccion('', 'ACC001', 'DEPOSITO', 500);

            expect(() => {
                transaccion.validar();
            }).toThrow('La transacción debe tener un ID y un ID de cuenta');
        });

        test('validar debe lanzar error si falta cuentaId', () => {
            const transaccion = new Transaccion('TXN001', '', 'DEPOSITO', 500);

            expect(() => {
                transaccion.validar();
            }).toThrow('La transacción debe tener un ID y un ID de cuenta');
        });

        test('validar debe lanzar error si monto es cero o negativo', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'DEPOSITO', -100);

            expect(() => {
                transaccion.validar();
            }).toThrow('El monto debe ser mayor a cero');
        });

        test('validar debe lanzar error si tipo es inválido', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'TIPO_INVALIDO', 500);

            expect(() => {
                transaccion.validar();
            }).toThrow('Tipo de transacción inválido');
        });
    });

    describe('Métodos estáticos de fábrica', () => {
        test('crearDeposito debe crear transacción de depósito', () => {
            const transaccion = Transaccion.crearDeposito('TXN001', 'ACC001', 500, 'Depósito');

            expect(transaccion.getTipo()).toBe('DEPOSITO');
            expect(transaccion.getMonto()).toBe(500);
        });

        test('crearRetiro debe crear transacción de retiro', () => {
            const transaccion = Transaccion.crearRetiro('TXN001', 'ACC001', 300, 'Retiro');

            expect(transaccion.getTipo()).toBe('RETIRO');
            expect(transaccion.getMonto()).toBe(300);
        });

        test('crearTransferenciaEnviada debe agregar metadato de cuenta destino', () => {
            const transaccion = Transaccion.crearTransferenciaEnviada('TXN001', 'ACC001', 200, 'ACC002', 'Transferencia');

            expect(transaccion.getTipo()).toBe('TRANSFERENCIA_ENVIADA');
            expect(transaccion.getMetadatos().cuentaDestinoId).toBe('ACC002');
        });

        test('crearTransferenciaRecibida debe agregar metadato de cuenta origen', () => {
            const transaccion = Transaccion.crearTransferenciaRecibida('TXN001', 'ACC002', 200, 'ACC001', 'Transferencia');

            expect(transaccion.getTipo()).toBe('TRANSFERENCIA_RECIBIDA');
            expect(transaccion.getMetadatos().cuentaOrigenId).toBe('ACC001');
        });
    });

    describe('Serialización', () => {
        test('toJSON debe retornar objeto con todas las propiedades', () => {
            const transaccion = new Transaccion('TXN001', 'ACC001', 'DEPOSITO', 500, 'Depósito');
            transaccion.agregarMetadato('test', 'value');

            const json = transaccion.toJSON();

            expect(json.id).toBe('TXN001');
            expect(json.cuentaId).toBe('ACC001');
            expect(json.tipo).toBe('DEPOSITO');
            expect(json.monto).toBe(500);
            expect(json.descripcion).toBe('Depósito');
            expect(json.estado).toBe('COMPLETADA');
            expect(json.metadatos.test).toBe('value');
            expect(json.fecha).toBeInstanceOf(Date);
        });
    });
});
