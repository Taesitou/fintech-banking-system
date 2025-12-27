class AccountService {
    constructor() {
        this.accounts = [];
    }

    createAccount(client, initialDeposit) {
        const accountNumber = this.generateAccountNumber();
        const newAccount = {
            accountNumber: accountNumber,
            balance: initialDeposit,
            owner: client.email,
            transactions: []
        };
        this.accounts.push(newAccount);
        return newAccount;
    }

    getAccountByEmail(email) {
        return this.accounts.find(account => account.owner === email);
    }

    getTransactionHistory(account) {
        return account.transactions;
    }

    deposit(account, amount) {
        account.balance += amount;
        account.transactions.push({
            transactionId: this.generateTransactionId(),
            amount: amount,
            date: new Date(),
            type: 'deposit'
        });
    }

    withdraw(account, amount) {
        if (account.balance >= amount) {
            account.balance -= amount;
            account.transactions.push({
                transactionId: this.generateTransactionId(),
                amount: amount,
                date: new Date(),
                type: 'withdrawal'
            });
        } else {
            throw new Error('Insufficient funds');
        }
    }

    generateAccountNumber() {
        return 'ACC' + Math.floor(Math.random() * 1000000);
    }

    generateTransactionId() {
        return 'TX' + Math.floor(Math.random() * 1000000);
    }
}

export default AccountService;