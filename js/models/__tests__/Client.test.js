import Client from '../Client.js';
import Account from '../Account.js';

describe('Client', () => {
    describe('Constructor', () => {
        test('debe crear un cliente con email y password', () => {
            const email = 'test@example.com';
            const password = 'password123';
            const client = new Client(email, password);

            expect(client.email).toBe(email);
            expect(client.password).toBe(password);
            expect(client.accounts).toEqual([]);
        });

        test('debe inicializar accounts como un array vacío', () => {
            const client = new Client('test@example.com', 'pass123');
            
            expect(Array.isArray(client.accounts)).toBe(true);
            expect(client.accounts).toHaveLength(0);
        });
    });

    describe('createAccount', () => {
        test('debe agregar una cuenta al array de accounts', () => {
            const client = new Client('test@example.com', 'pass123');
            const account = new Account('ACC001', 1000);

            client.createAccount(account);

            expect(client.accounts).toHaveLength(1);
            expect(client.accounts[0]).toBe(account);
        });

        test('debe agregar múltiples cuentas', () => {
            const client = new Client('test@example.com', 'pass123');
            const account1 = new Account('ACC001', 1000);
            const account2 = new Account('ACC002', 2000);

            client.createAccount(account1);
            client.createAccount(account2);

            expect(client.accounts).toHaveLength(2);
            expect(client.accounts[0]).toBe(account1);
            expect(client.accounts[1]).toBe(account2);
        });
    });

    describe('getTransactionHistory', () => {
        test('debe retornar un array vacío si no hay cuentas', () => {
            const client = new Client('test@example.com', 'pass123');

            const history = client.getTransactionHistory();

            expect(history).toEqual([]);
        });

        test('debe retornar todas las transacciones de una cuenta', () => {
            const client = new Client('test@example.com', 'pass123');
            const account = new Account('ACC001', 1000);
            
            account.deposit(500);
            account.withdraw(200);
            client.createAccount(account);

            const history = client.getTransactionHistory();

            expect(history).toHaveLength(2);
            expect(history[0].type).toBe('deposit');
            expect(history[0].amount).toBe(500);
            expect(history[1].type).toBe('withdrawal');
            expect(history[1].amount).toBe(200);
        });

        test('debe retornar transacciones de múltiples cuentas', () => {
            const client = new Client('test@example.com', 'pass123');
            const account1 = new Account('ACC001', 1000);
            const account2 = new Account('ACC002', 2000);

            client.createAccount(account1);
            client.createAccount(account2);

            account1.deposit(300);
            account2.deposit(500);
            account1.withdraw(100);

            const history = client.getTransactionHistory();

            expect(history).toHaveLength(3);
            // Las transacciones se agrupan por cuenta: primero todas de account1, luego de account2
            expect(history[0].type).toBe('deposit');
            expect(history[0].amount).toBe(300);
            expect(history[1].type).toBe('withdrawal');
            expect(history[1].amount).toBe(100);
            expect(history[2].type).toBe('deposit');
            expect(history[2].amount).toBe(500);
        });

        test('debe consolidar transacciones de múltiples cuentas en un solo array', () => {
            const client = new Client('test@example.com', 'pass123');
            const account1 = new Account('ACC001', 1000);
            const account2 = new Account('ACC002', 2000);

            account1.deposit(100);
            account2.deposit(200);

            client.createAccount(account1);
            client.createAccount(account2);

            const history = client.getTransactionHistory();

            expect(Array.isArray(history)).toBe(true);
            expect(history).toHaveLength(2);
        });
    });

    describe('Integración completa', () => {
        test('debe manejar flujo completo de cliente con múltiples cuentas y transacciones', () => {
            const client = new Client('john.doe@bank.com', 'securePass123');
            
            // Crear cuentas
            const savingsAccount = new Account('SAV001', 5000);
            const checkingAccount = new Account('CHK001', 1000);
            
            client.createAccount(savingsAccount);
            client.createAccount(checkingAccount);

            // Realizar transacciones
            savingsAccount.deposit(1500);
            checkingAccount.withdraw(300);
            savingsAccount.withdraw(500);
            checkingAccount.deposit(200);

            // Verificar estado
            expect(client.accounts).toHaveLength(2);
            expect(savingsAccount.getBalance()).toBe(6000);
            expect(checkingAccount.getBalance()).toBe(900);

            // Verificar historial completo
            const history = client.getTransactionHistory();
            expect(history).toHaveLength(4);
        });
    });
});
