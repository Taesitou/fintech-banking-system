class Transaction {
    constructor(transactionId, amount, date, type) {
        this.transactionId = transactionId;
        this.amount = amount;
        this.date = date;
        this.type = type; // 'deposit' or 'withdrawal'
    }

    formatTransactionDetails() {
        return `Transaction ID: ${this.transactionId}, Amount: ${this.amount}, Date: ${this.date}, Type: ${this.type}`;
    }
}

export default Transaction;