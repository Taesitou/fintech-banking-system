class Account {
    constructor(accountNumber, initialBalance = 0) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
        this.transactions = [];
    }

    deposit(amount) {
        if (amount > 0) {
            this.balance += amount;
            this.recordTransaction(amount, 'deposit');
            return true;
        }
        return false;
    }

    withdraw(amount) {
        if (amount > 0 && amount <= this.balance) {
            this.balance -= amount;
            this.recordTransaction(amount, 'withdrawal');
            return true;
        }
        return false;
    }

    recordTransaction(amount, type) {
        const transaction = {
            transactionId: this.transactions.length + 1,
            amount: amount,
            date: new Date(),
            type: type
        };
        this.transactions.push(transaction);
    }

    getBalance() {
        return this.balance;
    }

    getTransactions() {
        return this.transactions;
    }

    getTransactionHistory() {
        return this.transactions;
    }
}

export default Account;